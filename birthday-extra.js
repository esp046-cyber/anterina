/* ============================================
   birthday-extra.js
   Elegant enhancements: gold sparkles + photo lightbox
   Link this AFTER your existing <script> block, e.g.:
   <script src="birthday-extra.js"></script>
   ============================================ */

(function () {

  /* ---------- Gold sparkles when the song plays ---------- */
  // Hooks into the existing toggleSong() function by wrapping it,
  // so you don't need to edit your original script.
  const originalToggleSong = window.toggleSong;

  function spawnSparkles() {
    const wrap = document.getElementById('bdayWrap');
    if (!wrap) return;
    const symbols = ['✦', '✧', '⋆', '✨'];
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = (5 + Math.random() * 90) + '%';
        s.style.bottom = (20 + Math.random() * 60) + 'px';
        s.style.animation = `sparkleFloat ${2 + Math.random() * 1.5}s ease-out forwards`;
        wrap.appendChild(s);
        setTimeout(() => s.remove(), 4000);
      }, i * 150);
    }
  }

  if (typeof originalToggleSong === 'function') {
    window.toggleSong = function () {
      originalToggleSong();
      spawnSparkles();
    };
  }

  /* ---------- Photo lightbox: click a photo to enlarge, with prev/next nav ---------- */
  function initLightbox() {
    // Build the overlay once
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<span class="lightbox-nav lightbox-prev">&#8249;</span>' +
      '<img src="" alt="Enlarged photo">' +
      '<span class="lightbox-nav lightbox-next">&#8250;</span>' +
      '<span class="lightbox-close">&times;</span>';
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    // Collect all loaded, valid photos in order
    let photoEls = [];
    let currentIndex = 0;

    function refreshPhotoList() {
      photoEls = Array.prototype.slice.call(document.querySelectorAll('.photo-slot img'))
        .filter(function (img) { return img.naturalWidth > 0; });
    }

    function showIndex(index) {
      if (photoEls.length === 0) return;
      currentIndex = (index + photoEls.length) % photoEls.length; // wrap around
      overlayImg.src = photoEls[currentIndex].src;
    }

    function openLightbox(img) {
      refreshPhotoList();
      const idx = photoEls.indexOf(img);
      showIndex(idx === -1 ? 0 : idx);
      overlay.classList.add('active');
    }

    function closeLightbox() {
      overlay.classList.remove('active');
    }

    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      showIndex(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      showIndex(currentIndex + 1);
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
    });

    // Attach click handlers to every photo slot's image
    document.querySelectorAll('.photo-slot img').forEach(function (img) {
      img.addEventListener('click', function () {
        // Only open if the image actually loaded (not a broken placeholder)
        if (img.naturalWidth === 0) return;
        openLightbox(img);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

})();
