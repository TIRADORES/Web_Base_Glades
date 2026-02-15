/* ============================================================
   GLADES INTERNATIONAL – MAIN JS (Unified)
   Integrates: main.js + script.js (index2 product customizer)
   Tasks: Form handling, Facilities map, Animations, Scroll FX
   ============================================================ */
'use strict';

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    initMobileMenu();
    initScrollAnimations();
    initActiveNav();
    initStickyHeader();
    initContactForm();
    initInvestorForm();
    initSuccessHashHandler();
    initFooterYear();
    initCounterAnimation();
    initFacilityTabs();
    initProductCustomizer();
    initScrollReveal();

    console.log('%c🏭 Glades International JS Initialized ✓', 'color:#0E3A5D;font-weight:700;font-size:14px;');
});

/* ============================================================
   2. WINDOW LOAD
   ============================================================ */
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 400);
    }
});

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        btn.innerHTML = isOpen
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

/* ============================================================
   4. SCROLL ANIMATIONS (fade-in)
   ============================================================ */
function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    const check = () => {
        els.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) el.classList.add('visible');
        });
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
}

/* ============================================================
   5. SCROLL REVEAL (advanced staggered)
   ============================================================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, entry.target.dataset.delay ? +entry.target.dataset.delay : 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.glass-card, .product-card, .facility-card, .facility-detail-card').forEach((el, i) => {
        if (!el.style.opacity) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            el.dataset.delay = i * 80;
            observer.observe(el);
        }
    });
}

/* ============================================================
   6. ACTIVE NAV
   ============================================================ */
function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });
}

/* ============================================================
   7. STICKY HEADER
   ============================================================ */
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.style.boxShadow = '0 5px 24px rgba(14,58,93,0.14)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(14,58,93,0.10)';
        }
    }, { passive: true });
}

/* ============================================================
   8. CONTACT FORM – FormSubmit + Success Popup
   ============================================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate required fields
        if (!validateForm(form)) return;

        // Set dynamic subject
        const inquiryType = form.querySelector('#inquiryType, [name="inquiry_type"]');
        const dynamicSubject = form.querySelector('#dynamicSubject, [name="_subject"]');
        if (inquiryType && dynamicSubject && inquiryType.value) {
            dynamicSubject.value = `${inquiryType.value} Inquiry – Glades International`;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }

        // Submit via FormSubmit (AJAX-style using fetch to avoid redirect)
        const data = new FormData(form);
        // Add FormSubmit config for AJAX response
        data.set('_captcha', 'false');
        data.set('_template', 'table');

        fetch(form.action, { method: 'POST', body: data })
            .then(res => {
                showSuccessPopup('contact.html', 'Thank you for your message! Our team will contact you within 24 hours.');
                form.reset();
            })
            .catch(() => {
                // Fallback: native submit (FormSubmit will redirect to _next)
                form.submit();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = origText;
                    submitBtn.disabled = false;
                }
            });
    });
}

/* ============================================================
   9. INVESTOR FORM – FormSubmit + Success Popup
   ============================================================ */
function initInvestorForm() {
    const form = document.getElementById('investorForm');
    if (!form) return;

    // Ensure FormSubmit attributes are set
    if (!form.action || !form.action.includes('formsubmit')) {
        form.action = 'https://formsubmit.co/baybayinedu@gmail.com';
        form.method = 'POST';
    }

    // Inject hidden inputs if missing
    const addHidden = (name, value) => {
        if (!form.querySelector(`[name="${name}"]`)) {
            const inp = document.createElement('input');
            inp.type = 'hidden'; inp.name = name; inp.value = value;
            form.appendChild(inp);
        }
    };

    addHidden('_captcha', 'false');
    addHidden('_template', 'table');
    addHidden('_subject', 'Investor Inquiry – Glades International');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm(form)) return;

        // Dynamic subject
        const inquiryType = form.querySelector('#inv-inquiry, [name="inquiry_type"]');
        const subjectField = form.querySelector('[name="_subject"]');
        if (inquiryType && subjectField && inquiryType.value) {
            const map = {
                investment: 'Investment Opportunity',
                financial: 'Financial Information',
                governance: 'Corporate Governance',
                reports: 'Annual Reports',
                other: 'General Inquiry'
            };
            subjectField.value = `${map[inquiryType.value] || inquiryType.value} – Investor Relations`;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }

        const data = new FormData(form);
        fetch('https://formsubmit.co/baybayinedu@gmail.com', { method: 'POST', body: data })
            .then(() => {
                showSuccessPopup('investors.html', 'Thank you for your investor inquiry! Our IR team will respond within 2 business days.');
                form.reset();
            })
            .catch(() => {
                form.submit();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = origText;
                    submitBtn.disabled = false;
                }
            });
    });
}

/* ============================================================
   10. FORM VALIDATION
   ============================================================ */
function validateForm(form) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    form.querySelectorAll('[required]').forEach(field => {
        const val = field.value.trim();
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
   11. SUCCESS POPUP
   ============================================================ */
function showSuccessPopup(redirectPage, message) {
    // Create overlay if not exists
    let overlay = document.getElementById('successOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'successOverlay';
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Successfully Sent!</h3>
                <p id="successMessage"></p>
                <p class="success-timer" id="successTimer"></p>
            </div>`;
        document.body.appendChild(overlay);
    }

    const msgEl = document.getElementById('successMessage');
    const timerEl = document.getElementById('successTimer');

    if (msgEl) msgEl.textContent = message;
    overlay.classList.add('show');

    let countdown = 4;
    if (timerEl) timerEl.textContent = `Redirecting in ${countdown}s…`;

    const interval = setInterval(() => {
        countdown--;
        if (timerEl) timerEl.textContent = `Redirecting in ${countdown}s…`;
        if (countdown <= 0) {
            clearInterval(interval);
            overlay.classList.remove('show');
            if (redirectPage) {
                setTimeout(() => window.location.href = redirectPage, 300);
            }
        }
    }, 1000);

    // Close on click outside modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            clearInterval(interval);
            overlay.classList.remove('show');
        }
    });
}

/* ============================================================
   12. SUCCESS HASH HANDLER (#success)
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
   13. FOOTER YEAR
   ============================================================ */
function initFooterYear() {
    const el = document.querySelector('.copyright p');
    if (el) el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
}

/* ============================================================
   14. COUNTER ANIMATION
   ============================================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-value, [data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = +entry.target.dataset.target || +entry.target.textContent.replace(/[^0-9]/g, '');
                const suffix = entry.target.dataset.suffix || (entry.target.textContent.includes('+') ? '+' : '');
                animateCounter(entry.target, target, suffix);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target, suffix = '') {
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ============================================================
   15. FACILITY TABS (Task 4)
   ============================================================ */
function initFacilityTabs() {
    const tabBtns = document.querySelectorAll('.facility-tab-btn');
    const panels  = document.querySelectorAll('.facility-panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.facility;

            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(`facility-${target}`);
            if (targetPanel) targetPanel.classList.add('active');

            // Scroll into view smoothly
            const section = document.querySelector('.facilities-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

/* ============================================================
   16. PRODUCT CUSTOMIZER (Index2 Integration)
   ============================================================ */
function initProductCustomizer() {
    const cards = document.querySelectorAll('.prod-card');
    if (!cards.length) return;

    // Inject ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
        }
        @keyframes cardShake {
            0%,100% { transform: translateY(-16px) scale(1.03) rotateZ(1deg); }
            25%      { transform: translateY(-20px) scale(1.04) rotateZ(2deg); }
            50%      { transform: translateY(-14px) scale(1.02) rotateZ(0deg); }
            75%      { transform: translateY(-18px) scale(1.035) rotateZ(1.5deg); }
        }
    `;
    document.head.appendChild(style);

    // Scroll observer for entrance animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    cards.forEach((card, i) => {
        // Entrance animation setup
        card.style.opacity = '0';
        card.style.transform = 'translateY(32px)';
        card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        observer.observe(card);

        const productImage = card.querySelector('.product-image');
        if (!productImage) return;

        // Hover: scale active image
        card.addEventListener('mouseenter', () => {
            const active = productImage.querySelector('img.active');
            if (active) {
                active.style.transform = 'scale(1.12) translateY(-12px)';
                active.style.filter = 'drop-shadow(0 25px 50px rgba(0,0,0,0.35))';
                active.style.transition = 'all 0.5s cubic-bezier(0.23,1,0.32,1)';
            }
        });

        // Mousemove: parallax
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2, cy = rect.height / 2;
            const rX = ((y - cy) / cy) * 8;
            const rY = ((x - cx) / cx) * -8;

            const active = productImage.querySelector('img.active');
            if (active) {
                active.style.transform = `perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.12) translateY(-8px) translateZ(30px)`;
                active.style.transition = 'transform 0.12s ease-out, filter 0.3s ease';
                active.style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))';
            }
        });

        // Mouseleave: reset
        card.addEventListener('mouseleave', () => {
            const active = productImage.querySelector('img.active');
            if (active) {
                active.style.transform = 'scale(1) translateY(0) perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                active.style.transition = 'all 0.5s cubic-bezier(0.23,1,0.32,1)';
                active.style.filter = 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))';
            }
        });
    });

    // Keyboard nav for color options
    document.querySelectorAll('.prod-card .options > div').forEach(opt => {
        opt.setAttribute('tabindex', '0');
        opt.setAttribute('role', 'button');

        opt.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                opt.click();
            }
        });
    });
}

/* ============================================================
   17. CHANGE PRODUCT COLOR (global – called from HTML onclick)
   ============================================================ */
window.changeProductColor = function (element, color) {
    const card = element.closest('.prod-card');
    if (!card) return;

    const productImage = card.querySelector('.product-image');
    const targetImage = productImage?.querySelector(`img[data-color="${color}"]`);
    const currentActive = productImage?.querySelector('img.active');
    const allOptions = card.querySelectorAll('.options > div');

    // Update color option active states
    allOptions.forEach(opt => opt.classList.remove('active'));
    setTimeout(() => element.classList.add('active'), 80);

    if (currentActive === targetImage) return;

    // Shake card feedback
    card.style.animation = 'cardShake 0.4s ease';
    setTimeout(() => { card.style.animation = ''; }, 400);

    // Fade out current
    if (currentActive) {
        currentActive.classList.add('fade-out');
        setTimeout(() => {
            currentActive.classList.remove('active', 'fade-out');
            currentActive.style.transform = '';
        }, 480);
    }

    // Fade in new
    if (targetImage) {
        setTimeout(() => {
            targetImage.classList.add('active');
            targetImage.style.animation = 'none';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                targetImage.style.animation = '';
            }));
        }, 230);
    }

    createRipple(element);
    createParticleBurst(element);
};

/* ============================================================
   18. RIPPLE EFFECT
   ============================================================ */
function createRipple(element) {
    const ripple = document.createElement('span');
    const d = Math.max(element.clientWidth, element.clientHeight);
    Object.assign(ripple.style, {
        width: d + 'px', height: d + 'px',
        left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        position: 'absolute', borderRadius: '50%',
        background: 'rgba(255,255,255,0.7)',
        animation: 'ripple 0.6s ease-out',
        pointerEvents: 'none', zIndex: '10'
    });
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
}

/* ============================================================
   19. PARTICLE BURST
   ============================================================ */
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['#0E3A5D', '#2F7FB3', '#E53935', '#ffffff', getComputedStyle(element).backgroundColor];

    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 8;
        const vel = 50 + Math.random() * 35;

        Object.assign(p.style, {
            position: 'fixed', left: cx + 'px', top: cy + 'px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: colors[i % colors.length],
            pointerEvents: 'none', zIndex: '1000',
            boxShadow: '0 0 6px currentColor'
        });

        document.body.appendChild(p);

        p.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle)*vel}px,${Math.sin(angle)*vel}px) scale(0)`, opacity: 0 }
        ], { duration: 600 + Math.random() * 200, easing: 'cubic-bezier(0.4,0,0.2,1)' })
            .onfinish = () => p.remove();
    }
}

/* ============================================================
   20. PRODUCT CATEGORY FILTERING
   ============================================================ */
(function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const cat = this.dataset.category;

            productCards.forEach((card, i) => {
                const show = cat === 'all' || card.dataset.category === cat;
                if (show) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();
