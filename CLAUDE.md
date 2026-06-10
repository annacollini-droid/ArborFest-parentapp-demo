# Arbor Parent App — Prototype Context

This is the working prototype for Arbor's Parent App 2.0, built by Anna Collini (Senior Product Designer).
Used for team sharing, stakeholder review, and user testing. Not production code.

---

## Tech stack

- React / JSX
- Tailwind CSS — **core utility classes only**, no custom config
- No backend — all data is mocked

---

## Mock data — always use the Collini family

| Role | Name |
|---|---|
| Parent | Kate Brown |
| Child 1 | Molly |
| Child 2 | Lucas |
| Child 3 | Ethan |
| Schools | Oakwood Primary, Oakwood Secondary |

Never invent other names. Use this family consistently across all screens and flows.

---

## App structure

Four-tab bottom navigation:

| Tab | Contents |
|---|---|
| Home | Coming Up, To Do (consent notices), household summary |
| My Child | Child-specific academic/pastoral info, Absence Reporting |
| Book & Pay | Clubs, Trips, Meals, Basket |
| Messages | Parent-to-school messaging |

Profile/settings: half-height sheet accessed from Home. Contains "Account & settings" card, "Children's details" card, and Log out. Not a fifth tab.

---

## Key constraints to respect in every build

### Multi-child
- v1 is single-child at a time — no "all children" views
- Child switcher exists; each request is tagged to the active child
- Content must be clearly attributed to the right child when displayed

### School config states — three are always possible per feature
Every feature can be in one of three states. These must be visually distinct:

| State | API flag | What to show |
|---|---|---|
| App not enabled by school | `UNAVAILABLE_NOT_ROLLED_OUT` | [visual treatment TBD] |
| Feature turned off for this parent | `UNAVAILABLE_NOT_AVAILABLE` | [visual treatment TBD] |
| Feature on but no content yet | *(standard empty state)* | Empty state with appropriate CTA |

Never collapse these three into one generic "unavailable" state.

### Payments / checkout seam
Clubs, Trips, Meals, and Basket all hand off to a Voyager-built 3rd party checkout (arriving July 2026, branded to Arbor). Do not tightly couple payment flows to a specific checkout UI — design to a clear handoff point.

### Basket — two item types with different behaviour
| Type | Examples | Behaviour |
|---|---|---|
| Non-space-reserving | Meal top-ups | Persists indefinitely, no expiry |
| Space-reserving | Clubs, Trips | 24hr expiry from time added. Persists if app minimised or user navigates within app. On return after expiry: show expiry message, offer re-add if space available |

### Basket — "Add to basket" placement rule
The basket is a **checkout** concept: it collects items so the parent can pay for them in one go at the Voyager checkout. "Add to basket" therefore only appears on flows whose final commit step is a real payment going through checkout.

| Flow type | Final commit step | "Add to basket"? |
|---|---|---|
| Paid Clubs, Trips, Meal top-ups | External checkout (card / Apple Pay) | **Yes** — alongside the "Pay now" / "Continue to payment" CTA |
| Free Clubs | Direct confirm (no checkout) | **No** — nothing for the basket to collect |
| Wraparound bookings (any state) | Wallet reconciliation — deduction, soft-warn arrears, or hard-block top-up | **No** — wraparound never goes through checkout |

Two tests for any new flow:
1. **Does the final tap take a real payment through the checkout?** If no, no basket.
2. **Is the screen one tap away from that final commit?** If no (top-up first, separate form, intermediate confirmation), no basket — it implies a deferrable state the parent hasn't reached yet.

### Viewport
Primary design width is 390px (iPhone 14/15). Occasionally verify at 375px (iPhone SE) for anything with tight horizontal layouts — pill filters, multi-column grids, long labels.

---

## Clubs — session picker variants

| Variant | Pattern | When to use |
|---|---|---|
| S1 | Checklist | Default single-session picker |
| S2 | Checklist with time pills | Sessions with meaningful time variants |
| S3 | Week grid, 1 row | Breakfast and after-school clubs |
| S4 | Week grid, 2 rows, radio select | Breakfast/after-school with AM/PM split |

Breakfast and after-school clubs always use S3 or S4.

---

## @tonyarbor tokens and components

### Tokens
`@tonyarbor/tokens` CSS variables are imported globally in `main.jsx`. They are available everywhere — use them instead of hardcoded hex values.

**Never hardcode hex values.** Always map to a token:

| Instead of | Use |
|---|---|
| `#fff` | `var(--color-white)` or `var(--color-bg-primary)` |
| `#222`, `#333` | `var(--color-text-primary)` |
| `#666` | `var(--color-text-secondary)` |
| `#888`, `#bbb` | `var(--color-text-tertiary)` |
| `#eee`, `#ddd` | `var(--color-border-default)` |
| `#f5f5f5` | `var(--color-bg-secondary)` |
| Brand green | `var(--color-brand-600)` |
| Error red | `var(--color-text-destructive)` |

Use Tailwind utilities for layout and spacing where they map cleanly. Use `var(--token-name)` in inline styles for semantic colours.

### Component selection — decision tree

For every UI element when building a new screen:

1. **Does a `@tonyarbor` component exist?**
   - Yes → Is it mobile-fit (works at 390px, appropriate touch targets, no hover-only states)?
     - Yes → Use it.
     - No → Flag: *"Component X exists but is desktop-only — building a custom mobile variant using tokens instead."*
   - No → Flag: *"No suitable `@tonyarbor` component for [X]. Gap for Tony's library. Building custom using tokens."*

### Mobile fitness — quick reference

**Use these:**
`Button`, `Input`, `TextArea`, `Checkbox`, `Radio`, `Toggle`, `Tag`, `Banner`, `Avatar`, `Card`, `Tabs`, `ListRow`, `ListRowMultiLine`, `ButtonSegmented`, `DatePicker`
`Combobox` — use with care, test dropdown positioning at 390px.

**Desktop-only — skip, build custom with tokens:**
`TopNavBar`, `SideNavBar`, `SideNavButton`, `SideNavItem` — sidebar nav, not mobile.
`Table`, `TableControls`, `TableFooterPagination` — data grids don't work at 390px.
`Pagination` — desktop pattern; mobile uses "Load more".
`Breadcrumbs` — no place on a phone screen.
`Modal` — hardcoded 584px width; mobile needs full-screen sheets or bottom drawers.

### Retrofitting existing code
**Fix-forward rule:** Do not sweep the whole file. When touching a section for any reason, align its hardcoded hex values to tokens at the same time. New screens must use tokens from the start.

---

## Design patterns — be consistent

- **Reductive pill filters** — used in Browse, Messages, Bookings. Add, don't replace.
- **Progressive disclosure** — show the most critical info first; reveal complexity on demand.
- **No partial flows** — if a workflow is being prototyped it should be end-to-end complete.
- **Actionable insight, not raw data** — surface what the parent needs to know, not raw MIS values.

---

## Icon semantics — three tiers

Icons earn their place by doing semantic work. Before adding one, place it in a tier:

| Tier | When | Treatment |
|---|---|---|
| **A — door** | Icon links to a distinct area or feature | `var(--color-brand-600)` icon in a `var(--color-brand-050)` rounded square (the green icon-square) |
| **B — label** | Icon identifies *which* of a set (e.g. which wallet a balance funds) | Plain icon, no background square |
| **C — none** | Card is a lens/view over the context you're already in, or a singleton with nothing to differentiate | No icon |

- The green icon-square is a **signal meaning "this takes you into an area,"** not decoration. Reserve it for Tier A doors only. (Other `brand-050` uses — selected booking cards, home gradient, positive-amount tx pill — are not this pattern.)
- The load-bearing test is **"door to another area" vs "lens on the current context."** Absences (a distinct My Child feature) keeps its green square; Bookings & orders (a filtered view of the Book & Pay tab you're already in) gets no icon — even though both are structurally nav-cards-to-a-sub-page.
- Tier B glyph choice for balances follows the "match the in-app purchase surface" rule (Meals → `Utensils`, Wraparound → `SunMoon`, Milk → `ShoppingBag`).

---

## Nav header patterns

Four patterns. Pick the right one based on the screen's role — every screen must match one of them.

### Pattern A — Workflow start (chromeless)
- **Surface:** `var(--color-grey-050)`
- **Chrome:** back (left) + close (right) icons, **no title**, no shadow
- **Use for:** the entry screen of a flow — the content-immersive detail page that sets up the task (e.g. Club details, Wraparound after-school details, Breakfast details)
- **Why no title:** the screen's H2 (e.g. "Breakfast club / For Molly") sits inside the first card. Duplicating it in chrome is noise.

### Pattern B — Workflow step
- **Surface:** white nav bar with `boxShadow: "0 1px 0 rgba(0,0,0,0.06)"`
- **Chrome:** back (left) + centred title (`var(--font-size-4)` / 16px semibold) + close (right)
- **Use for:** any step *inside* a flow that isn't the entry or the terminal state — choose-sessions, review-booking, payment, top-up, compose, report-an-absence
- **Title content** — two acceptable kinds, pick one per screen:
  - **Subject-focused**: name of the thing being acted on + "For {child}" — e.g. "Breakfast club / For Molly". Use when the step is specific to a single subject the user is moving through the flow.
  - **Function-focused**: name of the step itself — e.g. "Review your booking", "Payment details", "New message". Use when the step is interchangeable / context-free.
- **Close = abandon the flow.** Always include it.

### Pattern C — Sub-page within a tab
- **Surface:** white nav bar with `boxShadow: "0 1px 0 rgba(0,0,0,0.06)"`
- **Chrome:** back (left) + **left-aligned** title (`var(--font-size-5)` / 18px semibold), **no close**
- **Use for:** navigating between sub-pages of a tab — Bookings & orders, Browse, Messages thread, Absences page
- **No close** because you're not in a flow. There's nowhere to "abandon" to — you're inside a tab.

### Pattern D — Terminal screen (success / confirmation)
- **Surface:** `var(--color-grey-050)` (never white)
- **Chrome:** close (right) only — no back, no title
- **Use for:** success / confirmation screens (Booking confirmed, Absence reported)
- **No back** because terminal actions aren't reversible. **No title** because the success H2 belongs in the content.

### Quick decision tree

1. Is this a tab root? → No nav header. (Exception: Messages root has an inline 22px page title, kept because the schools picker is only shown for multi-school households.)
2. Is this a *terminal* screen (something just succeeded)? → **Pattern D**.
3. Is this the *entry* screen of a flow with rich content? → **Pattern A**.
4. Is this a step *inside* a flow? → **Pattern B**.
5. Otherwise — navigating between sub-pages of a tab — **Pattern C**.

---

## UI Changes

When modifying UI components, always confirm the exact file path and component name with the user before making changes. Read the target file first to verify it's the correct page/component.

---

## Debugging

When fixing CSS overlay/positioning issues, always test that interactive elements (buttons, clickable areas) remain accessible. Check z-index stacking and pointer-events explicitly.

---

## Accessibility

Never use disabled button states. Disabled elements are inaccessible to screen readers. Instead, keep buttons active and show an inline error message when the user taps without meeting the requirements (e.g. no session selected).

---

## Decision log

All significant design and technical decisions must be appended to `DECISIONS.md` in this format:

```
[Date] [Feature area]
Decision: [what was decided]
Rationale: [why, including alternatives considered]
```

When Anna makes a decision during a session, offer to append it to DECISIONS.md.

---

## Out of scope for v1 — don't build these

- Multi-child views / "do this for all children" flows
- Push notification time customisation
- Search, filtering, or sorting on Clubs or Trips
- Cancellation of club or trip bookings
- Attachments on messages
- Dietary/allergen support in Meals
- Payment history in any feature
- Offline support, Dark Mode, Windows support
