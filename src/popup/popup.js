const defaults = {
  enabled: true,
  nativePinch: true,
  blockHorizontalScroll: true,
  archiveLabel: true
};
const enabled = document.querySelector('#enabled');
const features = document.querySelector('#features');
const nativePinch = document.querySelector('#native-pinch');
const blockHorizontalScroll = document.querySelector('#block-horizontal-scroll');
const archiveLabel = document.querySelector('#archive-label');

function setFeatureAvailability(isEnabled) {
  features.disabled = !isEnabled;
}

chrome.storage.sync.get(defaults, (settings) => {
  enabled.checked = settings.enabled;
  nativePinch.checked = settings.nativePinch;
  blockHorizontalScroll.checked = settings.blockHorizontalScroll;
  archiveLabel.checked = settings.archiveLabel;
  setFeatureAvailability(settings.enabled);
});

enabled.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabled.checked });
  setFeatureAvailability(enabled.checked);
});

nativePinch.addEventListener('change', () => {
  chrome.storage.sync.set({ nativePinch: nativePinch.checked });
});

blockHorizontalScroll.addEventListener('change', () => {
  chrome.storage.sync.set({ blockHorizontalScroll: blockHorizontalScroll.checked });
});

archiveLabel.addEventListener('change', () => {
  chrome.storage.sync.set({ archiveLabel: archiveLabel.checked });
});
