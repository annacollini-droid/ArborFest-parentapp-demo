# Update Sitemap

Updates the Arbor Parent App 2.0 sitemap in Figma to reflect the current state of the prototype.

## How to invoke
Type `/update-sitemap` after making structural changes to the prototype.

---

## Process

1. **Read the prototype** — scan `src/ParentApp.jsx` (and any other .jsx files in `src/`) to identify screens, flows, sheets, and navigation structure
2. **Diff against the baseline** — compare what you find against the Current Sitemap Structure below
3. **Propose changes** — list what's been added, removed, or renamed. Ask Anna to confirm before touching Figma
4. **Update Figma** — delete the existing frame (`Sitemap v2 — Fresh`) and rebuild using the same code pattern established in this project (use_figma tool, Plugin API, column-per-tab layout)
5. **Update this file** — after Anna confirms the changes, update the Current Sitemap Structure section below to reflect the new state

---

## Figma file
- **File key:** `crIX5n6nKFR5Vsvh6XpR53`
- **Frame name:** `Sitemap v2 — Fresh`
- **URL:** https://www.figma.com/design/crIX5n6nKFR5Vsvh6XpR53/Parent-App-2.0-Sitemap

---

## Visual conventions

| Style | Meaning |
|---|---|
| Solid fill + bold border | Primary screen / nav destination |
| Light fill + thin border | Sub-screen or section |
| Text only, no box | Action (e.g. Log out) |
| `[Bottom sheet]` in label | Sheet overlay — uses same solid style, NOT dashed |

**Never use dashed borders.** Dashed was a mistake made in an earlier iteration.

---

## Numbering conventions

- Hierarchical decimal notation per section prefix
- Children use decimal: `PROF-01.2.1` is a child of `PROF-01.2`
- Root/entry screens get `-00`
- Actions (Log out) get no number
- Tab filters within a screen (e.g. Inbox/Sent, Needs Attention/Upcoming/Past) are **not** given screen IDs — they are content states, not destinations
- Bottom sheets in the label use `[Bottom sheet]` suffix — they are not separate screen IDs unless they have meaningful sub-screens

---

## What to include / exclude

**Include:** screens you navigate *to* (distinct back-stack entries)
**Exclude:** tab filters, toggle states, loading/error states, inline interactions

---

## Current sitemap structure

### HOME
```
HOME-00  Home dashboard
  HOME-01  To Do
             Consent notices
             Alert cards
  HOME-02  Coming Up
             Upcoming events
```

### MY CHILD
```
CHILD-00  My Child
  CHILD-01    Children's Details
  CHILD-01.1  Consent Notices
  CHILD-01.1.1  Consent Detail [Bottom sheet]
  CHILD-02    Absence Reporting
  CHILD-02.1    Absence List
  CHILD-02.2    Report Absence
  CHILD-02.3    Absence Confirmed
```

### BOOK & PAY
```
BP-00  Book & Pay
  BP-01    Meal Account
  BP-01.1    Top Up
  BP-01.1.1    Top Up Confirmed
  BP-02    Wraparound Care Account
  BP-02.1    Top Up
  BP-02.1.1    Top Up Confirmed
  BP-03    Clubs
  BP-03.1    Browse Clubs
  BP-03.1.1    Detail
  BP-03.1.2    Choose sessions
  BP-03.1.3    Payment [Bottom sheet]
  BP-03.1.4    Confirmation
  BP-04    Wraparound Care
  BP-04.1    Browse Wraparound
  BP-04.1.1    Detail
  BP-04.1.2    Booking options
  BP-04.1.3    Choose dates
  BP-04.1.4    Payment
  BP-04.1.5    Card entry [Bottom sheet]
  BP-04.1.6    Confirmation
  BP-05    Trips
  BP-05.1    Trip Detail
  BP-06    Parents' Evenings
  BP-07    Meals
  BP-08    School Shop
  BP-09    My Bookings & Orders
  BP-09.1    Booking Item Detail
```

### MESSAGES
```
MSG-00  Messages
  MSG-01    School List [P3 only]
  MSG-02    Message List
  MSG-02.1    Message Detail
  MSG-03    New Message [Bottom sheet]
```

### PROFILE & SETTINGS
```
PROF-00  Profile & Settings [Bottom sheet]
  PROF-01    Account & Settings
  PROF-01.1    Your Details
  PROF-01.2    Log in & Security
  PROF-01.2.1    Change Password
  PROF-01.2.2    2FA Setup
  PROF-01.3    Notifications
  PROF-01.4    Help & About
  PROF-01.4.1    Legal
  PROF-01.5    Delete Account
  PROF-02    Share Feedback
             Log out  [action — no ID]
```

---

## Key decisions (don't relitigate these)

- Children's Details lives under **My Child**, not Profile
- Consent screen removed from booking flow (no longer a separate step)
- Booking flow: Detail → (Booking options, breakfast only) → Choose dates → Payment → Card entry [Bottom sheet] → Confirmation
- Trips has not yet been given the full Browse + booking flow treatment (only Trip Detail exists) — leave as-is until the prototype builds it out
- BP-01/BP-02 (Meal Account, Wraparound Care Account) are now navigable screens — they show transaction history with a Top Up flow (full screen, not a sheet)
