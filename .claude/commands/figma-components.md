# Figma Components

Authors decided prototype components and patterns into the Figma handover file as token-bound, documented, reusable Figma components. Uses the Figma MCP `use_figma`, `search_design_system`, `get_variable_defs`, `get_metadata`, and `get_screenshot` tools.

Run this when a design session is complete and new components/patterns have been decided — it syncs them into the Figma component-library page so the handover stays current. Complements `/figma-capture` (captures running screens as frames) and `/handover` (writes the Jira doc): this one builds the reusable components.

## How to invoke
```
/figma-components [Figma file URL]
```
Example:
```
/figma-components https://www.figma.com/design/i4R1E5kvkF4lDbLgJQvUhu/Clubs--MIS-68618-
```
If the URL is missing, default to the prototype file in the `figma-handover-setup` memory and confirm with Anna before proceeding.

---

## Before you start — load the plumbing

Read the `figma-handover-setup` memory file first. It holds the hard-won setup so you don't re-derive it:
- Prototype/handover file key (`i4R1E5kvkF4lDbLgJQvUhu`) and the components page (`BP — Nav Header Patterns`, `4262:31`)
- Arbor Design System source file key (`UKQfcxnT4rlHHNuiumt4o1`) — colour variables under Foundations > Colour
- The token → hex map, known icon/variable component keys, and the MCP gotchas

---

## Process

1. **Decide what to build** — read `CLAUDE.md` (patterns, constraints, nav-header rules), `DECISIONS.md` (decided behaviour), and inventory the prototype `.jsx` for the components/patterns in scope. Diff against components already on the `BP — Nav Header Patterns` page. Propose the new/changed list, grouped by family (Nav headers / Navigation / Landing / Detail & booking / Session pickers / Feedback). **Confirm the list with Anna before building.**

2. **Resolve tokens** — ensure the local `Arbor tokens (mirror)` collection holds the colours needed (Arbor names + hex from memory; resolve any new ones from the DS file with `get_variable_defs` / a `getLocalVariablesAsync` probe, following aliases). Bind every fill/stroke via `figma.variables.setBoundVariableForPaint`. **Never hardcode hex** — the only raw-value exception is per-child avatar pastels (content colours, not theme tokens).

3. **Resolve icons** — use Arbor `icons/{size}/{name}` components by key where they exist (`importComponentByKeyAsync`). Where the DS has a gap (it lacks most 24px glyphs), **draw the Lucide icon** as a vector via `figma.createNodeFromSvg` + `figma.createComponentFromNode`, named `Icon (Lucide) / {name}` — this matches the prototype, which imports from `lucide-react`. Reuse icon components already on the page. **Always fetch the exact path data first** — `curl -sL https://unpkg.com/lucide-static@latest/icons/{name}.svg` — and use it verbatim. **Never reconstruct Lucide paths from memory**: they drift and render malformed (a dropped fork prong, or the wrong glyph entirely). After drawing, screenshot and eyeball every icon against the real glyph.

4. **Build each component** — auto-layout, semantic layer names, bind all fills/strokes to mirror tokens, expose editable text as a component property (`addComponentProperty` + `componentPropertyReferences`), and embed the when-to-use spec in the component `description` (visible in Dev Mode). Reuse existing components as instances — don't duplicate (e.g. TopNav embeds ChildSwitcher embeds ChildAvatar).

5. **Validate** — screenshot each component (`get_screenshot` → curl the URL → Read the PNG) and check it against the prototype before moving on. Build **family by family**, and checkpoint with Anna between families.

6. **Flag drifts** — where the prototype diverges from the DS, note it on the component description and surface it for Tony. Known examples: the prototype's semantic error/default Tag vs the DS `tag`'s qualitative-colour variants (Owed→salmon, Low→orange); nav-header shadow `0 1px 1px / 0.12` (file) vs `0 1px 0 / 0.06` (CLAUDE.md spec).

7. **Tidy the page** — keep it in labelled sections (a header text per family, plus Tokens and Icons sections); park icon components in a column off to the side. Remove redundant captions once descriptions carry the spec.

8. **Record** — offer to append any new design decisions to `DECISIONS.md`, and update the `figma-handover-setup` memory with any new file/token/icon keys discovered.

---

## Key decisions / gotchas (don't relearn these)

- **Variables aren't live.** The Arbor DS library is subscribed to the prototype file for *components only* — its *variables are not enabled* (`getAvailableLibraryVariableCollectionsAsync()` returns 0; `importVariableByKeyAsync` fails). Use the local `Arbor tokens (mirror)` collection. Swap to live links only once Anna enables the variable library in the file.
- **`use_figma` returns only created nodes** — not return values or `console.log`. To read data back from a script (ids, sizes, probes), `throw new Error(JSON.stringify(data))`.
- **`resize()` flips an auto-layout axis to FIXED — on BOTH axes.** After adding children, set the hugging axis back to `'AUTO'`: `primaryAxisSizingMode` for the layout direction, `counterAxisSizingMode` for the cross axis. A horizontal card that should hug its height needs `counterAxisSizingMode = 'AUTO'` — if you `resize(w, h)` it, tall variants (a card with a pill) clip and short ones get over-padded. To set one dimension fixed and keep the other hugging: `resize(w, h)` then re-set the hug axis to `'AUTO'`.
- **Fixed-width side columns keep dividers/alignment consistent.** When cards have variable right-side content (e.g. "Free" vs "From £8 / per session"), give the price/side column a FIXED width so the vertical divider and content sit in the same place across every card — don't let it hug.
- **Set the page before mutating** — `await figma.setCurrentPageAsync(page)`; `figma.currentPage.selection` only accepts nodes on the current page.
- **`get_metadata` on a large node** can exceed the token limit and save to a file — query it with `jq`, don't read it whole.
- **Find the components page by id (`4262:31`), not by name** — `await figma.getNodeByIdAsync('4262:31')`. Anna renames the page (was "BP — Nav Header Patterns", now "BP — Mini Clubs design system"); a name lookup silently returns undefined.
- **Mind JS string escaping** (apostrophes) in `use_figma` code — a SyntaxError aborts the whole call before anything executes (so a failed parse leaves no partial state).
- **Components are local until Published.** Publishing (Figma → Assets → Publish) and Code Connect are manual steps — flag them to Anna, don't attempt via MCP.

---

## Out of scope

- Does **not** publish components or enable the variable library — both are manual Figma steps for Anna.
- Does **not** capture full screens as frames — that's `/figma-capture`. This command builds reusable components and patterns.
- Basket components are parked until the basket pattern is fully formed.
