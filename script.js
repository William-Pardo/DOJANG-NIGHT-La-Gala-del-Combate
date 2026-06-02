(() => {
  const story = document.querySelector(".horizontal-story");
  const sticky = document.querySelector(".horizontal-sticky");
  const track = document.querySelector(".horizontal-track");
  const panels = Array.from(document.querySelectorAll(".story-panel"));
  const progressBar = document.querySelector(".horizontal-progress-bar");
  const navLinks = Array.from(document.querySelectorAll("[data-panel-link]"));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let maxTranslate = 0;
  let storyStart = 0;
  let storyHeight = 0;
  let activeIndex = 0;
  let isReady = false;

  const fallbackSvg =
    "data:image/svg+xml;base64," +
    btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop stop-color="#11141b" offset="0"/>
            <stop stop-color="#050609" offset="1"/>
          </linearGradient>
          <radialGradient id="r" cx="30%" cy="30%" r="70%">
            <stop stop-color="#e3222c" stop-opacity=".18" offset="0"/>
            <stop stop-color="#e3222c" stop-opacity="0" offset="1"/>
          </radialGradient>
          <radialGradient id="b" cx="74%" cy="44%" r="70%">
            <stop stop-color="#126dff" stop-opacity=".18" offset="0"/>
            <stop stop-color="#126dff" stop-opacity="0" offset="1"/>
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#g)"/>
        <rect width="1600" height="900" fill="url(#r)"/>
        <rect width="1600" height="900" fill="url(#b)"/>
        <text x="50%" y="47%" text-anchor="middle" fill="#f8f8fb" font-family="Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="4">
          DOJANG NIGHT
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="#d8b66a" font-family="Arial, sans-serif" font-size="28" letter-spacing="8">
          IMAGEN PENDIENTE
        </text>
      </svg>
    `);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isDesktop() {
    return window.innerWidth >= 900;
  }

  function parseAttr(panel, name, fallback) {
    const raw = panel.dataset[name];
    if (raw === undefined) return fallback;

    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function setImageFallbacks() {
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          img.src = fallbackSvg;
          img.classList.add("fallback-img");
        },
        { once: true }
      );
    });
  }

  function setNavState(index) {
    navLinks.forEach((link) => {
      const linkIndex = Number(link.dataset.panelLink);
      link.classList.toggle("is-active", linkIndex === index);
    });
  }

  function getMostVisiblePanelIndex(x) {
    const panelWidth = window.innerWidth || 1;
    let selectedIndex = 0;
    let bestVisibleWidth = -1;

    panels.forEach((_, index) => {
      const panelLeft = index * panelWidth - x;
      const panelRight = panelLeft + panelWidth;

      const visibleLeft = Math.max(panelLeft, 0);
      const visibleRight = Math.min(panelRight, panelWidth);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);

      if (visibleWidth > bestVisibleWidth) {
        bestVisibleWidth = visibleWidth;
        selectedIndex = index;
      }
    });

    return selectedIndex;
  }

  function getSectionProgress(panelIndex, x) {
    const panelWidth = window.innerWidth || 1;
    const panelLeft = panelIndex * panelWidth - x;

    /*
      MAPA CORREGIDO DEL AVANCE DE CADA SECCIÓN:

      panelLeft =  panelWidth  → la sección empieza a entrar por la derecha → progress = 0.0
      panelLeft =  0           → la sección está centrada / visible completa → progress = 0.6
      panelLeft = -panelWidth  → la sección salió por la izquierda          → progress = 1.2

      Esto evita que el texto aparezca tarde.
    */
    return ((panelWidth - panelLeft) / (panelWidth * 2)) * 1.2;
  }

  function setPanelStates(x = 0) {
    activeIndex = getMostVisiblePanelIndex(x);
    setNavState(activeIndex);

    panels.forEach((panel, index) => {
      const enterAt = parseAttr(panel, "enter", 0.08);
      const leaveAt = parseAttr(panel, "leave", 1.1);
      const sectionProgress = getSectionProgress(index, x);

      const isPanelNearViewport = sectionProgress >= 0 && sectionProgress <= 1.2;
      const isTextVisible = sectionProgress >= enterAt && sectionProgress <= leaveAt;
      const leavingStart = Math.max(enterAt, leaveAt - 0.16);
      const isTextLeaving = isTextVisible && sectionProgress >= leavingStart;

      panel.classList.toggle("is-active-panel", index === activeIndex || isPanelNearViewport);
      panel.classList.toggle("is-text-visible", isTextVisible);
      panel.classList.toggle("is-text-leaving", isTextLeaving);
    });
  }

  function setupHorizontalScroll() {
    if (!story || !sticky || !track || panels.length === 0) return;

    if (!isDesktop() || reducedMotion) {
      story.style.height = "auto";
      track.style.transform = "none";

      panels.forEach((panel) => {
        panel.classList.add("is-active-panel", "is-text-visible");
        panel.classList.remove("is-text-leaving");
      });

      setNavState(activeIndex);
      isReady = true;
      return;
    }

    track.style.transform = "translate3d(0, 0, 0)";
    story.style.height = "auto";

    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;

    maxTranslate = Math.max(0, trackWidth - viewportWidth);
    storyHeight = maxTranslate + window.innerHeight;

    story.style.height = `${storyHeight}px`;
    storyStart = story.offsetTop;

    isReady = true;
    updateHorizontalScroll();
  }

  function updateHorizontalScroll() {
    if (!isReady || !story || !track || !isDesktop() || reducedMotion) return;

    const scrollY = window.scrollY;
    const raw = scrollY - storyStart;
    const progress = maxTranslate === 0 ? 0 : clamp(raw / maxTranslate, 0, 1);
    const x = progress * maxTranslate;

    track.style.transform = `translate3d(${-x}px, 0, 0)`;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    setPanelStates(x);
  }

  function scrollToPanel(panelIndex) {
    if (!story || !isDesktop() || reducedMotion) {
      panels[panelIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const targetX = clamp(panelIndex, 0, panels.length - 1) * window.innerWidth;
    const targetScrollY = storyStart + targetX;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }

  function setupNav() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const targetIndex = Number(link.dataset.panelLink);
        scrollToPanel(targetIndex);
      });
    });
  }

  function setupMobileObserver() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isDesktop() && !reducedMotion) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = panels.indexOf(entry.target);
            activeIndex = index;
            setNavState(activeIndex);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    panels.forEach((panel) => observer.observe(panel));
  }

  function init() {
    setImageFallbacks();
    setupNav();
    setupMobileObserver();

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }

    window.addEventListener("resize", setupHorizontalScroll);
    window.addEventListener("orientationchange", setupHorizontalScroll);
    window.addEventListener("scroll", updateHorizontalScroll, { passive: true });

    setupHorizontalScroll();
    setPanelStates(0);
  }

  window.addEventListener("load", init);
})();