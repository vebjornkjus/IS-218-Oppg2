import { supabaseClient } from '../config.js';

export async function getBrannstasjonLayer() {
  const layerGroup = L.featureGroup();
  const PAGE_SIZE = 1000;
  let page = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const { data, error } = await supabaseClient
        .rpc('get_geojson_features', {
          table_name: 'brannstasjon',
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
          pointToLayer: (feature, latlng) => {
            const customIcon = L.divIcon({
              html: '<i class="fa-solid fa-fire-extinguisher" style="font-size: 24px; color: #e74c3c;"></i>',
              className: 'custom-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            return L.marker(latlng, { icon: customIcon });
          },
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <h4>BRANNSTASJON</h4>
              <strong>Navn:</strong> ${feature.properties.brannstasjon || ''}<br/>
              <strong>Brannvesen:</strong> ${feature.properties.brannvesen || ''}<br/>
              <strong>Type:</strong> ${feature.properties.stasjonstype || ''}<br/>
              <strong>Kasernert:</strong> ${feature.properties.kasernert || ''}<br/>
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
    console.error('Error in getBrannstasjonLayer:', e);
    return layerGroup;
  }
}