// layers.js
import { supabaseClient } from './config.js';

export class MapLayers {
  constructor(map) {
    this.map = map;
  }

  async initializeLayers() {
    try {
      const heatData = await this.fetchHeatData();
      console.log('Fetched heat data:', heatData); // <-- Debug
      this.createHeatLayer(heatData);
    } catch (error) {
      console.error('Error in initializeLayers:', error);
    }
  }

  async fetchHeatData() {
    // ST_X/ ST_Y return the longitude/latitude for a POINT geometry in PostGIS
    const { data, error } = await supabaseClient
      .from('populated_places_view')
      .select('id, latitude, longitude');

    if (error) {
      console.error('Error fetching heat data from view:', error);
      return [];
    }

    // Convert each row into a Leaflet.heat-compatible triplet: [lat, lon, intensity]
    return data.map((row) => [row.latitude, row.longitude, 1]);
  }

  createHeatLayer(heatData) {
    // Create the heat layer
    const heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });

    // Add the heat layer to the map
    heatLayer.addTo(this.map);

    // Optional: automatically fit the map to your data’s bounding box
    if (heatData.length > 0) {
      const latLngs = heatData.map(([lat, lon]) => L.latLng(lat, lon));
      this.map.fitBounds(L.latLngBounds(latLngs));
    }
  }
}