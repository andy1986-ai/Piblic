import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Idrefjäll coordinates and configuration
const IDREFJALL = {
    lat: 61.8902763,
    lon: 12.8294831,
    minElevation: 585,
    maxElevation: 892,
    verticalDrop: 307,
    totalPistes: 42,
    totalKm: 41,
    totalLifts: 33,
    name: 'Idrefjäll'
};

// Scene setup
let scene, camera, renderer, controls;
let terrain, skiRoutes = [];

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 1000, 4000);

    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );
    camera.position.set(500, 400, 500);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 500, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    scene.add(directionalLight);

    // Create terrain
    createTerrain();

    // Add ski resort features
    addSkiLifts();
    addSkiRoutes();
    addTerrainPark();
    addTrees();
    addLodges();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Hide loading screen
    document.getElementById('loading').classList.add('hidden');

    // Start animation loop
    animate();
}

function createTerrain() {
    const width = 900;
    const height = 900;
    const widthSegments = 120;
    const heightSegments = 120;

    const geometry = new THREE.PlaneGeometry(
        width,
        height,
        widthSegments,
        heightSegments
    );

    // Generate mountainous terrain inspired by Idrefjäll's actual topography
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];

        // Create mountain peaks and valleys
        let z = 0;

        // Main mountain shape - Idrefjäll has a prominent central ridge
        const distFromCenter = Math.sqrt(x * x + y * y);
        const ridgeAlignment = Math.abs(x * 0.3 + y * 0.7); // NW-SE ridge orientation
        z += Math.max(0, 320 - distFromCenter * 0.35 - ridgeAlignment * 0.15);

        // Primary summit area (representing Idretoppen area)
        const summit1 = Math.sqrt(Math.pow(x + 50, 2) + Math.pow(y - 100, 2));
        z += Math.max(0, 80 - summit1 * 0.8);

        // Secondary peak (representing Södra Fjället)
        const summit2 = Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y + 80, 2));
        z += Math.max(0, 60 - summit2 * 0.7);

        // Add rolling terrain with multiple wavelengths
        z += 45 * Math.sin(x * 0.008) * Math.cos(y * 0.012);
        z += 35 * Math.sin(x * 0.015 + 2) * Math.cos(y * 0.018);
        z += 25 * Math.cos(x * 0.022) * Math.sin(y * 0.025);

        // Add medium-scale terrain features
        z += 18 * Math.sin(x * 0.04) * Math.cos(y * 0.045);
        z += 12 * Math.cos(x * 0.07) * Math.sin(y * 0.065);

        // Fine detail for realistic surface
        z += 8 * Math.sin(x * 0.12) * Math.cos(y * 0.11);
        z += 5 * Math.sin(x * 0.18) * Math.cos(y * 0.19);

        // Add some valleys and gullies
        const gully1 = Math.abs(x + y * 0.5);
        if (gully1 < 50) {
            z -= (50 - gully1) * 0.3;
        }

        vertices[i + 2] = z;
    }

    geometry.computeVertexNormals();

    // Create material with slope-based coloring
    const material = new THREE.MeshStandardMaterial({
        vertexColors: false,
        flatShading: false,
        side: THREE.DoubleSide
    });

    // Add colors based on height
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < vertices.length; i += 3) {
        const z = vertices[i + 2];

        // Color gradient based on elevation (matching Scandinavian mountain zones)
        if (z < 60) {
            color.setStyle('#2a4a1a'); // Dark forest (lower slopes)
        } else if (z < 120) {
            color.setStyle('#3d6624'); // Pine forest
        } else if (z < 180) {
            color.setStyle('#5a8030'); // Mixed forest/alpine
        } else if (z < 240) {
            color.setStyle('#7a9b55'); // Alpine meadow/scrubland
        } else if (z < 300) {
            color.setStyle('#b8b8aa'); // Rocky/exposed terrain
        } else if (z < 350) {
            color.setStyle('#e8e8e0'); // Snow patches
        } else {
            color.setStyle('#ffffff'); // Permanent snow/ice
        }

        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    material.vertexColors = true;

    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
}

function addSkiLifts() {
    // Add more ski lifts to match reality (showing 12 visible lifts)
    const liftPositions = [
        // Main lifts from base to upper mountain
        { start: [-220, -250], end: [-180, 180], type: 'chairlift' },
        { start: [180, -280], end: [160, 200], type: 'chairlift' },
        { start: [-40, -200], end: [0, 270], type: 'chairlift' },
        { start: [220, -200], end: [190, 190], type: 'chairlift' },

        // Mid-mountain lifts
        { start: [-180, 60], end: [-120, 240], type: 'chairlift' },
        { start: [140, 40], end: [100, 220], type: 'chairlift' },
        { start: [-80, -120], end: [-50, 140], type: 'surface' },
        { start: [70, -100], end: [90, 120], type: 'surface' },

        // Beginner area lifts (shorter)
        { start: [-270, -120], end: [-250, 80], type: 'surface' },
        { start: [250, -140], end: [240, 60], type: 'surface' },

        // Express lifts
        { start: [0, -300], end: [-20, 200], type: 'express' },
        { start: [-100, -250], end: [-80, 160], type: 'chairlift' }
    ];

    liftPositions.forEach(lift => {
        const startZ = getTerrainHeight(lift.start[0], lift.start[1]);
        const endZ = getTerrainHeight(lift.end[0], lift.end[1]);

        // Lift cable - thicker for express lifts
        const cableThickness = lift.type === 'express' ? 3 : 2;
        const cableColor = lift.type === 'express' ? 0x222222 : 0x444444;

        const cableGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(lift.start[0], startZ + 12, lift.start[1]),
            new THREE.Vector3(lift.end[0], endZ + 12, lift.end[1])
        ]);
        const cableMaterial = new THREE.LineBasicMaterial({
            color: cableColor,
            linewidth: cableThickness
        });
        const cable = new THREE.Line(cableGeometry, cableMaterial);
        scene.add(cable);

        // Add intermediate towers for longer lifts
        const distance = Math.sqrt(
            Math.pow(lift.end[0] - lift.start[0], 2) +
            Math.pow(lift.end[1] - lift.start[1], 2)
        );
        const numTowers = Math.floor(distance / 80) + 2; // Tower every ~80 units

        for (let i = 0; i < numTowers; i++) {
            const t = i / (numTowers - 1);
            const x = lift.start[0] + (lift.end[0] - lift.start[0]) * t;
            const y = lift.start[1] + (lift.end[1] - lift.start[1]) * t;
            const z = getTerrainHeight(x, y);

            // Tower height varies by type
            const towerHeight = lift.type === 'surface' ? 8 :
                               lift.type === 'express' ? 25 : 18;

            const towerRadius = lift.type === 'express' ? 1.5 : 1;

            const towerGeometry = new THREE.CylinderGeometry(
                towerRadius * 0.8,
                towerRadius,
                towerHeight,
                8
            );
            const towerMaterial = new THREE.MeshStandardMaterial({
                color: lift.type === 'express' ? 0x555555 : 0x666666,
                metalness: 0.6,
                roughness: 0.4
            });
            const tower = new THREE.Mesh(towerGeometry, towerMaterial);
            tower.position.set(x, z + towerHeight / 2, y);
            tower.castShadow = true;
            scene.add(tower);

            // Add cross-arm on top for chairlifts
            if (lift.type === 'chairlift' || lift.type === 'express') {
                const armGeometry = new THREE.BoxGeometry(8, 0.5, 0.5);
                const armMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
                const arm = new THREE.Mesh(armGeometry, armMaterial);
                arm.position.set(x, z + towerHeight, y);
                scene.add(arm);
            }
        }
    });
}

function addSkiRoutes() {
    // Add ski pistes with realistic distribution
    // 39% beginner (green), 39% intermediate (blue), 27% advanced (red), 13% expert (black)
    const routes = [
        // Beginner slopes (green) - 16 routes, gentle and wide
        { points: [[-200, 180], [-210, 100], [-220, 20], [-230, -60]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[-250, 150], [-240, 80], [-230, 10], [-220, -70]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[180, 150], [170, 80], [160, 10], [150, -70]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[250, 120], [240, 60], [230, 0], [220, -80]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[-150, -200], [-140, -120], [-130, -40], [-120, 40]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[150, -180], [140, -100], [130, -20], [120, 60]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[-80, 200], [-75, 120], [-70, 40], [-65, -40]], color: 0x00ff00, difficulty: 'green', width: 6 },
        { points: [[70, 180], [75, 100], [80, 20], [85, -60]], color: 0x00ff00, difficulty: 'green', width: 6 },

        // Intermediate slopes (blue) - 16 routes, moderate steepness
        { points: [[-150, 240], [-160, 140], [-170, 40], [-180, -60]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[0, 260], [-20, 160], [-40, 60], [-60, -40]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[150, 220], [130, 120], [110, 20], [90, -80]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[-100, 200], [-90, 100], [-80, 0], [-70, -100]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[100, 210], [90, 110], [80, 10], [70, -90]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[-180, 160], [-170, 70], [-160, -20], [-150, -110]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[180, 180], [170, 90], [160, 0], [150, -90]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[-50, 230], [-45, 130], [-40, 30], [-35, -70]], color: 0x0080ff, difficulty: 'blue', width: 5 },
        { points: [[40, 220], [45, 120], [50, 20], [55, -80]], color: 0x0080ff, difficulty: 'blue', width: 5 },

        // Advanced slopes (red) - 11 routes, steeper terrain
        { points: [[-120, 260], [-135, 150], [-150, 40], [-165, -80]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[20, 270], [10, 160], [0, 50], [-10, -70]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[120, 250], [110, 140], [100, 30], [90, -90]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[-70, 240], [-75, 130], [-80, 20], [-85, -100]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[60, 230], [55, 120], [50, 10], [45, -110]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[-200, 220], [-190, 110], [-180, 0], [-170, -120]], color: 0xff4444, difficulty: 'red', width: 4 },
        { points: [[200, 210], [190, 100], [180, -10], [170, -130]], color: 0xff4444, difficulty: 'red', width: 4 },

        // Expert slopes (black) - 5 routes, very steep and challenging
        { points: [[0, 280], [-10, 160], [-20, 40], [-30, -100]], color: 0x111111, difficulty: 'black', width: 3 },
        { points: [[-30, 270], [-40, 150], [-50, 30], [-60, -110]], color: 0x111111, difficulty: 'black', width: 3 },
        { points: [[30, 265], [20, 145], [10, 25], [0, -115]], color: 0x111111, difficulty: 'black', width: 3 },
        { points: [[150, 240], [135, 120], [120, 0], [105, -140]], color: 0x111111, difficulty: 'black', width: 3 },
        { points: [[-150, 250], [-135, 130], [-120, 10], [-105, -130]], color: 0x111111, difficulty: 'black', width: 3 }
    ];

    routes.forEach(route => {
        const points = route.points.map(p => {
            const z = getTerrainHeight(p[0], p[1]);
            return new THREE.Vector3(p[0], z + 2, p[1]);
        });

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 50, route.width, 8, false);
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: route.color,
            transparent: true,
            opacity: 0.7,
            emissive: route.color,
            emissiveIntensity: 0.3
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        scene.add(tube);
    });
}

function addTerrainPark() {
    // Add Fjällpark - terrain park with jumps, rails, and boxes
    const parkCenter = [80, -50]; // Mid-mountain location
    const parkZ = getTerrainHeight(parkCenter[0], parkCenter[1]);

    // Create jumps (kickers)
    const jumps = [
        { pos: [60, -30], size: 15, height: 8 },
        { pos: [80, -50], size: 20, height: 12 },
        { pos: [100, -70], size: 18, height: 10 }
    ];

    jumps.forEach(jump => {
        const z = getTerrainHeight(jump.pos[0], jump.pos[1]);

        // Jump ramp
        const rampGeometry = new THREE.ConeGeometry(jump.size, jump.height, 4);
        const rampMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9
        });
        const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
        ramp.position.set(jump.pos[0], z + jump.height / 2, jump.pos[1]);
        ramp.rotation.y = Math.PI / 4;
        ramp.rotation.x = Math.PI / 6; // Tilt for ramp angle
        ramp.castShadow = true;
        scene.add(ramp);

        // Landing area marker
        const landingGeometry = new THREE.CylinderGeometry(jump.size * 0.3, jump.size * 0.3, 0.5, 16);
        const landingMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff6600,
            emissiveIntensity: 0.3
        });
        const landing = new THREE.Mesh(landingGeometry, landingMaterial);
        landing.position.set(jump.pos[0] + 15, z + 0.3, jump.pos[1] - 15);
        scene.add(landing);
    });

    // Rails and boxes
    const features = [
        { pos: [50, -60], type: 'rail', length: 20 },
        { pos: [70, -40], type: 'box', length: 15 },
        { pos: [90, -55], type: 'rail', length: 25 },
        { pos: [110, -45], type: 'box', length: 18 }
    ];

    features.forEach(feature => {
        const z = getTerrainHeight(feature.pos[0], feature.pos[1]);

        if (feature.type === 'rail') {
            // Metal rail
            const railGeometry = new THREE.CylinderGeometry(0.3, 0.3, feature.length, 8);
            const railMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.9,
                roughness: 0.2
            });
            const rail = new THREE.Mesh(railGeometry, railMaterial);
            rail.position.set(feature.pos[0], z + 3, feature.pos[1]);
            rail.rotation.z = Math.PI / 2;
            rail.rotation.y = Math.PI / 8;
            rail.castShadow = true;
            scene.add(rail);

            // Support posts
            for (let i = 0; i < 3; i++) {
                const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
                const postMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
                const post = new THREE.Mesh(postGeometry, postMaterial);
                const offset = (i - 1) * (feature.length / 3);
                post.position.set(
                    feature.pos[0] + offset * Math.cos(Math.PI / 8),
                    z + 1.5,
                    feature.pos[1] + offset * Math.sin(Math.PI / 8)
                );
                scene.add(post);
            }
        } else {
            // Box
            const boxGeometry = new THREE.BoxGeometry(feature.length, 2, 3);
            const boxMaterial = new THREE.MeshStandardMaterial({
                color: 0x3366cc,
                roughness: 0.8
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(feature.pos[0], z + 2, feature.pos[1]);
            box.rotation.y = Math.PI / 8;
            box.castShadow = true;
            scene.add(box);
        }
    });

    // Park boundary markers (flags)
    const boundaryPoints = [
        [40, -20], [120, -20], [120, -80], [40, -80]
    ];

    boundaryPoints.forEach(point => {
        const z = getTerrainHeight(point[0], point[1]);

        // Flag pole
        const poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 8, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(point[0], z + 4, point[1]);
        scene.add(pole);

        // Flag
        const flagGeometry = new THREE.PlaneGeometry(3, 2);
        const flagMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(point[0] + 1.5, z + 7, point[1]);
        scene.add(flag);
    });
}

function addTrees() {
    // Add trees to forest areas (below 150m elevation)
    const treeCount = 300;

    for (let i = 0; i < treeCount; i++) {
        const x = (Math.random() - 0.5) * 700;
        const y = (Math.random() - 0.5) * 700;
        const z = getTerrainHeight(x, y);

        // Only place trees in lower elevations
        if (z < 150 && z > 20) {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 10, 6);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3428 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

            // Tree foliage
            const foliageGeometry = new THREE.ConeGeometry(5, 15, 6);
            const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x1a4d1a });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 12;

            const tree = new THREE.Group();
            tree.add(trunk);
            tree.add(foliage);
            tree.position.set(x, z + 5, y);
            tree.scale.setScalar(0.8 + Math.random() * 0.4);
            tree.castShadow = true;

            scene.add(tree);
        }
    }
}

function addLodges() {
    // Add ski lodges/buildings
    const lodges = [
        { pos: [0, -300], size: 30, color: 0x8B4513, name: 'Base Lodge' },
        { pos: [-100, 0], size: 20, color: 0xA0522D, name: 'Mid Station' },
        { pos: [150, 150], size: 15, color: 0x8B4513, name: 'Summit Cafe' }
    ];

    lodges.forEach(lodge => {
        const height = lodge.size * 0.4;
        const buildingGeometry = new THREE.BoxGeometry(lodge.size, height, lodge.size * 0.7);
        const buildingMaterial = new THREE.MeshStandardMaterial({ color: lodge.color });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        const z = getTerrainHeight(lodge.pos[0], lodge.pos[1]);
        building.position.set(lodge.pos[0], z + height / 2, lodge.pos[1]);
        building.castShadow = true;
        building.receiveShadow = true;

        scene.add(building);

        // Add roof
        const roofGeometry = new THREE.ConeGeometry(lodge.size * 0.7, lodge.size * 0.3, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(lodge.pos[0], z + height + lodge.size * 0.15, lodge.pos[1]);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;

        scene.add(roof);
    });
}

function getTerrainHeight(x, y) {
    // Calculate terrain height at given x, y position (same formula as in createTerrain)
    let z = 0;

    // Main mountain shape - Idrefjäll has a prominent central ridge
    const distFromCenter = Math.sqrt(x * x + y * y);
    const ridgeAlignment = Math.abs(x * 0.3 + y * 0.7);
    z += Math.max(0, 320 - distFromCenter * 0.35 - ridgeAlignment * 0.15);

    // Primary summit area
    const summit1 = Math.sqrt(Math.pow(x + 50, 2) + Math.pow(y - 100, 2));
    z += Math.max(0, 80 - summit1 * 0.8);

    // Secondary peak
    const summit2 = Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y + 80, 2));
    z += Math.max(0, 60 - summit2 * 0.7);

    // Add rolling terrain
    z += 45 * Math.sin(x * 0.008) * Math.cos(y * 0.012);
    z += 35 * Math.sin(x * 0.015 + 2) * Math.cos(y * 0.018);
    z += 25 * Math.cos(x * 0.022) * Math.sin(y * 0.025);
    z += 18 * Math.sin(x * 0.04) * Math.cos(y * 0.045);
    z += 12 * Math.cos(x * 0.07) * Math.sin(y * 0.065);
    z += 8 * Math.sin(x * 0.12) * Math.cos(y * 0.11);
    z += 5 * Math.sin(x * 0.18) * Math.cos(y * 0.19);

    // Valleys and gullies
    const gully1 = Math.abs(x + y * 0.5);
    if (gully1 < 50) {
        z -= (50 - gully1) * 0.3;
    }

    return z;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Start the application
init();
