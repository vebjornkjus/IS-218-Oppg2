// Fil: js/layers.js

import { supabaseClient } from './config.js';

// Then replace all instances of 'supabase' with 'supabaseClient' in your code

/**
 * Henter data fra en tabell i Supabase og returnerer et Leaflet LayerGroup.
 * @param {string} tableName - Navnet på tabellen i Supabase
 * @param {string} geometryField - Navnet på kolonnen som inneholder geometri (f.eks. "geom")
 * @param {string[]} fields - Liste over andre kolonner du ønsker å hente
 */

async function fetchAndCreateLayer(tableName, geometryField, fields) {
  const layerGroup = L.layerGroup();

  try {
    console.log(`Fetching data for ${tableName}...`);
    const { data, error } = await supabaseClient
      .rpc('get_geojson_features', {
        table_name: tableName
      });

    if (error) {
      console.error(`Feil ved henting av data fra ${tableName}:`, error);
      return layerGroup;
    }

    if (!data || !data.length) {
      console.warn(`Ingen data funnet for ${tableName}`);
      return layerGroup;
    }

    console.log(`Retrieved ${data.length} features for ${tableName}`);
    console.log('First feature:', data[0]);

    data.forEach((row, index) => {
      try {
        if (!row.geojson) {
          console.warn(`Missing geometry for row ${index} in ${tableName}:`, row);
          return;
        }

        // Debug coordinate values
        console.log(`Coordinates for ${tableName}:`, {
          raw: row.geojson.coordinates,
          lat: row.geojson.coordinates[1],
          lng: row.geojson.coordinates[0]
        });

        const geojsonFeature = {
          type: 'Feature',
          geometry: row.geojson,
          properties: row.properties || {}
        };

        console.log(`Processing feature ${index} for ${tableName}:`, geojsonFeature);

        const gj = L.geoJSON(geojsonFeature, {
          onEachFeature: (feature, layer) => {
            let popupContent = `<h4>${tableName.toUpperCase()}</h4>`;
            Object.entries(feature.properties).forEach(([key, value]) => {
              if (key !== 'geom') {
                popupContent += `<strong>${key}:</strong> ${value ?? ''}<br/>`;
              }
            });
            layer.bindPopup(popupContent);
          },
          pointToLayer: (feature, latlng) => {
            console.log(`Creating marker at ${latlng} for ${tableName}`);
            return L.marker(latlng);
          },
        });

        gj.addTo(layerGroup);
      } catch (e) {
        console.error(`Error processing feature ${index} in ${tableName}:`, e);
      }
    });

    console.log(`Successfully loaded ${data.length} features for ${tableName}`);
    return layerGroup;
  } catch (e) {
    console.error(`Error in fetchAndCreateLayer for ${tableName}:`, e);
    return layerGroup;
  }
}

export async function getTilfluktsromLayer() {
  return await fetchAndCreateLayer('tilfluktsrom', 'geom', [
    'id',
    'geom',
    'gml_id',
    'lokalId',
    'navnerom',
    'versjonId',
    'datauttaksdato',
    'opphav',
    'romnr',
    'plasser',
    'adresse'
  ]);
}

export async function getBrannstasjonLayer() {
  return await fetchAndCreateLayer('brannstasjon', 'geom', [
    'id',
    'geom',
    'gml_id',
    'opphav',
    'brannstasjon',
    'brannvesen',
    'stasjonstype',
    'kasernert'
  ]);
}

export async function getBefolkningstallLayer() {
  const layer = await fetchAndCreateLayer('befolkningstall', 'geom', [
    'id',
    'geom',
    'gml_id',
    'lokalId', 
    'navnerom',
    'versjonId', // Note: changed from versjonId
    'oppdateringsdato',
    'datauttaksdato',
    'opphav',
    'ssbid250m',
    'popTot',   // Note: changed from popTot
    'statistikkAr' // Note: changed from statistikkAr
  ]);

  // Add debug logging
  console.log('Befolkningstall layer created:', layer);
  console.log('Number of features:', layer.getLayers().length);
  
  return layer;
}