/* ==========================================================================
   PIGGY LANDING — Campaña Fin de Año (/diciembre)
   Lógica interactiva: Cuenta regresiva, Calculadora, FAQ y WhatsApp VIP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalculator();
  initFaqAccordion();
  initWhatsAppTracking();
});

/**
 * 1. Cuenta Regresiva hacia el 1 de Octubre
 */
function initCountdown() {
  // Fecha objetivo: 1 de Octubre de 2026, 23:59:59 (hora Colombia UTC-5)
  const targetDate = new Date('2026-10-01T23:59:59-05:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');
  const stickyTimerEl = document.getElementById('sticky-timer-val');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (stickyTimerEl) stickyTimerEl.textContent = '¡Últimos cupos!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    if (stickyTimerEl) {
      stickyTimerEl.textContent = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 2. Calculadora / Simulador de Rendimiento de Fin de Año
 */
function initCalculator() {
  const slider = document.getElementById('calc-slider');
  const countDisplay = document.getElementById('calc-pigs-count');
  const weightDisplay = document.getElementById('calc-weight-val');
  const meatDisplay = document.getElementById('calc-meat-val');
  const benefitDisplay = document.getElementById('calc-benefit-val');

  if (!slider) return;

  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  function recalculate() {
    const pigs = parseInt(slider.value, 10) || 1;
    if (countDisplay) countDisplay.textContent = `${pigs} ${pigs === 1 ? 'Piggy' : 'Piggys'}`;

    // Métricas por cerdo en etapa avanzada (12 semanas):
    // Peso final en pie estimado: ~108 kg promedio
    const totalWeight = pigs * 108;
    // Kilos de carne en canal (~75% rendimiento): ~81 kg por cerdo
    const totalMeat = Math.round(pigs * 81);
    // Margen comercial estimado escalonado:
    // Valor por Piggy: $1.000.000 COP
    // 1 Piggy: 8% ($80.000 c/u = $80.000)
    // 2 Piggys: 9% ($90.000 c/u = $180.000)
    // 3+ Piggys: 10% ($100.000 c/u = $300.000 hasta $1.000.000)
    const PIG_PRICE = 1000000;
    let marginRate = 0.10;
    if (pigs === 1) {
      marginRate = 0.08;
    } else if (pigs === 2) {
      marginRate = 0.09;
    } else {
      marginRate = 0.10;
    }
    const totalBenefit = pigs * PIG_PRICE * marginRate;

    if (weightDisplay) weightDisplay.textContent = `~${totalWeight} kg`;
    if (meatDisplay) meatDisplay.textContent = `~${totalMeat} kg`;
    if (benefitDisplay) benefitDisplay.textContent = currencyFormatter.format(totalBenefit);
  }

  slider.addEventListener('input', recalculate);
  recalculate();
}

/**
 * 3. Acordeón Accesible de Preguntas Frecuentes (FAQ)
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const panel = item.querySelector('.faq-answer-panel');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar otros si estuvieran abiertos
      document.querySelectorAll('.faq-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Alternar el actual
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        panel.style.maxHeight = `${panel.scrollHeight + 30}px`;
      }
    });
  });
}

/**
 * 4. Tracking y Enlaces de WhatsApp VIP
 */
function initWhatsAppTracking() {
  const whatsappButtons = document.querySelectorAll('.btn-whatsapp-vip');

  whatsappButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // Disparar evento a Pixel si está presente
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'Lista VIP Cerdito Fin de Año',
          content_category: 'Campaign Diciembre'
        });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'WhatsApp VIP Diciembre'
        });
      }
    });
  });
}
