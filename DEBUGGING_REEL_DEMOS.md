# Debugging Reel Demos

These demos are local-only Chrome DevTools recording scenarios. They use native
`fetch`, Next.js route handlers, harmless in-memory data, and no authentication
or database persistence.

## Demo Routes

- Landing: `/debug-demos`
- Existing notifications demo: `/debug-api-request/broken`
- Existing notifications fixed demo: `/debug-api-request/fixed`
- Request origin broken: `/debug-demos/request-origin/broken`
- Request origin fixed: `/debug-demos/request-origin/fixed`
- Slow submit broken: `/debug-demos/slow-submit/broken`
- Slow submit fixed: `/debug-demos/slow-submit/fixed`
- Stale search broken: `/debug-demos/stale-search/broken`
- Stale search fixed: `/debug-demos/stale-search/fixed`

## Demo 1: Request Origin

Open `/debug-demos/request-origin/broken`.

Broken flow:

1. Open Chrome DevTools.
2. Open Network and filter by Fetch/XHR.
3. Edit the draft title or notes.
4. Click `Save Draft` within about 1.2 seconds.
5. Observe one `POST /api/debug/drafts` request from the manual save.
6. Wait briefly.
7. Observe a second `POST /api/debug/drafts` request from the already-scheduled background save.

XHR/fetch breakpoint:

1. Open Sources.
2. Add an XHR/fetch breakpoint containing `/api/debug/drafts`.
3. Edit the draft.
4. Click `Save Draft` before the autosave delay ends.
5. DevTools should pause for the manual request.
6. The first meaningful application stack should include `saveDraft` and `handleManualSave`.
7. Resume execution.
8. DevTools should pause again for the delayed request.
9. The next meaningful application stack should include `saveDraft`, `runAutosave`, and `autosaveTimerCallback`.

Network Initiator may show the shared `draftApi.ts` helper for both requests.
That is intentional: the helper tells you where `fetch` lives, while the paused
Call Stack tells you which runtime path triggered the specific request.

Fixed flow:

1. Open `/debug-demos/request-origin/fixed`.
2. Clear Network.
3. Edit the draft.
4. Click `Save Draft` within about 1.2 seconds.
5. Confirm only one `POST /api/debug/drafts` request appears.
6. Wait at least 2 seconds and confirm no delayed duplicate save appears.

## Demo 2: Slow Submit

Open `/debug-demos/slow-submit/broken`.

Enable throttling:

1. Open Chrome DevTools.
2. Open Network.
3. Select a `3G` throttling preset.
4. If localhost still resolves too quickly, create a custom profile with about
   `1500-2000 ms` latency.
5. Clear Network.

Broken flow:

1. Keep the task title as `Follow up with client`.
2. Double-click `Create Task`.
3. Observe two `POST /api/debug/tasks` requests.
4. Observe two identical tasks in the list.

Fixed flow:

1. Open `/debug-demos/slow-submit/fixed`.
2. Keep the same throttling profile enabled.
3. Clear Network.
4. Double-click `Create Task`.
5. Confirm only one `POST /api/debug/tasks` request appears.
6. Confirm only one task is created.

The fixed page disables the button and uses a synchronous in-flight guard in
this UI instance. It does not implement backend idempotency.

## Demo 3: Stale Search

Open `/debug-demos/stale-search/broken`.

Exact sequence:

1. Open Network and filter by Fetch/XHR.
2. Click `Running Shoes`.
3. Immediately click `Wireless Headphones`.
4. Watch the waterfall:
   - `Running Shoes` starts first and takes about 2500 ms.
   - `Wireless Headphones` starts second and takes about 500 ms.
   - Headphones finishes first.
   - Shoes finishes last.
5. Broken UI result: the submitted query can still show `Wireless Headphones`,
   while the displayed cards are Running Shoes products.

Fixed flow:

1. Open `/debug-demos/stale-search/fixed`.
2. Click `Running Shoes`.
3. Immediately click `Wireless Headphones`.
4. Headphones results appear.
5. The late Shoes response finishes in Network but is ignored by the UI.
6. Headphones results remain visible.

This demo does not use `AbortController`. The lesson is that state should only
be updated by the response representing the latest user intent.

## Troubleshooting

- If an XHR/fetch breakpoint pauses inside extension code, disable
  request-intercepting extensions or test in Incognito.
- If DevTools pauses inside browser or framework code, click the first
  meaningful application frame in the Call Stack.
- If source maps or filenames are unreadable, run the app with `pnpm dev`.
- If development mode runs effects more than expected, reload and begin the
  interaction only after DevTools is ready.
- If hot reload resets data, use the page Reset button and repeat the flow.
- If throttled localhost requests still resolve too quickly, create a custom
  throttling profile with `1500-2000 ms` latency.
- If a breakpoint repeatedly pauses after you captured the stack, disable or
  remove the breakpoint.
- If the stale search race does not reproduce, send the second search faster:
  click `Running Shoes`, then immediately click `Wireless Headphones`.

Exact Call Stack formatting can vary across Chrome versions.
