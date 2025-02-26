import { MapLayers } from './layers.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize your Leaflet map (example coordinates and zoom level)
  const map = L.map('map').setView([58.1467, 7.9956], 13);

  // Add a base tile layer (OpenStreetMap used as an example)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Initialize the MapLayers, which will fetch your data and create the heatmap layer
  const mapLayers = new MapLayers(map);
  mapLayers.initializeLayers();
});