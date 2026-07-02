/* ==========================================================================
   MyPortfolio — script.js
   Vanilla JS only. No frameworks, no external animation libraries.
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initFooterYear();
  initCursorGlow();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initReducedMotionScroll();
  // initTypingAnimation();
  initParticleNetwork();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initRippleEffect();
  initMagneticButtons();
  initSpotlight();
  initContactForm();
  initBackToTop();
  initDownloadCv();
});

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouchDevice = () =>
  window.matchMedia('(pointer: coarse)').matches;

/* ---------------------------------------------------------------------- */
/* Preloader                                                               */
/* ---------------------------------------------------------------------- */
function splitHeroName() {
  const el = document.querySelector('.hero-name');
  if (!el) return;

  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'split-char';
    span.style.setProperty('--i', i);
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
  });
}

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;

    document.body.classList.remove('is-loading');
    revealHero();

    preloader.classList.add('preloader-hidden');
    setTimeout(() => preloader.remove(), 700);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 500);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 500), { once: true });
    setTimeout(hide, 3500);
  }
}

function revealHero() {
  document.body.classList.add('hero-ready');
  // Give the "Alex Rivera" letters and role line time to land before the
  // typing loop takes over the role text.
  setTimeout(initTypingAnimation, 950);
}

/* ---------------------------------------------------------------------- */
/* Footer year                                                             */
/* ---------------------------------------------------------------------- */

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- */
/* Custom cursor glow                                                      */
/* ---------------------------------------------------------------------- */

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  if (!glow || !dot || isTouchDevice()) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  const hoverables = document.querySelectorAll('a, button, .project-card, .skill-item, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('cursor-dot-hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('cursor-dot-hover'));
  });
}

/* ---------------------------------------------------------------------- */
/* Scroll progress bar                                                     */
/* ---------------------------------------------------------------------- */

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------------------------------------------------------------------- */
/* Navbar: scrolled state + scroll-spy active link                         */
/* ---------------------------------------------------------------------- */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const setScrolled = () => navbar.classList.toggle('navbar-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------------------- */
/* Mobile hamburger menu                                                   */
/* ---------------------------------------------------------------------- */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  const close = () => {
    navMenu.classList.remove('nav-menu-open');
    hamburger.classList.remove('hamburger-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('nav-menu-open');
    hamburger.classList.toggle('hamburger-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ---------------------------------------------------------------------- */
/* Respect prefers-reduced-motion for smooth scrolling                     */
/* ---------------------------------------------------------------------- */

function initReducedMotionScroll() {
  if (prefersReducedMotion()) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
}

/* ---------------------------------------------------------------------- */
/* Hero typing animation                                                   */
/* ---------------------------------------------------------------------- */

function initTypingAnimation() {
  // console.log("Typing started");
  const el = document.getElementById('typedText');
  if (!el) return;

  const words = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Game Developer', 'Editor Video'];

  if (prefersReducedMotion()) {
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = words[wordIndex];
    charIndex += isDeleting ? -1 : 1;
    el.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === current.length) {
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------------------------------------------------------------------- */
/* Hero particle constellation network                                     */
/* ---------------------------------------------------------------------- */

function initParticleNetwork() {
  const canvas = document.getElementById('particleCanvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const reduced = prefersReducedMotion();

  let width, height, particles;
  const mouse = { x: null, y: null };

  function buildParticles() {
    const count = Math.min(75, Math.max(24, Math.floor((width * height) / 16000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.7,
    }));
  }

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    buildParticles();
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 197, 253, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.16 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduced) requestAnimationFrame(frame);
  }

  if (!isTouchDevice()) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  frame();
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal (Intersection Observer driven fade/slide-in)              */
/* ---------------------------------------------------------------------- */

function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach((item) => item.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------------- */
/* Animated statistic counters                                             */
/* ---------------------------------------------------------------------- */

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;

    if (prefersReducedMotion()) {
      el.textContent = target;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ---------------------------------------------------------------------- */
/* Skill progress bars                                                     */
/* ---------------------------------------------------------------------- */

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = `${fill.dataset.width}%`;
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.35 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------------------------------------------------------------------- */
/* Button ripple effect                                                    */
/* ---------------------------------------------------------------------- */

function initRippleEffect() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion()) return;
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Magnetic button hover effect                                            */
/* ---------------------------------------------------------------------- */

function initMagneticButtons() {
  if (isTouchDevice() || prefersReducedMotion()) return;

  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Mouse-follow spotlight on cards                                         */
/* ---------------------------------------------------------------------- */

function initSpotlight() {
  if (isTouchDevice()) return;

  document.querySelectorAll('.spotlight-target').forEach((target) => {
    target.addEventListener('mousemove', (e) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      target.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Contact form validation + simulated submit                              */
/* ---------------------------------------------------------------------- */

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const subject = form.querySelector('#subject');
  const message = form.querySelector('#message');

  const showError = (input, msg) => {
    input.classList.add('input-error');
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
  };

  const clearErrors = () => {
    form.querySelectorAll('.input-error').forEach((el) => el.classList.remove('input-error'));
    form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    status.textContent = '';
    status.classList.remove('form-status-success');

    let valid = true;
    if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!subject.value.trim()) { showError(subject, 'Please add a subject.'); valid = false; }
    if (!message.value.trim()) { showError(message, 'Please write a short message.'); valid = false; }

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const submittedName = name.value.trim();

    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    // Simulated network request — this is a static template with no backend.
    // Wire this up to your own API, form service, or mailto handler.
    setTimeout(() => {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      form.reset();
      status.textContent = `Thanks, ${submittedName}! Your message has been sent — I'll get back to you soon.`;
      status.classList.add('form-status-success');
      setTimeout(() => {
        status.textContent = '';
        status.classList.remove('form-status-success');
      }, 6000);
    }, 1100);
  });
}

/* ---------------------------------------------------------------------- */
/* Back to top button                                                      */
/* ---------------------------------------------------------------------- */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => btn.classList.toggle('back-to-top-visible', window.scrollY > 500);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

/* ---------------------------------------------------------------------- */
/* Download CV — friendly notice since no resume file ships by default     */
/* ---------------------------------------------------------------------- */

function initDownloadCv() {
  const buttons = document.querySelectorAll('.js-download-cv');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // If you've added a real file at assets/resume.pdf, let the native
      // download happen. Otherwise, show a helpful reminder instead of a 404.
      const probablyMissing = btn.getAttribute('href') === 'assets/resume.pdf';
      if (probablyMissing) {
        e.preventDefault();
        showToast('Add your resume file at assets/resume.pdf to enable this download.');
      }
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast-visible');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('toast-visible'), 3800);
}