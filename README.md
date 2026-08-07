# Better Outlook Zoom

A small Chrome extension for Microsoft 365 Outlook on the web. It makes Outlook behave more like an ordinary webpage when using a Mac trackpad.

## Changes this extension makes

1. **Restores native Chrome pinch zoom**
   - Prevents Outlook from hijacking a trackpad pinch for its own aggressive, message-only zoom.
   - Lets Chrome perform its standard smooth page zoom instead, just like on Google or another regular website.
   - Zoom applies to the complete Outlook page, including the subject, sender, email content, and Outlook controls.
   - Chrome controls the zoom speed, range, focus point, and reset behavior. Use Chrome's normal zoom controls, including <kbd>⌘</kbd>+<kbd>0</kbd>, to reset to 100%.

2. **Prevents sideways scrolling within the open-email pane**
   - Horizontal trackpad swipes over the subject, sender/header, message controls, or rendered email body do not move the open message sideways.
   - Normal vertical and diagonal scrolling continue to work.

3. **Makes the Archive command easier to spot**
   - Widens Outlook's Archive button.
   - Adds a visible **Archive** label beside its icon.

4. **Provides a quick on/off switch**
   - Click the extension icon in Chrome's toolbar to enable or disable all extension behavior.
   - The popup also has separate saved toggles for native pinch zoom, sideways-scroll blocking, and the Archive button label.

The extension runs only on `outlook.office.com` and `outlook.cloud.microsoft`. It requests only extension storage for saving the on/off setting; it does not send email data anywhere.

## Install locally in Chrome

1. Download or clone this repository to a folder on your Mac.
2. Open Chrome and visit `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the folder containing this repository's `manifest.json` file.
6. Open or reload Microsoft 365 Outlook Web (`outlook.office.com` or `outlook.cloud.microsoft`).
7. Pinch anywhere in Outlook to use Chrome's normal page zoom. Click the extension icon to toggle the features on or off.

After changing any extension files, return to `chrome://extensions`, click the extension's reload icon, and refresh the Outlook tab.

## Test and debug

- Pinch anywhere in Outlook: Chrome should zoom the page as it does on Google or another normal webpage.
- Scroll with two fingers: Outlook should scroll normally.
- Swipe horizontally anywhere in an open email pane: it should not scroll sideways.
- Turn the popup switch off: Outlook's own pinch handling should return after reloading the tab.

If pinching still triggers Outlook's original zoom, verify that the extension is enabled in `chrome://extensions`, then reload Outlook. The listener registers at page start so it can run before Outlook's own handler.

## Feature requests

Please share feature requests and bugs in the [GitHub Issues](https://github.com/Jdka1/Better-Outlook/issues) section.

## Known prototype boundary

Chrome presents a macOS trackpad pinch to a page as a `ctrlKey` wheel event, rather than exposing a dedicated native pinch-scale event. The extension stops Outlook's handler without canceling Chrome's browser-zoom default action. A physical Control + mouse-wheel gesture is treated the same way. Chrome owns the sensitivity and zoom range, so the extension no longer provides a custom sensitivity control.
