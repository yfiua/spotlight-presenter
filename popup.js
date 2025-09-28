document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("enableSpotlight");

  // Load current setting
  chrome.storage.local.get({ enabled: true }, (data) => {
    checkbox.checked = data.enabled;
  });

  // Save on change
  checkbox.addEventListener("change", () => {
    chrome.storage.local.set({ enabled: checkbox.checked });
  });
});
