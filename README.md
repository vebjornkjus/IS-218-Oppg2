# IS-218-Oppg2


# Atomkrig  
En fullstack webapplikasjon som simulerer effekten av en atombombe på Kristiansand og gir informasjon om tilfluktsrom, brannstasjoner, samt befolkning og eiendommer i fare.

## 📖 Problemstilling  
- **Hvis en atombombe skulle være på vei mot Kristiansand, hvor finner man nærmeste tilfluktsrom?**
- **Hvor mange er det plass til i hvert tilfluktsrom?**
- **Hvem er innafor hvilke soner?**
  - Flammeradius
  - Høyeksplosiv skade
  - Moderat eksplosjonsskade
  - Varmestråling (tredjegrads forbrenning)
- **Hvor mange personer er innafor området til atombomben?**

## 🛠 Teknologivalg  
Prosjektet bruker følgende teknologier:  
- **Frontend:** [Leaflet / FontAwesome]
- **Backend:** [Supabase / PostGIS]
- **Database:** [PostGIS i Supabase / PostgreSQL] 
- **Databehandling:** [QGIS / GeoJSON / TurfJS]

**Begrunnelse for teknologivalg:**  
- **Leaflet** ble valgt for å visualisere geografiske data på en smidig og effektiv måte.  
- **Supabase + PostGIS** gir oss en enkel måte å håndtere romlige spørringer og lagre geodata.

## 🗺 Brukte datasett  
Vi har benyttet følgende tre åpne datasett:  
1. **Tilfluktsrom i Agder** – Kilde: GeoNorge  
2. **Befolkningstall i Agder** – Kilde: GeoNorge
3. **Brannstasjoner i Agder** – Kilde: GeoNorge  

## 🚀 Implementasjon  
### 🔹 Backend  
- Supabase/PostGIS brukes til å lagre og håndtere geodata.  
![Database](https://github.com/vebjornkjus/IS-218-Oppg2/blob/main/images/Tabeller1.png?raw=true)

##🛠 Backend-funksjoner
###🔹 Befolkningstall (befolkningstall.js)
- Laster befolkningsdata fra Supabase og visualiserer det på kartet.

- Henter befolkningsdata fra supabaseClient.rpc('get_geojson_features', { table_name: 'befolkningstall' })
-Lager klynger (clusters) med L.markerClusterGroup()
-Fargekoder befolkningstetthet basert på getPopulationColor(popTot)

###🔹 Tilfluktsrom (tilfluktsrom.js)
- Henter og viser tilfluktsrom på kartet.
- Henter tilfluktsrom fra Supabase
- Lager GeoJSON-lag med L.geoJSON()
- Binder popup-informasjon med kapasitet og adresse

### 🔹 Frontend  
- **Leaflet** brukes til å visualisere kartdata som flammeradius, skadeområder og tilfluktsrom.  


### 🔹 Brukerinteraksjon  
- **Visualisering:** Kart med interaktive lag som viser soner for flammeradius, skadeområder, tilfluktsrom og brannstasjoner.  


## 🎥 Demo  
### 📸 Skjermbilder
![Eksempelbilde 1](https://github.com/vebjornkjus/IS-218-Oppg2/blob/main/images/Screenshot.png?raw=true)

### 🎬 Video  
![GIF1](https://raw.githubusercontent.com/vebjornkjus/IS-218-Oppg2/main/images/9m77x6.gif)
![GIF2](https://raw.githubusercontent.com/vebjornkjus/IS-218-Oppg2/main/images/9m782w.gif)

  

## ⚙️ Installasjon  
Følg disse stegene for å kjøre prosjektet lokalt:  

1. **Klon repoet**  
   ```bash
   git clone https://github.com/vebjornkjus/IS-218-Oppg2.git
   cd IS-219-Oppg2.git
   ```
2. **Installer avhengigheter**  
   ```bash
   npm install  
   ```
3. **Start backend**  
   ```bash
   npm run backend 
   ```
4. **Start frontend**  
   ```bash
   npm run dev
   ```


## 📜 Lisens  
MIT-lisens - se `LICENSE`-filen for detaljer.  
```
