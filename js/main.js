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

// Helt redesignet kompass med forbedret synlighet
const CompassControl = L.Control.extend({
  options: {
    position: 'topright'
  },
  
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar compass-control');
    
    // Styling av container
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    container.style.width = '90px';  
    container.style.height = '90px'; 
    container.style.borderRadius = '50%'; // Gjør kompasset rundt
    container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
    container.style.marginBottom = '10px';
    container.style.position = 'relative';
    container.style.border = '2px solid #333';
    
    // Bruk SVG for kompasset - full sirkel med tydelige himmelretninger
    container.innerHTML = `
      <svg viewBox="0 0 100 100" width="90" height="90">
        <!-- Bakgrunnsirkel -->
        <circle cx="50" cy="50" r="45" fill="white" stroke="#333" stroke-width="1" />
        
        <!-- Kompasslinjer -->
        <line x1="50" y1="5" x2="50" y2="95" stroke="#555" stroke-width="1" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#555" stroke-width="1" />
        <line x1="20" y1="20" x2="80" y2="80" stroke="#555" stroke-width="0.5" />
        <line x1="20" y1="80" x2="80" y2="20" stroke="#555" stroke-width="0.5" />
        
        <!-- Himmelretninger - i en sirkel rundt ytterkanten -->
        <text x="50" y="15" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">N</text>
        <text x="85" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">Ø</text>
        <text x="50" y="88" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">S</text>
        <text x="15" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">V</text>
        
        <!-- Nordøst, Sørøst, etc. -->
        <text x="75" y="25" text-anchor="middle" font-size="10" fill="#555">NØ</text>
        <text x="75" y="75" text-anchor="middle" font-size="10" fill="#555">SØ</text>
        <text x="25" y="75" text-anchor="middle" font-size="10" fill="#555">SV</text>
        <text x="25" y="25" text-anchor="middle" font-size="10" fill="#555">NV</text>
        
        <!-- Kompassnål -->
        <polygon points="50,15 45,50 50,45 55,50" fill="red" stroke="#333" stroke-width="0.5" />
        <polygon points="50,85 45,50 50,55 55,50" fill="#333" stroke="#333" stroke-width="0.5" />
        
        <!-- Midtpunkt -->
        <circle cx="50" cy="50" r="4" fill="#333" />
      </svg>
    `;
    
    return container;
  }
});

// Legg til det forbedrede kompasset på kartet
new CompassControl().addTo(map);

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
const befolkningLayer = await getBefolkningstallLayer(map); // Added map parameter
layerControl.addOverlay(befolkningLayer, 'Befolkningstall');
})();