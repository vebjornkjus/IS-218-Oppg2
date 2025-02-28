// Fil: js/main.js

import { getTilfluktsromLayer, getBrannstasjonLayer, getBefolkningstallLayer } from './layers.js';

// Opprett Leaflet-kartet
const map = L.map('map').setView([58.14671, 7.9956], 12); // Kristiansand-ish

// Legg til en basiskart-layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Opprett en Layer Control for å kunne skru av/på lag
const layerControl = L.control.layers(null, null).addTo(map);

// IIFE (Immediately Invoked Function Expression) for å kunne bruke async/await
(async function() {
  // Hent og legg til tilfluktsrom
  const tilfluktsromLayer = await getTilfluktsromLayer();
  tilfluktsromLayer.addTo(map);
  layerControl.addOverlay(tilfluktsromLayer, 'Tilfluktsrom');

  // Hent og legg til brannstasjoner
  const brannstasjonLayer = await getBrannstasjonLayer();
  // Legger ikke til som default synlig på kartet
  layerControl.addOverlay(brannstasjonLayer, 'Brannstasjoner');

  // Hent og legg til befolkningstall
  const befolkningLayer = await getBefolkningstallLayer();
  // Legger ikke til som default synlig på kartet
  layerControl.addOverlay(befolkningLayer, 'Befolkningstall');
})();