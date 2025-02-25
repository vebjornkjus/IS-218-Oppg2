class MapLayers {
    constructor(map) {
        this.map = map;
        this.layers = {};
    }

    async initializeLayers() {
        const populatedPlaces = await this.fetchPopulatedPlaces();
        this.createBaseLayers(populatedPlaces);
        await this.createRiskLayer();
        this.addLayerControls();
    }

    async fetchPopulatedPlaces() {
        const { data, error } = await supabaseClient
            .from('populated_places')
            .select(`
                id,
                name,
                pop_min,
                ST_AsGeoJSON(geom)::json AS geometry
            `);
        
        if (error) throw error;

        return {
            type: "FeatureCollection",
            features: data.map(item => ({
                type: "Feature",
                geometry: item.geometry,
                properties: {
                    id: item.id,
                    name: item.name,
                    pop_min: item.pop_min
                }
            }))
        };
    }

    createBaseLayers(populatedPlaces) {
        this.layers.dot = this.createDotLayer(populatedPlaces);
        this.layers.cluster = this.createClusterLayer(populatedPlaces);
        this.layers.heat = this.createHeatLayer(populatedPlaces);
    }

    createDotLayer(data) {
        return L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 0,
                    fillOpacity: 0.4
                });
            }
        }).addTo(this.map);
    }

    createClusterLayer(data) {
        const clusterLayer = L.markerClusterGroup();
        L.geoJSON(data, {
            pointToLayer: (feature, latlng) => L.marker(latlng)
        }).addTo(clusterLayer);
        return clusterLayer;
    }

    createHeatLayer(data) {
        return L.heatLayer(
            data.features.map(feature => [
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]
            ]),
            {
                radius: 50,
                blur: 10,
                maxZoom: 10,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }
        );
    }

    async createRiskLayer() {
        this.layers.risk = L.layerGroup().addTo(this.map);
        try {
            const response = await fetch('data/processed/Flomkart.geojson');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const flomData = await response.json();
            
            this.layers.risk.clearLayers();
            this.layers.risk.addLayer(L.geoJSON(flomData, {
                style: () => ({ color: 'blue', weight: 2 }),
                onEachFeature: (feature, layer) => {
                    if (feature.properties?.gml_id) {
                        layer.bindPopup("GML ID: " + feature.properties.gml_id);
                    }
                }
            }));
        } catch (error) {
            console.error("Error loading Flomkart.geojson:", error);
        }
    }

    addLayerControls() {
        const overlayMaps = {
            "Dot Map": this.layers.dot,
            "Cluster Map": this.layers.cluster,
            "Heat Map": this.layers.heat,
            "Flomkart": this.layers.risk
        };
        L.control.layers(null, overlayMaps).addTo(this.map);
    }
}