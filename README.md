# Enhanced Outlook UI

## Changes this extension makes

1. Restores Chrome’s normal page pinch zoom in Outlook.
2. Keeps normal sideways scrolling available when the page is zoomed in.
3. Makes the Archive button easier to use with a wider hit area.
4. Adds saved popup toggles for every feature and the extension as a whole.

The extension runs only on `outlook.office.com` and `outlook.cloud.microsoft`. It requests only extension storage for saving the on/off setting; it does not send email data anywhere.

## Install locally in Chrome

1. Download or clone this repository to a folder on your Mac.
2. Open Chrome and visit `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select this repository's top-level folder (the folder containing `manifest.json`).
6. Open or reload Microsoft 365 Outlook Web (`outlook.office.com` or `outlook.cloud.microsoft`).
7. Pinch anywhere in Outlook to use Chrome's normal page zoom. Click the extension icon to toggle the features on or off.

After changing any extension files, return to `chrome://extensions`, click the extension's reload icon, and refresh the Outlook tab.

## Feature requests

Please share feature requests and bugs in the [GitHub Issues](https://github.com/Jdka1/Better-Outlook/issues) section.
