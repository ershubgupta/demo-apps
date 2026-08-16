# Unexpected API Request Demo

## Run Instructions

- Start the app with `pnpm dev`.
- Open `http://localhost:3010/debug-api-request`.
- The default route opens Broken mode at `/debug-api-request/broken`.
- Use `/debug-api-request/fixed` to test the corrected cleanup.
- Click the bell icon in the top bar to open the Notifications drawer.

## Broken-Flow Test

1. Open `/debug-api-request/broken`.
2. Open Chrome DevTools.
3. Open the Network tab and filter by Fetch/XHR.
4. Click the notification bell in the top bar.
5. Wait for multiple `/api/notifications` requests.
6. Close the Notifications drawer with the drawer close button or outside click.
7. Confirm requests continue every 3 seconds even though the drawer is closed.

## Network Initiator Test

1. Open `/debug-api-request/broken`.
2. Open Chrome DevTools.
3. Open Network.
4. Filter by Fetch/XHR.
5. Right-click the Network table header and enable the Initiator column if it is hidden.
6. Click the notification bell.
7. Wait for multiple `/api/notifications` requests.
8. Close the Notifications drawer.
9. Select a later `/api/notifications` request that arrived after closing the drawer.
10. Inspect the Initiator column or the request's Initiator details.

Expected application frames should involve `notificationApi`, `fetchNotifications`, `useNotificationsPolling`, `loadNotifications`, or the `notificationsPollingInterval` callback. Chrome may also show framework and React development frames around these.

## XHR/fetch Breakpoint Test

1. Open `/debug-api-request/broken`.
2. Open Chrome DevTools.
3. Open Sources.
4. Expand the right sidebar section for XHR/fetch Breakpoints.
5. Add a breakpoint containing `api/notifications`.
6. Click the notification bell, or wait for the next poll if polling is already active.
7. DevTools should pause before the matching request is sent.

The paused stack should let you trace from the native `fetch` call in `fetchNotifications` back through `loadNotifications`, `useNotificationsPolling`, and the interval callback. Chrome may pause inside the helper line first, which is expected because the URL is intentionally centralized there.

## Expected Call Stack

Look for these readable application names or source files:

- `notificationApi.ts`
- `fetchNotifications`
- `useNotificationsPolling.ts`
- `loadNotifications`
- `notificationsPollingInterval`

Exact DevTools grouping can vary by Chrome version, source-map timing, and the selected request.

## Fixed-Flow Test

1. Open `/debug-api-request/fixed`.
2. Clear the Network tab.
3. Click the notification bell.
4. Wait for at least two `/api/notifications` requests.
5. Close the Notifications drawer.
6. Wait at least 6 to 8 seconds.
7. Confirm no new `/api/notifications` requests appear after closing.

Fixed mode also clears any old demo polling intervals that were leaked by Broken mode during client-side navigation, so switching to Fixed mode in the same tab should not leave the Broken timer running.

## Troubleshooting

- If Initiator only shows the shared helper, open the request's Initiator details or use the XHR/fetch breakpoint to inspect the full call stack.
- If the Call Stack contains framework internals, look for nearby application frames named `fetchNotifications`, `loadNotifications`, or `notificationsPollingInterval`.
- If XHR/fetch Breakpoints are not visible, widen the Sources right sidebar or use the `+` button in the breakpoint pane.
- If the browser pauses repeatedly, disable or remove the XHR/fetch breakpoint after capturing the stack.
- If requests appear twice in development, reload the page and only open the drawer after DevTools is ready. The demo starts with polling disabled to avoid pre-interaction Strict Mode noise.
- If source filenames are difficult to read, use `pnpm dev` rather than a production build so development source maps remain readable.