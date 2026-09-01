/* ============================================
   birthday-wishes-sync.js
   Connects the wish box to a Google Sheet (via Apps Script Web App)
   so wishes are saved permanently and shown to every visitor.

   Link this LAST, at the very end of <body>, after all other scripts:
   <script src="birthday-wishes-sync.js"></script>
   ============================================ */

(function () {

  // Your deployed Apps Script Web App URL
  const WISHES_API_URL = "https://script.google.com/macros/s/AKfycbx5fSd_XBC8RCMPbkeK54anbvPRMFm939T8EBhpmiftAAgGHa0r39bcTxxMiLrP2Yhb/exec";

  const list = document.getElementById('wishesList');

  /* ---------- Render a single wish item (no animation, used for loaded history) ---------- */
  function renderWish(text) {
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'wish-item';
    item.textContent = text;
    list.appendChild(item);
  }

  /* ---------- Load all existing wishes from the Sheet on page open ---------- */
  function loadWishes() {
    fetch(WISHES_API_URL)
      .then(function (res) { return res.json(); })
      .then(function (wishes) {
        if (Array.isArray(wishes)) {
          wishes.forEach(renderWish);
        }
      })
      .catch(function (err) {
        console.log('Could not load wishes:', err);
      });
  }

  /* ---------- Send a new wish to the Sheet ---------- */
  function saveWishToSheet(text) {
    fetch(WISHES_API_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't return CORS headers for POST; we don't need to read the response
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // avoids a CORS preflight request
      },
      body: JSON.stringify({ wish: text })
    }).catch(function (err) {
      console.log('Could not save wish:', err);
    });
  }

  /* ---------- Hook into the existing addWish() so new wishes also get saved ---------- */
  function hookAddWish() {
    const originalAddWish = window.addWish;
    if (typeof originalAddWish !== 'function') return;

    window.addWish = function () {
      const input = document.getElementById('wishInput');
      const text = input ? input.value.trim() : '';

      originalAddWish(); // still does the normal on-page display (+ heart pop, if that file is loaded)

      if (text) {
        saveWishToSheet(text);
      }
    };
  }

  function init() {
    loadWishes();
    hookAddWish();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
