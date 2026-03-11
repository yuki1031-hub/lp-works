/* ============================================================
   LISELA - 女性専用美肌脱毛サロン LP
   Main JavaScript
   ============================================================ */

'use strict';

// ──────────────────────────────────────────
// Utility
// ──────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ──────────────────────────────────────────
// Header scroll effect
// ──────────────────────────────────────────
(function initHeaderScroll() {
  const header = $('#header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Add CSS for scrolled state
  const style = document.createElement('style');
  style.textContent = `.header.scrolled { box-shadow: 0 2px 32px rgba(0,0,0,.12); }`;
  document.head.appendChild(style);
})();


// ──────────────────────────────────────────
// Hamburger menu
// ──────────────────────────────────────────
(function initHamburger() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');
  const overlay   = $('#overlay');
  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  $$('.mobile-nav__link, .mobile-nav__cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();


// ──────────────────────────────────────────
// Hero slider
// ──────────────────────────────────────────
(function initHeroSlider() {
  const slides = $$('.hero__slide');
  const dots   = $$('.hero__dots .dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(+dot.dataset.index);
      autoPlay();
    });
  });

  autoPlay();
})();


// ──────────────────────────────────────────
// Carousel helper factory
// ──────────────────────────────────────────
function createCarousel(trackId, prevId, nextId, getItemWidth) {
  const track = $(trackId);
  const prevBtn = $(prevId);
  const nextBtn = $(nextId);
  if (!track || !prevBtn || !nextBtn) return;

  let offset = 0;

  function maxOffset() {
    const containerWidth = track.parentElement.offsetWidth;
    const totalWidth = track.scrollWidth;
    return Math.max(0, totalWidth - containerWidth);
  }

  function move(dir) {
    const step = getItemWidth ? getItemWidth() : track.firstElementChild?.offsetWidth + 20 || 280;
    offset += dir * step;
    offset = Math.max(0, Math.min(offset, maxOffset()));
    track.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn.addEventListener('click', () => move(-1));
  nextBtn.addEventListener('click', () => move(1));

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) move(diff > 0 ? 1 : -1);
  }, { passive: true });
}

createCarousel('#campaignTrack', '#campaignPrev', '#campaignNext');
createCarousel('#voiceTrack',    '#voicePrev',    '#voiceNext');


// ──────────────────────────────────────────
// Plan tabs
// ──────────────────────────────────────────
(function initPlanTabs() {
  const tabs  = $$('.plan__tab');
  const panes = $$('.plan__pane');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = $(`[data-pane="${target}"]`);
      if (pane) pane.classList.add('active');
    });
  });
})();


// ──────────────────────────────────────────
// FAQ accordion
// ──────────────────────────────────────────
(function initFaq() {
  const items = $$('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq__q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();


// ──────────────────────────────────────────
// Scroll fade-in animation
// ──────────────────────────────────────────
(function initFadeIn() {
  // Add fade-in class to target elements
  const targets = [
    '.campaign__card',
    '.special__item',
    '.plan__card',
    '.feature__item',
    '.voice__card',
    '.flow__step',
    '.faq__item',
    '.salon__area',
    '.stat',
  ];

  targets.forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  $$('.fade-in').forEach(el => observer.observe(el));
})();


// ──────────────────────────────────────────
// Fixed CTA visibility
// ──────────────────────────────────────────
(function initFixedCta() {
  const cta = $('#fixedCta');
  if (!cta) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      cta.classList.add('show');
    } else {
      cta.classList.remove('show');
    }
  }, { passive: true });
})();


// ──────────────────────────────────────────
// Smooth scroll for anchor links
// ──────────────────────────────────────────
(function initSmoothScroll() {
  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '70'
  );

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ──────────────────────────────────────────
// Notice bar — duplicate content for seamless loop
// ──────────────────────────────────────────
(function initMarquee() {
  const inner = $('.notice-bar__inner');
  if (!inner) return;
  // Duplicate the content so the loop appears seamless
  inner.innerHTML += inner.innerHTML;
})();


// ──────────────────────────────────────────
// Active nav highlight on scroll
// ──────────────────────────────────────────
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__list a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px',
  });

  sections.forEach(section => observer.observe(section));

  // Add active style
  const style = document.createElement('style');
  style.textContent = `.nav__list a.active { color: var(--gold); }`;
  document.head.appendChild(style);
})();
