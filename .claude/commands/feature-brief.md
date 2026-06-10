# Feature Brief

Reads Arbor Help Centre articles for a feature area and produces a structured design briefing — covering MIS config states, parent-visible fields, participant/booking states, pricing models, and edge cases to design for.

## How to invoke
```
/feature-brief [feature name] [help centre URL]
```
The URL can be a search results page or one or more specific article URLs.

Examples:
```
/feature-brief Trips https://support.arbor-education.com/hc/en-us/search?query=trips
/feature-brief Meals https://support.arbor-education.com/hc/en-us/articles/123456-Meals
```

If either argument is missing, ask Anna to provide it before proceeding.

---

## Process

1. **Parse arguments** — extract the feature name and URL(s)

2. **Collect articles** — if the URL is a search results page, fetch it and extract every article title and URL listed. If specific article URLs were provided, use those directly.

3. **Fetch articles in parallel** — fetch all article URLs simultaneously. Extract from each: all configuration options, fields, settings, statuses, states, edge cases, caveats, and any admin-side workflow details that would affect what a parent sees.

4. **Read context** — re-read `CLAUDE.md` to identify:
   - Which edge cases or pricing models are already marked out of scope
   - Which decisions have already been made (e.g. implied consent, no waitlists)
   - Any existing patterns that apply (e.g. session picker variants, basket behaviour)

5. **Synthesise the briefing** — produce the output below. Suppress any edge cases that CLAUDE.md already marks as out of scope or resolved. Flag anything not covered by the articles as unknown.

6. **Offer next steps** — ask Anna if any open questions or decisions should be appended to `DECISIONS.md`.

---

## Output format

```
## [Feature name] — Feature Brief

### What the MIS supports
[2–4 sentences: what this feature covers from the school-admin perspective, any sub-types or variants]

---

### Your three config states — mapped

| State | What's happening in the MIS |
|---|---|
| `UNAVAILABLE_NOT_ROLLED_OUT` | [what it means for this feature] |
| `UNAVAILABLE_NOT_AVAILABLE` | [what it means for this feature] |
| Standard empty state | [what triggers it for this feature] |

[Note any per-item eligibility rules that sit below the feature-level states]

---

### Parent-visible fields

| Field | Notes |
|---|---|
| [field] | [always/optional/may be blank — and what to show if blank] |

---

### States to design for

| State | What's happening |
|---|---|
| [state] | [description] |

---

### Pricing / booking models
*(Omit this section if not applicable)*

| Model | What it means for the UI |
|---|---|
| [model] | [implication] |

---

### Scheduling / session patterns
*(Omit this section if not applicable)*

| Pattern | Detail |
|---|---|
| [pattern] | [detail] |

---

### Edge cases to design for

[Numbered list — only include items not already resolved or out of scope per CLAUDE.md]

---

### Already resolved — don't re-litigate

[Bullet list of edge cases found in the articles that CLAUDE.md or prior decisions have already handled]

---

### Open questions

[Numbered list of anything the articles didn't answer, or that needs a call with engineering or product]
```

---

## Key constraints (always apply)

- Never design a waitlist — if a feature has a capacity cap, the item simply becomes unavailable
- Never use disabled button states — inline errors only (per CLAUDE.md)
- Always account for all three config states — never collapse them
- Mock data always uses the Collini family (Kate Brown, Molly, Lucas, Ethan; Oakwood Primary/Secondary)
- Payments always hand off to the Voyager checkout — don't tightly couple booking flows to a specific payment UI
- Primary viewport is 390px; check 375px for tight horizontal layouts
