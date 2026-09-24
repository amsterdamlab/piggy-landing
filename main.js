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

  // Close when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });

  // Close when clicking outside of menu
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  });
}

/**
 * Scroll Spy / Active Section Nav Highlighting
 * Highlights the nav link corresponding to the section in view
 */
function initActiveSectionHighlighting() {
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sections = ['nosotros', 'como-funciona', 'beneficios', 'faq', 'contacto']
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el !== null);

  let isManualScroll = false;
  let manualScrollTimeout = null;

  const setActiveLink = (currentId) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentId && href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const handleScroll = () => {
    if (isManualScroll) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    // Above first section
    if (scrollY < 200) {
      setActiveLink(null);
      return;
    }

    // Near the absolute bottom of the document
    const isAtBottom = (windowHeight + scrollY) >= (fullHeight - 60);
    const contactoSection = sections.find(s => s.id === 'contacto');

    if (isAtBottom && contactoSection && contactoSection.el.getBoundingClientRect().top < windowHeight - 60) {
      setActiveLink('contacto');
      return;
    }

    // Find currently active section based on top offset threshold
    const scrollPosition = 140; // pixel offset from viewport top
    for (const section of sections) {
      if (section.id === 'contacto') continue;
      const rect = section.el.getBoundingClientRect();
      if (rect.top <= scrollPosition && rect.bottom > scrollPosition) {
        setActiveLink(section.id);
        return;
      }
    }

    // Secondary check for contacto if scrolled into footer view
    if (contactoSection) {
      const rect = contactoSection.el.getBoundingClientRect();
      if (rect.top <= scrollPosition && rect.bottom > 0) {
        setActiveLink('contacto');
        return;
      }
    }
  };

  // Nav link clicks: smooth scroll & immediate active highlight
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        setActiveLink(targetId);
        isManualScroll = true;
        clearTimeout(manualScrollTimeout);
        manualScrollTimeout = setTimeout(() => {
          isManualScroll = false;
          handleScroll();
        }, 800);
      }
    });
  });

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleScroll();
}

/**
 * FAQ Accordion Interaction
 * Auto collapses others when opening a new item
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other accordions first
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

      // Toggle clicked item
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        panel.style.maxHeight = null;
        item.classList.remove('active');
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.classList.add('active');
      }
    });
  });
}

/**
 * Smooth entrance animations via IntersectionObserver
 */
function initScrollAnimations() {
  const selectors = [
    '.step-flow-card',
    '.endorsement-box',
    '.video-card-wrapper',
    '.welcome-bonus-banner',
    '.faq-item',
    '.pig-feeding-img',
    '.ally-logo-card'
  ];

  const animElements = document.querySelectorAll(selectors.join(', '));

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

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const type = element.dataset.type;
  const duration = 1800; // ms
  const startTime = performance.now();

  if (type === 'range') {
    const to1 = parseFloat(element.dataset.to1) || 8;
    const to2 = parseFloat(element.dataset.to2) || 13;
    const suffix = element.dataset.suffix || '%';

    const updateRange = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current1 = Math.floor(easeProgress * to1);
      const current2 = Math.floor(easeProgress * to2);

      element.textContent = `${current1}${suffix} - ${current2}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateRange);
      } else {
        element.textContent = `${to1}${suffix} - ${to2}${suffix}`;
      }
    };
    requestAnimationFrame(updateRange);
  } else if (type === 'decimal') {
    const target = parseFloat(element.dataset.target) || 4.3;
    const suffix = element.dataset.suffix || ' meses';

    const updateDecimal = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current = (easeProgress * target).toFixed(1);
      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateDecimal);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(updateDecimal);
  }
}

/**
 * Mobile Phone Mockup Interactive Scrolling
 * Adds discreet hint disappearance and smooth touch interaction
 */
function initPhoneScrollInteractions() {
  const viewport = document.getElementById('phone-screen-viewport');
  const scrollHint = document.getElementById('phone-scroll-hint');

  if (!viewport) return;

  // Hide the scroll hint once the user interacts with the mockup viewport
  if (scrollHint) {
    const hideHint = () => {
      scrollHint.classList.add('hidden');
      viewport.removeEventListener('scroll', hideHint);
      viewport.removeEventListener('touchstart', hideHint);
      viewport.removeEventListener('mousedown', hideHint);
    };

    viewport.addEventListener('scroll', hideHint, { passive: true });
    viewport.addEventListener('touchstart', hideHint, { passive: true });
    viewport.addEventListener('mousedown', hideHint, { passive: true });
  }

  // Prevent parent page scroll lock when reaching ends of viewport scroll
  let startY = 0;
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const isAtBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2;
    const isAtTop = viewport.scrollTop <= 2;

    // If scrolling past boundaries, allow window to take over scroll
    if ((isAtBottom && deltaY > 0) || (isAtTop && deltaY < 0)) {
      window.scrollBy(0, deltaY);
      startY = currentY;
    }
  }, { passive: true });
}
