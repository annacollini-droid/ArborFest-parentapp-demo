# Arbor Parent App — Mobile Typography Scale

Primary viewport: 390px (iPhone 14/15). All sizes use `@tonyarbor/tokens` primitives — no hardcoded values.

---

## Primitive tokens (font sizes)

| Token | Size |
|---|---|
| `--font-size-1` | 11px |
| `--font-size-2` | 13px |
| `--font-size-3` | 14px |
| `--font-size-4` | 16px |
| `--font-size-5` | 18px |
| `--font-size-6` | 22px |
| `--font-size-7` | 27px |
| `--font-size-8` | 40px |

Weight tokens: `--font-weight-regular` (400) · `--font-weight-medium` (500) · `--font-weight-semibold` (600) · `--font-weight-bold` (700)

Line-height tokens: `--font-line-height-tight` (1.25) · `--font-line-height-normal` (1.5)

---

## Mobile semantic scale (the waterfall)

| Semantic role | Token | Size | Typical weight | Line-height |
|---|---|---|---|---|
| Display | `--font-size-8` | 40px | bold | tight |
| Heading / lg | `--font-size-7` | 27px | bold | tight |
| Heading / md | `--font-size-6` | 22px | semibold | tight |
| Heading / sm | `--font-size-5` | 18px | semibold | tight |
| **Body / md** | **`--font-size-4`** | **16px** | **regular / medium** | **normal** |
| Micro / md | `--font-size-3` | 14px | regular | normal |
| Micro / xs | `--font-size-1` | 11px | regular | tight |

`--font-size-2` (13px) is the Arbor desktop body size. It is not used on mobile.

Display (40px) is reserved for hero numbers and large data callouts — not general headings.

---

## Navigation header patterns

Two distinct patterns exist in the app. They are different sizes because they represent different levels of hierarchy.

### Pattern A — Screen title
Back arrow (left) + left-aligned title. Used when entering a top-level section.

| Token | Size | Weight |
|---|---|---|
| `--font-size-5` | 18px | semibold |

**Examples:** Clubs · Absences · Wraparound care · Trips · My bookings & orders

### Pattern B — Workflow step header
Back arrow (left) + centred title + close (right). Used for steps within a flow.

| Token | Size | Weight |
|---|---|---|
| `--font-size-4` | 16px | semibold |

**Examples:** Club details · Choose sessions

---

## Content section headings

Prominent headings within a screen body — not nav chrome.

| Token | Size | Weight |
|---|---|---|
| `--font-size-4` | 16px | bold |

**Examples:** Report an absence · Previous absences · About this club

The size matches Pattern B but bold weight (700 vs 600) distinguishes content headings from workflow headers.

---

## Line-height rule

| Size | Rule |
|---|---|
| 18px and above | `--font-line-height-tight` (1.25) |
| 16px and below (running text) | `--font-line-height-normal` (1.5) |
| 14px UI labels | tight; normal only if the label wraps |

---

## What to avoid

- Do not use `--font-size-2` (13px) on mobile — this is the Arbor desktop body size.
- Do not use 17px, 15px, 20px, or any size not in the primitive token set.
- Do not hardcode hex colours or px values — always reference a token.
- Do not use disabled button states — keep buttons active and show inline errors instead.
