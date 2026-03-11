'use strict';

/* ================================================================
   SHEER MEN'S CLINIC — main.js
================================================================ */

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


// ---------------------------------------------------------------
// Header: scroll effect
// ---------------------------------------------------------------
const header = qs('#header');

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 60);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


// ---------------------------------------------------------------
// Hamburger / Mobile Nav
// ---------------------------------------------------------------
const hamburger  = qs('#hamburger');
const headerNav  = qs('#headerNav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  headerNav.classList.toggle('is-open', isOpen);
  headerNav.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
qsa('a', headerNav).forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    headerNav.classList.remove('is-open');
    headerNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});


// ---------------------------------------------------------------
// Smooth scroll (offset for sticky header)
// ---------------------------------------------------------------
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href === '#') return;
  const target = qs(href);
  if (!target) return;
  e.preventDefault();
  const offset = header.offsetHeight + 8;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
});


// ---------------------------------------------------------------
// FAQ Accordion
// ---------------------------------------------------------------
const faqItems = qsa('.s-faq__item');

faqItems.forEach(item => {
  const btn    = qs('.s-faq__q', item);
  const answer = qs('.s-faq__a', item);

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(other => {
      const ob = qs('.s-faq__q', other);
      const oa = qs('.s-faq__a', other);
      ob.setAttribute('aria-expanded', 'false');
      oa.setAttribute('hidden', '');
    });

    // Toggle this
    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.removeAttribute('hidden');
    }
  });
});


// ---------------------------------------------------------------
// Gallery / Slideshow
// ---------------------------------------------------------------
const track    = qs('#galleryTrack');
const slides   = track ? qsa('.clinic-gallery-slide', track) : [];
const dotsWrap = qs('#galleryDots');
const btnPrev  = qs('#galleryPrev');
const btnNext  = qs('#galleryNext');

if (slides.length && dotsWrap) {
  let current = 0;
  let autoTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = qsa('.gallery-dot', dotsWrap);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  btnPrev && btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  btnNext && btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetAuto();
    }
  }, { passive: true });

  startAuto();
}


// ---------------------------------------------------------------
// Scroll Reveal
// ---------------------------------------------------------------
const revealTargets = [
  '.s-concern__item',
  '.s-feature__mini-card',
  '.s-flow__step',
  '.s-faq__item',
  '.clinic-info-card',
  '.access-store-card',
  '.s-plan__item-body',
  '.s-cta__head',
];

revealTargets.forEach(selector => {
  qsa(selector).forEach((el, i) => {
    el.classList.add('js-reveal');
    // Stagger siblings
    const siblings = qsa(selector, el.parentElement);
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 5) {
      el.classList.add(`js-reveal--delay${idx}`);
    }
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

qsa('.js-reveal').forEach(el => revealObserver.observe(el));


// ---------------------------------------------------------------
// Fixed Bottom CTA (SP) — show after hero leaves viewport
// ---------------------------------------------------------------
const fixedCta = qs('#fixedBottomCta');
const heroSection = qs('#hero');

if (fixedCta && heroSection) {
  const heroObserver = new IntersectionObserver(entries => {
    fixedCta.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0.05 });
  heroObserver.observe(heroSection);
}


// ---------------------------------------------------------------
// Back to Top
// ---------------------------------------------------------------
const pageTopBtn = qs('#pageTop');

if (pageTopBtn) {
  window.addEventListener('scroll', () => {
    pageTopBtn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  pageTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ---------------------------------------------------------------
// Form Validation & Submit
// ---------------------------------------------------------------
const form        = qs('#ctaForm');
const formSuccess = qs('#formSuccess');

if (form) {
  const rules = {
    'f-name':    { test: v => v.trim().length >= 2,                        msg: 'お名前を入力してください（2文字以上）' },
    'f-kana':    { test: v => /^[\u30A0-\u30FF\s　]+$/.test(v.trim()),     msg: 'カタカナでフリガナを入力してください' },
    'f-tel':     { test: v => /^[\d\-+() ]{10,15}$/.test(v.trim()),        msg: '正しい電話番号を入力してください' },
    'f-email':   { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),msg: '正しいメールアドレスを入力してください' },
    'f-privacy': { test: () => qs('#f-privacy').checked,                   msg: 'プライバシーポリシーへの同意が必要です' },
  };

  function setError(id, msg) {
    const el  = qs('#err-' + id.replace('f-', ''));
    const inp = qs('#' + id);
    if (el)  el.textContent = msg;
    if (inp) inp.classList.toggle('is-err', !!msg);
  }

  // Blur validation
  Object.keys(rules).forEach(id => {
    const inp = qs('#' + id);
    if (!inp || inp.type === 'checkbox') return;
    inp.addEventListener('blur', () => {
      const ok = rules[id].test(inp.value);
      setError(id, ok ? '' : rules[id].msg);
    });
    inp.addEventListener('input', () => {
      if (inp.classList.contains('is-err') && rules[id].test(inp.value)) {
        setError(id, '');
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(id => {
      const inp = qs('#' + id);
      const val = inp ? inp.value : '';
      const ok  = rules[id].test(val);
      setError(id, ok ? '' : rules[id].msg);
      if (!ok) valid = false;
    });

    if (!valid) {
      const firstErr = form.querySelector('.is-err');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate submit
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.setAttribute('hidden', '');
      formSuccess.removeAttribute('hidden');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
}


// ---------------------------------------------------------------
// Active nav link on scroll (highlight current section)
// ---------------------------------------------------------------
const sections  = qsa('section[id], div[id="cta"]');
const navLinks  = qsa('.l-header__nav a[href^="#"]');

if (navLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));
}
