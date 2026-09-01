/* ============================================
   birthday-wishes-sync.js
   Connects the wish box to a Google Sheet (via Apps Script Web App)
   so wishes + names are saved permanently and shown to every visitor.

   Link this LAST, at the very end of <body>, after all other scripts:
   <script src="birthday-wishes-sync.js"></script>
   ============================================ */

(function () {

  // Your deployed Apps Script Web App URL
  const WISHES_API_URL = "https://script.google.com/macros/s/AKfycbx5fSd_XBC8RCMPbkeK54anbvPRMFm939T8EBhpmiftAAgGHa0r39bcTxxMiLrP2Yhb/exec";

  const list = document.getElementById('wishesList');

  /* ---------- Render a single {name, wish} item (used for loaded history) ---------- */
  function renderWish(entry) {
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'wish-item';
    const name = (entry && entry.name) ? entry.name : 'Anonymous';
    const wish = (entry && entry.wish) ? entry.wish : '';
    item.innerHTML = '<strong>' + escapeHtml(name) + ':</strong> ' + escapeHtml(wish);
    list.appendChild(item);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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

  /* ---------- Send a new wish + name to the Sheet ---------- */
  function saveWishToSheet(name, wish) {
    fetch(WISHES_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ name: name, wish: wish })
    }).catch(function (err) {
      console.log('Could not save wish:', err);
    });
  }

  /* ---------- Fully handle the Send button: name + wish together ---------- */
  function setupSendHandler() {
    const sendBtn = document.querySelector('.wish-input button');
    const wishInput = document.getElementById('wishInput');
    const nameInput = document.getElementById('nameInput');
    if (!sendBtn || !wishInput) return;

    // Replace the old inline onclick="addWish()" with our own handler
    sendBtn.removeAttribute('onclick');

    function handleSend() {
      const wishText = wishInput.value.trim();
      const nameText = nameInput ? nameInput.value.trim() : '';

      if (!nameText) {
        if (nameInput) {
          nameInput.style.borderColor = '#e0607a';
          nameInput.placeholder = 'Please enter your name first';
          nameInput.focus();
        }
        return;
      }
      if (!wishText) {
        wishInput.style.borderColor = '#e0607a';
        wishInput.focus();
        return;
      }

      const displayName = nameText;

      // Show it immediately on the page
      renderWish({ name: displayName, wish: wishText });

      // Trigger heart-pop animation if that file is loaded
      if (list && list.lastElementChild) {
        const heart = document.createElement('span');
        heart.className = 'heart-pop';
        heart.textContent = '♥';
        list.lastElementChild.appendChild(heart);
        setTimeout(function () { heart.remove(); }, 1500);
      }

      // Save permanently to the Sheet
      saveWishToSheet(displayName, wishText);

      // Clear inputs
      wishInput.value = '';
      if (nameInput) nameInput.value = '';
    }

    sendBtn.addEventListener('click', handleSend);
    wishInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') handleSend();
    });
    if (nameInput) {
      nameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSend();
      });
      nameInput.addEventListener('input', function () {
        nameInput.style.borderColor = '';
      });
    }
    wishInput.addEventListener('input', function () {
      wishInput.style.borderColor = '';
    });
  }

  function init() {
    loadWishes();
    setupSendHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
