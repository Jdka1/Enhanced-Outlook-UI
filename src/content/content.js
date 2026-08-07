// On macOS Chrome reports a trackpad pinch as a ctrl+wheel event. Outlook
// handles that event itself and changes only its message content. Stop the
// event before Outlook receives it, but do not call preventDefault(): Chrome
// can then perform its normal, smooth browser-page pinch zoom.
const DEFAULTS = {
  enabled: true,
  nativePinch: true,
  archiveButton: true
};
let settings = { ...DEFAULTS };

chrome.storage.sync.get(DEFAULTS, (stored) => {
  settings = stored;
  applyVisualSettings();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const key of Object.keys(DEFAULTS)) {
    if (changes[key]) settings[key] = changes[key].newValue;
  }
  applyVisualSettings();
});

document.addEventListener('wheel', (event) => {
  if (!settings.enabled) return;

  if (!settings.nativePinch || !event.ctrlKey || event.metaKey) return;

  // This prevents Outlook's event handler from turning the pinch into its own
  // text/content zoom. It intentionally does *not* cancel the event's default
  // action, so Chrome performs the same zoom it uses on ordinary webpages.
  event.stopImmediatePropagation();
}, { capture: true, passive: false });

function applyVisualSettings() {
  document.documentElement.dataset.enhancedOutlookArchiveButton = String(
    settings.enabled && settings.archiveButton
  );
}
