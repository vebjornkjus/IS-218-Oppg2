document.addEventListener('DOMContentLoaded', () => {
  // Create the map
  const map = L.map('map').setView([60, 10], 5);
  
  // Add OSM base layer
  const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
      }
  ).addTo(map);

  // Add Carto light layer
  const cartoLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
      }
  );

  // Overlay layers
  const someOverlay = L.heatLayer(/* ... */);
  const anotherOverlay = L.marker([59.91, 10.75]);

  // Layer controls
  const baseMaps = {
      'OpenStreetMap': osmLayer,
      'Carto Light': cartoLayer,
  };

  const overlayMaps = {
      'Heatmap': someOverlay,
      'Markør': anotherOverlay,
  };

  // Sidebar functionality
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  const dragHandle = document.getElementById('drag-handle');
  const mapDiv = document.getElementById('map');

  let isCollapsed = false;
  let isResizing = false;

  // Toggle sidebar
  toggleBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
          sidebar.classList.add('collapsed');
          toggleBtn.textContent = '→';
      } else {
          sidebar.classList.remove('collapsed');
          toggleBtn.textContent = '←';
      }
      setTimeout(() => {
          map.invalidateSize();
      }, 300);
  });

  // Resize functionality
  dragHandle.addEventListener('mousedown', (e) => {
      if (!isCollapsed) {
          isResizing = true;
          document.body.style.cursor = 'col-resize';
      }
  });

  document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const newWidth = Math.min(Math.max(e.clientX, 150), 600);
      sidebar.style.width = newWidth + 'px';
      mapDiv.style.width = `calc(100% - ${newWidth}px)`;
      map.invalidateSize();
  });

  document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = 'default';
  });

  // Generate layer list
  function generateLayerList(overlays) {
      const layerList = document.getElementById('layer-list');
      
      Object.entries(overlays).forEach(([name, layer]) => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = false;
          checkbox.addEventListener('change', (e) => {
              if (e.target.checked) {
                  layer.addTo(map);
              } else {
                  map.removeLayer(layer);
              }
          });
      
          li.appendChild(checkbox);
          li.appendChild(document.createTextNode(' ' + name));
          layerList.appendChild(li);
      });
  }

  // Add scale control
  L.control.scale({
      position: 'bottomleft',
      imperial: false,
  }).addTo(map);

  // Initialize layer list
  generateLayerList(overlayMaps);
});