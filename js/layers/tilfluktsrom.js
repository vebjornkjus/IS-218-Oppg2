import { supabaseClient } from '../config.js';

export async function getTilfluktsromLayer() {
  const layerGroup = L.featureGroup();
  const PAGE_SIZE = 1000;
  let page = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const { data, error } = await supabaseClient
        .rpc('get_geojson_features', {
          table_name: 'tilfluktsrom',
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
              html: '<i class="fa-solid fa-person-shelter" style="font-size: 24px; color: #2980b9;"></i>',
              className: 'custom-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            return L.marker(latlng, { icon: customIcon });
          },
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <h4>TILFLUKTSROM</h4>
              <strong>Plasser:</strong> ${feature.properties.plasser || ''}<br/>
              <strong>Adresse:</strong> ${feature.properties.adresse || ''}<br/>
              <strong>Rom nr:</strong> ${feature.properties.romnr || ''}<br/>
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
    console.error('Error in getTilfluktsromLayer:', e);
    return layerGroup;
  }
}