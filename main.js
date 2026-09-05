/* ==========================================================================
   PIGGY LANDING — Client Side Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveSectionHighlighting();
  initFAQAccordion();
  initScrollAnimations();
  initVideoModal();
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
 * Highlight active menu items based on scroll position using IntersectionObserver
 */
function initActiveSectionHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  const options = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
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
 * YouTube Video Modal Popup
 */
function initVideoModal() {
  const openBtns = [document.getElementById('open-video-btn'), document.getElementById('cta-hero-watch')].filter(Boolean);
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('close-video-btn');
  const iframe = document.getElementById('video-iframe');
  
  // Use embed URL with autoplay parameter
  const youtubeEmbedUrl = "https://www.youtube.com/embed/1AAZCAOxV0c?autoplay=1&rel=0";

  if (openBtns.length === 0 || !modal || !closeBtn || !iframe) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      iframe.src = youtubeEmbedUrl;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    iframe.src = "";
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking on the blurred background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
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
 * Handle scroll hint fading on inner phone screen interaction
 */
function initPhoneScrollInteractions() {
  const viewport = document.getElementById('phone-screen-viewport');
  const hint = document.getElementById('phone-scroll-hint');

  if (!viewport || !hint) return;

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
