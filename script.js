// DOJANG NIGHT interaction system. Pure JS, GitHub Pages friendly.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const animatedItems = Array.from(document.querySelectorAll("[data-animate]"));
const timelineItems = Array.from(document.querySelectorAll(".timeline-item"));
const backToTop = document.querySelector("[data-back-to-top]");
const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
const flowSticky = document.querySelector("[data-flow-sticky]");
const flowTrack = document.querySelector("[data-flow-track]");
const flowPanels = Array.from(document.querySelectorAll("[data-flow-panel]"));

const timelineDetails = {
  "Bloque 1": {
    grupo: "Grupo rojo",
    ingreso: "Manilla roja, validación y ubicación inicial",
    centro: "Combates internos, break freestyle y reconocimientos",
    salida: "Salida controlada, limpieza rápida y preparación del siguiente bloque"
  },
  "Bloque 2": {
    grupo: "Grupo azul",
    ingreso: "Nuevo ingreso con aforo rotativo y manilla azul",
    centro: "Rondas por edad y nivel con mesa técnica visible",
    salida: "Desocupación escalonada para liberar el auditorio"
  },
  "Bloque 3": {
    grupo: "Grupo dorado",
    ingreso: "Último bloque operativo con manilla dorada",
    centro: "Cierre deportivo, reconocimientos y foto familiar",
    salida: "Salida general organizada y cierre de jornada"
  }
};

function getTargetFromLink(link) {
  const id = link.getAttribute("href");
  return id && id.length > 1 ? document.querySelector(id) : null;
}

function getHeaderOffset() {
  return header ? header.offsetHeight + 12 : 0;
}

function closeMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setupProgressLine() {
  if (document.querySelector(".progress-line")) return;
  const line = document.createElement("div");
  line.className = "progress-line";
  line.setAttribute("aria-hidden", "true");
  document.body.appendChild(line);
}

function setupSmoothScroll() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = getTargetFromLink(link);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      closeMobileNav();
    });
  });
}

function setupMobileNav() {
  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMobileNav();
      navToggle.focus();
    }
  });
}

function setupActiveNavigation() {
  const sections = navLinks.map(getTargetFromLink).filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: [0.08, 0.2, 0.45]
  });

  sections.forEach((section) => observer.observe(section));
}

function setupStaggeredItems() {
  const groups = Array.from(document.querySelectorAll("[data-stagger]"));

  groups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.style.setProperty("--stagger-delay", prefersReducedMotion ? "0ms" : `${Math.min(index * 70, 420)}ms`);
    });
  });
}

function animateCounter(number) {
  if (!number || number.dataset.counted === "true") return;

  const target = Number(number.dataset.count);
  if (!Number.isFinite(target)) return;

  number.dataset.counted = "true";

  if (prefersReducedMotion) {
    number.textContent = String(target);
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    number.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      number.textContent = String(target);
    }
  }

  requestAnimationFrame(tick);
}

function setupRevealOnScroll() {
  if (!animatedItems.length) return;

  if (prefersReducedMotion) {
    animatedItems.forEach((item) => {
      item.classList.add("is-visible");
      if (item.dataset.animate === "counter") {
        animateCounter(item.querySelector("[data-count]"));
      }
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.dataset.animate === "counter") {
        animateCounter(entry.target.querySelector("[data-count]"));
      }

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -48px 0px"
  });

  animatedItems.forEach((item) => observer.observe(item));
}

function buildTimelineDetail(item) {
  const title = item.querySelector("h3")?.textContent?.trim();
  const details = timelineDetails[title];
  if (!details || item.querySelector(".timeline-detail-list")) return;

  const list = document.createElement("ul");
  list.className = "timeline-detail-list";
  list.innerHTML = `
    <li><strong>Grupo:</strong> ${details.grupo}</li>
    <li><strong>Ingreso:</strong> ${details.ingreso}</li>
    <li><strong>Centro:</strong> ${details.centro}</li>
    <li><strong>Salida:</strong> ${details.salida}</li>
  `;

  item.appendChild(list);
}

function setActiveTimelineItem(activeItem) {
  timelineItems.forEach((item) => {
    const isActive = item === activeItem;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-expanded", String(isActive));
  });
  buildTimelineDetail(activeItem);
}

function setupInteractiveTimeline() {
  if (!timelineItems.length) return;

  timelineItems.forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-expanded", index === 0 ? "true" : "false");

    const activate = () => setActiveTimelineItem(item);

    item.addEventListener("mouseenter", activate);
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  setActiveTimelineItem(timelineItems[0]);
}

function setActiveFlowPanel(activeIndex) {
  flowPanels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === activeIndex);
  });
}

function setupFlowPanelObserver() {
  if (!flowPanels.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    setActiveFlowPanel(flowPanels.indexOf(visible.target));
  }, {
    rootMargin: "-22% 0px -38% 0px",
    threshold: [0.18, 0.36, 0.58]
  });

  flowPanels.forEach((panel) => observer.observe(panel));
  setActiveFlowPanel(0);
}

function setupBackToTop() {
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

function updateFlowSticky() {
  if (!flowSticky || !flowTrack || prefersReducedMotion || window.innerWidth <= 1180) return;

  const rect = flowSticky.getBoundingClientRect();
  const scrollable = flowSticky.offsetHeight - window.innerHeight;
  const maxTranslate = Math.max(0, flowTrack.scrollWidth - window.innerWidth + 72);
  const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);

  flowTrack.style.setProperty("--flow-progress", (progress * maxTranslate).toFixed(2));

  if (flowPanels.length) {
    const activeIndex = Math.min(flowPanels.length - 1, Math.floor(progress * flowPanels.length));
    setActiveFlowPanel(activeIndex);
  }
}

function updateScrollState() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

  document.documentElement.style.setProperty("--page-progress", pageProgress.toFixed(4));

  if (header) {
    header.classList.toggle("is-scrolled", scrollY > 24);
  }

  if (backToTop) {
    backToTop.classList.toggle("is-visible", scrollY > 620);
  }

  if (!prefersReducedMotion && parallaxItems.length) {
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * 34;
      item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  }

  updateFlowSticky();
}

function setupScrollListeners() {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", updateScrollState);
  updateScrollState();
}

setupProgressLine();
setupSmoothScroll();
setupMobileNav();
setupStaggeredItems();
setupActiveNavigation();
setupRevealOnScroll();
setupInteractiveTimeline();
setupFlowPanelObserver();
setupBackToTop();
setupScrollListeners();
