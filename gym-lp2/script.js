/* ==========================================================================
   NEXFIT GYM — script.js
   ========================================================================== */

'use strict';

/* ---------- Hamburger Menu ---------- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const body      = document.body;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  body.appendChild(overlay);

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

/* ---------- Header scroll effect ---------- */
(function () {
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Back to top ---------- */
(function () {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- Floating CTA hide near contact ---------- */
(function () {
  const cta     = document.getElementById('floatingCta');
  const contact = document.getElementById('contact');

  if (!cta || !contact) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      cta.style.opacity       = entry.isIntersecting ? '0' : '1';
      cta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    },
    { threshold: 0.1 }
  );

  observer.observe(contact);
})();

/* ---------- Hero Particles ---------- */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 5 + 2;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = (Math.random() * 8 + 6).toFixed(1);
    const del  = (Math.random() * 8).toFixed(1);

    span.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur}s;
      --delay: ${del}s;
    `;
    container.appendChild(span);
  }
})();

/* ---------- Counter Animation ---------- */
(function () {
  const nums = document.querySelectorAll('.num[data-target]');
  if (!nums.length) return;

  function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const duration  = 1800;
    const step      = 16;
    const increment = target / (duration / step);
    let current     = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach(el => observer.observe(el));
})();

/* ---------- Scroll Reveal ---------- */
(function () {
  const targets = [
    '.feature-card',
    '.program-card',
    '.flow-step',
    '.price-card',
    '.faq-item',
    '.about__grid > *',
    '.access__grid > *',
    '.numbers__list li',
    '.ba-card',
  ];

  const elements = document.querySelectorAll(targets.join(','));
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let i = 0;
          siblings.forEach(sib => {
            if (!sib.classList.contains('visible')) {
              setTimeout(() => sib.classList.add('visible'), i * 80);
              i++;
            }
          });
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ---------- FAQ Accordion ---------- */
(function () {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-item__q');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ---------- Smooth scroll for anchor links ---------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---------- Price Plan Tab Switcher ---------- */
(function () {
  const tabs     = document.querySelectorAll('.price__tab');
  const cards    = document.querySelectorAll('.price-card');
  const priceNote = document.getElementById('priceNote');

  if (!tabs.length || !cards.length) return;

  function switchTab(tab) {
    const plan = tab.dataset.tab; // 'monthly' or 'annual'

    // Update tab active state
    tabs.forEach(t => t.classList.toggle('active', t === tab));

    // Update each price card
    cards.forEach(card => {
      const priceEl      = card.querySelector('.price-val');
      const annualNote   = card.querySelector('.price-card__annual-note');
      const monthlyPrice = card.dataset.monthlyPrice;
      const annualPrice  = card.dataset.annualPrice;
      const annualTotal  = card.dataset.annualTotal;

      if (!priceEl) return;

      if (plan === 'annual') {
        priceEl.textContent = `¥${annualPrice}`;
        if (annualNote) {
          annualNote.style.display = 'block';
          annualNote.textContent   = `年間 ¥${annualTotal}（税込）`;
        }
        card.classList.add('annual-active');
      } else {
        priceEl.textContent = `¥${monthlyPrice}`;
        if (annualNote) annualNote.style.display = 'none';
        card.classList.remove('annual-active');
      }

      // Trigger animation
      priceEl.style.animation = 'none';
      priceEl.offsetHeight; // reflow
      priceEl.style.animation = 'priceSwap 0.35s ease';
    });

    // Update footnote
    if (priceNote) {
      priceNote.textContent = plan === 'annual'
        ? '※ 年額プランは月額と比べて約2ヶ月分お得。30日間全額返金保証付き。'
        : '※ 全プランに30日間全額返金保証付き。入会金・事務手数料は0円。';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab));
  });
})();

/* ---------- Voice / Testimonial Slider ---------- */
(function () {
  const track   = document.getElementById('voiceTrack');
  const prevBtn = document.getElementById('voicePrev');
  const nextBtn = document.getElementById('voiceNext');
  const dotsEl  = document.getElementById('voiceDots');

  if (!track) return;

  const slides = track.querySelectorAll('.voice-card');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    const dots = dotsEl ? dotsEl.querySelectorAll('.voice__dot') : [];
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  }

  // Dot navigation
  if (dotsEl) {
    dotsEl.querySelectorAll('.voice__dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    });
  }

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  // Initialize
  goTo(0);
  startAuto();
})();

/* ---------- Before / After Comparison Slider ---------- */
(function () {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterPane = slider.querySelector('.ba-slider__after');
    const handle    = slider.querySelector('.ba-slider__handle');

    if (!afterPane || !handle) return;

    let active = false;

    function move(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width * 100;
      pct = Math.max(5, Math.min(95, pct));
      afterPane.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    }

    // Set initial 50%
    function initPosition() {
      const rect = slider.getBoundingClientRect();
      move(rect.left + rect.width * 0.5);
    }

    // Mouse events
    slider.addEventListener('mousedown', e => {
      active = true;
      move(e.clientX);
    });

    window.addEventListener('mousemove', e => {
      if (active) move(e.clientX);
    });

    window.addEventListener('mouseup', () => { active = false; });

    // Touch events
    slider.addEventListener('touchstart', e => {
      active = true;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (active) move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { active = false; });

    // Initialize when visible
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        initPosition();
        observer.unobserve(slider);
      }
    }, { threshold: 0.3 });

    observer.observe(slider);
  });
})();

/* ---------- Form Validation & Submit ---------- */
(function () {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');

  if (!form) return;

  const rules = {
    name:  { required: true, label: 'お名前' },
    kana:  { required: true, label: 'フリガナ' },
    email: { required: true, email: true, label: 'メールアドレス' },
    goal:  { required: true, label: '目標・お悩み' },
    agree: { checkbox: true, label: 'プライバシーポリシー' },
  };

  function getError(field, value) {
    const rule = rules[field];
    if (!rule) return '';

    if (rule.checkbox) {
      const el = form.querySelector(`[name="${field}"]`);
      return el && !el.checked ? `${rule.label}に同意してください。` : '';
    }

    if (rule.required && !value.trim()) {
      return `${rule.label}を入力してください。`;
    }

    if (rule.email && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '正しいメールアドレスを入力してください。';
    }

    return '';
  }

  function showError(fieldName, msg) {
    const errEl = document.getElementById(`${fieldName}Error`);
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
  }

  Object.keys(rules).forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;

    const eventType = input.type === 'checkbox' ? 'change' : 'blur';
    input.addEventListener(eventType, () => {
      const val = input.type === 'checkbox' ? '' : input.value;
      showError(name, getError(name, val));
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;

    Object.keys(rules).forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const val   = input ? (input.type === 'checkbox' ? '' : input.value) : '';
      const msg   = getError(name, val);
      showError(name, msg);
      if (msg) hasError = true;
    });

    if (hasError) {
      const firstError = form.querySelector('.error, input.error, select.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
})();
