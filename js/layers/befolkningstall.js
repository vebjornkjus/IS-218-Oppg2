import { supabaseClient } from '../config.js';

function getPopulationColor(population) {
  return population > 5000 ? '#800026' :
         population > 1249 ? '#BD0026' :
         population > 624  ? '#E31A1C' :
         population > 312  ? '#FC4E2A' :
         population > 124  ? '#FD8D3C' :
         population > 31   ? '#FEB24C' :
         population > 7    ? '#FED976' :
                           '#FFEDA0';
}

export async function getBefolkningstallLayer() {
  const layerGroup = L.featureGroup();
  const PAGE_SIZE = 500;
  let page = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const { data, error } = await supabaseClient
        .rpc('get_geojson_features', {
          table_name: 'befolkningstall',
          page_number: page,
          page_size: PAGE_SIZE
        });

      if (error || !data || data.length === 0) break;

      data.forEach(row => {
        if (!row.geojson) return;

        L.geoJSON({
          type: 'Feature',
          geometry: row.geojson,
          properties: row.properties || {}
        }, {
          style: (feature) => ({
            fillColor: getPopulationColor(feature.properties.popTot || 0),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
          }),
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <h4>BEFOLKNINGSTALL</h4>
              <strong>Befolkning:</strong> ${feature.properties.popTot || 0}<br/>
              <strong>SSB ID:</strong> ${feature.properties.ssbid250m || ''}<br/>
            `;
            layer.bindPopup(popupContent);
          }
        }).addTo(layerGroup);
      });

      page++;
      hasMore = data.length === PAGE_SIZE;
    }

    return layerGroup;
  } catch (e) {
    console.error('Error in getBefolkningstallLayer:', e);
    return layerGroup;
  }
}