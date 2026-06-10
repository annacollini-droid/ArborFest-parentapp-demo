# Deploy

Builds the prototype and publishes it to GitHub Pages so the live link reflects the latest changes.

## How to invoke
```
/deploy
```

No arguments. The live URL is always the same:
**https://annacollini-droid.github.io/parentappprototype**

Anna shares this URL with stakeholders and testers — running `/deploy` updates what's at that URL.

---

## Process

1. **Sanity-check the working tree** — run `git status` (no `-uall`). If there are uncommitted changes, surface them in one line (e.g. "Deploying with 2 uncommitted files in src/") so Anna knows what she's about to publish. **Do not commit anything** — the deploy uses the working tree directly, so WIP changes are fine to deploy for stakeholder review

2. **Run the deploy** — `npm run deploy`. This runs `vite build` then `gh-pages -d dist`, which pushes `dist/` to the `gh-pages` branch on GitHub. Stream output; it takes 10–30 seconds

3. **Confirm success** — look for the `gh-pages` "Published" line at the end. If the build step fails, surface the error and stop — do not retry

4. **Report back** — one short message with:
   - The live URL: https://annacollini-droid.github.io/parentappprototype
   - A note that GitHub Pages can take 1–2 minutes to propagate, so a hard refresh (Cmd+Shift+R) may be needed if the changes don't show immediately
   - A reminder to test on the real device if the change involved touch gestures or viewport-sensitive layout

---

## Don't

- Don't commit or push source changes as part of deploy — those are separate operations
- Don't retry on failure; investigate the root cause
- Don't skip the build step or deploy a stale `dist/` — always run the full `npm run deploy`
