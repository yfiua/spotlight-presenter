// Spotlight content script
(function () {
  let spotlightEnabled = true;

  // sync with storage
  chrome.storage.local.get({ enabled: true }, (data) => {
    spotlightEnabled = data.enabled;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.enabled) {
      spotlightEnabled = changes.enabled.newValue;
    }
  });

  const overlay = document.createElement('div');
  overlay.className = 'spotlight-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(overlay);

  let rightDown = false;

  function updatePosition(x, y) {
    overlay.style.setProperty('--x', x + 'px');
    overlay.style.setProperty('--y', y + 'px');
  }

  function showSpotlight() {
    if (spotlightEnabled) {
      document.body.classList.add('spotlight-hide-cursor');
      overlay.classList.add('active');
    }
  }
  function hideSpotlight() {
    overlay.classList.remove('active');
    document.body.classList.remove('spotlight-hide-cursor');
  }

  function onMouseDown(e) {
    if (!spotlightEnabled) return;
    if (e.button === 2) {
      rightDown = true;
      e.preventDefault();
      updatePosition(e.clientX, e.clientY);
      showSpotlight();
      document.addEventListener('mousemove', onMouseMove, {capture: true});
    }
  }

  function onMouseUp(e) {
    if (rightDown && e.button === 2) {
      rightDown = false;
      hideSpotlight();
      document.removeEventListener('mousemove', onMouseMove, {capture: true});
    }
  }

  function onMouseMove(e) {
    updatePosition(e.clientX, e.clientY);
  }

  function onContextMenu(e) {
    if (rightDown) e.preventDefault();
  }

  function onBlur() {
    if (rightDown) {
      rightDown = false;
      hideSpotlight();
      document.removeEventListener('mousemove', onMouseMove, {capture: true});
    }
  }

  document.addEventListener('mousedown', onMouseDown, {capture: true});
  document.addEventListener('mouseup', onMouseUp, {capture: true});
  document.addEventListener('contextmenu', onContextMenu, {capture: true});
  window.addEventListener('blur', onBlur);

  document.addEventListener('mousemove', (e) => {
    updatePosition(e.clientX, e.clientY);
  }, {passive: true});
})();
