# Enhanced Outlook UI — Agent Guide

## Project purpose

This is a deliberately small, unpacked Manifest V3 Chrome extension for Microsoft 365 Outlook Web on macOS/Chrome.

The original problem was Outlook Web intercepting a Mac trackpad pinch and applying an aggressive, awkward email-content zoom. Several custom CSS-transform prototypes were attempted, but they could not consistently keep Outlook's separately rendered subject, message card, sender header, and email HTML in sync. The current implementation intentionally avoids all custom zoom transforms.

The extension now restores the interaction the user actually wants: pinching in Outlook should work like pinching on an ordinary Chrome webpage (for example, Google). Chrome performs its normal native page zoom; Outlook does not hijack the pinch for its own internal email zoom.

## Current behavior

1. **Native pinch zoom in Outlook**
   - In macOS Chrome, trackpad pinch reaches a webpage as a `wheel` event with `ctrlKey: true`.
   - `content.js` listens at capture phase from `document_start`.
   - For a pinch event, it calls `stopImmediatePropagation()` but deliberately does **not** call `preventDefault()`.
   - This stops Outlook's JavaScript handler from receiving the gesture while allowing Chrome's default browser-page zoom to occur.
   - Native Chrome zoom affects the whole Outlook tab: subject, sender, message frame, message content, and surrounding Outlook UI. This is intentional and is the behavior the user approved.
   - A physical Control + mouse-wheel over Outlook is treated the same as a trackpad pinch. This is an unavoidable consequence of Chrome's event model.

2. **Normal horizontal scrolling**
   - Do not intercept ordinary non-pinch `wheel` events. When native page zoom makes Outlook wider than its viewport, two-finger horizontal scrolling must remain available to pan around the page.

3. **Archive button size**
   - `outlook.css` makes accessible Archive buttons wider, without injecting a text label. Outlook may already render its own label; injecting another causes duplicate `Archive Archive` text.
   - It targets `button[aria-label^="Archive"]` and `[role="button"][aria-label^="Archive"]`, avoiding volatile Outlook CSS classes.
   - The CSS applies automatically to elements Outlook adds/replaces in its single-page app; no mutation observer is needed.

4. **Popup**
   - The popup has a master persistent on/off switch plus independent saved toggles for native pinch zoom and the wider Archive button.
   - State is stored in `chrome.storage.sync` as `{ enabled, nativePinch, archiveButton }`, all defaulting to `true`.
   - When disabled, the content script leaves Outlook's normal pinch behavior intact and removes the Archive styling. Individual feature toggles affect only their named behavior.

## Project layout

| Path | Responsibility |
| --- | --- |
| `manifest.json` | MV3 manifest, Outlook-only host matches, content stylesheet/script, popup registration. |
| `src/content/content.js` | Native-pinch pass-through. Keep it free of UI styling. |
| `src/styles/outlook.css` | Small Outlook visual customizations, currently the Archive command. |
| `src/popup/` | Popup HTML, CSS, and JavaScript for the enabled-state controls. |
| `README.md` | User-facing installation, testing, feature-request, and constraint documentation. Update it with user-visible behavior changes. |
| `AGENTS.md` | This implementation and maintenance guide for future agent sessions. |

## Scope and permissions

- Match only `https://outlook.office.com/*` and `https://outlook.cloud.microsoft/*`.
- The only extension permission is `storage`.
- Content scripts use `all_frames: true` and `match_about_blank: true` so same-origin Outlook message frames are covered.
- Do **not** add `<all_urls>`, broad host permissions, or `tabs`/`scripting` permissions without a concrete feature that needs them and explicit user approval.
- The extension cannot intercept a cross-origin iframe without requesting access to that iframe's domain. Do not broaden permissions merely as a speculative workaround.

## Important implementation constraints

### Keep Chrome native zoom native

Do not reintroduce CSS `transform`, `zoom`, wrappers, cloned nodes, or manual scroll-position math to simulate pinch zoom unless the user explicitly changes the product direction. Those approaches were rejected because Outlook renders portions of an opened email in distinct containers, causing content to drift separately from its frame and header.

For the current desired behavior, do not call `preventDefault()` in the `ctrlKey` pinch branch. `preventDefault()` cancels Chrome's browser zoom. Stopping propagation alone is the key technique.

### Preserve normal gestures

- Never cancel ordinary non-pinch `wheel` events. This includes horizontal scrolling needed to pan a zoomed-in page.
- Do not cancel `ctrlKey` pinch events with `preventDefault()`.

### Outlook is a single-page app

Outlook commonly replaces toolbar/message DOM nodes without a full navigation. Prefer CSS attribute selectors and event delegation/capture listeners over querying once at startup, hard-coded class names, or attaching listeners to a particular button.

Accessibility attributes such as `aria-label` and `role` are intentionally preferred as relatively stable selectors. They may still vary by language: the Archive CSS currently expects English `Archive`. If localization becomes a requirement, discuss the desired locales before expanding selector coverage.

## Development workflow

1. Edit the feature files under `src/`; keep the extension dependency-free and plain HTML/CSS/JavaScript. Keep `manifest.json`, `README.md`, and this guide at the project root.
2. Validate without mutation:

   ```sh
   node --check src/content/content.js
   node --check src/popup/popup.js
   node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('Manifest valid')"
   ```

3. In Chrome, open `chrome://extensions`, enable Developer mode, and click the reload icon for this unpacked extension.
4. Reload the Outlook tab after any `src/content/content.js` or `src/styles/outlook.css` change. Existing content scripts/styles may otherwise remain from the prior version.
5. Test with a real opened email, ideally both a simple text email and a formatted HTML email.

## Manual acceptance checklist

- Pinch anywhere in Outlook: Chrome's native page zoom occurs; Outlook does not apply its aggressive message-only zoom.
- Two-finger vertical scrolling in an email and in the message list still works normally.
- When zoomed in, horizontal trackpad scrolling can pan around the email normally.
- The popup switch disables all extension interception after the Outlook tab is reloaded.
- The Archive command is visibly wider without a duplicate label in English Outlook Web.
- Other toolbar buttons remain unaffected.

## Known limitations

- The extension cannot independently set native Chrome pinch sensitivity or Chrome's zoom range. Those are browser-controlled. The former custom sensitivity slider was deliberately removed when the product direction changed to native zoom.
- Native page zoom affects all of Outlook, not only the message body. This is intentional and matches the user's approved "like browsing Google" behavior.
- The Archive button selector is English-specific and depends on Outlook retaining an accessible `aria-label` beginning with `Archive`.
- There is no automated browser test setup. Validate syntax/manifest statically and perform the manual acceptance checklist in Chrome.

## Documentation and issue intake

Keep `README.md` aligned with actual behavior. It directs users to https://github.com/Jdka1/Better-Outlook/issues for feature requests and bugs.

The remote repository was observed to be empty when this project was started; do not assume local Git history or a configured remote exists. Check repository state before any Git operation and do not create commits, push, or alter remote configuration unless the user explicitly asks.
