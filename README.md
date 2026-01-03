# Idrefjäll 3D Karta

En interaktiv 3D-visualisering av skidanläggningen Idrefjäll i Dalarna, Sverige.

![Idrefjäll 3D Map](screenshot.png)

## 🎿 Funktioner

- **3D Terrain**: Realistisk bergsterräng genererad med procedurell geometri
- **Skidliftar**: 4 visualiserade liftar över berget
- **Pister**: 4 nedfarter med färgkodning efter svårighetsgrad:
  - 🟢 Grön (nybörjare)
  - 🔵 Blå (lätt)
  - 🔴 Röd (medel)
  - ⚫ Svart (svår)
- **Skog**: 300+ träd på lägre höjder
- **Byggnader**: Baslodge, mellanstation och toppstuga
- **Interaktiva kontroller**: Rotera, zooma och panorera med musen

## 🏔️ Om Idrefjäll

**Koordinater**: 61.89°N, 12.83°E
**Höjd**: 590m - 890m
**Pister**: 38 nedfarter
**Liftar**: 33 liftar
**Totallängd**: 28 km

Idrefjäll är en av Sveriges största skidanläggningar, belägen i Älvdalens kommun i Dalarna, nära norska gränsen.

## 🚀 Kom igång

### Kör lokalt

1. Öppna `index.html` i en modern webbläsare
2. För bästa prestanda, använd en lokal webbserver:

```bash
# Med Python 3
python -m http.server 8000

# Med Node.js
npx serve

# Med PHP
php -S localhost:8000
```

3. Navigera till `http://localhost:8000`

### Kontroller

- **Vänster musknapp + dra**: Rotera kameran runt scenen
- **Höger musknapp + dra**: Panorera (flytta) kameran
- **Scrollhjul**: Zooma in/ut

## 🛠️ Teknologi

- **Three.js** (v0.160.0): 3D-renderingsbibliotek
- **OrbitControls**: Kamerakontroller för interaktiv navigation
- **Vanilla JavaScript**: Ingen ramverk-overhead
- **CDN-baserat**: Inga beroenden att installera

## 📐 Teknisk implementation

### Terrain Generation

Terrängen genereras med en kombination av:
- Procedurell höjdgenerering baserad på avstånd från centrum
- Sinusvågor för att skapa realistiska berg och dalar
- Höjdbaserad färgläggning (skog → sten → snö)

### Ski Features

- **Liftar**: Visualiserade med torn och kablar
- **Pister**: Skapade med TubeGeometry längs definierade kurvor
- **Träd**: Procedurellt placerade i skogszoner (< 150m höjd)
- **Byggnader**: Stugor med tak på strategiska platser

### Performance

- Optimerad geometri med 100x100 segment för terrain
- Effektiv vertex-färgläggning
- Shadow mapping för realism
- Fog för djup och atmosfär

## 🎨 Anpassning

### Ändra terrängstorlek

```javascript
const width = 800;  // Ändra bredd
const height = 800; // Ändra djup
```

### Lägg till fler pister

```javascript
const routes = [
    {
        points: [[x1, y1], [x2, y2], ...],
        color: 0x0000ff,
        difficulty: 'blue'
    },
    // Lägg till fler här
];
```

### Justera kameraposition

```javascript
camera.position.set(500, 400, 500); // x, y, z
```

## 📚 Resurser

### Idrefjäll Information
- [Officiell webbplats](https://www.idrefjall.se/)
- [Pist-kartor på Snow-Forecast](https://www.snow-forecast.com/resorts/IdreFjall/pistemap)
- [Skiresort.info Trail Map](https://www.skiresort.info/ski-resort/idre-fjaell/trail-map/)

### Three.js Dokumentation
- [Three.js Official Docs](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Creating 3D Terrain with Three.js](https://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data/)

## 🔮 Framtida förbättringar

- [ ] Använd verkliga höjddata från SRTM eller liknande
- [ ] Lägg till vädereffekter (snöfall, dimma)
- [ ] Animera liftarna
- [ ] Lägg till verkliga pistnamn och svårighetsgrader
- [ ] Integrera med Mapbox för satellit-texturer
- [ ] VR-stöd med WebXR
- [ ] Real-time väderdataskåde från SMHI
- [ ] Skidspår-tracking

## 📄 Licens

MIT License - fri att använda och modifiera

## 🙏 Acknowledgments

Skapad med data och inspiration från:
- [Idrefjäll Ski Resort](https://www.idrefjall.se/)
- [Three.js Community](https://threejs.org/)
- [Esri's Low Poly Ski Resort Tutorial](https://www.esri.com/arcgis-blog/products/js-api-arcgis/3d-gis/low-poly-ski-resort-map-1)
