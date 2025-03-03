// Fil: js/kompass.js

// Helt redesignet kompass med forbedret synlighet
export const CompassControl = L.Control.extend({
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