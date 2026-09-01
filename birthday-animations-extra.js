/* ============================================
   birthday-animations-extra.js
   Extra animations: confetti burst on load, continuous floating
   background petals, "years together" counting animation,
   heart pop when a wish is submitted.
   Link this AFTER birthday-extra.js, at the very end of <body>:
   <script src="birthday-animations-extra.js"></script>
   ============================================ */

(function () {

  /* ---------- 1. Confetti burst on page load ---------- */
  function burstConfetti() {
    const colors = ['#d4a574', '#e0607a', '#f1c40f', '#b8860b', '#fff3d6'];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.width = size + 'px';
      piece.style.height = (size * 0.4) + 'px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }
  }

  /* ---------- 2. Continuous floating background petals/hearts ---------- */
  function startBackgroundFloat() {
    const layer = document.createElement('div');
    layer.className = 'bg-float-layer';
    document.body.appendChild(layer);

    const symbols = ['❀', '♥', '✿', '❁'];

    function spawnItem() {
      const item = document.createElement('div');
      item.className = 'bg-float-item';
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = Math.random() * 100 + 'vw';
      item.style.fontSize = (14 + Math.random() * 12) + 'px';
      const duration = 10 + Math.random() * 8;
      item.style.animationDuration = duration + 's';
      layer.appendChild(item);
      setTimeout(() => item.remove(), duration * 1000);
    }

    for (let i = 0; i < 5; i++) {
      setTimeout(spawnItem, i * 1200);
    }
    setInterval(spawnItem, 1800);
  }

  /* ---------- 3. "Years together" animated counter ---------- */
  function insertYearsCounter() {
    const sub = document.querySelector('.bday-sub');
    if (!sub) return;

    const counterEl = document.createElement('div');
    counterEl.className = 'years-counter';
    counterEl.innerHTML = 'Celebrating <span class="years-number">0</span> wonderful years';
    sub.insertAdjacentElement('afterend', counterEl);

    const numberEl = counterEl.querySelector('.years-number');
    const target = 67;
    const duration = 1400; // ms
    const startTime = performance.now();

    function animateCount(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      numberEl.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }
    requestAnimationFrame(animateCount);
  }

  /* ---------- 4. Heart pop when a wish is submitted ---------- */
  function hookWishHeart() {
    const originalAddWish = window.addWish;
    if (typeof originalAddWish !== 'function') return;

    window.addWish = function () {
      const list = document.getElementById('wishesList');
      const countBefore = list ? list.children.length : 0;

      originalAddWish();

      if (list && list.children.length > countBefore) {
        const lastItem = list.lastElementChild;
        const heart = document.createElement('span');
        heart.className = 'heart-pop';
        heart.textContent = '♥';
        lastItem.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
      }
    };
  }

  function init() {
    burstConfetti();
    startBackgroundFloat();
    insertYearsCounter();
    hookWishHeart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
