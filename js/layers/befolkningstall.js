import { supabaseClient } from '../config.js';

// Memoize color calculations
const colorCache = new Map();
function getPopulationColor(population) {
    if (colorCache.has(population)) {
        return colorCache.get(population);
    }
    const color = population > 5000 ? '#800026' :
        population > 1249 ? '#BD0026' :
        population > 624 ? '#E31A1C' :
        population > 312 ? '#FC4E2A' :
        population > 124 ? '#FD8D3C' :
        population > 31 ? '#FEB24C' :
        population > 7 ? '#FED976' :
        '#FFEDA0';
    colorCache.set(population, color);
    return color;
}

const baseStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
};

// Throttle function to limit how often moveend fires
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export async function getBefolkningstallLayer(map) {
    const clusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 13,
        iconCreateFunction: function(cluster) {
            const markers = cluster.getAllChildMarkers();
            const totalPopulation = markers.reduce((sum, marker) => {
                return sum + (marker.feature?.properties?.popTot || 0);
            }, 0);
            
            const className = totalPopulation > 5000 ? 'marker-cluster-large' :
                            totalPopulation > 1000 ? 'marker-cluster-medium' :
                            'marker-cluster-small';
            
            return L.divIcon({
                html: `<div><span>${totalPopulation.toLocaleString()}</span></div>`,
                className: `marker-cluster ${className}`,
                iconSize: L.point(40, 40)
            });
        }
    });

    const featureLayer = L.featureGroup();
    let allFeatures = [];
    let loadingDiv;

    try {
        loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        document.body.appendChild(loadingDiv);

        const PAGE_SIZE = 250;
        let page = 0;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabaseClient
                .rpc('get_geojson_features', {
                    table_name: 'befolkningstall',
                    page_number: page,
                    page_size: PAGE_SIZE
                });

            if (error) throw error;
            if (!data || data.length === 0) break;

            const newFeatures = data
                .filter(row => row.geojson)
                .map(row => ({
                    type: 'Feature',
                    geometry: row.geojson,
                    properties: row.properties || {}
                }));

            allFeatures = [...allFeatures, ...newFeatures];
            loadingDiv.textContent = `Henter: ${allFeatures.length} områder med befolkningstall`;
            
            page++;
            hasMore = data.length === PAGE_SIZE;
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        if (allFeatures.length === 0) throw new Error("Ingen befolkningsdata tilgjengelig");

        const renderViewport = throttle(() => {
            const bounds = map.getBounds();
            const currentZoom = map.getZoom();

            featureLayer.clearLayers();
            clusterGroup.clearLayers();

            allFeatures.forEach(feature => {
                const layer = L.geoJSON(feature);
                if (layer.getBounds().intersects(bounds)) {
                    if (currentZoom >= 13) {
                        const geoJsonLayer = L.geoJSON(feature, {
                            style: (feature) => ({
                                ...baseStyle,
                                fillColor: getPopulationColor(feature.properties.popTot || 0)
                            }),
                            onEachFeature: (feature, layer) => {
                                const content = `
                                    <h4>BEFOLKNINGSTALL</h4>
                                    <strong>Befolkning:</strong> ${feature.properties.popTot || 0}<br/>
                                    <strong>Oppdatert:</strong> ${(feature.properties.oppdateringsdato || '').slice(0, 10)}<br/>
                                `;
                                layer.bindPopup(content);
                            }
                        });
                        featureLayer.addLayer(geoJsonLayer);
                    } else {
                        const center = layer.getBounds().getCenter();
                        const marker = L.marker(center, {
                            icon: L.divIcon({
                                className: 'population-marker',
                                html: `<div style="background-color: ${getPopulationColor(feature.properties.popTot || 0)}">${feature.properties.popTot || 0}</div>`,
                                iconSize: [30, 30]
                            })
                        });
                        marker.feature = feature;
                        clusterGroup.addLayer(marker);
                    }
                }
            });
        }, 250);

        map.on('moveend', renderViewport);
        renderViewport();
    } catch (e) {
        console.error('Feil ved lasting av befolkningsdata:', e);
        alert("Kunne ikke laste befolkningsdata. Sjekk konsollen for mer info.");
    } finally {
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }

    return L.layerGroup([featureLayer, clusterGroup]);
}
