class DrawTools {
    constructor(map) {
        this.map = map;
        this.drawnItems = new L.FeatureGroup();
        this.initialize();
    }

    initialize() {
        this.map.addLayer(this.drawnItems);
        this.addDrawControl();
        this.addDrawEventListeners();
    }

    addDrawControl() {
        const drawControl = new L.Control.Draw({
            edit: { featureGroup: this.drawnItems },
            draw: {
                polygon: true,
                polyline: false,
                rectangle: true,
                circle: true,
                marker: false
            }
        });
        this.map.addControl(drawControl);
    }

    addDrawEventListeners() {
        this.map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            this.drawnItems.addLayer(layer);
            this.createBuffer(layer);
        });
    }

    createBuffer(layer) {
        const drawnGeoJSON = layer.toGeoJSON();
        const buffered = turf.buffer(drawnGeoJSON, 5, { units: 'kilometers' });
        L.geoJSON(buffered, {
            style: { color: 'green', weight: 2, fillOpacity: 0.2 }
        }).addTo(this.map);
        layer.bindPopup("Buffer på 5 km opprettet rundt dette område").openPopup();
    }
}