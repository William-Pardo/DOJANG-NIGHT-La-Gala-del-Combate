const storyWrapper = document.getElementById('horizontal-story');
const stickyContainer = document.getElementById('horizontal-sticky');
const track = document.getElementById('horizontal-track');
const panels = Array.from(document.querySelectorAll('.story-panel'));
const progressBar = document.getElementById('progress-bar');
const heroLogo = document.querySelector('.hero-logo-large');
const heroBg = document.querySelector('.panel-hero .panel-media img');

function updateHorizontalScroll() {
  const isDesktop = window.innerWidth >= 900;

  if (!isDesktop) {
    // Reset para mobile
    storyWrapper.style.height = 'auto';
    track.style.transform = 'none';
    if (progressBar) progressBar.style.width = '0%';
    
    // Intersection Observer simple para mobile
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
        panel.classList.add('is-active');
      }
    });
    return;
  }

  // Lógica Desktop
  const maxTranslate = track.scrollWidth - window.innerWidth;
  
  // Altura del wrapper = 100vh (para que el sticky funcione) + la distancia a hacer scroll
  // Así, por cada 1px de scroll vertical, avanzamos 1px horizontal
  storyWrapper.style.height = `${window.innerHeight + maxTranslate}px`;

  const scrollY = window.scrollY;
  const offsetTop = storyWrapper.offsetTop;
  
  // Calcular progreso dentro del wrapper
  let progress = (scrollY - offsetTop) / maxTranslate;
  progress = Math.max(0, Math.min(1, progress));

  // Actualizar Progress Bar
  if (progressBar) {
    progressBar.style.width = `${progress * 100}%`;
  }

  // Translación Horizontal
  const translateX = progress * maxTranslate;
  track.style.transform = `translate3d(-${translateX}px, 0, 0)`;

  // Activar Paneles basado en visibilidad
  panels.forEach(panel => {
    // La posición virtual del panel en la pantalla
    const panelLeft = panel.offsetLeft - translateX;
    // Si la izquierda del panel entra en el viewport (un poco antes del centro)
    if (panelLeft < window.innerWidth * 0.65 && panelLeft > -window.innerWidth * 0.5) {
      panel.classList.add('is-active');
    }
  });

  // Parallax Hero
  if (heroLogo && heroBg && progress < 0.2) {
    // El translateX ya mueve el contenedor, pero queremos un pequeño offset adicional 
    // vertical u horizontal. El requerimiento pide "logo grande con leve desplazamiento vertical"
    // y "fondo con translateY sutil". Como estamos en horizontal, el vertical scroll de la página 
    // se refleja en "scrollY - offsetTop".
    const localScroll = scrollY - offsetTop;
    if (localScroll > 0) {
      heroLogo.style.transform = `translate3d(0, ${localScroll * 0.4}px, 0)`;
      heroBg.style.transform = `translate3d(0, ${localScroll * 0.2}px, 0)`;
    } else {
      heroLogo.style.transform = 'none';
      heroBg.style.transform = 'none';
    }
  }
}

// Inicialización
window.addEventListener('scroll', updateHorizontalScroll, { passive: true });
window.addEventListener('resize', updateHorizontalScroll);

// Llamada inicial para setear alturas
updateHorizontalScroll();

// Pequeño delay para asegurar carga completa
setTimeout(updateHorizontalScroll, 150);
