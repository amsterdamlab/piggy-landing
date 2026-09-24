/* ==========================================================================
   PIGGY LANDING — Client Side Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveSectionHighlighting();
  initFAQAccordion();
  initScrollAnimations();
  initNumberCounters();
  initPhoneScrollInteractions();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item-link');

  if (!menuToggle || !navMenu) return;

  // Toggle active state
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  });
}

/**
 * Highlight active menu items based on scroll position & navigation clicks
 */
function initActiveSectionHighlighting() {
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sectionIds = ['nosotros', 'como-funciona', 'beneficios', 'faq', 'contacto'];
  const sections = sectionIds
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el !== null);

  let isClickScrolling = false;
  let clickTimeout = null;

  const setActive = (id) => {
    navLinks.forEach(link => {
      if (id && link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const updateActiveSection = () => {
    if (isClickScrolling) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Top of page (Hero section) -> clear all active indicators
    if (scrollY < 200) {
      setActive(null);
      return;
    }

    // Scrolled to bottom -> highlight Contacto
    const isAtBottom = (windowHeight + scrollY) >= (docHeight - 60);
    const contacto = sections.find(s => s.id === 'contacto');
    if (isAtBottom && contacto) {
      const contactoRect = contacto.el.getBoundingClientRect();
      if (contactoRect.top < windowHeight - 60) {
        setActive('contacto');
        return;
      }
    }

    // Focal point for determining active section (offset from sticky navbar)
    const focalPoint = 140;

    for (const section of sections) {
      if (section.id === 'contacto') continue;
      const rect = section.el.getBoundingClientRect();
      if (rect.top <= focalPoint && rect.bottom > focalPoint) {
        setActive(section.id);
        return;
      }
    }

    // If bottom section (contacto) is mostly in view
    if (contacto) {
      const contactoRect = contacto.el.getBoundingClientRect();
      if (contactoRect.top <= focalPoint && contactoRect.bottom > 0) {
        setActive('contacto');
        return;
      }
    }
  };

  // Nav link click handling
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        setActive(targetId);
        isClickScrolling = true;
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
          updateActiveSection();
        }, 800);
      }
    });
  });

  // Optimized scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial check on page load
  updateActiveSection();
}

/**
 * FAQ Accordion Interaction
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels for accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger && otherPanel) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherPanel.style.maxHeight = null;
            otherItem.classList.remove('active');
          }
        }
      });

      // Toggle current panel
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.classList.add('active');
      } else {
        panel.style.maxHeight = null;
        item.classList.remove('active');
      }
    });
  });
}

/**
 * Scroll animations for premium feel (reveals cards on scroll)
 */
function initScrollAnimations() {
  const animSelectors = [
    '.step-flow-card',
    '.endorsement-box',
    '.video-card-wrapper',
    '.welcome-bonus-banner',
    '.faq-item',
    '.pig-feeding-img',
    '.ally-logo-card'
  ];
  
  const animElements = document.querySelectorAll(animSelectors.join(', '));

  // Add initial state styles dynamically
  animElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.215, 0.610, 0.355, 1), transform 0.7s cubic-bezier(0.215, 0.610, 0.355, 1)';
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => {
    animationObserver.observe(el);
  });
}


/**
 * Animated Number Counter for stats
 */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('.counter-num');
  if (counterElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const type = el.dataset.type;
  const duration = 1800; // ms
  const startTime = performance.now();

  if (type === 'range') {
    const target1 = parseFloat(el.dataset.to1) || 8;
    const target2 = parseFloat(el.dataset.to2) || 13;
    const suffix = el.dataset.suffix || '%';

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current1 = Math.floor(easeProgress * target1);
      const current2 = Math.floor(easeProgress * target2);

      el.textContent = `${current1}${suffix} - ${current2}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target1}${suffix} - ${target2}${suffix}`;
      }
    };
    requestAnimationFrame(update);

  } else if (type === 'decimal') {
    const target = parseFloat(el.dataset.target) || 4.3;
    const suffix = el.dataset.suffix || ' meses';

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current = (easeProgress * target).toFixed(1);

      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(update);
  }
}

/**
 * Handle scroll hint fading and seamless mobile touch scroll chaining
 */
function initPhoneScrollInteractions() {
  const viewport = document.getElementById('phone-screen-viewport');
  const hint = document.getElementById('phone-scroll-hint');

  if (!viewport) return;

  if (hint) {
    const hideHint = () => {
      hint.classList.add('hidden');
      viewport.removeEventListener('scroll', hideHint);
      viewport.removeEventListener('touchstart', hideHint);
      viewport.removeEventListener('mousedown', hideHint);
    };

    viewport.addEventListener('scroll', hideHint, { passive: true });
    viewport.addEventListener('touchstart', hideHint, { passive: true });
    viewport.addEventListener('mousedown', hideHint, { passive: true });
  }

  // Seamless Mobile Touch Scroll Chaining when reaching top/bottom boundary
  let touchStartY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY - touchCurrentY; // positive = dragging content upwards (scrolling down)

    const isAtBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2;
    const isAtTop = viewport.scrollTop <= 2;

    if ((isAtBottom && deltaY > 0) || (isAtTop && deltaY < 0)) {
      window.scrollBy(0, deltaY);
      touchStartY = touchCurrentY;
    }
  }, { passive: true });
}
