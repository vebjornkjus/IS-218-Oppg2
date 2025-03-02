// Fil: js/main.js

import { getTilfluktsromLayer, getBrannstasjonLayer, getBefolkningstallLayer } from './layers.js';
import { NuclearEffectsVisualizer } from './nuclearEffects.js';
import { initializeSidebar } from './Sidebar.js';

// Opprett Leaflet-kartet med tilpassede zoomkontroller
const map = L.map('map', {
  zoomControl: false, // Deaktiver standard zoomkontroller
  center: [58.14671, 7.9956], // Kristiansand-ish
  zoom: 12 // Startzoom
});

// Legg til en basiskart-layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Legg til tilpassede zoomkontroller øverst til høyre
L.control.zoom({
  position: 'topright' // Endre posisjonen til zoomkontrollene
}).addTo(map);

// Opprett en Layer Control for å kunne skru av/på lag
const layerControl = L.control.layers(null, null).addTo(map);

// Initialiser visualisering av atomvåpeneffekter
function initializeNuclearEffects() {
  const nuclearVisualizer = new NuclearEffectsVisualizer(map);
  const sidebarLayerList = document.getElementById('layer-list');
  
  if (!sidebarLayerList) {
    console.error('Layer list element is missing.');
    return;
  }

  // Lag bombevalg-grensesnittet i sidepanelet
  nuclearVisualizer.createSidebarUI(sidebarLayerList);
  
  // Initialiser klikkhendelse på kartet for å plassere bomber
  nuclearVisualizer.initMapClickEvent();
}

// IIFE (Immediately Invoked Function Expression) for å kunne bruke async/await
(async function() {
  // Initialiser sidebar
  initializeSidebar(map);
  
  // Initialiser verktøy for atomvåpeneffekter
  initializeNuclearEffects();
  
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