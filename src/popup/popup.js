const defaults = {
  enabled: true,
  nativePinch: true,
  archiveButton: true,
  emailSizeControls: true
};
const enabled = document.querySelector('#enabled');
const features = document.querySelector('#features');
const nativePinch = document.querySelector('#native-pinch');
const archiveButton = document.querySelector('#archive-button');
const emailSizeControls = document.querySelector('#email-size-controls');

function setFeatureAvailability(isEnabled) {
  features.disabled = !isEnabled;
}

chrome.storage.sync.get(defaults, (settings) => {
  enabled.checked = settings.enabled;
  nativePinch.checked = settings.nativePinch;
  archiveButton.checked = settings.archiveButton;
  emailSizeControls.checked = settings.emailSizeControls;
  setFeatureAvailability(settings.enabled);
});

enabled.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabled.checked });
  setFeatureAvailability(enabled.checked);
});

nativePinch.addEventListener('change', () => {
  chrome.storage.sync.set({ nativePinch: nativePinch.checked });
});

archiveButton.addEventListener('change', () => {
  chrome.storage.sync.set({ archiveButton: archiveButton.checked });
});

emailSizeControls.addEventListener('change', () => {
  chrome.storage.sync.set({ emailSizeControls: emailSizeControls.checked });
});
