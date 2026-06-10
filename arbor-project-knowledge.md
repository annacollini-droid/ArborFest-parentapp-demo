# Arbor Parent App — Project Knowledge Base

_Last updated from Confluence: 2026-04-02_

---

## Who I am

Anna Collini, Senior UX/IA Specialist at Arbor Education (anna.collini@arbor-education.com). Designing and building the parent-facing mobile app from scratch — Parent App 2.0. Team name: **Team Appollo**. PM: **Drew Pountney** (drew.pountney@arbor-education.com).

Work spans IA, interaction design, and high-fidelity prototyping. Prototype built in Cursor using Claude Code (React/JSX, Tailwind CSS).

Key stakeholder: Head of Design → consolidates updates for CPO, CEO, CTO.

---

## The product vision

**"Connecting you to your child's education."**

Shift from data viewer to parental reassurance platform. Current app feels like a data management tool — out of date vs consumer products like Uber/Deliveroo. Problems: school friction, brand erosion, market barriers (can't penetrate Independents or Nurseries).

**Target launch:** End of Autumn 2026 (lower estimate ~mid Sep 2026, upper ~mid Jan 2027).

### Product principles (official)

1. **Be Bold** — take the more radical path
2. **Consumer UX** — native mobile feel; joy from day 1; move complexity away from the user (don't repeat actions for multiple children)
3. **Navigation will be easy** — intuitive and scalable
4. **Login will have zero problems** — single biggest current issue
5. **Actionable insights not data** — tell parents what they need to know, no interpretation required
6. **AI native** — use AI where it genuinely improves UX
7. **API first** — design APIs for internal and external use
8. **Comprehensive** — match Arbor's platform play over time (not v1)

---

## Target audience — v1

- School MIS customers (Comms and Perform tiers), new and existing, all phases
- **English language only** (v1)
- Mobile: optimised iOS and Android. Tablet: responsive, not optimised. Not Windows.
- **Primary school parents are the primary design focus for v1 scope decisions.**

---

## v1 Baseline Scope — overview

Functional priority order:
1. Coming Up
2. Clubs
3. Meals
4. Messages (from AND to school)
5. Trips
6. Absence Reporting
7. Basket

Plus Unavoidable Basics (Login/Auth, Child Switcher, Navigation & Homepage, Parent Profile, School Config) and Enablers (Technical Foundations, Success Metrics & Feedback, Customer Guidance).

See per-feature scope detail below.

---

## Unavoidable Basics — scope detail

### Login and Authentication
- MFA expected as part of solution (confirmed by InfoSec/Lloyd)
- Password expiry removal approved by InfoSec
- Habitude team have a reusable pattern as short-term fallback if Single Identity Service not ready in time
- Needs mapping with back-end Engineer — not a blocker for starting dev, only at release
- **Out of scope for v1:** not yet specified in detail beyond auth flows

### Child Switcher
- Authentication happening at school level — if two children at same school, easy switch
- Each request is tagged with child; on child switch the tag value changes
- **Out of scope for v1:** all-children/multi-child view (single child at a time for v1)

### Navigation and Homepage
- Four-tab bottom nav: Home, My Child, Book & Pay, Messages
- Bottom nav **may disappear on some screens** (per engineering advice from Stephen)
- **"Coming soon" placeholders** for major capabilities not yet built, where a school has the feature switched on
- Schools may turn features on/off at any time — nav may change accordingly
- Design considerations noted by Drew for Anna:
  - Areas like Behaviour/Attainment will likely be delivered as something significantly different from current experience (e.g. AI-powered student summary), not a direct port
- **Out of scope for v1:** personalised navigation, scrollable bottom bar, side sheet variants

### Parent Profile
- Single scrollable screen (no sub-pages)
- Accessed via half-height sheet from Home (not a fifth tab)
- Sheet contains: "Account & settings" card + "Children's details" card + Log out
- **Out of scope for v1:** notification time customisation, dark/light mode toggle, language change (all noted as future)
- API endpoint needed for changing login credentials

### School Config

**This is a critical design constraint — three states exist for every feature:**

| State | Confluence name | Meaning |
|---|---|---|
| App not enabled | `UNAVAILABLE_NOT_ROLLED_OUT` | School has not enabled the new parent app at all |
| Feature not available to parent | `UNAVAILABLE_NOT_AVAILABLE` | App is enabled, but this specific feature/module is turned off for this parent by school settings |
| Feature available but empty | *(standard empty state)* | Feature is on, parent can access it, but no content exists yet |

These three states must be visually and behaviourally distinct. **[TO BE DESIGNED — the visual treatment for each state]**

Additional design constraint: schools can turn features on/off at any time, so the nav/tab state may change between sessions.

**Out of scope for v1:** decommissioning of current Parent Portal settings (stays until portal is sunset), enforced settings, more granular functional settings

---

## Functional Capabilities — scope detail

### Coming Up

**What it is:** Brand new functionality. Solves the #1 emotional parent need heard in research: "I don't remember key dates or what's coming up." Key adoption driver while other features are still being built. High design risk.

**What's in scope:** To be determined through design exploration — solution options include calendar view, list view, homepage "Today" actions + separate "Coming Up" nav item, calendar subscribe/sync. 2–3 sprints budgeted, later in the sequence to give design time to explore.

**Design constraints:**
- Upstream content (dates, events) comes from existing MIS data — no new data sources in v1
- Innovation potential: use AI to make Coming Up "smart" from day 1 using current data

**Explicitly out of scope for v1:**
- "All children" view (single child only)
- Push notification time customisation
- Additional notification types beyond what's scoped
- Historical dates (upcoming only, not past)
- School control over what appears
- Proactive functionality (e.g. "bring packed lunch", detecting changed items, collecting from emails/newsletters/WhatsApp)

---

### Clubs

**High design risk.** Multiple parent mental models: browse vs book vs manage. Time-bound with deadlines. Overlaps with Trips and Coming Up.

**Session picker variants (established design system):**

| Variant | Description | When to use |
|---|---|---|
| S1 | Checklist | Default single-session picker |
| S2 | Checklist with time pills | Sessions with meaningful time variants |
| S3 | Week grid (1 row) | Breakfast and after-school clubs |
| S4 | Week grid (2 rows, radio select) | Breakfast/after-school with AM/PM split |

Breakfast and after-school clubs always use S3 or S4.

**Important design constraint — new checkout coming:**
Voyager are delivering a new checkout as part of PCI compliance work by July 2026. It will be a 3rd party experience branded to Arbor. This affects the Clubs (and Trips, Meals, Basket) payment flow — design should account for this seam.

**Explicitly out of scope for v1:**
- Search, filtering, sorting on clubs
- Push notification time customisation or additional notification types (e.g. "new club available", "bring your instrument")
- Booking the same club for another child without repeating the process
- Calendar subscribe (Coming Up handles in v1)
- Cancellation of club booking (parent must contact school)
- Registering interest when a club is full
- Payment history for clubs
- Multi-child mental model support ("I want something for my daughter on Thursdays")
- AI-assisted booking

---

### Meals

**Medium design risk.** Topping up balances is straightforward; meal selection is high repetition and cognitive load.

**What's in scope:**
- Browse and select meal choices by week (grouped-by-week row pattern)
- Bulk choice (confirmed for v1 — replaces default choice which was cut in scope trim)
- Meal account balance top-up
- Clear cut-off information for choices
- Empty state when no menus or choices exist

**Key data insight (from March 2026 research):**
- Only 23% of primary school customers have at least 1 menu set up (2,208 of 9,672 active primaries)
- Most menus have fewer than 10–20 choices
- ~40% of primaries and ~40% of secondaries have a meal account set up for top-up

**Design constraint — new checkout:** Same PCI-compliance checkout change applies here (Voyager, July 2026).

**Explicitly out of scope for v1:**
- Push notification time customisation
- Confirming choices for multiple children simultaneously
- Handling two parents of same child making choices at the same time
- Paying once and distributing to different wallet pots
- Dietary requirements / allergen support (MIS doesn't support this in the data structure)
- Veg/meat or variable option visualisation (MIS data is free-text only)
- Payment history, auto top-up, auto-release of funds
- Default/repeat choice (cut in scope trim; bulk choice is the v1 solution)

---

### Messages

**Low design risk** (established pattern).

**How the underlying MIS system works — critical design constraints:**
- School-level setting 1: enables in-app messages at all (`In-app messages: Yes/No` in Parent Portal Settings)
- School-level setting 2: controls whether parents can send/reply (`Accept messages from Guardians`)
- Messages route to a **shared MIS inbox** — not a specific teacher's inbox
- School staff notified via email or Arbor dashboard alert (configurable: by role, or specific staff member)
- Parent receives a **push notification** when school replies — no email copy, stays entirely in-app
- Interface is **email-style threaded** — NOT live chat (no typing indicators, no online status)
- Each reply is a separate audit record in MIS but visually grouped in thread view for the parent
- In-App Message Subject Field is being added as a dependency (contract engineer, March 2026)

**Design decisions made:**
- School picker first (messages scoped by school, not by child)
- Inbox: reductive pill filters
- Compose entry point: pencil icon in header (not a fixed bottom button)
- Replies controlled by per-school `repliesEnabled` flag
- Placeholder copy before school responds: "Add a message..." — neutral
- Parent-initiated threads live in Sent tab; inbox shows school-initiated only; reply threads are sub-views

**Explicitly out of scope for v1:**
- Offline viewing of messages
- Attachments on messages (requires MIS change)
- Search messages
- Additional message filters
- Archive or delete messages
- Choosing a target recipient when sending a new message
- Changes to school inbox, routing, or notification settings
- Additional statuses (sent/unsent/resolved etc.)
- Live chat style (read receipts, typing indicators)
- Email notifications for in-app messages

---

### Trips

**High design risk.** Consent + payment + deadlines create anxiety. High consequences if misunderstood. Appears both as an event and as an actionable commitment.

**Design goal:** Clear end-to-end flow (understand → decide → act). Reduce cognitive load around consent and payment.

**Design decisions made:**
- Progressive disclosure for year-group selector
- Amber inline callout for future-year trip scenarios
- Notification-based copy: review burden sits with system, not school staff

**Design constraint — new checkout:** Same PCI-compliance checkout change applies here (Voyager, July 2026).

**Explicitly out of scope for v1:**
- Push notification time customisation or additional notification types (e.g. "new trip available", "space became available", "bring your kit")
- Booking the same trip for another child without repeating the process
- Calendar subscribe (Coming Up handles this)
- Cancellation of trip booking (parent must contact school)
- Additional trip fields in MIS e.g. dedicated kit list field (requires MIS changes)
- Waiting list / registering interest when trip is full
- Payment history for trips
- Multi-child/mental model support ("I want a history trip")

---

### Absence Reporting

**Medium design risk.** Emotionally sensitive, simple mental model, low tolerance for error.

**Design goal:** Clear, calm flow. Reassurance that information has been received. Minimal interaction complexity.

**Explicitly out of scope for v1:**
- Image upload
- Reporting absence for multiple children simultaneously
- Populating the absence reason code on behalf of school (unless auto-absence logic)
- In-app confirmation when absence is accepted or rejected by school
- Notifying parent that stakeholders (e.g. tennis coach, trip organisers) have been informed
- Editing a previously submitted multi-day absence
- Auto-absence style "assuming" a reason code
- Push notifications: absence prompts, school acceptance/rejection alerts, absent-on-register alerts

---

### Basket

**Scope trim applied:** Reservation-while-in-basket removed; space confirmed at payment (pre-checks done at checkout step).

**Critical design logic — two types of basket item:**

| Type | Behaviour |
|---|---|
| **Non-space-reserving** (e.g. meal top-ups) | Persists in basket indefinitely even if app is closed/quit. No expiry. |
| **Space-reserving** (e.g. clubs, trips) | 24-hour expiry per item, calculated from when added. Persists if app minimised or user navigates away within app. If app is closed and user returns after expiry: inform of expiry, offer to re-add if space still available, or inform if space gone. |

**Why basket is in scope:** multi-item payment was a major parent frustration in the current app (and historically defect-prone). Basket also starts "All children" support — paying for items for multiple children in a single transaction.

**Design constraint — new checkout:** Voyager's PCI-compliance checkout applies here too (July 2026).

**Explicitly out of scope for v1:**
- School shop item payments
- Partial basket value payments
- Transaction history for basket (covered in each functional area)
- AI-powered basket (adding items via AI assistant)

---

## Enablers — scope detail

### Technical Foundations
- OTA (over the air updates): **cut from v1 scope** in scope trim — reduces build complexity, can be added later, doesn't affect future implementation

### Success Metrics and Feedback
- Basic in-product feedback (targeted, customisable, post-action or time-based prompts)
- Gainsight PX integration being pursued (potential to replace 3,500 SLT users with parent users in Gainsight)
- **Out of scope:** image attachments in feedback, full custom forms

### Customer Guidance — open design decision
Anna's area. What to show when a feature exists in Arbor but isn't built yet in the new app.

**Options being considered:**
1. Simple "coming soon" markers — title only
2. Placeholder pages — elaborate on the vision for that area
3. Link out to the current portal in browser

**Anna's concerns about linking to portal:**
- Reputational damage — jarring experience difference
- Would complicate basket (users shouldn't be bouncing between app and portal mid-payment)
- Re-authentication needed (engineering may be able to handle)

**Arguments for linking:**
- Parents have to go to the portal anyway for things not yet in the new app
- Transparency reduces school enquiries
- Schools more likely to adopt new app if there's an escape hatch

**Decision:** still open — Anna to include in school research to validate which is a better experience.

**No dedicated onboarding experience** — focus on usability testing to make flows intuitive. Research shows dedicated onboarding is only effective in three scenarios none of which apply here: fintech (legal obligation), data-required apps, truly novel interaction patterns.

---

## Dependencies — status

| Dependency | Owner | Status / Timeline |
|---|---|---|
| Platform Setup | Platforms team | TBC by perm back-end engineer — **critical** |
| Single Identity Service | Ecosystem team | Unclear timeline; Appollo building fallback — **high** |
| Payments Stabilisation | Team Voyager | By Parent App release (~14 Sep 2026) — **critical, no fallback** |
| New Checkout (PCI compliance) | Team Voyager | By July 2026 — affects Clubs, Meals, Trips, Basket flows |
| Save Card Details | Team Voyager | By July 2026 via new checkout — **medium** |
| Remove Password Expiry | Appollo | Part of Login & Auth work — **high** |
| In-App Message Subject Field | Appollo | Contract engineer, March 2026 — **medium** |
| Gainsight PX | Appollo | TBC |

**Key design implication:** The new Voyager checkout will be a 3rd party experience branded to Arbor. All payment flows (Clubs, Meals, Trips, Basket) need to account for this handoff point — design should not tightly couple the pre-checkout flow to a specific checkout UI.

**Single Identity Service — fallback:**
If Ecosystem don't deliver, Appollo builds its own temporary mobile auth solution. The L/XL estimate (4–6 sprints) for Login & Auth already includes this fallback. Needed by end of July / mid August 2026 to allow 2–4 sprints of integration before target release.

**Payments Stabilisation — known issues being fixed by Voyager:**
- Parents charged incorrectly on basket during top-up (in scope, tentative: end of this term)
- Parents charged twice on clubs/trips basket, multiple invoices generated (in progress)
- Basket checkout timeout for students with lots of historic top-ups (in scope, later stage)
- Meal payment failure due to floating-point rounding error (in scope, likely quick fix)
- Sibling's meal choice blocked if other sibling has top-up in basket (out of Voyager scope for now — low report volume)

---

## Design philosophy

- **Household-first, child-specific when needed.** Default view is household; drill into child context only when content is genuinely child-specific.
- **Minimal navigation layers.** Single-scroll over multi-step where possible.
- **Pattern consistency.** Reductive pill filters across Browse, Messages, Children. Establish a pattern once, apply it everywhere.
- **Progressive disclosure.** Critical info first; complexity revealed only when needed.
- **Complete workflows.** Don't ship partial flows. "Workflows chosen will be end-to-end complete."
- **Think first, build second.** Critique and UX logic before prototyping.

---

## Navigation structure

| Tab | Purpose |
|---|---|
| Home | Coming Up, To Do (consent notices, actions), household summary |
| My Child | Child-specific academic/pastoral info |
| Book & Pay | Clubs, Trips, Meals, Absence Reporting, Basket |
| Messages | Parent-to-school messaging (scoped by school) |

- Profile/settings: half-height sheet from Home (not a fifth tab)
- Sheet contains: "Account & settings" card + "Children's details" card + Log out
- Bottom nav may disappear on some screens (engineering constraint)

---

## Design risk framework (Anna's)

| Risk level | Areas | Why |
|---|---|---|
| High | Clubs, Trips, Coming Up | Multiple mental models, deadlines, new functionality, anxiety-inducing |
| Medium | Meals, Attendance, Home, Navigation | Known patterns but specific interaction/emotional risks |
| Low | Parent Profile, Child Switcher, Login, Messages | Established patterns, low uncertainty |

High-risk areas get earliest concentrated design effort. Low-risk areas designed late, won't block high-risk work. This reflects uncertainty, not importance.

---

## Roadmap phases

| Phase | Content |
|---|---|
| **Now — Deliver v1** | Foundation for primary school parents + 1 significant innovation (Coming Up) |
| **Next — Close Functionality Gap** | School shop, order history, behaviour/attendance/timetable, invoice visibility, Parents Evenings, all notice types, school preview of app, decommission old app |
| **Later — Multi-Child Support** | One action covers multiple children (absence, clubs, meals, top-up etc.) |
| **Later — Optimisations / New Capabilities** | Enhanced notifications, cancellations, additional languages, meal allergens, universal inbox (all message types), payment splits, AI features |

**Ruled out for now:** Offline support, Dark Mode, Windows device support.

---

## Mock data — the Collini family

Use consistently across all prototypes:

- **Parent:** Anna Collini
- **Children:** Molly, Lucas, Ethan
- **Schools:** [TO BE FILLED IN — same school / different schools?]

---

## Always check — design review checklist

Run against every screen, flow, or component.

### Multi-child / multi-school
- [ ] How does this work with multiple children at the **same school**?
- [ ] How does this work with children at **different schools**?
- [ ] Is child-specific content clearly attributed?
- [ ] Does the household view aggregate correctly?
- [ ] Have we avoided repeating actions for multiple children where possible?

### School configuration states
- [ ] **App not enabled** (`UNAVAILABLE_NOT_ROLLED_OUT`): school hasn't turned on the new app — handled?
- [ ] **Feature not available to parent** (`UNAVAILABLE_NOT_AVAILABLE`): school has turned off this specific module — handled? [Visual treatment TO BE DESIGNED]
- [ ] **Feature empty**: feature is on but no content exists — standard empty state with CTA?
- [ ] Are all three states visually distinct from each other?

### Payments / checkout
- [ ] Does this flow account for the Voyager new checkout handoff point (arriving July 2026)?
- [ ] For basket items: is this space-reserving (24hr expiry logic) or non-reserving (no expiry)?

### General UX
- [ ] Does this pattern match existing patterns in the app?
- [ ] Household-first hierarchy maintained?
- [ ] Progressive disclosure applied?
- [ ] CTAs clear about what happens next?
- [ ] Works on iPhone SE viewport?
- [ ] Giving actionable insight, not raw data?

---

## Prototype — technical context

- **Cursor + Claude Code**, React/JSX, Tailwind CSS (core utility classes only)
- Used for team sharing, stakeholder review, user testing
- Decision log: `DECISIONS.md` at project root

**DECISIONS.md format:**
```
[Date] [Feature area]
Decision: [what was decided]
Rationale: [why, including alternatives considered]
```

---

## Sprint context

**Sprint 1** (25 Mar – 8 Apr 2026): Parent can navigate the app — global elements, landing pages for all tabs (Home, My Child, Book & Pay, Messages, Parent Profile). Navigation structure locked this sprint.

---

## Thursday update — format guide

Weekly note to Head of Design. High-level, links where relevant, appropriate for CPO/CEO/CTO.

```
Week of [date]

What I worked on:
- [Item — description + link]

What's next:
- [Item]

Blockers / decisions needed:
- [If any]
```

---

## Key Confluence pages

Space `AMOB` — https://orchard.atlassian.net/wiki/spaces/AMOB/

| Page | Link |
|---|---|
| PDS: Parent App 2.0 | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2461958188 |
| Parent App Product Principles | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2394751027 |
| Parent App Roadmap | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2495643805 |
| v1: Baseline Scope Summary | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2376564780 |
| v1: Scope for Functional Capabilities | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2394751043 |
| v1: Scope for Unavoidable Basics | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2390818859 |
| v1: Scope for Enablers | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2394652709 |
| v1: Scope for Dependencies | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2458452033 |
| v1: Success Metrics | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2484928519 |
| Defining the Navigation Structure | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2494955597 |
| Design risk strategy for V1 | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2416410687 |
| Sprint 1: Parent can navigate the app | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2517991511 |
| Parent App Settings | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2382004358 |
| Summary of General Parent Interviews | https://orchard.atlassian.net/wiki/spaces/AMOB/pages/2377547841 |

---

## Open decisions / things still to fill in

- [ ] Collini family school allocation (same school vs different schools?)
- [ ] Visual/interaction design for the three School Config states (not rolled out / not available / empty)
- [ ] Customer Guidance decision: "coming soon" markers vs placeholder pages vs portal linking — pending school research
- [ ] Messages: send/delivery state behaviour (loading → success → error)
- [ ] Messages: delivery status indicators
- [ ] Child switcher: persistent or contextual?
- [ ] Add more as design progresses

---

*Living document. Update as decisions are made. When in doubt, refer to it rather than re-deciding.*
