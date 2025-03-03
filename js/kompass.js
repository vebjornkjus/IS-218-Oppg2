// Fil: js/kompass.js

// Helt redesignet kompass med forbedret synlighet
export const CompassControl = L.Control.extend({
  options: {
    position: 'bottomright' // Endre posisjonen til nederst til høyre
  },
  
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar compass-control');
    
    // Styling av container
    container.style.backgroundColor = 'transparent'; // Gjør bakgrunnen gjennomsiktig
    container.style.width = '60px';  
    container.style.height = '60px'; 
    container.style.boxShadow = 'none'; // Fjern skyggen
    container.style.marginBottom = '10px';
    container.style.position = 'absolute'; // Bruk absolutt posisjonering
    container.style.right = '10px'; // Plasser 10px fra høyre kant
    container.style.bottom = '80%'; // Plasser litt nærmere midten på høyre side
    container.style.transform = 'translateY(-50%)'; // Juster for å sentrere vertikalt
    container.style.border = 'none'; // Fjern rammen
    
    // Bruk SVG for kompasset - firebeint stjerne med tydelige himmelretninger
    container.innerHTML = `
      <svg viewBox="0 0 100 100" width="60" height="60">
        <!-- Kompasslinjer -->
        <line x1="50" y1="5" x2="50" y2="95" stroke="#555" stroke-width="1" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#555" stroke-width="1" />
        
        <!-- Himmelretninger -->
        <text x="50" y="15" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">N</text>
        <text x="85" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">Ø</text>
        <text x="50" y="88" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">S</text>
        <text x="15" y="50" text-anchor="middle" font-weight="bold" font-size="14" fill="#000">V</text>
        
        <!-- Kompassnål -->
        <polygon points="50,20 47,50 50,47 53,50" fill="red" stroke="#333" stroke-width="1" />
        <polygon points="50,80 47,50 50,53 53,50" fill="#333" stroke="#333" stroke-width="1" />
        
        <!-- Midtpunkt -->
        <circle cx="50" cy="50" r="4" fill="#333" />
      </svg>
    `;
    
    return container;
  }
});