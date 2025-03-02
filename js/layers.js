import { supabaseClient } from './config.js';

/**
 * Henter data fra en tabell i Supabase og returnerer et Leaflet LayerGroup.
 * @param {string} tableName - Navnet på tabellen i Supabase
 * @param {string} geometryField - Navnet på kolonnen som inneholder geometri (f.eks. "geom")
 * @param {string[]} fields - Liste over andre kolonner du ønsker å hente
 */
async function fetchAndCreateLayer(tableName, geometryField, fields) {
  const layerGroup = L.featureGroup();
  let totalFeatures = 0;
  const PAGE_SIZE = 1000;

  try {
    console.log(`Fetching data for ${tableName}...`);
    
    // Hent alle sider med data
    let allData = [];
    let hasMore = true;
    let page = 0;

    while (hasMore) {
      const { data, error, count } = await supabaseClient
        .rpc('get_geojson_features', {
          table_name: tableName,
          page_number: page,
          page_size: PAGE_SIZE
        });

      if (error) {
        console.error(`Error fetching page ${page} for ${tableName}:`, error);
        break;
      }

      if (!data || data.length === 0) {
        hasMore = false;
        continue;
      }

      allData = [...allData, ...data];
      console.log(`Fetched page ${page + 1} for ${tableName}, got ${data.length} features`);
      page++;
      
      // Sjekk om vi har fått færre enn PAGE_SIZE elementer
      hasMore = data.length === PAGE_SIZE;
    }

    console.log(`Total features fetched for ${tableName}: ${allData.length}`);

    // Behandle alle hentede data
    allData.forEach((row, index) => {
      try {
        if (!row.geojson) {
          console.warn(`Missing geometry for row ${index} in ${tableName}`);
          return;
        }

        const geojsonFeature = {
          type: 'Feature',
          geometry: row.geojson,
          properties: row.properties || {}
        };

        const gj = L.geoJSON(geojsonFeature, {
          style: (feature) => {
            if (feature.geometry.type === 'Polygon') {
              const population = feature.properties.popTot || 0;
              const color = population > 5000 ? '#800026' :
                           population > 1249 ? '#BD0026' :
                           population > 624  ? '#E31A1C' :
                           population > 312  ? '#FC4E2A' :
                           population > 124  ? '#FD8D3C' :
                           population > 31   ? '#FEB24C' :
                           population > 7    ? '#FED976' :
                                               '#FFEDA0';
              return {
                fillColor: color,
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
              };
            }
          },
          onEachFeature: (feature, layer) => {
            let popupContent = `<h4>${tableName.toUpperCase()}</h4>`;
            Object.entries(feature.properties).forEach(([key, value]) => {
              if (key !== 'geom') {
                if (key === 'popTot') {
                  popupContent += `<strong>Befolkning:</strong> ${value}<br/>`;
                } else {
                  popupContent += `<strong>${key}:</strong> ${value ?? ''}<br/>`;
                }
              }
            });
            layer.bindPopup(popupContent);
          },
          pointToLayer: (feature, latlng) => {
            if (feature.geometry.type === 'Point') {
              // Opprett tilpasset ikon basert på tabellnavn
              let customIcon = null;
              
              if (tableName === 'tilfluktsrom') {
                customIcon = L.divIcon({
                  html: '<i class="fa-solid fa-person-shelter" style="font-size: 24px; color: #2980b9;"></i>',
                  className: 'custom-icon',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                });
              } else if (tableName === 'brannstasjon') {
                customIcon = L.divIcon({
                  html: '<i class="fa-solid fa-fire-extinguisher" style="font-size: 24px; color: #e74c3c;"></i>',
                  className: 'custom-icon',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                });
              }
              return L.marker(latlng, { icon: customIcon || L.Icon.Default() });
            }
          }
        });

        gj.addTo(layerGroup);
        totalFeatures++;
      } catch (e) {
        console.error(`Error processing feature ${index} in ${tableName}:`, e);
      }
    });

    console.log(`Successfully loaded ${totalFeatures} features for ${tableName}`);
    return layerGroup;
  } catch (e) {
    console.error(`Error in fetchAndCreateLayer for ${tableName}:`, e);
    return layerGroup;
  }
}

export async function getTilfluktsromLayer() {
  return await fetchAndCreateLayer('tilfluktsrom', 'geom', [
    'id', 'geom', 'gml_id', 'lokalId', 'navnerom',
    'versjonId', 'datauttaksdato', 'opphav',
    'romnr', 'plasser', 'adresse'
  ]);
}

export async function getBrannstasjonLayer() {
  return await fetchAndCreateLayer('brannstasjon', 'geom', [
    'id', 'geom', 'gml_id', 'opphav',
    'brannstasjon', 'brannvesen',
    'stasjonstype', 'kasernert'
  ]);
}

export async function getBefolkningstallLayer() {
  const layer = await fetchAndCreateLayer('befolkningstall', 'geom', [
    'id', 'geom', 'gml_id', 'lokalid',
    'navnerom', 'versjonid',
    'oppdateringsdato', 'datauttaksdato',
    'opphav', 'ssbid250m', 'poptot',
    'statistikkar'
  ]);

  // Debug layer info
  const bounds = layer.getBounds();
  const features = layer.getLayers();
  
  console.log('Befolkningstall layer info:', {
    featureCount: features.length,
    bounds: {
      north: bounds.getNorth().toFixed(4),
      south: bounds.getSouth().toFixed(4),
      east: bounds.getEast().toFixed(4),
      west: bounds.getWest().toFixed(4)
    },
    populationStats: features.reduce((stats, feature) => {
      const pop = feature.feature?.properties?.poptot || 0;
      stats.total += pop;
      stats.max = Math.max(stats.max, pop);
      stats.min = Math.min(stats.min, pop);
      return stats;
    }, { total: 0, max: 0, min: Infinity })
  });
  
  return layer;
}