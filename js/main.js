// Fil: js/main.js

import { getTilfluktsromLayer, getBrannstasjonLayer, getBefolkningstallLayer } from './layers.js';
import { NuclearEffectsVisualizer } from './nuclearEffects.js';

// Opprett Leaflet-kartet
const map = L.map('map').setView([58.14671, 7.9956], 12); // Kristiansand-ish

// Legg til en basiskart-layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Opprett en Layer Control for å kunne skru av/på lag
const layerControl = L.control.layers(null, null).addTo(map);

// Initialiser sidebar funksjonalitet
function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  const dragHandle = document.getElementById('drag-handle');
  const mapElement = document.getElementById('map');

  // Toggle sidebar når knappen trykkes
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
      toggleBtn.textContent = '→';
      mapElement.style.width = '100%';
    } else {
      toggleBtn.textContent = '←';
      mapElement.style.width = `calc(100% - ${sidebar.offsetWidth}px)`;
    }
    map.invalidateSize(); // Oppdater kartstørrelsen
  });

  // Håndter drag for å endre bredden
  let isDragging = false;
  let startX;
  let startWidth;

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
    });
  });

  function handleMouseMove(e) {
    if (isDragging) {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 50 && newWidth <= 500) { // Min/max bredde
        sidebar.style.width = `${newWidth}px`;
        mapElement.style.width = `calc(100% - ${newWidth}px)`;
        map.invalidateSize();
      }
    }
  }
}

// Initialiser visualisering av atomvåpeneffekter
function initializeNuclearEffects() {
  const nuclearVisualizer = new NuclearEffectsVisualizer(map);
  const sidebarLayerList = document.getElementById('layer-list');
  
  // Lag bombevalg-grensesnittet i sidepanelet
  nuclearVisualizer.createSidebarUI(sidebarLayerList);
  
  // Initialiser klikkhendelse på kartet for å plassere bomber
  nuclearVisualizer.initMapClickEvent();

}

// IIFE (Immediately Invoked Function Expression) for å kunne bruke async/await
(async function() {
  // Initialiser sidebar
  initializeSidebar();
  
  // Initialiser verktøy for atomvåpeneffekter
  const nuclearEffects = initializeNuclearEffects();
  
  // Hent og legg til tilfluktsrom
  const tilfluktsromLayer = await getTilfluktsromLayer();
  tilfluktsromLayer.addTo(map);
  layerControl.addOverlay(tilfluktsromLayer, 'Tilfluktsrom');

  // Hent og legg til brannstasjoner
  const brannstasjonLayer = await getBrannstasjonLayer();
  // Legger ikke til som default synlig på kartet
  layerControl.addOverlay(brannstasjonLayer, 'Brannstasjoner');

  // Hent og legg til befolkningstall
  const befolkningLayer = await getBefolkningstallLayer(map);  // Added map parameter
  layerControl.addOverlay(befolkningLayer, 'Befolkningstall');
})();