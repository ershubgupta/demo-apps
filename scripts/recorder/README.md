# Chrome DevTools Recorder Exports

Use this folder for Puppeteer scripts exported from Chrome DevTools Recorder.

1. Start the application:

   ```bash
   pnpm dev
   ```

2. Open `http://127.0.0.1:5173/debug-demos/cart-recorder` in Chrome.
3. Open Chrome DevTools.
4. Open More tools -> Recorder.
5. Record the ecommerce cart bug reproduction flow: add a product, apply `SAVE10PERCENT`, change the input to `SAVE20` or `SAVE30`, then apply again.
6. Use Replay to confirm the flow reproduces correctly.
7. Export -> Puppeteer.
8. Save the exported file inside this `scripts/recorder/` folder.
9. Run the exported script with Node, for example:

   ```bash
   node scripts/recorder/cart-discount-bug.mjs
   ```

If Puppeteer reports that Chrome cannot be found, install Puppeteer's supported browser with:

```bash
npx puppeteer browsers install
```

