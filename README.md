# Idrefjäll 3D Karta

En interaktiv 3D-visualisering av skidanläggningen Idrefjäll i Dalarna, Sverige.

![Idrefjäll 3D Map](screenshot.png)

## 🎿 Funktioner

- **3D Terrain**: Realistisk bergsterräng inspirerad av Idrefjälls faktiska topografi
  - Prominent central bergsrygg (NW-SE orientering)
  - Flera toppar inkl. Idretoppen och Södra Fjället
  - Dalgångar och raviner för naturligt utseende
- **Skidliftar**: 12 visualiserade liftar inkl. expresslift, stolliftar och släpliftar
  - Automatisk tornplacering längs liftlinjer
  - Olika typer: Express, chairlift, surface lift
- **Pister**: 38 nedfarter med realistisk svårighetsfördelning:
  - 🟢 Grön (nybörjare) - 39% - Breda och flacka
  - 🔵 Blå (lätt) - 39% - Måttlig lutning
  - 🔴 Röd (medel) - 27% - Brant terräng
  - ⚫ Svart (svår) - 13% - Expertnivå
- **Terrängpark (Fjällpark)**: Komplett freestyle-område med:
  - 3 hopp (kickers) i olika storlekar
  - Rails och boxes för tricks
  - Avgränsning med flaggor
- **Skog**: 300+ träd strategiskt placerade på lägre höjder
- **Byggnader**: Baslodge, mellanstation och toppstuga
- **Interaktiva kontroller**: Rotera, zooma och panorera med musen

## 🏔️ Om Idrefjäll

**Koordinater**: 61.89°N, 12.83°E
**Höjd**: 585m - 892m
**Vertikal drop**: 307m
**Pister**: 42 nedfarter (41 km)
**Liftar**: 33 liftar totalt
**Säsong**: December - April

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

Terrängen genereras med avancerad procedurell geometri:
- Realistisk central bergsrygg med NW-SE orientering
- Flera distinkt definierade toppar (Idretoppen, Södra Fjället)
- Multi-skalig sinusvåggenerering för naturligt utseende
- Dalgångar och raviner för realism
- 7-stegs höjdbaserad färgläggning (mörk skog → barr → alpin → klippig → snöfält → permanent snö)

### Ski Features

- **Liftar**:
  - 12 liftar i olika kategorier (express, stolliftar, släpliftar)
  - Automatisk tornplacering baserad på liftlängd
  - Realistiska kablar med olika tjocklek
- **Pister**:
  - 38 nedfarter med TubeGeometry längs kurvade banor
  - Breddvariation baserad på svårighetsgrad
  - Realistisk fördelning (39% grön, 39% blå, 27% röd, 13% svart)
- **Terrängpark**:
  - 3 hopp med landningsmarkörer
  - 4 rails och boxes med stödpelare
  - Parkavgränsning med flaggor
- **Träd**: Procedurellt placerade i skogszoner (< 150m höjd)
- **Byggnader**: Stugor med tak på strategiska platser

### Performance

- Optimerad geometri med 120x120 segment (900x900 units)
- Effektiv vertex-färgläggning med 7 höjdzoner
- Shadow mapping för realism
- Fog för djup och atmosfär
- Över 38 rendererade pister och 12 liftar med hög performance

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

- [ ] Använd verkliga höjddata från SRTM eller Svenska Lantmäteriet
- [ ] Lägg till vädereffekter (snöfall, dimma, vind)
- [ ] Animera liftarna med rörliga stollar/gondoler
- [ ] Lägg till verkliga pistnamn och svårighetsmarkeringar
- [ ] Integrera med Mapbox för satellit-texturer och real topografi
- [ ] Nattskidåkning-visualisering med belysta pister
- [ ] VR-stöd med WebXR för immersiv upplevelse
- [ ] Real-time väderdata från SMHI API
- [ ] Skidspår-tracking och heatmaps
- [ ] Snowpark tricks-simulator
- [ ] Webcam-integration från verkliga kameror på Idrefjäll

## 📄 Licens

MIT License - fri att använda och modifiera

## 🙏 Acknowledgments

Skapad med data och inspiration från:
- [Idrefjäll Ski Resort](https://www.idrefjall.se/)
- [Three.js Community](https://threejs.org/)
- [Esri's Low Poly Ski Resort Tutorial](https://www.esri.com/arcgis-blog/products/js-api-arcgis/3d-gis/low-poly-ski-resort-map-1)
