import React from "react";
import { Tag } from "@tonyarbor/components";

// ── shared sample data ─────────────────────────────────────────────────────────
const CLUBS = [
  {
    id: 1,
    title: "Drumming",
    days: "Mondays",
    time: "15:30–16:15",
    termDates: "6th Apr – 17th Jul 2026",
    priceRange: "£110 for the block",
    isFree: false,
    deadlineLabel: "11th Mar 2026",
    isClosingSoon: false,
    places: 7,
    isLowPlaces: true,
  },
  {
    id: 2,
    title: "Chess club",
    days: "Mondays",
    time: "15:30–16:30",
    termDates: "6th Apr – 17th Jul 2026",
    priceRange: "Free",
    isFree: true,
    deadlineLabel: "28th Mar 2026",
    isClosingSoon: false,
    places: 24,
    isLowPlaces: false,
  },
  {
    id: 3,
    title: "Drama",
    days: "Mondays & Thursdays",
    time: "15:30–16:30",
    termDates: "6th Apr – 17th Jul 2026",
    priceRange: "£8 per session",
    isFree: false,
    deadlineLabel: "22nd Mar 2026",
    isClosingSoon: true,
    places: 14,
    isLowPlaces: true,
  },
];

// ── shared sub-components ──────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke="#aaa" strokeWidth="1.2" />
      <path d="M7 4V7L9 8.5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="3" width="10" height="9" rx="1.5" stroke="#aaa" strokeWidth="1.2" />
      <path d="M2 6H12" stroke="#aaa" strokeWidth="1" />
      <path d="M5 1.5V3.5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 1.5V3.5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 5L11 9L7 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── VARIANT A — current (reference) ───────────────────────────────────────────
function CardCurrent({ club }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 16px",
      textAlign: "left",
      width: "100%",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#2f2f2f" }}>{club.title}</span>
        <Chevron />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <ClockIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.days} · {club.time}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <CalIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.termDates}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, marginTop: 8 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="5.5" stroke="#aaa" strokeWidth="1.2" />
          <text x="7" y="10" textAnchor="middle" fontSize="8" fill="#aaa" fontWeight="600" fontFamily="sans-serif">£</text>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2f2f2f" }}>{club.priceRange}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <Tag variant={club.isClosingSoon ? "default" : "neutral"}>
          {club.isClosingSoon ? "Closing soon" : "Deadline: " + club.deadlineLabel}
        </Tag>
        <Tag variant={club.isLowPlaces ? "default" : "neutral"}>
          {club.places} places remaining
        </Tag>
      </div>
    </div>
  );
}

// ── VARIANT B — price top-right + divider ──────────────────────────────────────
function CardVariantB({ club }) {
  const priceColor = club.isFree ? "#1a7a4a" : "var(--color-brand-600)";
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 16px",
      textAlign: "left",
      width: "100%",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    }}>
      {/* Title row — name left, price + chevron right */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#2f2f2f", lineHeight: 1.3 }}>{club.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: priceColor }}>{club.priceRange}</span>
          <Chevron />
        </div>
      </div>

      {/* When block */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <ClockIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.days} · {club.time}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CalIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.termDates}</span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #f0f0f0", margin: "10px 0" }} />

      {/* Availability row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Tag variant={club.isClosingSoon ? "default" : "neutral"}>
          {club.isClosingSoon ? "Closing soon" : "Deadline: " + club.deadlineLabel}
        </Tag>
        <Tag variant={club.isLowPlaces ? "default" : "neutral"}>
          {club.places} places remaining
        </Tag>
      </div>
    </div>
  );
}

// ── VARIANT C — price below title (large), divider, no price icon ──────────────
function CardVariantC({ club }) {
  const priceColor = club.isFree ? "#1a7a4a" : "var(--color-brand-600)";
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 16px",
      textAlign: "left",
      width: "100%",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    }}>
      {/* Title + chevron */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#2f2f2f" }}>{club.title}</span>
        <Chevron />
      </div>

      {/* Price — prominent, right under title */}
      <div style={{ fontSize: 16, fontWeight: 700, color: priceColor, marginBottom: 10 }}>
        {club.priceRange}
      </div>

      {/* When block */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <ClockIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.days} · {club.time}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CalIcon />
        <span style={{ fontSize: 13, color: "#2f2f2f" }}>{club.termDates}</span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #f0f0f0", margin: "10px 0" }} />

      {/* Availability row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Tag variant={club.isClosingSoon ? "default" : "neutral"}>
          {club.isClosingSoon ? "Closing soon" : "Deadline: " + club.deadlineLabel}
        </Tag>
        <Tag variant={club.isLowPlaces ? "default" : "neutral"}>
          {club.places} places remaining
        </Tag>
      </div>
    </div>
  );
}

// ── Column wrapper — phone-width mockup ───────────────────────────────────────
function PhoneColumn({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#666",
        marginBottom: 12,
      }}>
        {label}
      </div>
      {/* Phone frame */}
      <div style={{
        width: 390,
        background: "#F8F8F8",
        borderRadius: 16,
        border: "1px solid #ddd",
        padding: "16px 16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────
export default function ClubCardPreview() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f0f0",
      padding: "40px 32px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: "#202020", marginBottom: 4 }}>
        Club card — visual options
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 36 }}>
        Same data, three layout treatments. Focused on price prominence and visual rhythm.
      </p>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>

        <PhoneColumn label="Current (reference)">
          {CLUBS.map(c => <CardCurrent key={c.id} club={c} />)}
        </PhoneColumn>

        <PhoneColumn label="Option B — price top-right">
          {CLUBS.map(c => <CardVariantB key={c.id} club={c} />)}
        </PhoneColumn>

        <PhoneColumn label="Option C — price below title">
          {CLUBS.map(c => <CardVariantC key={c.id} club={c} />)}
        </PhoneColumn>

      </div>

      <div style={{ marginTop: 40, padding: "16px 20px", background: "#fff", borderRadius: 10, border: "1px solid #e8e8e8", maxWidth: 600 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>Notes on both options</p>
        <ul style={{ fontSize: 12, color: "#666", lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
          <li>Both use a thin divider to separate "when" info from deadline/availability tags — cleaner grouping than the current layout</li>
          <li>Price for free clubs shown in green; paid in brand colour — helps "Free" stand out at a glance</li>
          <li>Option B keeps the card height roughly the same as current; Option C is slightly taller due to the larger price line</li>
          <li>Neither uses category colours — works regardless of club naming conventions</li>
        </ul>
      </div>
    </div>
  );
}
