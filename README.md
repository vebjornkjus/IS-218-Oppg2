# IS-218-Oppg2


## 📑 Innholdsfortegnelse

1. [Introduksjon](#introduksjon)
2. [📖 Problemstilling](#-problemstilling)
3. [🛠 Teknologivalg](#-teknologivalg)
4. [🗺 Brukte datasett](#-brukte-datasett)
5. [🚀 Implementasjon](#-implementasjon)  
   - [🔹 Backend](#-backend)  
   - [🛠 Backend-funksjoner](#-backend-funksjoner)  
     - Befolkningstall  
     - Tilfluktsrom  
   - [🔹 Frontend](#-frontend)  
   - [🔹 Brukerinteraksjon](#-brukerinteraksjon)
6. [🎥 Demo](#-demo)  
   - [📸 Skjermbilder](#-skjermbilder)  
   - [🎬 Video](#-video)
7. [🧰 Installasjon](#instaslasjon)
8. [📜 Lisens](#-lisens)

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

## Motivasjon for problemstilling 
- Verden er i en urolig situasjon
- Det var satt spørsmål til hvor store bombene var, og om det var mulig å komme seg til et tilfluktsrom som var trygt.
- Hvor katastrofisk en atombombe faktisk hadde vært for Norge

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

## 🛠 Backend-funksjoner
### 🔹 Befolkningstall (befolkningstall.js)
- Laster befolkningsdata fra Supabase og visualiserer det på kartet.

- Henter befolkningsdata fra supabaseClient.rpc('get_geojson_features', { table_name: 'befolkningstall' })
-Lager klynger (clusters) med L.markerClusterGroup()
-Fargekoder befolkningstetthet basert på getPopulationColor(popTot)

### 🔹 Tilfluktsrom (tilfluktsrom.js)
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
https://github.com/user-attachments/assets/8d0b45b6-120e-4f01-a5df-70046d1f0c21 

  
## intaslasjon
Clon Repository 
Trykk go live 


## 📜 Lisens  
MIT-lisens - se `LICENSE`-filen for detaljer.  
```
