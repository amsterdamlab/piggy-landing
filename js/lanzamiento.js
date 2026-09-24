/**
 * Piggy App — Lógica de Cuenta Regresiva de Prelanzamiento
 * Objetivo: 8 de Octubre, 2026 a las 10:00:00 AM (Hora Colombia, UTC-5)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Fecha objetivo oficial: 8 de Octubre, 2026 10:00:00 COT (UTC-5)
  const targetDate = new Date('2026-10-08T10:00:00-05:00').getTime();

  const daysEl = document.getElementById('lz-days');
  const hoursEl = document.getElementById('lz-hours');
  const minutesEl = document.getElementById('lz-minutes');
  const secondsEl = document.getElementById('lz-seconds');

  const countdownWrap = document.getElementById('lz-countdown-wrap');
  const postLaunchWrap = document.getElementById('lz-post-launch');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  function formatValue(val) {
    return String(Math.max(0, val)).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
      // Si la cuenta regresiva expiró, activar la vista de lanzamiento en vivo
      if (countdownWrap) countdownWrap.style.display = 'none';
      if (postLaunchWrap) postLaunchWrap.style.display = 'block';
      if (timerInterval) clearInterval(timerInterval);
      return;
    }

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formattedDays = formatValue(days);
    const formattedHours = formatValue(hours);
    const formattedMinutes = formatValue(minutes);
    const formattedSeconds = formatValue(seconds);

    if (daysEl.textContent !== formattedDays) daysEl.textContent = formattedDays;
    if (hoursEl.textContent !== formattedHours) hoursEl.textContent = formattedHours;
    if (minutesEl.textContent !== formattedMinutes) minutesEl.textContent = formattedMinutes;
    if (secondsEl.textContent !== formattedSeconds) secondsEl.textContent = formattedSeconds;
  }

  // Ejecución inmediata y actualización cada segundo
  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);
});
