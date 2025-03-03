# IS-218-Oppg2

```md
# Atomkrig  
En fullstack webapplikasjon som simulerer effekten av en atombombe på Kristiansand og gir informasjon om tilfluktsrom, evakueringstider, samt befolkning og eiendommer i fare.

## 📖 Problemstilling  
- **Hvis en atombombe skulle være på vei mot Kristiansand, hvor finner man nærmeste tilfluktsrom?**
- **Hvor mange er det plass til i hvert tilfluktsrom?**
- **Hvor god tid trenger man på å evakuere?**
- **Hvem er innafor hvilke soner?**
  - Flammeradius
  - Høyeksplosiv skade
  - Moderat eksplosjonsskade
  - Varmestråling (tredjegrads forbrenning)
- **Hvor mange og hvilke hus blir rammet?**
- **Hvor mange personer er innafor området til atombomben?**

## 🛠 Teknologivalg  
Prosjektet bruker følgende teknologier:  
- **Frontend:** [Leaflet / Maplibre / OpenLayers]  
- **Backend:** [Supabase / PostGIS / Node.js / .NET]  
- **Database:** [PostGIS i Supabase / PostgreSQL]  
- **Databehandling:** [QGIS / TurfJS / Python]  

**Begrunnelse for teknologivalg:**  
- **Leaflet** ble valgt for å visualisere geografiske data på en lettvekts og effektiv måte.  
- **Supabase + PostGIS** gir oss en enkel måte å håndtere romlige spørringer og lagre geodata.  
- **TurfJS** benyttes for å gjøre geospatiale analyser direkte i frontend.  

## 🗺 Brukte datasett  
Vi har benyttet følgende tre åpne datasett:  
1. **Eiendommer i Kristiansand** – Kilde: GeoNorge  
2. **Befolkningstall i Kristiansand** – Kilde: https://kartkatalog.geonorge.no/metadata/befolkning-paa-rutenett-250-m/0c0ad0ce-55e8-4d73-9c12-0eb0e2454acb 
3. **Tilfluktsrom og brannstasjoner** – Kilde: [Offentlige datakilder]  

## 🚀 Implementasjon  
### 🔹 Backend  
- Supabase/PostGIS brukes til å lagre og håndtere geodata.  
- API-et tilbyr endepunkter for å hente og beregne geografiske analyser, som for eksempel avstand til nærmeste tilfluktsrom.  

### 🔹 Frontend  
- **Leaflet**/Maplibre brukes til å visualisere kartdata som flammeradius, skadeområder og tilfluktsrom.  
- Brukeren kan søke etter en adresse og få visualisert hvilke områder som er i fare.  

### 🔹 Brukerinteraksjon  
- **Søkefunksjon:** Brukeren kan søke etter en adresse og få informasjon om risikoen i området.  
- **Visualisering:** Kart med interaktive lag som viser soner for flammeradius, skadeområder og tilfluktsrom.  
- **Evakueringstid:** Beregn tid for å evakuere til nærmeste tilfluktsrom.  

## 🎥 Demo  
### 📸 Skjermbilder
![Eksempelbilde 1](https://github.com/vebjornkjus/IS-218-Oppg2/blob/main/images/Screenshot%202025-03-03%20015625.png?raw=true)
![Eksempelbilde 2](https://github.com/vebjornkjus/IS-218-Oppg2/blob/main/images/Screenshot%202025-03-03%20123456.png?raw=true)  

### 🎬 Video  
[Legg inn en lenke til en kort demo-video eller en GIF her.]  

## ⚙️ Installasjon  
Følg disse stegene for å kjøre prosjektet lokalt:  

1. **Klon repoet**  
   ```bash
   git clone https://github.com/vebjornkjus/IS-218-Oppg2.git
   cd IS-219-Oppg2.git
   ```
2. **Installer avhengigheter**  
   ```bash
   npm install  # eller dotnet restore for .NET
   ```
3. **Start backend**  
   ```bash
   npm run backend  # eller dotnet run for .NET
   ```
4. **Start frontend**  
   ```bash
   npm run dev
   ```

## 🤝 Bidrag  
1. **Fork repoet**  
2. **Lag en ny branch**  
3. **Gjennomfør endringer og lag en pull request**  

## 📜 Lisens  
MIT-lisens - se `LICENSE`-filen for detaljer.  
```
