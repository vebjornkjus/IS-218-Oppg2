export function initializeSidebar(map) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    const dragHandle = document.getElementById('drag-handle');
    const mapElement = document.getElementById('map');
  
    // Opprett en knapp som vises når sidebaren er kollapset
    const showSidebarBtn = document.createElement('button');
    showSidebarBtn.id = 'show-sidebar-btn';
    showSidebarBtn.textContent = '-';
    showSidebarBtn.style.position = 'absolute';
    showSidebarBtn.style.left = '5px';
    showSidebarBtn.style.top = '10px';
    showSidebarBtn.style.zIndex = '1000';
    showSidebarBtn.style.padding = '5px 10px';
    showSidebarBtn.style.backgroundColor = 'white';
    showSidebarBtn.style.border = '1px solid #ccc';
    showSidebarBtn.style.borderRadius = '4px';
    showSidebarBtn.style.cursor = 'pointer';
    showSidebarBtn.style.display = 'none';
    document.body.appendChild(showSidebarBtn);
  
    if (!sidebar || !toggleBtn || !dragHandle || !mapElement) {
      console.error('One or more sidebar elements are missing.');
      return;
    }
  
    // Sett CSS for kartet til å fylle hele kontaineren
    mapElement.style.width = '100%';
    mapElement.style.height = '100%';
    mapElement.style.position = 'absolute';
    mapElement.style.top = '0';
    mapElement.style.left = '0';
    
    // Oppdater CSS for sidebaren for å overlappe kartet
    sidebar.style.position = 'absolute';
    sidebar.style.top = '0';
    sidebar.style.left = '0';
    sidebar.style.height = '100%';
    sidebar.style.zIndex = '999'; // Under vis-knappen, men over kartet
    
    // Sett en bakgrunnsfarge med opasitet om nødvendig
    if (!sidebar.style.backgroundColor) {
      sidebar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    // Lagre original sidebar-bredde
    const originalSidebarWidth = sidebar.offsetWidth || 300; // Fallback til 300px
    
    // Funksjon for å vise sidebar
    function showSidebar() {
      sidebar.classList.remove('collapsed');
      sidebar.style.display = 'block';
      sidebar.style.transform = 'translateX(0)';
      toggleBtn.textContent = '←';
      showSidebarBtn.style.display = 'none';
    }
    
    // Funksjon for å skjule sidebar
    function hideSidebar() {
      sidebar.classList.add('collapsed');
      sidebar.style.transform = 'translateX(-100%)';
      toggleBtn.textContent = '→';
      showSidebarBtn.style.display = 'block';
    }
    
    // Lytter for vis-knappen
    showSidebarBtn.addEventListener('click', showSidebar);
    
    // Toggle sidebar når knappen trykkes
    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('collapsed')) {
        showSidebar();
      } else {
        hideSidebar();
      }
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
      document.addEventListener('mouseup', handleMouseUp);
    });
  
    function handleMouseMove(e) {
      if (isDragging) {
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth >= 50 && newWidth <= 500) {
          sidebar.style.width = `${newWidth}px`;
        }
      }
    }
    
    function handleMouseUp() {
      if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    }
    
    // Oppdater kartet én gang ved oppstart (bare i tilfelle)
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    // Legg til CSS-overgang for en myk animasjon
   // sidebar.style.transition = 'transform 0.3s ease-in-out';
  }