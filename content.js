// Spotlight content script
(function () {
  // create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'spotlight-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(overlay);

  let rightDown = false;
  let lastClientX = 0;
  let lastClientY = 0;

  // update spotlight position using CSS variables for high performance
  function updatePosition(x, y) {
    overlay.style.setProperty('--x', x + 'px');
    overlay.style.setProperty('--y', y + 'px');
  }

  function showSpotlight() {
    overlay.classList.add('active');
    document.body.classList.add('spotlight-hide-cursor');
  }
  function hideSpotlight() {
    overlay.classList.remove('active');
    document.body.classList.remove('spotlight-hide-cursor');
  }

  function onMouseDown(e) {
    if (e.button === 2) {
      rightDown = true;
      e.preventDefault();
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      updatePosition(lastClientX, lastClientY);
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
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    updatePosition(lastClientX, lastClientY);
  }

  function onContextMenu(e) {
    if (rightDown) {
      e.preventDefault();
    }
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

  window.addEventListener('unload', () => {
    document.removeEventListener('mousedown', onMouseDown, {capture: true});
    document.removeEventListener('mouseup', onMouseUp, {capture: true});
    document.removeEventListener('contextmenu', onContextMenu, {capture: true});
    document.removeEventListener('mousemove', onMouseMove, {capture: true});
    window.removeEventListener('blur', onBlur);
    overlay.remove();
  });

  document.addEventListener('mousemove', (e) => {
    updatePosition(e.clientX, e.clientY);
  }, {passive: true});
})();
