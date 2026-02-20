/* ============================================================
   GLADES INTERNATIONAL — MAIN JS v2.0 (Unified)
   Integrates: main.js + script.js improved algorithm
   Tasks: Integration, Better Performance, Scroll FX
   ============================================================ */
'use strict';

const TRANSITION_MS = 280; // ms — tuned for snappy feel

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initActiveNav();
  initStickyHeader();
  initContactForm();
  initSuccessHashHandler();
  initFooterYear();
  initCounterAnimation();
  initFacilityTabs();
  initProductCustomizer();
  initScrollReveal();
  preloadImages();
  console.log('%c🏭 Glades International JS v2 ✓', 'color:#0E3A5D;font-weight:700;font-size:14px;');
});

/* ============================================================
   2. WINDOW LOAD
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
});

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (!btn || !nav) return;
  const open  = () => { nav.classList.add('active'); btn.innerHTML = '<i class="fas fa-times"></i>'; document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('active'); btn.innerHTML = '<i class="fas fa-bars"></i>'; document.body.style.overflow = ''; };
  btn.addEventListener('click', () => nav.classList.contains('active') ? close() : open());
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (!btn.contains(e.target) && !nav.contains(e.target)) close(); });
}

/* ============================================================
   4. SCROLL ANIMATIONS (lightweight, passive)
   ============================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const check = () => els.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 72) el.classList.add('visible'); });
  check();
  window.addEventListener('scroll', check, { passive: true });
}

/* ============================================================
   5. SCROLL REVEAL — IntersectionObserver (better perf, Task 2)
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = +entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.glass-card, .product-card, .facility-card, .facility-detail-card').forEach((el, i) => {
    if (!el.dataset.revealed) {
      el.dataset.revealed = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.dataset.delay = i * 75;
      observer.observe(el);
    }
  });
}

/* ============================================================
   6. ACTIVE NAV
   ============================================================ */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === page));
}

/* ============================================================
   7. STICKY HEADER
   ============================================================ */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 72 ? '0 5px 24px rgba(14,58,93,0.14)' : '0 2px 20px rgba(14,58,93,0.10)';
  }, { passive: true });
}

/* ============================================================
   8. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const inquiryType = form.querySelector('#inquiryType, [name="inquiry_type"]');
    const dynSubject  = form.querySelector('#dynamicSubject, [name="_subject"]');
    if (inquiryType?.value && dynSubject) dynSubject.value = `${inquiryType.value} Inquiry — Glades International`;
    submitForm(form, 'Thank you for your message! Our team will contact you within 24 hours.', 'contact.html');
  });
}



/* ============================================================
   10. FORM SUBMIT HELPER (DRY)
   ============================================================ */
function submitForm(form, successMsg, redirect) {
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn?.innerHTML;
  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; btn.disabled = true; }
  fetch(form.action, { method: 'POST', body: new FormData(form) })
    .then(() => { showSuccessPopup(redirect, successMsg); form.reset(); })
    .catch(() => form.submit())
    .finally(() => { if (btn) { btn.innerHTML = orig; btn.disabled = false; } });
}

/* ============================================================
   11. FORM VALIDATION
   ============================================================ */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('.error-message').forEach(el => { el.classList.remove('show'); el.textContent = ''; });
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('[required]').forEach(field => {
    const val  = field.value.trim();
    const errEl = field.closest('.form-group')?.querySelector('.error-message');
    if (!val) {
      field.classList.add('error');
      if (errEl) { errEl.textContent = 'This field is required.'; errEl.classList.add('show'); }
      if (valid) field.focus();
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      field.classList.add('error');
      if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.classList.add('show'); }
      if (valid) field.focus();
      valid = false;
    }
  });
  return valid;
}

/* ============================================================
   12. SUCCESS POPUP
   ============================================================ */
function showSuccessPopup(redirectPage, message) {
  let overlay = document.getElementById('successOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'successOverlay';
    overlay.className = 'success-overlay';
    overlay.innerHTML = `<div class="success-modal"><div class="success-icon"><i class="fas fa-check"></i></div><h3>Successfully Sent!</h3><p id="successMessage"></p><p class="success-timer" id="successTimer"></p></div>`;
    document.body.appendChild(overlay);
  }
  const msgEl   = document.getElementById('successMessage');
  const timerEl = document.getElementById('successTimer');
  if (msgEl) msgEl.textContent = message;
  overlay.classList.add('show');
  let countdown = 4;
  if (timerEl) timerEl.textContent = `Redirecting in ${countdown}s…`;
  const iv = setInterval(() => {
    countdown--;
    if (timerEl) timerEl.textContent = `Redirecting in ${countdown}s…`;
    if (countdown <= 0) { clearInterval(iv); overlay.classList.remove('show'); if (redirectPage) setTimeout(() => window.location.href = redirectPage, 300); }
  }, 1000);
  overlay.addEventListener('click', e => { if (e.target === overlay) { clearInterval(iv); overlay.classList.remove('show'); } });
}

/* ============================================================
   13. SUCCESS HASH HANDLER
   ============================================================ */
function initSuccessHashHandler() {
  if (window.location.hash === '#success') {
    history.replaceState(null, null, ' ');
    showSuccessPopup(null, 'Your inquiry has been sent successfully. We will contact you within 24 hours.');
    const form = document.getElementById('contactForm') || document.getElementById('investorForm');
    if (form) form.reset();
  }
}

/* ============================================================
   14. FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  document.querySelectorAll('.copyright p').forEach(el => el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear()));
}

/* ============================================================
   15. COUNTER ANIMATION (IntersectionObserver — Task 2)
   ============================================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-value, [data-counter]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        const raw    = entry.target.textContent.replace(/[^0-9]/g, '');
        const target = +(entry.target.dataset.target || raw);
        const suffix = entry.target.dataset.suffix || (entry.target.textContent.includes('+') ? '+' : '');
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

function animateCounter(el, target, suffix = '') {
  const duration = 1500, start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ============================================================
   16. FACILITY TABS
   ============================================================ */
function initFacilityTabs() {
  const tabs   = document.querySelectorAll('.facility-tab-btn');
  const panels = document.querySelectorAll('.facility-panel');
  if (!tabs.length) return;
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`facility-${btn.dataset.facility}`);
    if (panel) panel.classList.add('active');
    document.querySelector('.facilities-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
}

/* ============================================================
   17. PRODUCT CUSTOMIZER — IMPROVED ALGORITHM (Task 1 + 2)
   Based on the cleaner script.js approach:
   • Data-driven: swatches matched by data-color → img[data-color]
   • Self-contained per card (no cross-card interference)
   • Arrow-key nav, ARIA roles
   • Parallax / hover effects
   ============================================================ */
function initProductCustomizer() {
  const cards = document.querySelectorAll('.prod-card');
  if (!cards.length) return;

  // Inject keyframes once
  if (!document.getElementById('_customizerKF')) {
    const s = document.createElement('style');
    s.id = '_customizerKF';
    s.textContent = `
      @keyframes ripple { 0%{transform:translate(-50%,-50%)scale(0);opacity:1} 100%{transform:translate(-50%,-50%)scale(4);opacity:0} }
      @keyframes cardShake { 0%,100%{transform:translateY(-14px)scale(1.03)rotateZ(1deg)} 25%{transform:translateY(-18px)scale(1.04)rotateZ(2deg)} 50%{transform:translateY(-12px)scale(1.02)rotateZ(0deg)} 75%{transform:translateY(-16px)scale(1.035)rotateZ(1.5deg)} }
    `;
    document.head.appendChild(s);
  }

  // Scroll entrance
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

  cards.forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    io.observe(card);

    const imgWrap = card.querySelector('.product-image');
    if (!imgWrap) return;

    // Wire each swatch — IMPROVED ALGO from script.js
    card.querySelectorAll('.options > div').forEach(swatch => {
      swatch.setAttribute('tabindex', '0');
      swatch.setAttribute('role', 'button');
      swatch.setAttribute('aria-label', `Select ${swatch.dataset.color || swatch.title || ''} color`);

      const activate = () => selectColor(card, imgWrap, swatch);
      swatch.addEventListener('click', activate);
      swatch.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const siblings = [...card.querySelectorAll('.options > div')];
          const next = e.key === 'ArrowRight' ? siblings[siblings.indexOf(swatch) + 1] : siblings[siblings.indexOf(swatch) - 1];
          if (next) { next.focus(); selectColor(card, imgWrap, next); }
        }
      });
    });

    // Hover
    card.addEventListener('mouseenter', () => applyHover(imgWrap, true));
    card.addEventListener('mouseleave', () => applyHover(imgWrap, false));
    card.addEventListener('mousemove', e => applyParallax(card, imgWrap, e));
  });
}

/* ============================================================
   18. SELECT COLOR — Self-contained, no global calls (Task 2)
   ============================================================ */
function selectColor(card, imgWrap, swatch) {
  const color   = swatch.dataset.color || swatch.onclick?.toString().match(/'(\w+)'/)?.[1];
  const current = imgWrap.querySelector('img.active');
  // Try data-color first, then class-based fallback
  const target  = color
    ? imgWrap.querySelector(`img[data-color="${color}"]`)
    : null;

  if (!target || current === target) return;

  card.querySelectorAll('.options > div').forEach(s => s.classList.remove('active'));
  setTimeout(() => swatch.classList.add('active'), 60);

  // Card shake
  card.style.animation = 'cardShake 0.4s ease';
  setTimeout(() => { card.style.animation = ''; }, 420);

  // Fade out current
  if (current) {
    current.classList.add('fade-out');
    setTimeout(() => { current.classList.remove('active', 'fade-out'); current.style.transform = ''; }, TRANSITION_MS + 180);
  }

  // Fade in target
  setTimeout(() => {
    target.style.animation = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      target.style.animation = '';
      target.classList.add('active');
    }));
  }, TRANSITION_MS);

  createRipple(swatch);
  createParticleBurst(swatch);
}

/* ============================================================
   19. GLOBAL changeProductColor — legacy onclick compat (Task 1)
   Delegates to the new self-contained algorithm
   ============================================================ */
window.changeProductColor = function(element, color) {
  const card    = element.closest('.prod-card');
  if (!card) return;
  const imgWrap = card.querySelector('.product-image');
  if (!imgWrap) return;
  // Patch data-color on the swatch so selectColor can find it
  element.dataset.color = color;
  selectColor(card, imgWrap, element);
};

/* ============================================================
   20. HOVER / PARALLAX HELPERS
   ============================================================ */
function applyHover(imgWrap, entering) {
  const img = imgWrap.querySelector('img.active');
  if (!img) return;
  if (entering) {
    img.style.transform  = 'scale(1.12) translateY(-12px)';
    img.style.filter     = 'drop-shadow(0 25px 50px rgba(0,0,0,.35))';
    img.style.transition = 'all 0.5s cubic-bezier(.23,1,.32,1)';
  } else {
    img.style.transform  = 'scale(1) translateY(0) perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    img.style.filter     = 'drop-shadow(0 20px 40px rgba(0,0,0,.25))';
    img.style.transition = 'all 0.5s cubic-bezier(.23,1,.32,1)';
  }
}

function applyParallax(card, imgWrap, e) {
  const img = imgWrap.querySelector('img.active');
  if (!img) return;
  const { left, top, width, height } = card.getBoundingClientRect();
  const rx = ((e.clientY - top  - height / 2) / (height / 2)) * 8;
  const ry = ((e.clientX - left - width  / 2) / (width  / 2)) * -8;
  img.style.transform  = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.12) translateY(-8px) translateZ(30px)`;
  img.style.transition = 'transform 0.12s ease-out, filter 0.3s ease';
  img.style.filter     = 'drop-shadow(0 30px 60px rgba(0,0,0,.4))';
}

/* ============================================================
   21. RIPPLE EFFECT
   ============================================================ */
function createRipple(el) {
  const r = document.createElement('span');
  const d = Math.max(el.clientWidth, el.clientHeight);
  Object.assign(r.style, {
    width: d + 'px', height: d + 'px', left: '50%', top: '50%',
    transform: 'translate(-50%,-50%)', position: 'absolute',
    borderRadius: '50%', background: 'rgba(255,255,255,0.7)',
    animation: 'ripple 0.6s ease-out', pointerEvents: 'none', zIndex: '10'
  });
  el.style.position = 'relative'; el.style.overflow = 'hidden';
  el.appendChild(r);
  setTimeout(() => r.remove(), 620);
}

/* ============================================================
   22. PARTICLE BURST
   ============================================================ */
function createParticleBurst(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const cx = left + width / 2, cy = top + height / 2;
  const colors = ['#0E3A5D', '#2F7FB3', '#E53935', '#ffffff', getComputedStyle(el).backgroundColor];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 8;
    const vel   = 48 + Math.random() * 32;
    Object.assign(p.style, {
      position: 'fixed', left: cx + 'px', top: cy + 'px',
      width: '6px', height: '6px', borderRadius: '50%',
      background: colors[i % colors.length], pointerEvents: 'none',
      zIndex: '1000', boxShadow: '0 0 6px currentColor'
    });
    document.body.appendChild(p);
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle)*vel}px,${Math.sin(angle)*vel}px) scale(0)`, opacity: 0 }
    ], { duration: 580 + Math.random() * 200, easing: 'cubic-bezier(0.4,0,0.2,1)' }).onfinish = () => p.remove();
  }
}

/* ============================================================
   23. PRODUCT CATEGORY FILTER — optimised (Task 2)
   Uses requestAnimationFrame for batched DOM updates
   ============================================================ */
(function initCategoryFilter() {
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const productCards  = document.querySelectorAll('.product-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.category;

    requestAnimationFrame(() => {
      productCards.forEach((card, i) => {
        const show = cat === 'all' || card.dataset.category === cat;
        if (show) {
          card.style.display   = 'flex';
          card.style.opacity   = '0';
          card.style.transform = 'translateY(14px)';
          card.style.transition = `opacity 0.35s ease ${i * 50}ms, transform 0.35s ease ${i * 50}ms`;
          requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
        } else {
          card.style.display = 'none';
        }
      });
    });
  }));
})();

/* ============================================================
   24. PRELOAD IMAGES — for smooth transitions (Task 2)
   ============================================================ */
function preloadImages() {
  document.querySelectorAll('.product-image img, .prod-card .product-image img').forEach(img => {
    if (img.src) new Image().src = img.src;
  });
}
