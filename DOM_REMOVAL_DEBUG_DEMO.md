# DOM Removal Debug Demo

## Routes

- Broken: `/debug-demos/dom-removal/broken`
- Fixed: `/debug-demos/dom-removal/fixed`

## Broken Reproduction

1. Open `/debug-demos/dom-removal/broken`.
2. Click the date input or `Open Calendar`.
3. Confirm the calendar popup appears.
4. Click `Next Month`.
5. Confirm the complete calendar popup disappears.

## Node Removal Breakpoint

1. Open Chrome DevTools.
2. Go to Elements.
3. Open the calendar popup.
4. Select the popup container with:
   `data-debug-calendar-popup="true"`
5. Right-click the selected element.
6. Choose `Break on` -> `Node removal`.
7. Click `Next Month`.
8. DevTools should pause when the popup is removed.
9. Inspect the Call Stack and click the first application-owned frame.

## Expected Paused Code

Expected application pattern:

- `calendarPopup.remove()`
- `removeCalendarPopup`
- `handleDocumentPointerDown`

Chrome versions may show slightly different surrounding framework or browser
frames, but the first meaningful application frame should point to the
document-level pointer handler that removed the popup.

## Fixed Validation

1. Open `/debug-demos/dom-removal/fixed`.
2. Click the date input or `Open Calendar`.
3. Click `Next Month`.
4. Confirm the month changes and the popup stays open.
5. Click outside the input and popup.
6. Confirm the popup closes.
7. Reopen the calendar and confirm it still works.

## Troubleshooting

- If `Node removal` is not visible, make sure you right-clicked an element in
  the Elements tree, not text or whitespace.
- If DevTools does not pause, confirm the selected element is the popup
  container with `data-debug-calendar-popup="true"`, not a child day cell.
- If the breakpoint pauses repeatedly, remove the DOM breakpoint after capture.
- If source names are difficult to read, use `pnpm dev` and avoid production
  builds while recording.
- If React development mode appears to run setup twice, reload the page and
  open the popup after DevTools is ready.
- If the popup disappears before you can select it, open it, press `F8` to pause
  JavaScript, then select the popup container in Elements.
