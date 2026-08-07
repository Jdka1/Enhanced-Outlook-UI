// On macOS Chrome reports a trackpad pinch as a ctrl+wheel event. Outlook
// handles that event itself and changes only its message content. Stop the
// event before Outlook receives it, but do not call preventDefault(): Chrome
// can then perform its normal, smooth browser-page pinch zoom.
const DEFAULTS = {
  enabled: true,
  nativePinch: true,
  blockHorizontalScroll: true,
  archiveLabel: true
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

  if (settings.blockHorizontalScroll && !event.ctrlKey && Math.abs(event.deltaX) > Math.abs(event.deltaY) && isReadingPaneTarget(event)) {
    // Prevent a horizontal trackpad swipe from moving the open-message pane.
    // Only gestures whose primary movement is horizontal are blocked, so
    // ordinary vertical and diagonal reading scrolls remain available.
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (!settings.nativePinch || !event.ctrlKey || event.metaKey) return;

  // This prevents Outlook's event handler from turning the pinch into its own
  // text/content zoom. It intentionally does *not* cancel the event's default
  // action, so Chrome performs the same zoom it uses on ordinary webpages.
  event.stopImmediatePropagation();
}, { capture: true, passive: false });

function applyVisualSettings() {
  document.documentElement.dataset.betterOutlookArchiveLabel = String(
    settings.enabled && settings.archiveLabel
  );
}

function isReadingPaneTarget(event) {
  const elements = event.composedPath().filter((node) => node instanceof HTMLElement);
  if (elements.some((element) => element.getAttribute('role') === 'document')) return true;

  // Outlook can render an email in an isolated same-origin child frame.
  if (window.top !== window && elements.includes(document.body)) return true;

  // The sender/header controls are siblings of the role=document body. Find
  // that body's scroll area and its immediate reading-pane wrapper so a
  // horizontal gesture is blocked anywhere in the open-message pane, not just
  // over the rendered email HTML.
  const messageBody = [...document.querySelectorAll('[role="document"]')]
    .find((element) => element.getBoundingClientRect().width > 0);
  const scroller = messageBody && findScrollableAncestor(messageBody);
  const pane = scroller && (scroller.parentElement || scroller);
  return Boolean(pane && pane.contains(event.target));
}

function findScrollableAncestor(element) {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (/(auto|scroll)/.test(style.overflowX) || /(auto|scroll)/.test(style.overflowY)) {
      return node;
    }
  }
  return null;
}
