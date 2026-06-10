# Design Handover

Generates a structured design handover document for engineering, sourced from the Figma design and the prototype, then posts it to the Jira ticket after review.

## How to invoke
```
/handover [feature name] [Figma file URL] [Jira ticket ID]
```
Example:
```
/handover Messages https://www.figma.com/design/MPFBu2jHl3sZdH0fWc7rVu/Messages--MIS-68620- MIS-69994
```

If any of the three arguments are missing, ask Anna to provide them before proceeding.

---

## Process

1. **Parse arguments** — extract feature name, Figma file key (from URL), and Jira ticket ID
2. **Get Figma structure** — call `get_metadata` on the Figma file (use the page node or root) to get the full layer tree
3. **Find screen nodes** — filter the layer tree for frames whose names start with the feature's sitemap prefix (e.g. `MSG-`, `BP-`, `CHILD-`). Collect node IDs for all primary screens (not component/variant frames)
4. **Get design context** — call `get_design_context` for each screen node (with screenshots enabled — do NOT set `excludeScreenshot: true`). Run these in parallel where possible
5. **Extract icons** — from each `get_design_context` result, scan all `data-name` attributes for icon-like values. Apply the rules in the **Icon extraction rules** section below
6. **Read the prototype** — grep `src/ParentApp.jsx` (and other `.jsx` files) for the feature's section to understand interactions, states, and validation logic not visible in static Figma frames
7. **Read constraints** — re-read `CLAUDE.md` to ensure configuration states, accessibility rules, and out-of-scope items are correctly reflected
8. **Draft the handover** — produce the document using the **Output format** below. Do not post to Jira yet
9. **Review** — output the full draft to Anna and explicitly ask: *"Does this look right? I'll post to Jira once you confirm."* Wait for confirmation
10. **Post to Jira** — only after Anna confirms. Use the Atlassian MCP (`addCommentToJiraIssue` or `editJiraIssue`) to post the handover as a comment or description on the ticket. Use Jira's Atlassian Document Format (ADF) where required

---

## Icon extraction rules

Scan every `data-name` attribute in the `get_design_context` output. Apply these rules:

| Pattern | Action |
|---|---|
| `lucide/[name]` | Named Lucide icon — use as-is, convert to PascalCase for React (e.g. `lucide/x` → `X`) |
| `icons/[size]/[name]` | Named Lucide icon — extract the name part, convert to PascalCase (e.g. `icons/16/pencil` → `Pencil`) |
| `chevron down`, `chevron right`, `chevron left`, `chevron up` | Map to Lucide PascalCase: `ChevronDown`, `ChevronRight`, etc. |
| Any other recognisable icon name in kebab-case or plain English | Map to Lucide PascalCase equivalent |
| `SVG`, `Vector`, `Icon`, `Frame`, generic names | Flag as `SVG — check Figma layer` |

For each icon found, note **where it is used** in the UI (button label, back navigation, row indicator, etc.).

---

## Output format

Use this exact structure. Populate each section from the Figma + prototype data. Where information is genuinely unknown or TBD, say so explicitly — do not invent or guess.

```
## [Feature name] — Design Handover
**Figma:** [link to Figma file]
**Sitemap:** [link to sitemap — always https://www.figma.com/design/crIX5n6nKFR5Vsvh6XpR53/Parent-App-2.0-Sitemap]
**Ticket:** [Jira ticket ID]

---

### Overview
[2–4 sentences: what this feature does, who it's for, key constraints]

---

### [SCREEN-ID] — [Screen name]

![screenshot](figma-asset-url)
**Figma node:** [deep link to this node]

[Description of what's on screen, header behaviour, key interactions]

**Icons**

| Icon | Lucide name | Usage |
|---|---|---|
| [description] | [name or "SVG — check Figma layer"] | [where used] |

---

[Repeat for each screen]

---

### Configuration states
*(Three states always required — must be visually distinct)*

| State | API flag | What to show |
|---|---|---|
| Not enabled by school | `UNAVAILABLE_NOT_ROLLED_OUT` | TBD |
| Turned off for parent | `UNAVAILABLE_NOT_AVAILABLE` | TBD |
| Enabled, no content yet | *(standard empty state)* | [describe] |

---

### Error states
[Describe designed error states, or flag as TBD if not yet designed]

---

### Out of scope for v1
[Pull from CLAUDE.md out-of-scope list, filtered to this feature]

---

### Open questions
[Numbered list of anything unresolved — API field names, copy TBD, visual treatments TBD, implementation questions]
```

---

## Key decisions (don't relitigate these)

- Always show a screenshot per screen — it helps engineers locate the frame in Figma
- Screenshots are Figma-hosted URLs (7-day expiry) — fine for Jira, not permanent references
- Each screen section gets a permanent Figma deep-link (node URL) for the Jira ticket
- Never post to Jira without Anna's explicit confirmation
- Configuration states section is always required — never omit or collapse the three states
- Never use disabled button states — always describe inline validation instead (per CLAUDE.md)
- Figma file key for the sitemap is always `crIX5n6nKFR5Vsvh6XpR53`
