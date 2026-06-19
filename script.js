(function () {
  'use strict';

  /* ----------------------------------------------------------
     MOBILE NAV TOGGLE
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ----------------------------------------------------------
     HERO PARALLAX FLOAT  (ported from 21st.dev parallax-floating)
     ---------------------------------------------------------- */
  (function () {
    const hero     = document.getElementById('hero');
    const floatEls = hero ? Array.from(hero.querySelectorAll('.float-el')) : [];
    if (!floatEls.length) return;

    const SENSITIVITY    = -1;   // negative = images move opposite mouse (depth illusion)
    const EASING         = 0.05;

    let mouseX = 0, mouseY = 0;
    const pos = floatEls.map(() => ({ x: 0, y: 0 }));

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouseX = hero.offsetWidth  / 2;
      mouseY = hero.offsetHeight / 2;
    });

    // Touch support
    hero.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const r = hero.getBoundingClientRect();
      mouseX = t.clientX - r.left;
      mouseY = t.clientY - r.top;
    }, { passive: true });

    function tick() {
      floatEls.forEach((el, i) => {
        const depth    = parseFloat(el.dataset.depth) || 1;
        const strength = (depth * SENSITIVITY) / 20;
        const tx = mouseX * strength;
        const ty = mouseY * strength;
        pos[i].x += (tx - pos[i].x) * EASING;
        pos[i].y += (ty - pos[i].y) * EASING;
        el.style.transform = `translate3d(${pos[i].x}px,${pos[i].y}px,0)`;
      });
      requestAnimationFrame(tick);
    }

    // Start at hero centre so images don't jump on first mouse entry
    mouseX = hero.offsetWidth  / 2;
    mouseY = hero.offsetHeight / 2;
    tick();
  })();

  /* ----------------------------------------------------------
     HERO TILES — fill container with hover-flash tiles
     ---------------------------------------------------------- */
  function initTiles() {
    const container = document.getElementById('heroTiles');
    if (!container) return;

    const TILE = 48;

    function build() {
      container.innerHTML = '';
      // +2 on each axis ensures the partial tiles at the right and bottom edges are covered
      const cols = Math.ceil(container.offsetWidth  / TILE) + 2;
      const rows = Math.ceil(container.offsetHeight / TILE) + 2;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < rows * cols; i++) {
        const el = document.createElement('div');
        el.className = 'hero-tile';
        frag.appendChild(el);
      }
      container.appendChild(frag);
    }

    build();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });
  }

  initTiles();

  /* ----------------------------------------------------------
     MARQUEE — scroll-velocity speed boost
     ---------------------------------------------------------- */
  (function () {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    const baseSpeeds = Array.from(tracks).map(t => parseFloat(t.dataset.speed) || 22);
    let lastY = window.scrollY;
    let velocity = 0;

    function tick() {
      const currentY = window.scrollY;
      velocity += (currentY - lastY - velocity) * 0.2; // smooth
      lastY = currentY;

      const boost = Math.min(Math.abs(velocity) * 0.4, 12);
      tracks.forEach((t, i) => {
        t.style.animationDuration = Math.max(8, baseSpeeds[i] - boost) + 's';
      });

      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ----------------------------------------------------------
     TIMELINE ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll('.tc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      const isOpen = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.textContent = isOpen ? 'Collapse' : 'Expand';
    });
  });

  /* ----------------------------------------------------------
     SCROLL SPY — highlight active nav link
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));

})();
