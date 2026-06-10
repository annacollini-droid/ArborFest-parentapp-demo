# Figma Capture

Captures the running React prototype into a Figma file as design frames.
Uses the Figma MCP `generate_figma_design` tool plus an in-browser capture script.

## How to invoke
```
/figma-capture [Figma file URL]
```

Example:
```
/figma-capture https://www.figma.com/design/i4R1E5kvkF4lDbLgJQvUhu/Clubs--MIS-68618-?node-id=2-43
```

If the URL is missing, ask Anna to provide one before proceeding.

---

## Process

1. **Parse the URL**
   - Extract `fileKey` from `/design/:fileKey/...`
   - Extract `nodeId` from `?node-id=X-Y` and convert `-` to `:`

2. **Resolve target node**
   - If `nodeId` was in the URL → use it
   - If not → call `get_metadata` on the file (no nodeId) to list top-level pages
     - If a page named "Handoff" exists (case-insensitive, ignore emoji) → use it
     - If not → ask Anna where to drop the captures, wait for an answer

3. **Check the dev server**
   - Look for a Vite dev server already running on a localhost port (`lsof -i :5173-5180` on macOS)
   - If none, run `npm run dev` in the background and read the `Local:` URL from the output
   - Note the localhost URL for step 5

4. **Verify the capture script**
   - Read `index.html`
   - If `https://mcp.figma.com/mcp/html-to-design/capture.js` is not present, add this tag to the `<head>`:
     `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`

5. **Trigger the first capture**
   - Tell Anna: "Navigate to the screen you want captured, then say 'go'"
   - Wait for her confirmation
   - Call `generate_figma_design` with `outputMode: "existingFile"`, the `fileKey`, and the resolved `nodeId`
   - Get the `captureId` back
   - Run: `open "<localhost-url>#figmacapture=<id>&figmaendpoint=<encoded-endpoint>&figmadelay=1000"`

6. **Poll until complete**
   - Wait 5s, then call `generate_figma_design` with the `captureId`
   - If status is `pending` or `processing`, wait 5s and poll again
   - Stop only when `completed`
   - Return the Figma deep link

7. **Hand off to the toolbar**
   - Tell Anna the first capture landed. Remind her:
     "Use the in-browser capture toolbar for any additional screens — it generates new IDs automatically and lands them on the same Handoff page."

---

## Key decisions

- **Project-specific** to this Vite/React prototype — assumes `npm run dev` and `index.html` in the project root.
- **Target node defaults to the Handoff page** if none specified in the URL. If no Handoff page exists, ask before proceeding.
- **Anna has control after the first capture** — subsequent captures use the in-browser toolbar, not Claude.
- **Capture script stays in `index.html`** permanently — already added, no need to remove.

---

## Caveats to mention if relevant

- The prototype has a password gate. If Anna hasn't entered the password, the capture will grab the password screen instead of the app. Remind her to unlock first.
- The prototype is state-based (no URL changes between screens), so the capture grabs whatever's currently on screen.
- If the screen needs a specific element captured (e.g. a single card variant), use `figmaselector=*` in the hash to enter the hover-select UI — it opens a hover-to-select overlay so Anna can pick a specific DOM element.
