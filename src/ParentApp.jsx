import { useState, useEffect, useLayoutEffect, useRef } from "react";
import womanParent from "./assets/woman-parent.png";
import arborLogo from "./assets/arbor-logo.png";
import BottomNavBar from "./BottomNavBar.jsx";
import BookPayLandingV2 from "./BookPayLandingV2.jsx";

// ── Exploration toggle ──────────────────────────────────────────────────────
// true  → renders BookPayLandingV2.jsx (the sandbox)
// false → renders the original inline landing (below)
const EXPLORE_BOOK_PAY = true;
// ───────────────────────────────────────────────────────────────────────────
import { Avatar, Button, Card, Checkbox, Toggle, Input, TextArea, Tag, Banner, DatePicker, Combobox, Toast } from '@tonyarbor/components';
import { CircleUserRound, Lock, Bell, Info, User, School, Shapes, Bus, SunMoon, Sun, Utensils, ShoppingBag, MapPin, Users, ChevronLeft, ChevronRight, ChevronDown, X, Calendar, CalendarX, Link2, Clock, ClipboardList, MessageCircle, Wallet, ArrowRight, AlertTriangle, Check, Tag as TagIcon, Newspaper, Mail, Smartphone, Trophy, PartyPopper, Book } from 'lucide-react';

const children = [
  // `year` is an internal filtering key only — never surfaced in the parent UI (parents know their child's year).
  { id: 1, name: "Molly", initials: "M", school: "Oakwood Primary",    year: "Year 4", avatarColour: { bg: "#eeebf4", border: "#e2dcef", text: "#472b61" } }, // purple
  { id: 2, name: "Lucas", initials: "L", school: "Oakwood Primary",    year: "Year 6", avatarColour: { bg: "#e4f4f3", border: "#cbefed", text: "#0a685b" } }, // teal
  { id: 3, name: "Ethan", initials: "E", school: "Riverside Secondary", year: "Year 9", avatarColour: { bg: "#f7eed8", border: "#efe0bc", text: "#7e3e00" } }, // orange
];

const catColours = {
  "Club":             { bg: "var(--color-extended-orange-050)", iconColor: "var(--color-extended-orange-800)" },
  "Wraparound":       { bg: "#EAF4F3", iconColor: "var(--color-grey-900)" },
  "Trip":             { bg: "#EAF4F3", iconColor: "var(--color-grey-900)" },
  "Meals":            { bg: "var(--color-extended-purple-050)", iconColor: "var(--color-extended-purple-800)" },
  "Parents' evening": { bg: "#EAF4F3", iconColor: "var(--color-grey-900)" },
  "Shop":             { bg: "#EAF4F3", iconColor: "var(--color-grey-900)" },
};

// ── Trips (Parent App 2.0 v1) ──────────────────────────────────────────────
// Prototype school-config switch. Flip to preview the three distinct states:
//   "ENABLED"                  → Trips on (browse shows trips, or empty state if none)
//   "UNAVAILABLE_NOT_ROLLED_OUT" → school hasn't switched on the new app at all
//   "UNAVAILABLE_NOT_AVAILABLE"  → app is on, Trips feature off for this parent
const tripsConfig = "ENABLED";

// About copy + consent statements per trip id (mirrors clubExtras). Detail reads
// the trip item itself (selectedClub) for everything else.
const tripExtras = {
  4: { // The Lion King (free)
    about: "A West End matinee performance of The Lion King at the Lyceum Theatre. Pupils travel by coach with staff, watch the show, and return for the end of the school day. A packed lunch is needed.",
    bullets: ["Travel by coach, supervised by school staff", "Bring a packed lunch and a drink", "Back in time for normal pick-up"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  31: { // Science Museum (fixed £12)
    about: "A full day at the Science Museum in South Kensington exploring the interactive galleries, with a workshop linked to the term's science topic. Travel by coach with staff.",
    bullets: ["Travel by coach, supervised by school staff", "Bring a packed lunch and a drink", "Wear school uniform"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  32: { // Local woodland habitat study (voluntary contribution)
    about: "A morning of fieldwork at the local woodland, studying habitats and food chains as part of the science curriculum. The school asks for a voluntary contribution to help cover the cost.",
    bullets: ["Walking distance, supervised by school staff", "Wear sturdy shoes and a waterproof", "Back at school for lunch"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  33: { // Year 4 residential – PGL (instalment)
    about: "A 3-day residential adventure trip for Year 4 pupils at PGL Marchants Hill. Activities include zip wire, climbing and team challenges. All meals and accommodation are included. A deposit secures the place, with the balance paid in instalments before the trip.",
    bullets: ["2 nights full-board accommodation", "All activities and equipment included", "Supervised by school staff throughout"],
    consentStatements: ["I give permission for my child to attend this residential trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached.", "I confirm the school holds up-to-date medical and dietary information for my child."],
  },
  34: { // Year 5 residential – France (instalment, future year)
    about: "A 6-day residential trip to Normandy for Year 5, visiting historical sites and taking part in French language and cultural activities. Sign-up has opened early so families can spread the cost over the year. A deposit secures the place.",
    bullets: ["5 nights full-board accommodation", "Coach and ferry travel included", "Supervised by school staff throughout"],
    consentStatements: ["I give permission for my child to attend this residential trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached.", "I confirm the school holds a valid passport and any required documents for my child."],
  },
  35: { // Theatre trip – Matilda (fixed £16, full)
    about: "An evening performance of Matilda The Musical at the Cambridge Theatre. Pupils travel by coach with staff and return later in the evening.",
    bullets: ["Travel by coach, supervised by school staff", "Evening trip — later return", "Bring a snack and a drink"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  36: { // Leavers' residential – PGL Liddington (instalment)
    about: "A 4-night end-of-year residential at PGL Liddington. Pupils take part in adventure activities including abseiling, raft building and the giant swing, with evening campfires and team challenges. All meals and accommodation are included. A deposit secures the place, with the balance paid in instalments before the trip.",
    bullets: ["4 nights full-board accommodation", "All activities and equipment included", "Supervised by school staff throughout"],
    consentStatements: ["I give permission for my child to attend this residential trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached.", "I confirm the school holds up-to-date medical and dietary information for my child."],
  },
  37: { // Natural History Museum (fixed £18)
    about: "A full day at the Natural History Museum, with a guided workshop linked to the science curriculum and time to explore the galleries. Pupils travel by coach with staff.",
    bullets: ["Travel by coach, supervised by school staff", "Bring a packed lunch and a drink", "Wear school uniform"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  38: { // National Theatre – evening performance (fixed £22)
    about: "An evening performance at the National Theatre on the South Bank, supporting the GCSE English and Drama curriculum. Pupils travel by coach with staff and return later in the evening.",
    bullets: ["Travel by coach, supervised by school staff", "Evening trip — later return", "Bring a snack and a drink"],
    consentStatements: ["I give permission for my child to attend this trip.", "I consent to emergency medical treatment if it is needed and I cannot be reached."],
  },
  39: { // Duke of Edinburgh Bronze expedition (fixed £25)
    about: "The assessed Bronze expedition for the Duke of Edinburgh's Award: a two-day, one-night supervised hike and camp in the Surrey Hills. Expedition kit can be borrowed from school at no cost. The fee covers registration and campsite costs.",
    bullets: ["1 night camping, supervised by qualified staff", "Expedition kit available to borrow free of charge", "Pupils carry and prepare their own food"],
    consentStatements: ["I give permission for my child to take part in this expedition.", "I consent to emergency medical treatment if it is needed and I cannot be reached.", "I confirm the school holds up-to-date medical information for my child."],
  },
};

// Bespoke Parents' evening glyph — a calendar with two appointment dots. Shared by the Home
// Coming Up cards and the Book & Pay Bookings & orders cards so the event reads identically in
// both places. Props mirror the lucide icon API (size / color / strokeWidth) so it can be used
// interchangeably with the lucide icons elsewhere on the cards.
const ParentsEveningIcon = ({ size = 24, color = "var(--color-grey-900)", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="3" y="5" width="22" height="19" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
    <path d="M3 11H25" stroke={color} strokeWidth={strokeWidth} />
    <path d="M9 3V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M19 3V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="10" cy="17" r="1.8" fill={color} opacity="0.8" />
    <circle cx="18" cy="17" r="1.8" fill={color} opacity="0.8" />
  </svg>
);

const drummingSessionDates = [
  { id: "s1-apr13", label: "Mon 13 Apr", past: true },
  { id: "s1-apr20", label: "Mon 20 Apr", past: true },
  { id: "s1-apr27", label: "Mon 27 Apr", past: true },
  { id: "s1-may4",  label: "Mon 4 May" },
  { id: "s1-may11", label: "Mon 11 May" },
  { id: "s1-may18", label: "Mon 18 May" },
  { id: "s1-may25", label: "Mon 25 May", active: false, note: "Half term" },
  { id: "s1-jun1",  label: "Mon 1 Jun" },
  { id: "s1-jun8",  label: "Mon 8 Jun" },
  { id: "s1-jun15", label: "Mon 15 Jun" },
];

// Shared Summer-term session dates by weekday — used by the secondary (Ethan) and Year 6 (Lucas)
// clubs added for the demo so each browse detail has a populated session picker. Today is 8 Jun 2026.
const secMonDates = [
  { id: "sm-apr27", label: "Mon 27 Apr", past: true }, { id: "sm-may4", label: "Mon 4 May", past: true },
  { id: "sm-may11", label: "Mon 11 May", past: true }, { id: "sm-may18", label: "Mon 18 May", past: true },
  { id: "sm-may25", label: "Mon 25 May", active: false, note: "Half term" }, { id: "sm-jun1", label: "Mon 1 Jun", past: true },
  { id: "sm-jun8", label: "Mon 8 Jun" }, { id: "sm-jun15", label: "Mon 15 Jun" }, { id: "sm-jun22", label: "Mon 22 Jun" },
  { id: "sm-jun29", label: "Mon 29 Jun" }, { id: "sm-jul6", label: "Mon 6 Jul" }, { id: "sm-jul13", label: "Mon 13 Jul" },
];
const secTueDates = [
  { id: "st-apr28", label: "Tue 28 Apr", past: true }, { id: "st-may5", label: "Tue 5 May", past: true },
  { id: "st-may12", label: "Tue 12 May", past: true }, { id: "st-may19", label: "Tue 19 May", past: true },
  { id: "st-may26", label: "Tue 26 May", active: false, note: "Half term" }, { id: "st-jun2", label: "Tue 2 Jun", past: true },
  { id: "st-jun9", label: "Tue 9 Jun" }, { id: "st-jun16", label: "Tue 16 Jun" }, { id: "st-jun23", label: "Tue 23 Jun" },
  { id: "st-jun30", label: "Tue 30 Jun" }, { id: "st-jul7", label: "Tue 7 Jul" }, { id: "st-jul14", label: "Tue 14 Jul" },
];
const secWedDates = [
  { id: "sw-apr29", label: "Wed 29 Apr", past: true }, { id: "sw-may6", label: "Wed 6 May", past: true },
  { id: "sw-may13", label: "Wed 13 May", past: true }, { id: "sw-may20", label: "Wed 20 May", past: true },
  { id: "sw-may27", label: "Wed 27 May", active: false, note: "Half term" }, { id: "sw-jun3", label: "Wed 3 Jun", past: true },
  { id: "sw-jun10", label: "Wed 10 Jun" }, { id: "sw-jun17", label: "Wed 17 Jun" }, { id: "sw-jun24", label: "Wed 24 Jun" },
  { id: "sw-jul1", label: "Wed 1 Jul" }, { id: "sw-jul8", label: "Wed 8 Jul" }, { id: "sw-jul15", label: "Wed 15 Jul" },
];
const secThuDates = [
  { id: "sth-apr30", label: "Thu 30 Apr", past: true }, { id: "sth-may7", label: "Thu 7 May", past: true },
  { id: "sth-may14", label: "Thu 14 May", past: true }, { id: "sth-may21", label: "Thu 21 May", past: true },
  { id: "sth-may28", label: "Thu 28 May", active: false, note: "Half term" }, { id: "sth-jun4", label: "Thu 4 Jun", past: true },
  { id: "sth-jun11", label: "Thu 11 Jun" }, { id: "sth-jun18", label: "Thu 18 Jun" }, { id: "sth-jun25", label: "Thu 25 Jun" },
  { id: "sth-jul2", label: "Thu 2 Jul" }, { id: "sth-jul9", label: "Thu 9 Jul" }, { id: "sth-jul16", label: "Thu 16 Jul" },
];
const secFriDates = [
  { id: "sf-may1", label: "Fri 1 May", past: true }, { id: "sf-may8", label: "Fri 8 May", past: true },
  { id: "sf-may15", label: "Fri 15 May", past: true }, { id: "sf-may22", label: "Fri 22 May", past: true },
  { id: "sf-may29", label: "Fri 29 May", active: false, note: "Half term" }, { id: "sf-jun5", label: "Fri 5 Jun", past: true },
  { id: "sf-jun12", label: "Fri 12 Jun" }, { id: "sf-jun19", label: "Fri 19 Jun" }, { id: "sf-jun26", label: "Fri 26 Jun" },
  { id: "sf-jul3", label: "Fri 3 Jul" }, { id: "sf-jul10", label: "Fri 10 Jul" }, { id: "sf-jul17", label: "Fri 17 Jul" },
];

const breakfastSessionDates = [
  { id: "bk-apr14", label: "Mon 14 Apr", active: true,  weekLabel: "Mon 14 – Fri 18 Apr" },
  { id: "bk-apr15", label: "Tue 15 Apr", active: true  },
  { id: "bk-apr16", label: "Wed 16 Apr", active: true  },
  { id: "bk-apr17", label: "Thu 17 Apr", active: true  },
  { id: "bk-apr18", label: "Fri 18 Apr", active: true  },
  { id: "bk-apr21", label: "Mon 21 Apr", active: true,  weekLabel: "Mon 21 – Fri 25 Apr" },
  { id: "bk-apr22", label: "Tue 22 Apr", active: true  },
  { id: "bk-apr23", label: "Wed 23 Apr", active: true  },
  { id: "bk-apr24", label: "Thu 24 Apr", active: true  },
  { id: "bk-apr25", label: "Fri 25 Apr", active: true  },
  { id: "bk-apr28", label: "Mon 28 Apr", active: true,  weekLabel: "Mon 28 Apr – Fri 2 May" },
  { id: "bk-apr29", label: "Tue 29 Apr", active: true  },
  { id: "bk-apr30", label: "Wed 30 Apr", active: true  },
  { id: "bk-may1",  label: "Thu 1 May",  active: true  },
  { id: "bk-may2",  label: "Fri 2 May",  active: true  },
  { id: "bk-may5",  label: "Mon 5 May",  active: true,  weekLabel: "Mon 5 – Fri 9 May" },
  { id: "bk-may6",  label: "Tue 6 May",  active: true  },
  { id: "bk-may7",  label: "Wed 7 May",  active: true  },
  { id: "bk-may8",  label: "Thu 8 May",  active: true  },
  { id: "bk-may9",  label: "Fri 9 May",  active: true  },
  { id: "bk-may12", label: "Mon 12 May", active: true,  weekLabel: "Mon 12 – Fri 16 May" },
  { id: "bk-may13", label: "Tue 13 May", active: true  },
  { id: "bk-may14", label: "Wed 14 May", active: true  },
  { id: "bk-may15", label: "Thu 15 May", active: true  },
  { id: "bk-may16", label: "Fri 16 May", active: true  },
  { id: "bk-may19", label: "Mon 19 May", active: true,  weekLabel: "Mon 19 – Fri 23 May" },
  { id: "bk-may20", label: "Tue 20 May", active: true  },
  { id: "bk-may21", label: "Wed 21 May", active: true  },
  { id: "bk-may22", label: "Thu 22 May", active: true  },
  { id: "bk-may23", label: "Fri 23 May", active: true  },
  { id: "bk-ht1",   label: "Mon 26 May", active: false, note: "Half term", weekLabel: "Mon 26 – Fri 30 May" },
  { id: "bk-ht2",   label: "Tue 27 May", active: false, note: "Half term" },
  { id: "bk-ht3",   label: "Wed 28 May", active: false, note: "Half term" },
  { id: "bk-ht4",   label: "Thu 29 May", active: false, note: "Half term" },
  { id: "bk-ht5",   label: "Fri 30 May", active: false, note: "Half term" },
  { id: "bk-jun2",  label: "Mon 2 Jun",  active: true,  weekLabel: "Mon 2 – Fri 6 Jun" },
  { id: "bk-jun3",  label: "Tue 3 Jun",  active: true  },
  { id: "bk-jun4",  label: "Wed 4 Jun",  active: true  },
  { id: "bk-jun5",  label: "Thu 5 Jun",  active: true  },
  { id: "bk-jun6",  label: "Fri 6 Jun",  active: true  },
  { id: "bk-jun9",  label: "Mon 9 Jun",  active: true,  weekLabel: "Mon 9 – Fri 13 Jun" },
  { id: "bk-jun10", label: "Tue 10 Jun", active: true  },
  { id: "bk-jun11", label: "Wed 11 Jun", active: true  },
  { id: "bk-jun12", label: "Thu 12 Jun", active: true  },
  { id: "bk-jun13", label: "Fri 13 Jun", active: true  },
  { id: "bk-jun16", label: "Mon 16 Jun", active: true,  weekLabel: "Mon 16 – Fri 20 Jun" },
  { id: "bk-jun17", label: "Tue 17 Jun", active: true  },
  { id: "bk-jun18", label: "Wed 18 Jun", active: true  },
  { id: "bk-jun19", label: "Thu 19 Jun", active: true  },
  { id: "bk-jun20", label: "Fri 20 Jun", active: true  },
  { id: "bk-jun23", label: "Mon 23 Jun", active: true,  weekLabel: "Mon 23 – Fri 27 Jun" },
  { id: "bk-jun24", label: "Tue 24 Jun", active: true  },
  { id: "bk-jun25", label: "Wed 25 Jun", active: true  },
  { id: "bk-jun26", label: "Thu 26 Jun", active: true  },
  { id: "bk-jun27", label: "Fri 27 Jun", active: true  },
  { id: "bk-jun30", label: "Mon 30 Jun", active: true,  weekLabel: "Mon 30 Jun – Fri 4 Jul" },
  { id: "bk-jul1",  label: "Tue 1 Jul",  active: true  },
  { id: "bk-jul2",  label: "Wed 2 Jul",  active: true  },
  { id: "bk-jul3",  label: "Thu 3 Jul",  active: true  },
  { id: "bk-jul4",  label: "Fri 4 Jul",  active: true  },
  { id: "bk-jul7",  label: "Mon 7 Jul",  active: true,  weekLabel: "Mon 7 – Fri 11 Jul" },
  { id: "bk-jul8",  label: "Tue 8 Jul",  active: true  },
  { id: "bk-jul9",  label: "Wed 9 Jul",  active: true  },
  { id: "bk-jul10", label: "Thu 10 Jul", active: true  },
  { id: "bk-jul11", label: "Fri 11 Jul", active: true  },
];

// Booking model scenarios for the breakfast club prototype.
// S1: single individual, S2: single block, S3: multi individual, S4: multi block, S5: mixed.
const bkPeriodsS1 = [
  { id: "standard-daily",   name: "Standard",  type: "daily",  days: "Mon–Fri", start: "07:30", end: "08:15", price: 5,   sessionsRemaining: null },
];
const bkPeriodsS2 = [
  { id: "standard-termly",  name: "Standard",  type: "termly", days: "Mon–Fri", start: "07:30", end: "08:15", price: 260, sessionsRemaining: 52,   periodLabel: "this term" },
];
const bkPeriodsS3 = [
  { id: "early-bird-daily",  name: "Early Bird",  type: "daily", days: "Mon–Fri", start: "07:00", end: "08:30", price: 6, sessionsRemaining: null },
  { id: "standard-daily",    name: "Standard",    type: "daily", days: "Mon–Fri", start: "07:30", end: "08:15", price: 5, sessionsRemaining: null },
  { id: "late-start-daily",  name: "Late Start",  type: "daily", days: "Mon–Fri", start: "07:45", end: "08:30", price: 4, sessionsRemaining: null },
];
const bkPeriodsS4 = [
  { id: "mon-wed-termly", name: "Short week", type: "termly", days: "Mon–Wed", start: "07:30", end: "08:15", price: 156, sessionsRemaining: 31 },
  { id: "mon-fri-termly", name: "Full week",  type: "termly", days: "Mon–Fri", start: "07:30", end: "08:15", price: 260, sessionsRemaining: 52 },
];
const bkPeriodsS5 = [
  { id: "standard-daily",   name: "Standard",  type: "daily",  days: "Mon–Fri", start: "07:30", end: "08:15", price: 5,   sessionsRemaining: null },
  { id: "standard-termly",  name: "Standard",  type: "termly", days: "Mon–Fri", start: "07:30", end: "08:15", price: 260, sessionsRemaining: 52,   periodLabel: "this term" },
];

const breakfastClubConfig = {
  chargeOnAttendance: true,
  allowSignUpIfLowBalance: true,
  blockDeadlineLabel: "13 Apr",
  sameDayCutoff: "Book by 15:00 the day before",
};

// Converts a regular club browse item + its clubExtras into the period format
// used by the unified booking options card.
const periodsForClub = (clubItem, extras) => {
  if (!extras) return [];
  if (extras.periods) return extras.periods;
  const [start, end] = clubItem.time.split("–");
  const base = { days: clubItem.days, start, end, name: clubItem.title };
  if (extras.isFree) {
    if (clubItem.individualOnly) {
      return [{ ...base, id: `${clubItem.id}-daily`,  type: "daily",  price: 0, sessionsRemaining: null, label: extras.dailyLabel }];
    }
    return   [{ ...base, id: `${clubItem.id}-termly`, type: "termly", price: 0, sessionsRemaining: extras.blockSessions, label: extras.termlyLabel }];
  }
  if (clubItem.blockOnly) {
    return   [{ ...base, id: `${clubItem.id}-termly`, type: "termly", price: extras.blockPrice,        sessionsRemaining: extras.blockSessions, label: extras.termlyLabel }];
  }
  if (clubItem.individualOnly) {
    return   [{ ...base, id: `${clubItem.id}-daily`,  type: "daily",  price: extras.perSessionPrice,   sessionsRemaining: null, label: extras.dailyLabel }];
  }
  // Both options available → mixed (S5 equivalent)
  return [
    { ...base, id: `${clubItem.id}-daily`,  type: "daily",  price: extras.perSessionPrice, sessionsRemaining: null,                label: extras.dailyLabel },
    { ...base, id: `${clubItem.id}-termly`, type: "termly", price: extras.blockPrice,       sessionsRemaining: extras.blockSessions, label: extras.termlyLabel },
  ];
};

const DAY_PLURAL = { Mon: "Mondays", Tue: "Tuesdays", Wed: "Wednesdays", Thu: "Thursdays", Fri: "Fridays", Sat: "Saturdays", Sun: "Sundays" };
const expandDay = (d) => (d.includes("\u2013") || d.includes(",")) ? d : (DAY_PLURAL[d.trim()] ?? d);

// Returns the schedule line for a club card or detail header.
// For multi-day clubs with a periods override, deduplicates days and detects
// whether times vary. Falls back to item.timeDisplay or the raw days/time fields.
const getClubScheduleLabel = (item, extras) => {
  if (extras?.periods) {
    const seenDays = new Set();
    const orderedDays = [];
    extras.periods.forEach(p => {
      if (!seenDays.has(p.days)) { seenDays.add(p.days); orderedDays.push(p.days); }
    });
    const uniqueTimes = new Set(extras.periods.map(p => `${p.start}\u2013${p.end}`));
    const dayStr = orderedDays.length === 1 ? expandDay(orderedDays[0]) : orderedDays.map(d => d.slice(0, 3)).join(", ");
    return `${dayStr} \u00b7 ${uniqueTimes.size === 1 ? [...uniqueTimes][0] : "Multiple times"}`;
  }
  return item.timeDisplay || `${expandDay(item.days)} \u00b7 ${item.time}`;
};

// Returns structured schedule parts for the details page.
// When days have different times, returns { multiDay: true, pairs: [{ label }, ...] } for one line per day-time pair.
// When times are uniform, returns { multiDay: false, label } for single-line rendering.
const getClubScheduleDetailParts = (item, extras) => {
  if (extras?.periods) {
    const seen = new Map();
    extras.periods.forEach(p => {
      if (!seen.has(p.days)) seen.set(p.days, { days: p.days, time: `${p.start}\u2013${p.end}` });
    });
    const entries = [...seen.values()];
    const uniqueTimes = new Set(entries.map(e => e.time));
    const dayStr = (arr) => arr.length === 1 ? expandDay(arr[0].days) : arr.map(e => e.days.slice(0, 3)).join(", ");
    if (uniqueTimes.size === 1) {
      return { multiDay: false, label: `${dayStr(entries)} \u00b7 ${[...uniqueTimes][0]}` };
    }
    return {
      multiDay: true,
      pairs: entries.map(e => ({ label: `${expandDay(e.days)} \u00b7 ${e.time}` })),
    };
  }
  if (item.days && item.days.includes(",") && item.time) {
    const days = item.days.split(",").map(s => DAY_PLURAL[s.trim()] ?? s.trim()).join(", ");
    return { multiDay: true, pairs: [{ label: `${days} \u00b7 ${item.time}` }] };
  }
  return { multiDay: false, label: item.timeDisplay || `${expandDay(item.days)} \u00b7 ${item.time}` };
};

const afterSchoolClubConfigs = {
  mon: {
    name: "Monday After School Club", timeDisplay: "Mondays", dayOrder: [1],
    chargeOnAttendance: false, allowSignUpIfLowBalance: false, blockDeadlineLabel: "13 Apr", sameDayCutoff: "Book by 12:30 on the day",
    sessionDates: [
      { id: "as-mon-apr14", date: "Mon 14 Apr", active: true },
      { id: "as-mon-apr21", date: "Mon 21 Apr", active: true },
      { id: "as-mon-apr28", date: "Mon 28 Apr", active: true },
      { id: "as-mon-may5",  date: "Mon 5 May",  active: true },
      { id: "as-mon-may12", date: "Mon 12 May", active: true },
      { id: "as-mon-may19", date: "Mon 19 May", active: true },
      { id: "as-mon-may26", date: "Mon 26 May", active: false, note: "Half term" },
      { id: "as-mon-jun2",  date: "Mon 2 Jun",  active: true },
      { id: "as-mon-jun9",  date: "Mon 9 Jun",  active: true },
      { id: "as-mon-jun16", date: "Mon 16 Jun", active: true },
      { id: "as-mon-jun23", date: "Mon 23 Jun", active: true },
      { id: "as-mon-jun30", date: "Mon 30 Jun", active: true },
      { id: "as-mon-jul7",  date: "Mon 7 Jul",  active: true },
    ],
  },
  thuRecorder: {
    name: "Recorder Club", timeDisplay: "Thursdays", dayOrder: [4],
    chargeOnAttendance: false, allowSignUpIfLowBalance: false, isFree: true, blockDeadlineLabel: "16 Apr", sameDayCutoff: "Book by 12:30 on the day",
    sessionDates: [
      { id: "as-rec-apr17", date: "Thu 17 Apr", active: true },
      { id: "as-rec-apr24", date: "Thu 24 Apr", active: true },
      { id: "as-rec-may1",  date: "Thu 1 May",  active: true },
      { id: "as-rec-may8",  date: "Thu 8 May",  active: true },
      { id: "as-rec-may15", date: "Thu 15 May", active: true },
      { id: "as-rec-may22", date: "Thu 22 May", active: true },
      { id: "as-rec-may29", date: "Thu 29 May", active: false, note: "Half term" },
      { id: "as-rec-jun5",  date: "Thu 5 Jun",  active: true },
      { id: "as-rec-jun12", date: "Thu 12 Jun", active: true },
      { id: "as-rec-jun19", date: "Thu 19 Jun", active: true },
      { id: "as-rec-jun26", date: "Thu 26 Jun", active: true },
      { id: "as-rec-jul3",  date: "Thu 3 Jul",  active: true },
      { id: "as-rec-jul10", date: "Thu 10 Jul", active: true },
    ],
  },
  wedFootball: {
    name: "Football After School Club", timeDisplay: "Wednesdays", dayOrder: [3],
    chargeOnAttendance: false, allowSignUpIfLowBalance: true, blockDeadlineLabel: "15 Apr", sameDayCutoff: "Book by 12:30 on the day",
    sessionDates: [
      { id: "as-foot-apr16", date: "Wed 16 Apr", active: true },
      { id: "as-foot-apr23", date: "Wed 23 Apr", active: true },
      { id: "as-foot-apr30", date: "Wed 30 Apr", active: true },
      { id: "as-foot-may7",  date: "Wed 7 May",  active: true },
      { id: "as-foot-may14", date: "Wed 14 May", active: true },
      { id: "as-foot-may21", date: "Wed 21 May", active: true },
      { id: "as-foot-may28", date: "Wed 28 May", active: false, note: "Half term" },
      { id: "as-foot-jun4",  date: "Wed 4 Jun",  active: true },
      { id: "as-foot-jun11", date: "Wed 11 Jun", active: true },
      { id: "as-foot-jun18", date: "Wed 18 Jun", active: true },
      { id: "as-foot-jun25", date: "Wed 25 Jun", active: true },
      { id: "as-foot-jul2",  date: "Wed 2 Jul",  active: true },
      { id: "as-foot-jul9",  date: "Wed 9 Jul",  active: true },
    ],
  },
};
// Derive termWeeks from sessionDates for each config
Object.values(afterSchoolClubConfigs).forEach(cfg => {
  cfg.termWeeks = cfg.sessionDates.map(d => ({ label: d.date, active: d.active }));
});

const bottomNav = [
  { id: "home", label: "Home" },
  { id: "my-child", label: "My child" },
  { id: "book-pay", label: "Book & Pay" },
  { id: "messages", label: "Messages" },
];

// Single pastel avatar circle, shared by chip + dropdown + stack
function ChildAvatar({ child, ml = 0 }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: child.avatarColour.bg, border: `1px solid ${child.avatarColour.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: ml, boxSizing: "border-box" }}>
      <span style={{ fontSize: "var(--font-size-1)", fontWeight: 400, color: child.avatarColour.text, lineHeight: 1 }}>{child.initials}</span>
    </div>
  );
}

// Overlapping avatar stack for the "All children" state. Caps at 3 avatars + "+N" overflow.
function ChildStack({ kids }) {
  const shown = kids.slice(0, 3);
  const overflow = kids.length - shown.length;
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {shown.map((c, i) => <ChildAvatar key={c.id} child={c} ml={i > 0 ? -6 : 0} />)}
      {overflow > 0 && (
        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-grey-100)", border: "1px solid var(--color-border-default)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: -6, boxSizing: "border-box" }}>
          <span style={{ fontSize: "var(--font-size-1)", fontWeight: 600, color: "var(--color-text-secondary)", lineHeight: 1 }}>+{overflow}</span>
        </span>
      )}
    </span>
  );
}

function ChildSwitcher({ selectedChild, onSwitch, allChildren, onSelectAll, showAllOption }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAll = showAllOption && allChildren;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 32,
          background: "#fff",
          border: "1px solid #dfdfdf",
          borderRadius: 20,
          padding: "0 10px 0 6px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "var(--font-size-3)",
        }}
      >
        {isAll ? <ChildStack kids={children} /> : <ChildAvatar child={selectedChild} />}
        <span style={{ color: "#2f2f2f", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {isAll ? "All children" : selectedChild.name}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            marginLeft: 2,
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="#666"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
            zIndex: 100,
            minWidth: 170,
          }}
        >
          {showAllOption && (
            <button
              className="dropdown-item"
              onClick={() => { onSelectAll(); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: "var(--font-size-3)", color: "#333",
                fontWeight: isAll ? 600 : 400,
              }}
            >
              <ChildStack kids={children} />
              All children
            </button>
          )}
          {children.map((child) => {
            const active = !isAll && selectedChild.id === child.id;
            return (
              <button
                key={child.id}
                className="dropdown-item"
                onClick={() => { onSwitch(child); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "var(--font-size-3)", color: "#333",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <ChildAvatar child={child} />
                {child.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopNav({ selectedChild, onSwitchChild, allChildren, onSelectAll, showAllOption, hideChildSwitcher, onProfileOpen, surface }) {
  const brand = surface === "brand";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        boxShadow: brand ? "none" : "0px 1px 2px 0px rgba(0,0,0,0.12)",
        background: brand ? "var(--color-brand-050)" : "var(--color-white)",
        flexShrink: 0,
      }}
    >
      {/* Arbor logo */}
      <img src={arborLogo} alt="Arbor" width="32" height="32" style={{ flexShrink: 0, objectFit: "contain" }} />

      {/* Right side: child switcher + profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ visibility: hideChildSwitcher ? "hidden" : "visible", pointerEvents: hideChildSwitcher ? "none" : "auto" }}>
          <ChildSwitcher
            selectedChild={selectedChild}
            onSwitch={onSwitchChild}
            allChildren={allChildren}
            onSelectAll={onSelectAll}
            showAllOption={showAllOption}
          />
        </div>

        {/* Parent avatar */}
        <button
          onClick={onProfileOpen}
          className="btn-icon"
          style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-default)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
        >
          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)", letterSpacing: "0.01em" }}>KB</span>
        </button>
      </div>
    </div>
  );
}

function BottomNav({ activeTab, onTabChange, unreadCount }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 0 12px",
        boxShadow: "0 -1px 0 rgba(0,0,0,0.06)",
        background: "var(--color-white)",
        flexShrink: 0,
      }}
    >
      {bottomNav.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: isActive ? "#999" : "#d9d9d9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {item.id === "messages" && unreadCount > 0 && (
                <div style={{ position: "absolute", top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, background: "#d44", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{unreadCount}</div>
              )}
              {item.id === "home" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L7 2L12 7V12H9V9H5V12H2V7Z" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              )}
              {item.id === "messages" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="2.5" width="11" height="8" rx="1" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" />
                  <path d="M2 3L7 7L12 3" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.id === "my-child" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="5" r="2.5" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" />
                  <path d="M2.5 13C2.5 10.5 4.5 8.5 7 8.5C9.5 8.5 11.5 10.5 11.5 13" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
              {item.id === "book-pay" && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="3" width="11" height="8.5" rx="1" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" />
                  <path d="M1.5 6H12.5" stroke={isActive ? "#fff" : "#888"} strokeWidth="1.2" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#333" : "#999",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BookingConfirmedScreen({ isMobile, clubName, childName, days, time, location, clubLead, periodLabel, sessionCount, dates, isFree, total, fromAccount, onClose, onGoToBookings, confirmedDatesExpanded, setConfirmedDatesExpanded, bookingNudgeRating, setBookingNudgeRating, newLayout, paymentComplete, amountPaidNow, paymentModel, minimumContribution, outstanding, paymentDeadline, instalment, depositPaid, balanceRemaining, feedbackNoun = "club" }) {
  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const futureDates = (dates || []).filter(d => d.active !== false);

  const renderDates = () => {
    const groups = {};
    futureDates.forEach(d => {
      const parts = d.label.split(" ");
      const month = parts[parts.length - 1];
      const dayDisplay = parts.slice(0, -1).join(" ");
      if (!groups[month]) groups[month] = [];
      groups[month].push({ ...d, dayDisplay });
    });
    const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    return (
      <div style={{ marginTop: 12, textAlign: "left" }}>
        {sortedMonths.map((month, mi) => (
          <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
            {groups[month].map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                <span style={{ fontSize: "var(--font-size-3)", color: d.active !== false ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active !== false ? "none" : "line-through" }}>{d.label}</span>
                {d.active !== false
                  ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{d.time || time || ""}</span>
                  : d.note && <Tag variant="neutral">{d.note}</Tag>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (newLayout) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--color-grey-050)", zIndex: 5 }}>
        <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 120, height: 28, background: "var(--color-text-primary)", borderRadius: 14, display: isMobile ? "none" : "block" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 8px 0", flexShrink: 0 }}>
          <button onClick={onClose} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ padding: "8px 16px 24px", textAlign: "center", flexShrink: 0 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none"><path d="M10 18L16 24L26 12" stroke="var(--color-success-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "inherit" }}>{paymentComplete ? "Payment complete" : "Booking confirmed"}</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
          <div style={{ background: "var(--color-white)", borderRadius: 8, border: "1px solid var(--color-grey-100)", padding: 16 }}>
            <p style={{ fontSize: "var(--font-size-6)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 4px", lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>{clubName}</p>
            <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.2 }}>For {childName}</p>
            <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
            {(days || time) && <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{[days ? expandDay(days) : null, time].filter(Boolean).join(" · ")}</p>}
            {sessionCount !== 1 && (
              <>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{sessionCount} sessions booked</span>
                  <button onClick={() => setConfirmedDatesExpanded(!confirmedDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View dates</span>
                    <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: confirmedDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                </div>
                {confirmedDatesExpanded && renderDates()}
              </>
            )}
            {(location || clubLead) && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                {location && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    {location}
                  </span>
                )}
                {clubLead && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    {clubLead}
                  </span>
                )}
              </div>
            )}
            {(() => {
              const isVariable = paymentModel === "variable";
              const isVoluntary = isVariable && (minimumContribution ?? 0) === 0;
              const isMinThreshold = isVariable && (minimumContribution ?? 0) > 0;
              const hasOutstanding = (outstanding ?? 0) > 0;
              if (isVoluntary && total === 0) return null;
              const fmt = (n) => `£${Number.isInteger(n) ? n + ".00" : n.toFixed(2)}`;
              // Instalment trips — show what was paid now; balance only if any remains
              if (instalment) {
                const bal = balanceRemaining ?? 0;
                if (bal <= 0) {
                  return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--color-success-050)", borderRadius: 10, padding: "12px 14px", marginTop: 20 }}>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-success-700)" }}>Paid in full</span>
                      <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-success-700)" }}>{fmt(depositPaid ?? total)}</span>
                    </div>
                  );
                }
                return (
                  <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Paid today</span>
                      <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>{fmt(depositPaid ?? total)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Balance remaining</div>
                        {paymentDeadline && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>Pay before the trip</div>}
                      </div>
                      <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>{fmt(bal)}</span>
                    </div>
                  </div>
                );
              }
              // For standard (non-variable) clubs, keep the green success block
              if (!isVariable) {
                const displayAmount = paymentComplete && amountPaidNow != null ? amountPaidNow : total;
                const label = isFree ? "Cost" : fromAccount ? "Charged to account" : paymentComplete ? "Remaining balance paid" : "Paid";
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--color-success-050)", borderRadius: 10, padding: "12px 14px", marginTop: 20 }}>
                    <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-success-700)" }}>{label}</span>
                    <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-success-700)" }}>{isFree ? "Free" : fmt(displayAmount)}</span>
                  </div>
                );
              }
              // Variable clubs — clean done = green container; partial pay = grey container with hierarchy
              const isCleanDone = !hasOutstanding;
              const containerBg = isCleanDone ? "var(--color-success-050)" : "var(--color-grey-050)";
              const row = (label, amount, subline, tone) => {
                // tone: "success" | "muted" | "primary"
                const color = tone === "success" ? "var(--color-success-700)"
                  : tone === "muted" ? "var(--color-text-secondary)"
                  : "var(--color-text-primary)";
                const weight = tone === "muted" ? 500 : 600;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "var(--font-size-3)", fontWeight: weight, color }}>{label}</div>
                      {subline && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>{subline}</div>}
                    </div>
                    <span style={{ fontSize: tone === "muted" ? "var(--font-size-5)" : "var(--font-size-6)", fontWeight: weight, color, flexShrink: 0 }}>{fmt(amount)}</span>
                  </div>
                );
              };
              return (
                <div style={{ background: containerBg, borderRadius: 10, padding: "12px 14px", marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  {isVoluntary ? row("Contribution", total, null, "success")
                    : isMinThreshold && hasOutstanding ? (
                        <>
                          {row("Paid", total, null, "muted")}
                          {row("Outstanding", outstanding, paymentDeadline ? `Full amount by ${paymentDeadline}` : null, "primary")}
                        </>
                      )
                    : row("Paid in full", total, null, "success")}
                </div>
              );
            })()}
          </div>
        </div>
        <div style={{ padding: "10px 16px 6px", textAlign: "center", borderTop: "1px solid var(--color-border-default)", background: "var(--color-white)", flexShrink: 0 }}>
          <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-disabled)", marginBottom: 6 }}>Was it easy to book this {feedbackNoun}?</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[["👎", 1], ["👍", 2]].map(([face, val]) => (
              <button key={val} onClick={() => !bookingNudgeRating && setBookingNudgeRating(val)} className="btn-pill" style={{ background: "none", border: "none", cursor: bookingNudgeRating ? "default" : "pointer", fontSize: "var(--font-size-6)", minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", opacity: bookingNudgeRating && bookingNudgeRating !== val ? 0.2 : 1, transition: "opacity 0.15s", lineHeight: 1 }}>{face}</button>
            ))}
          </div>
          {bookingNudgeRating && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-disabled)", marginTop: 6 }}>Thanks for your feedback</div>}
        </div>
        <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)" }}>
          <button onClick={onGoToBookings} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Go to my bookings</button>
        </div>
        <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--color-white)", zIndex: 5 }}>
      <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
        <div style={{ width: 120, height: 28, background: "var(--color-text-primary)", borderRadius: 14, display: isMobile ? "none" : "block" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 16px 0", flexShrink: 0 }}>
        <button onClick={onClose} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 20px", background: "var(--color-bg-secondary)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><path d="M10 18L16 24L26 12" stroke="var(--color-success-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 28px", textAlign: "center" }}>Booking confirmed</h1>

        <div style={{ background: "var(--color-white)", borderRadius: 12, padding: 16, width: "100%", marginBottom: 16, border: "1px solid var(--color-grey-100)" }}>
          <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 2px" }}>{clubName}</h2>
          {periodLabel && <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "0 0 2px" }}>{periodLabel}</p>}
          <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0 }}>For {childName}</p>

          {(days || time || location || clubLead) && (
            <>
              <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
              {(days || time) && <p style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 8px" }}>{[days, time].filter(Boolean).join(" · ")}</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {location && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="var(--color-text-secondary)" strokeWidth={1.5} /><span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{location}</span></div>}
                {clubLead && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={14} color="var(--color-text-secondary)" strokeWidth={1.5} /><span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{clubLead}</span></div>}
              </div>
            </>
          )}

          {sessionCount !== 1 && (
            <>
              <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)" }}>{sessionCount} sessions</span>
                <button onClick={() => setConfirmedDatesExpanded(!confirmedDatesExpanded)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", textDecoration: "underline", textUnderlineOffset: 2 }}>View dates</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: confirmedDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M3 4.5L6 7.5L9 4.5" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              {confirmedDatesExpanded && renderDates()}
            </>
          )}

          <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0 0" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", marginTop: 14, background: "var(--color-brand-050)", borderRadius: 10 }}>
            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-success-700)" }}>{isFree ? "Cost" : fromAccount ? "Charged to account" : "Paid"}</div>
            <div style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-success-700)" }}>{isFree ? "Free" : `£${Number.isInteger(total) ? total + ".00" : total.toFixed(2)}`}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 16px 6px", textAlign: "center", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", background: "var(--color-white)", flexShrink: 0 }}>
        <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-disabled)", marginBottom: 6 }}>Was it easy to book this club?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[["👎", 1], ["👍", 2]].map(([face, val]) => (
            <button key={val} onClick={() => !bookingNudgeRating && setBookingNudgeRating(val)} className="btn-pill" style={{ background: "none", border: "none", cursor: bookingNudgeRating ? "default" : "pointer", fontSize: "var(--font-size-6)", minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", opacity: bookingNudgeRating && bookingNudgeRating !== val ? 0.2 : 1, transition: "opacity 0.15s", lineHeight: 1 }}>{face}</button>
          ))}
        </div>
        {bookingNudgeRating && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-disabled)", marginTop: 6 }}>Thanks for your feedback</div>}
      </div>
      <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)" }}>
        <button onClick={onGoToBookings} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Go to my bookings</button>
      </div>
      <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
      </div>
    </div>
  );
}

const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS_SHORT = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function DatePickerSheet({ label, value, onChange, min, onClose }) {
  const selectedDate = value ? new Date(value + "T12:00:00") : null;
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate);
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDow = new Date(year, month, 1).getDay();
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const minDate = min ? new Date(min + "T00:00:00") : null;
  const isDisabled = (d) => minDate && d < minDate;
  const isSelected = (d) => selectedDate &&
    d.getFullYear() === selectedDate.getFullYear() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getDate() === selectedDate.getDate();
  const isTodayCell = (d) => {
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };

  const toStr = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const shiftMonth = (delta) => { const d = new Date(viewDate); d.setDate(1); d.setMonth(d.getMonth() + delta); setViewDate(d); };
  const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 1 + i);

  const handleDaySelect = (d) => { if (isDisabled(d)) return; onChange(toStr(d)); onClose(); };
  const handleToday = () => { const t = new Date(); onChange(toStr(t)); setViewDate(t); onClose(); };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 15 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--color-bg-primary)", borderRadius: "20px 20px 0 0", zIndex: 1 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)", margin: "12px auto 8px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0 16px", borderBottom: "1px solid var(--color-border-default)" }}>
          <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)" }}>{label}</span>
          <button type="button" onClick={onClose} style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <X size={20} color="var(--color-icon-default)" strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ padding: "0 16px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 8px" }}>
            <button type="button" onClick={() => shiftMonth(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <ChevronLeft size={16} color="var(--color-text-primary)" />
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={month} onChange={(e) => { const d = new Date(viewDate); d.setDate(1); d.setMonth(+e.target.value); setViewDate(d); }}
                style={{ fontSize: "var(--font-size-3)", border: "1px solid var(--color-border-default)", borderRadius: 6, padding: "4px 6px", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", fontFamily: "inherit" }}>
                {MONTHS_LONG.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => { const d = new Date(viewDate); d.setDate(1); d.setFullYear(+e.target.value); setViewDate(d); }}
                style={{ fontSize: "var(--font-size-3)", border: "1px solid var(--color-border-default)", borderRadius: 6, padding: "4px 6px", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", fontFamily: "inherit" }}>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => shiftMonth(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <ChevronRight size={16} color="var(--color-text-primary)" />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 2 }}>
            {WEEKDAYS_SHORT.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "var(--font-size-1)", fontWeight: 600, color: "var(--color-text-tertiary)", padding: "4px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const sel = isSelected(date);
              const dis = isDisabled(date);
              const tod = isTodayCell(date);
              return (
                <button key={i} type="button" onClick={() => handleDaySelect(date)}
                  style={{
                    width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                    border: "none", borderRadius: "50%", cursor: dis ? "default" : "pointer", fontFamily: "inherit",
                    fontSize: "var(--font-size-3)",
                    backgroundColor: sel ? "var(--color-brand-600)" : "transparent",
                    color: sel ? "var(--color-white)" : dis ? "var(--color-text-tertiary)" : tod ? "var(--color-brand-600)" : "var(--color-text-primary)",
                    fontWeight: tod && !sel ? 700 : "normal",
                    opacity: dis ? 0.4 : 1,
                  }}>
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-grey-100)" }}>
            <button type="button" onClick={handleToday}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)", fontFamily: "inherit" }}>
              Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDatePicker({ value, label, error, onOpen }) {
  const selectedDate = value ? new Date(value + "T12:00:00") : null;
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "Select date";

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", minHeight: 52, width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
    >
      <span style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: error ? "var(--color-text-destructive)" : "var(--color-text-primary)" }}>{label}</span>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${error ? "var(--color-text-destructive)" : "var(--color-border-default)"}`, borderRadius: 8, height: 36, padding: "0 10px", background: "var(--color-bg-primary)" }}>
        <span style={{ fontSize: "var(--font-size-3)", color: selectedDate ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>{displayValue}</span>
        <Calendar size={14} strokeWidth={1.5} color={error ? "var(--color-text-destructive)" : "var(--color-icon-secondary)"} />
      </div>
    </button>
  );
}

function TimePickerSheet({ label, value, onChange, onClose }) {
  const ITEM_H = 44;
  const VISIBLE = 6;
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const parseTime = (v) => {
    if (!v) return { h: 8, m: 50 };
    const [hStr, mStr] = v.split(":");
    const h = parseInt(hStr, 10);
    const m = Math.round(parseInt(mStr, 10) / 5) * 5 % 60;
    return { h, m };
  };

  const { h: initH, m: initM } = parseTime(value);
  const [selHour, setSelHour] = useState(initH);
  const [selMinute, setSelMinute] = useState(initM);

  const fmt = (n) => String(n).padStart(2, "0");
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (hourRef.current) hourRef.current.scrollTop = initH * ITEM_H;
      if (minuteRef.current) minuteRef.current.scrollTop = (initM / 5) * ITEM_H;
    });
  }, []);

  const commitHour = (h) => {
    setSelHour(h);
    onChange(`${fmt(h)}:${fmt(selMinute)}`);
    hourRef.current?.scrollTo({ top: h * ITEM_H, behavior: "smooth" });
  };

  const commitMinute = (m) => {
    setSelMinute(m);
    onChange(`${fmt(selHour)}:${fmt(m)}`);
    minuteRef.current?.scrollTo({ top: (m / 5) * ITEM_H, behavior: "smooth" });
  };

  const drumCol = (ref, items, selVal, onSelect) => (
    <div
      ref={ref}
      className="time-drum"
      style={{ width: 88, height: VISIBLE * ITEM_H, overflowY: "auto", scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
    >
      {items.map(n => {
        const sel = n === selVal;
        return (
          <button key={n} type="button" onClick={() => onSelect(n)}
            style={{
              scrollSnapAlign: "start", width: "100%", height: ITEM_H,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer", fontFamily: "inherit",
              fontSize: "var(--font-size-4)", fontWeight: sel ? 600 : 400,
              background: sel ? "var(--color-brand-600)" : "transparent",
              color: sel ? "var(--color-white)" : "var(--color-text-primary)",
              borderRadius: sel ? 10 : 0,
            }}
          >
            {fmt(n)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 15 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--color-bg-primary)", borderRadius: "20px 20px 0 0", zIndex: 1 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)", margin: "12px auto 8px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0 16px", borderBottom: "1px solid var(--color-border-default)" }}>
          <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)" }}>{label}</span>
          <button type="button" onClick={onClose} style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <X size={20} color="var(--color-icon-default)" strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 8, padding: "16px 16px 8px" }}>
          {drumCol(hourRef, hours, selHour, commitHour)}
          <div style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", height: ITEM_H, display: "flex", alignItems: "center" }}>:</div>
          {drumCol(minuteRef, minutes, selMinute, commitMinute)}
        </div>
        <div style={{ padding: "8px 16px 36px" }}>
          <button type="button" onClick={onClose}
            style={{ width: "100%", minHeight: 48, borderRadius: 10, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileTimePicker({ value, label, onOpen }) {
  const fmt = (n) => String(n).padStart(2, "0");
  const parseTime = (v) => {
    if (!v) return { h: 8, m: 50 };
    const [hStr, mStr] = v.split(":");
    return { h: parseInt(hStr, 10), m: parseInt(mStr, 10) };
  };
  const { h, m } = parseTime(value);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", minHeight: 52, width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
    >
      <span style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)" }}>{label}</span>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--color-border-default)", borderRadius: 8, height: 36, padding: "0 10px", background: "var(--color-bg-primary)" }}>
        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)" }}>{fmt(h)}:{fmt(m)}</span>
        <Clock size={14} strokeWidth={1.5} color="var(--color-icon-secondary)" />
      </div>
    </button>
  );
}

export default function ParentApp() {
  const [hasStarted, setHasStarted] = useState(true);
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [allChildren, setAllChildren] = useState(true); // launch default — Home shows the whole household; only ever true on Home
  const [activeTab, setActiveTab] = useState("home");
  const [homeDay, setHomeDay] = useState("30-Jun"); // demo: 30 Jun 2026 is "today"
  const homeStripRef = useRef(null); // Coming Up week strip — swipe snaps week by week
  const [subPage, setSubPage] = useState(null);

  // Centre the week strip on the current week when Home opens, so both past and future weeks
  // peek at the edges — the cue that you can swipe either way.
  useLayoutEffect(() => {
    if (activeTab !== "home" || subPage) return;
    const el = homeStripRef.current;
    if (!el) return;
    const cur = el.querySelector('[data-current-week="1"]');
    if (cur) el.scrollLeft = cur.offsetLeft - (el.clientWidth - cur.offsetWidth) / 2;
  }, [hasStarted, activeTab, subPage]);
  const [browseFilter, setBrowseFilter] = useState("all");
  const [clubDayFilter, setClubDayFilter] = useState(null); // null = all days; "mon"–"fri" = day filter
  const [wraparoundDayFilter, setWraparoundDayFilter] = useState(null);
  const [tripYearFilter, setTripYearFilter] = useState(null); // null = all years; "2025/2026" etc.
  const [bookingsFilter, setBookingsFilter] = useState("needs-attention");
  const [bookingsSectionState, setBookingsSectionState] = useState("attention"); // "attention" | "clear" | "empty"
  const [selectedUpcomingItem, setSelectedUpcomingItem] = useState(null);
  const [bookingReturnTo, setBookingReturnTo] = useState("list");
  const [bookingDetailDatesExpanded, setBookingDetailDatesExpanded] = useState(false);
  const [paymentTakeoverConfirmed, setPaymentTakeoverConfirmed] = useState(false);
  const [showTakeoverApplePay, setShowTakeoverApplePay] = useState(false);
  const [showPartialSheet, setShowPartialSheet] = useState(false);
  const [partialAmount, setPartialAmount] = useState(0);
  const [partialAmountFlash, setPartialAmountFlash] = useState(false);
  const partialFlashTimer = useRef(null);
  useEffect(() => { setPartialAmountFlash(false); }, [partialAmount]);
  const [partialPaymentToast, setPartialPaymentToast] = useState(null);
  const [takeoverPaymentAmount, setTakeoverPaymentAmount] = useState(0);
  useEffect(() => {
    if (!partialPaymentToast) return;
    const t = setTimeout(() => setPartialPaymentToast(null), 4000);
    return () => clearTimeout(t);
  }, [partialPaymentToast]);
  const [detailPage, setDetailPage] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubDatesError, setClubDatesError] = useState(false);
  const [clubCardError, setClubCardError] = useState(false);
  const [flowStep, setFlowStep] = useState(null); // "consent", "sessions", etc.
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [bookingOption, setBookingOption] = useState(null); // "term" or "individual"
  const [selectedBkPeriod, setSelectedBkPeriod] = useState(null); // selected membership period { id, name, type: "daily"|"termly", start, end, price, sessionsRemaining }
  const [bkScenarioId, setBkScenarioId] = useState("s1"); // "s1"–"s5" — prototype scenario switcher
  const [bkIsFree, setBkIsFree] = useState(false);
  const [bkAboutExpanded, setBkAboutExpanded] = useState(false);
  const [bkPatternApplied, setBkPatternApplied] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const browseSectionRef = useRef(null);
  const bkScrollRef = useRef(null);
  const bkWeek2Ref = useRef(null);
  const bkDetailRef = useRef(null);
  const [termExpanded, setTermExpanded] = useState(false);
  const [selectedDates, setSelectedDates] = useState({}); // scenario 1: { dateId: true }
  const [selectedDates2, setSelectedDates2] = useState({}); // scenario 2: { dateId: "timeSlot" }
  const [selectedGridDates, setSelectedGridDates] = useState({}); // scenario 3: { dayId: true }
  const [wraparoundClubConfig, setWraparoundClubConfig] = useState(afterSchoolClubConfigs.mon);
  const [selectedGridDates2, setSelectedGridDates2] = useState({}); // scenario 4: { dayId: "timeSlot" }
const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "apple"
  const [showApplePay, setShowApplePay] = useState(false);
  const [showStripeSheet, setShowStripeSheet] = useState(false);
  const [reviewDatesExpanded, setReviewDatesExpanded] = useState(false);
  const [detailDatesExpanded, setDetailDatesExpanded] = useState(false);
  const [cardFilled, setCardFilled] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [showTopUpSheet, setShowTopUpSheet] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(250);
  const [topUpMinFlash, setTopUpMinFlash] = useState(false);
  const topUpMinFlashTimer = useRef(null);
  const flashTopUpMinError = () => {
    setTopUpMinFlash(true);
    if (topUpMinFlashTimer.current) clearTimeout(topUpMinFlashTimer.current);
    topUpMinFlashTimer.current = setTimeout(() => setTopUpMinFlash(false), 2000);
  };
  useEffect(() => { setTopUpMinFlash(false); }, [topUpAmount]);
  const [topUpPaymentMethod, setTopUpPaymentMethod] = useState("card");
  const [showTopUpApplePay, setShowTopUpApplePay] = useState(false);
  const [topUpCardScreen, setTopUpCardScreen] = useState(false);
  const [topUpCardFilled, setTopUpCardFilled] = useState(false);
  const [toppedUpAmount, setToppedUpAmount] = useState(0);
  const [mealsTopUpAmount, setMealsTopUpAmount] = useState(0);
  const [showTopUpStripeSheet, setShowTopUpStripeSheet] = useState(false);
  const [showTopUpStripeApplePay, setShowTopUpStripeApplePay] = useState(false);
  const [showStandaloneTopUp, setShowStandaloneTopUp] = useState(false);
  const [standaloneTopUpAccount, setStandaloneTopUpAccount] = useState(null);
  const [txHistoryAccount, setTxHistoryAccount] = useState(null);
  const [txBalanceRevealed, setTxBalanceRevealed] = useState(false);
  const [txDragDx, setTxDragDx] = useState(null);
  const txPointerStartRef = useRef(null);
  const [showStandaloneTopUpStripeSheet, setShowStandaloneTopUpStripeSheet] = useState(false);
  const [showStandaloneTopUpApplePay, setShowStandaloneTopUpApplePay] = useState(false);
  const [standaloneTopUpAddedToBasket, setStandaloneTopUpAddedToBasket] = useState(false);
  const [standaloneTopUpSuccess, setStandaloneTopUpSuccess] = useState(false);
  const [dynamicTransactions, setDynamicTransactions] = useState({ meals: [], wraparound: [], milk: [] });
  const [confirmedDatesExpanded, setConfirmedDatesExpanded] = useState(false);
  const [messagesFilter, setMessagesFilter] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [readMessages, setReadMessages] = useState(new Set([1, 3, 5]));
  const [messagesSchool, setMessagesSchool] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState(false);
  const [replySending, setReplySending] = useState(false);
  const [replyFocused, setReplyFocused] = useState(false);
  const [threadReplies, setThreadReplies] = useState({
    4: [
      { id: "r4-1", sender: "You", body: "Hi Miss Taylor,\n\nJust to let you know that Molly has lost her reading log book. Could she have a new one please?\n\nShe's been reading every evening so I'd hate for her to lose track.\n\nMany thanks", date: "21 Feb 2026", time: "19:45", delivered: true },
    ],
    10: [
      { id: "r10-1", sender: "You", body: "Hi Mrs Clarke,\n\nI wanted to let you know that Ethan has been unwell this week and hasn't been able to finish his English essay that's due tomorrow.\n\nWould it be possible to have an extension until early next week?\n\nMany thanks", date: "18 Feb 2026", time: "20:30", delivered: true },
    ],
  });
  const repliesEnabledSchools = ["Oakwood Primary"];
  const threadRef = useRef(null);
  const msgListRef = useRef(null);
  const [msgListScrolled, setMsgListScrolled] = useState(false);
  const [extraSentMessages, setExtraSentMessages] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeSchool, setComposeSchool] = useState(null);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeErrors, setComposeErrors] = useState({});
  const [composeFocused, setComposeFocused] = useState(true);
  const [consentDecisions, setConsentDecisions] = useState({
    n6:  { decision: "given",    note: "",                                    date: "12 Jan 2026" },
    n9:  { decision: "given",    note: "",                                    date: "25 Sep 2025" },
    n7:  { decision: "given",    note: "",                                    date: "6 Sep 2025"  },
    n13: { decision: "given",    note: "",                                    date: "22 Jan 2026" },
    n14: { decision: "given",    note: "",                                    date: "10 Nov 2025" },
    n15: { decision: "given",    note: "",                                    date: "4 Jun 2025"  },
    n16: { decision: "given",    note: "",                                    date: "16 Oct 2025" },
    n17: { decision: "declined", note: "Molly has a prior commitment that week.", date: "5 Mar 2025" },
    n8:  { decision: "declined", note: "Ethan is not able to attend.",        date: "18 Nov 2025" },
    n20: { decision: "given",    note: "",                                    date: "15 Jan 2026" },
    n21: { decision: "given",    note: "",                                    date: "5 Sep 2025"  },
  });
  const [consentPendingAction, setConsentPendingAction] = useState({});
  const [consentNotes, setConsentNotes] = useState({});
  const [consentDetailOpen, setConsentDetailOpen] = useState({});
  const [fadingConsents, setFadingConsents] = useState({});
  const [showAllConsents, setShowAllConsents] = useState({});
  const [pastConsentsExpanded, setPastConsentsExpanded] = useState({});
  const [consentToast, setConsentToast] = useState(null);
  const [consentToastFading, setConsentToastFading] = useState(false);
  const [consentPageChild, setConsentPageChild] = useState(children[0]);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(false); // Coming Up — subscribe-to-calendar placeholder
  const [profileChild, setProfileChild] = useState(null);
  const [profileScreen, setProfileScreen] = useState(null); // "notifications", "help", "delete-confirm", "delete-done"
  const [notifToggles, setNotifToggles] = useState({ messages: true, payments: true, meals: true, attendance: true });
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [securityView, setSecurityView] = useState("overview");
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [bookingNudgeRating, setBookingNudgeRating] = useState(null);
  const [feedbackCategory, setFeedbackCategory] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);

  // --- Pending payment bookings shared between landing banner + needs attention list ---
  const [archeryAmountPaid, setArcheryAmountPaid] = useState(15);
  const archeryBooking = {
    id: "c2",
    title: "Archery",
    category: "Club",
    status: "pending-payment",
    paymentModel: "variable",
    icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,
    sub: "10 Apr – 17 Jul 2026",
    dateRange: "10 Apr – 17 Jul 2026",
    nextSession: "Fri 10 Apr",
    days: "Fri",
    time: "15:30–16:30",
    sessions: 10,
    child: "Molly",
    childColour: children[0].avatarColour,
    totalCost: 50,
    amountPaid: archeryAmountPaid,
    balanceOwed: 50 - archeryAmountPaid,
    minimumContribution: 10,
    paymentDeadline: new Date(2026, 6, 17),
    location: "Sports Field",
    clubLead: "Mr Patel",
    description: "Archery Club teaches the fundamentals of target archery in a safe, supervised environment. Children learn stance, aim, and release under qualified coaches, building focus and precision over the term.",
    dates: [
      { id: "arch-apr10", label: "Fri 10 Apr", past: true },
      { id: "arch-apr17", label: "Fri 17 Apr", past: true },
      { id: "arch-apr24", label: "Fri 24 Apr", past: true },
      { id: "arch-may1",  label: "Fri 1 May",  past: true },
      { id: "arch-may8",  label: "Fri 8 May",  past: true },
      { id: "arch-may15", label: "Fri 15 May", past: true },
      { id: "arch-may22", label: "Fri 22 May", past: true },
      { id: "arch-may29", label: "Fri 29 May" },
      { id: "arch-jun5",  label: "Fri 5 Jun" },
      { id: "arch-jun12", label: "Fri 12 Jun" },
    ],
  };
  // PGL residential trip — instalment booking; balance chips down as the parent pays
  const [pglAmountPaid, setPglAmountPaid] = useState(85);
  const pglTrip = {
    id: "t1",
    title: "Year 4 residential – PGL",
    category: "Trip",
    paymentModel: "instalment",
    icon: <Bus size={24} color={catColours["Trip"].iconColor} strokeWidth={1.5} />,
    child: "Molly",
    childColour: children[0].avatarColour,
    dateRange: "Tue 12 – Thu 14 May 2026",
    time: "08:00–17:00",
    location: "Marchants Hill, Surrey",
    clubLead: "Mrs Hughes",
    description: "A 3-day residential adventure trip for Year 4 pupils at PGL Marchants Hill. Activities include zip wire, climbing, and team challenges. All meals and accommodation included.",
    totalCost: 185,
    amountPaid: pglAmountPaid,
    balanceOwed: 185 - pglAmountPaid,
    paymentDeadline: new Date(2026, 4, 1),
  };
  // Count = Cancelled Art (u4) + PGL trip (when balance owed) + Archery (when balance owed)
  // (Coding Provisional c1 archived 2026-05-29 — see ARCHIVED block below)
  // These items are all Molly's; Lucas and Ethan have nothing needing attention, so their count is 0
  // (no amber badge on the card or bottom nav, and Bookings & orders opens straight to Upcoming).
  const bookingsNeedsAttentionCount = selectedChild.name === "Molly"
    ? 1 + (pglTrip.balanceOwed > 0 ? 1 : 0) + (archeryBooking.balanceOwed > 0 ? 1 : 0)
    : 0;

  // --- Absence reporting ---
  const [myChildPage, setMyChildPage] = useState(null); // null | "absence-form" | "absence-success"
  const [absenceMultiDay, setAbsenceMultiDay] = useState(false);
  const [absenceStartDate, setAbsenceStartDate] = useState("2026-04-22");
  const [absenceEndDate, setAbsenceEndDate] = useState("2026-04-23");
  const [absenceStartTime, setAbsenceStartTime] = useState("08:50");
  const [absenceEndTime, setAbsenceEndTime] = useState("15:15");
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceOtherText, setAbsenceOtherText] = useState("");
  const [absenceNote, setAbsenceNote] = useState("");
  const [absenceErrors, setAbsenceErrors] = useState({});
  const [absenceSending, setAbsenceSending] = useState(false);
  const [showAbsenceCancelSheet, setShowAbsenceCancelSheet] = useState(false);
  const [absenceDatePickerActive, setAbsenceDatePickerActive] = useState(null); // null | "start" | "end"
  const [absenceTimePickerActive, setAbsenceTimePickerActive] = useState(null); // null | "start" | "end"
  const [absenceOtherExpanded, setAbsenceOtherExpanded] = useState(false);

  const [basketsBySchool, setBasketsBySchool] = useState({});
  const basketCount = basketsBySchool[selectedChild.school] || 0;
  const [basketToast, setBasketToast] = useState(null); // null | { title, child }
  const [basketToastFading, setBasketToastFading] = useState(false);
  // Race-at-commit (full states Part B): clubs whose space was lost at the commit tap, plus the "just filled up" sheet.
  const [raceFilledIds, setRaceFilledIds] = useState(() => new Set());      // club ids that raced fully full (whole club gone)
  const [racedPeriodIds, setRacedPeriodIds] = useState(() => new Set());    // period ids that raced full (single option gone, club may still have others)
  const [raceSheet, setRaceSheet] = useState(null); // null | { scope: "club"|"option", title, optionLabel?, periodId? }
  useEffect(() => {
    if (!basketToast) return;
    const t = setTimeout(() => {
      setBasketToastFading(true);
      setTimeout(() => { setBasketToast(null); setBasketToastFading(false); }, 400);
    }, 4000);
    return () => clearTimeout(t);
  }, [basketToast]);

  // Date conversion helpers for DatePicker (works in local time, avoids UTC offset issues)
  const dateFromStr = (s) => { if (!s) return undefined; const [y, m, d] = s.split('-'); return new Date(+y, +m - 1, +d); };
  const strFromDate = (d) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : "";

  const absenceReasonOptions = [
    { value: "Illness or injury", label: "Illness or injury" },
    { value: "Medical appointment", label: "Medical appointment" },
    { value: "Dental appointment", label: "Dental appointment" },
    { value: "Mental health", label: "Mental health" },
    { value: "Bereavement or family loss", label: "Bereavement or family loss" },
    { value: "Religious observance", label: "Religious observance" },
    { value: "Family emergency", label: "Family emergency" },
    { value: "Holiday during term time", label: "Holiday during term time" },
    { value: "Quarantine / infectious disease", label: "Quarantine / infectious disease" },
    { value: "Other", label: "Other" },
  ];

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: "", color: "#ddd", width: "0%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "#c44", width: "20%" };
    if (score === 2) return { label: "Fair", color: "#e88", width: "40%" };
    if (score === 3) return { label: "Good", color: "#eb4", width: "60%" };
    if (score === 4) return { label: "Strong", color: "#8b5", width: "80%" };
    return { label: "Very strong", color: "#4a4", width: "100%" };
  };

  const formatAbsenceDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
  };

  const formatAbsenceTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const isAbsenceFormDirty = absenceReason !== "" || absenceNote.trim() !== "" || absenceMultiDay;

  const resetAbsenceForm = () => {
    setAbsenceMultiDay(false);
    setAbsenceStartDate("2026-04-22");
    setAbsenceEndDate("2026-04-23");
    setAbsenceStartTime("08:50");
    setAbsenceEndTime("15:15");
    setAbsenceReason("");
    setAbsenceOtherText("");
    setAbsenceNote("");
    setAbsenceErrors({});
    setAbsenceSending(false);
    setShowAbsenceCancelSheet(false);
    setAbsenceDatePickerActive(null);
    setAbsenceTimePickerActive(null);
    setAbsenceOtherExpanded(false);
  };

  const handleAbsenceSubmit = () => {
    const errs = {};
    if (!absenceStartDate) errs.startDate = "Please select a date";
    if (absenceMultiDay && !absenceEndDate) errs.endDate = "Please select an end date";
    if (!absenceReason) errs.reason = "Please select a reason for the absence";
    if (absenceReason === "Other" && !absenceOtherText.trim()) {
      errs.otherText = "Please describe the reason for the absence";
    }
    setAbsenceErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setAbsenceSending(true);
    setTimeout(() => {
      setAbsenceSending(false);
      setMyChildPage("absence-success");
    }, 900);
  };
  const allNotices = [
    { id: "n1", type: "Consent", title: "Swimming lessons – Year 3", child: "Molly", school: "Oakwood Primary", description: "Year 3 swimming lessons will take place every Monday from 14 Apr to 14 Jul at Greenfield Leisure Centre.\n\nChildren will travel by coach and be supervised by school staff and qualified instructors at all times.\n\nSwimming caps are required (available from the school office for £2). Children with long hair must tie it back.\n\nPlease give or decline consent below.", date: "25 Feb 2026" },
    { id: "n2", type: "Consent", title: "Science trip – Natural History Museum", child: "Ethan", school: "Riverside Secondary", description: "Year 9 have been offered a trip to the Natural History Museum on Friday 4 Apr.\n\nThe cost is £18 per student, covering coach travel and a guided workshop. Students will need a packed lunch and should wear school uniform.\n\nDeparture: 8:15am from the bus bay. Expected return: 4:00pm.\n\nPlease give or decline consent below.", date: "26 Feb 2026" },
    { id: "n3", type: "Consent", title: "School photo permissions 2025/26", child: "Lucas", school: "Oakwood Primary", description: "We would like your permission to use photographs of your child in school publications, on the school website, and on our social media channels.\n\nPhotos are used to celebrate achievements and school events. No child's full name is published alongside their image.\n\nYou may withdraw consent at any time by contacting the school office.\n\nPlease give or decline consent below.", date: "20 Feb 2026" },
    { id: "n4", type: "Consent", title: "Sports Day participation 2026", child: "Lucas", school: "Oakwood Primary", description: "Sports Day will take place on Friday 26 Jun on the school field.\n\nAll children are welcome to participate in running, throwing and jumping events. Please ensure your child comes in their PE kit and brings sunscreen and a water bottle.\n\nPlease give or decline consent below.", date: "27 Feb 2026" },
    { id: "n5", type: "Consent", title: "After-school cookery club – Summer term", child: "Lucas", school: "Oakwood Primary", description: "We are offering a cookery club on Thursdays from 3:30–4:30pm, starting 24 Apr.\n\nThe cost is £5 per session, payable termly (£60). Children will cook simple recipes and take their food home each week.\n\nPlease give or decline consent below.", date: "28 Feb 2026" },
    { id: "n6", type: "Consent", title: "School trip – Tate Modern", child: "Lucas", school: "Oakwood Primary", description: "Historical notice.", date: "10 Jan 2026" },
    { id: "n9", type: "Consent", title: "Class trip – Bekonscot Model Village", child: "Lucas", school: "Oakwood Primary", description: "Historical notice.", date: "24 Sep 2025" },
    { id: "n10", type: "Consent", title: "Year 4 residential – Stubbington Study Centre", child: "Molly", school: "Oakwood Primary", description: "Year 4 are going on a 3-night residential to Stubbington Study Centre from Monday 12 May to Thursday 15 May.\n\nActivities include coastal fieldwork, night walks and team challenges. The cost is £285 per child, covering all meals, accommodation and activities. A deposit of £50 is due by 28 Mar.\n\nChildren should bring named clothing and a small amount of spending money (no more than £10).\n\nPlease give or decline consent below.", date: "3 Mar 2026" },
    { id: "n11", type: "Consent", title: "PSHE survey – Wellbeing and safety", child: "Molly", school: "Oakwood Primary", description: "As part of our PSHE curriculum, all Year 4 children are invited to take part in an anonymous wellbeing survey.\n\nThe survey covers topics including friendships, feelings and staying safe online. It is conducted by a specialist external provider, and no personally identifiable information is collected.\n\nResults are used to shape our pastoral support programme.\n\nPlease give or decline consent below.", date: "4 Mar 2026" },
    { id: "n12", type: "Consent", title: "After-school drama club – Summer term", child: "Molly", school: "Oakwood Primary", description: "We are offering a drama club for Year 4 children on Tuesdays from 3:30–4:30pm, starting 29 Apr.\n\nThe club will culminate in a short end-of-term performance for parents on Wednesday 16 Jul at 5:30pm.\n\nThe cost is £4 per session, payable termly (£48). Places are limited to 20 children.\n\nPlease give or decline consent below.", date: "5 Mar 2026" },
    { id: "n13", type: "Consent", title: "Swimming lessons – Year 4", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "20 Jan 2026" },
    { id: "n7", type: "Consent", title: "Media permission 2024/25", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "5 Sep 2025" },
    { id: "n14", type: "Consent", title: "School trip – Science Museum", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "8 Nov 2025" },
    { id: "n15", type: "Consent", title: "Sports Day participation 2025", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "2 Jun 2025" },
    { id: "n16", type: "Consent", title: "Flu vaccination 2025", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "15 Oct 2025" },
    { id: "n17", type: "Consent", title: "Year 3 residential – Stubbers Adventure", child: "Molly", school: "Oakwood Primary", description: "Historical notice.", date: "3 Mar 2025" },
    { id: "n18", type: "Consent", title: "Duke of Edinburgh – Bronze award", child: "Ethan", school: "Riverside Secondary", description: "Riverside Secondary is pleased to offer students the opportunity to complete the Duke of Edinburgh Bronze Award.\n\nThe programme involves 3 months of volunteering, physical activity and skill development, plus a 2-day assessed expedition in the Surrey Hills (dates TBC, approximately June).\n\nThe registration fee is £25. Expedition kit can be borrowed from school at no cost.\n\nPlease give or decline consent below.", date: "4 Mar 2026" },
    { id: "n19", type: "Consent", title: "Work experience placement consent", child: "Ethan", school: "Riverside Secondary", description: "Work experience will take place from Monday 23 Jun to Friday 27 Jun.\n\nStudents are responsible for arranging their own placement (a list of local employers is available from the careers office). Once a placement is confirmed, parents are asked to sign this consent form and return it by 30 Apr.\n\nPlease give or decline consent below.", date: "5 Mar 2026" },
    { id: "n8", type: "Consent", title: "Residential trip – Kingswood", child: "Ethan", school: "Riverside Secondary", description: "Historical notice.", date: "15 Nov 2025" },
    { id: "n20", type: "Consent", title: "Year 9 theatre trip – National Theatre", child: "Ethan", school: "Riverside Secondary", description: "Historical notice.", date: "14 Jan 2026" },
    { id: "n21", type: "Consent", title: "Media permission 2024/25", child: "Ethan", school: "Riverside Secondary", description: "Historical notice.", date: "4 Sep 2025" },
  ];
  const inboxMessageIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const unreadCount = inboxMessageIds.filter(id => !readMessages.has(id)).length;

  // Per-child wallet balances — single source of truth for the landing, booking flows and top-up.
  // Molly is the live top-up demo (£3.50 base, low Meals). Lucas: healthy Meals, low Wraparound.
  // Ethan (secondary): healthy Meals, no Wraparound wallet. Top-up amounts still apply on top.
  const baseMealsBalance = selectedChild.name === "Ethan" ? 64.0 : selectedChild.name === "Lucas" ? 52.0 : 3.50;
  const baseWraparoundBalance = selectedChild.name === "Lucas" ? 4.50 : selectedChild.name === "Ethan" ? 0 : 80.0;
  const mealsBalance = baseMealsBalance + mealsTopUpAmount;
  const wraparoundBalance = baseWraparoundBalance + toppedUpAmount;
  const lowFundsThreshold = 5.0;

  // Active breakfast scenario — driven by the prototype scenario switcher
  const activeBkPeriods = bkScenarioId === "s2" ? bkPeriodsS2 : bkScenarioId === "s3" ? bkPeriodsS3 : bkScenarioId === "s4" ? bkPeriodsS4 : bkScenarioId === "s5" ? bkPeriodsS5 : bkPeriodsS1;
  const activeBkTimesVary = new Set(activeBkPeriods.map(p => `${p.start}–${p.end}`)).size > 1;
  const activeBkDaysVary  = new Set(activeBkPeriods.map(p => p.days)).size > 1;
  const activeBkTypesVary = new Set(activeBkPeriods.map(p => p.type)).size > 1;
  const activeBkPeriodMeta = (p) => `${expandDay(p.days)} · ${p.start}–${p.end}`;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const clubExtras = {
    1: {
      about: "Our Drumming Club introduces children to the exciting world of percussion in a fun, supportive group setting. They'll develop rhythm, coordination, and timing skills while learning a variety of drumming styles and techniques — building confidence and working towards a group performance.",
      bullets: [
        "No prior experience required",
        "All equipment provided",
        "Led by experienced music tutors",
      ],
      sessionDates: [
        { id: "mon-apr7",  label: "Mon 7 Apr",   past: true },
        { id: "mon-apr14", label: "Mon 14 Apr",  past: true },
        { id: "mon-apr28", label: "Mon 28 Apr",  active: true },
        { id: "mon-may5",  label: "Mon 5 May",     active: true },
        { id: "mon-may12", label: "Mon 12 May",    active: true },
        { id: "mon-may19", label: "Mon 19 May",    active: true },
        { id: "mon-may26", label: "Mon 26 May",    active: false, note: "Half term" },
        { id: "mon-jun2",  label: "Mon 2 Jun",    active: true },
        { id: "mon-jun9",  label: "Mon 9 Jun",    active: true },
        { id: "mon-jun16", label: "Mon 16 Jun",   active: true },
        { id: "mon-jun23", label: "Mon 23 Jun",   active: true },
      ],
      blockSessions: 10, blockPrice: 110, isFree: false, termlyLabel: "Summer term 2026",
    },
    5: {
      about: "Join our Football Club and develop your skills on the pitch in a fun, structured environment. Players work on passing, shooting, and tactical awareness across the term, building teamwork and finishing with a mini tournament.",
      bullets: ["All abilities welcome", "Qualified FA-trained coaches", "Bibs and training equipment provided"],
      periods: [
        // Demo: Tuesday is already full (static per-option full), Wednesday is open. Wednesday termly races full at commit
        // (raceFull) while Wednesday daily survives → exercises the "this option went, others remain" race variant.
        { id: "5-tue-daily",  type: "daily",  days: "Tue",   label: "Tuesdays only",   start: "15:30", end: "16:30", price: 8,  sessionsRemaining: null, dayKey: "tue", full: true },
        { id: "5-tue-termly", type: "termly", days: "Tue",   label: "Tuesdays only",   start: "15:30", end: "16:30", price: 80, sessionsRemaining: 10,   dayKey: "tue", full: true },
        { id: "5-wed-daily",  type: "daily",  days: "Wed", label: "Wednesdays only", start: "16:00", end: "17:00", price: 8,  sessionsRemaining: null, dayKey: "wed" },
        { id: "5-wed-termly", type: "termly", days: "Wed", label: "Wednesdays only", start: "16:00", end: "17:00", price: 80, sessionsRemaining: 10,   dayKey: "wed", raceFull: true },
      ],
      sessionDates: [
        { id: "tue-apr14", label: "Tue 14 Apr",  past: true,          time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-apr15", label: "Wed 15 Apr",  past: true,          time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-apr21", label: "Tue 21 Apr",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-apr22", label: "Wed 22 Apr",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-apr28", label: "Tue 28 Apr",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-apr29", label: "Wed 29 Apr",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-may5",  label: "Tue 5 May",   active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-may6",  label: "Wed 6 May",   active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-may12", label: "Tue 12 May",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-may13", label: "Wed 13 May",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-may19", label: "Tue 19 May",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-may20", label: "Wed 20 May",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-may26", label: "Tue 26 May",  active: false, note: "Half term", time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-may27", label: "Wed 27 May",  active: false, note: "Half term", time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-jun2",  label: "Tue 2 Jun",   active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-jun3",  label: "Wed 3 Jun",   active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-jun9",  label: "Tue 9 Jun",   active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-jun10", label: "Wed 10 Jun",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-jun16", label: "Tue 16 Jun",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-jun17", label: "Wed 17 Jun",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-jun23", label: "Tue 23 Jun",  active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-jun24", label: "Wed 24 Jun",  active: true,        time: "16:00\u201317:00", dayKey: "wed" },
        { id: "tue-jul7",  label: "Tue 7 Jul",   active: true,        time: "15:30\u201316:30", dayKey: "tue" },
        { id: "wed-jul8",  label: "Wed 8 Jul",   active: true,        time: "16:00\u201317:00", dayKey: "wed" },
      ],
      perSessionPrice: 8, blockSessions: 10, blockPrice: 80, isFree: false,
    },
    /* ARCHIVED 2026-05-29 — Coding Club + provisional payment model. Provisional bookings are portal-only for now. Restore by uncommenting + restoring needsAttention count.
    7: {
      about: "Coding Club introduces children to programming through hands-on projects using Scratch, Python, and web basics. Sessions are accessible and engaging, helping children develop logical thinking and problem-solving skills.",
      bullets: ["No prior coding experience required", "Devices and software provided", "Projects become progressively more challenging"],
      sessionDates: [
        { id: "thu-apr16", label: "Thu 16 Apr",  active: true },
        { id: "thu-apr23", label: "Thu 23 Apr",  active: true },
        { id: "thu-apr30", label: "Thu 30 Apr",  active: true },
        { id: "thu-may7",  label: "Thu 7 May",     active: true },
        { id: "thu-may14", label: "Thu 14 May",    active: true },
        { id: "thu-may21", label: "Thu 21 May",    active: true },
        { id: "thu-may28", label: "Thu 28 May",    active: false, note: "Half term" },
        { id: "thu-jun4",  label: "Thu 4 Jun",    active: true },
        { id: "thu-jun11", label: "Thu 11 Jun",   active: true },
        { id: "thu-jun18", label: "Thu 18 Jun",   active: true },
        { id: "thu-jun25", label: "Thu 25 Jun",   active: true },
        { id: "thu-jul9",  label: "Thu 9 Jul",    active: true },
      ],
      perSessionPrice: 7, blockSessions: 11, blockPrice: 77, isFree: false, dailyLabel: "Drop-in", termlyLabel: "Summer term 2026",
    },
    */
    28: {
      about: "Forest School at Oakwood gives children weekly outdoor learning sessions in our woodland area. Activities include shelter building, fire safety, nature crafts, and seasonal exploration. Children develop resilience, creativity, and confidence in the outdoors.",
      bullets: ["Suitable clothing provided if needed", "All weather — sessions run rain or shine", "Run by qualified Forest School practitioners"],
      sessionDates: [
        { id: "fs-apr17", label: "Fri 17 Apr", active: true },
        { id: "fs-apr24", label: "Fri 24 Apr", active: true },
        { id: "fs-may1",  label: "Fri 1 May",  active: true },
        { id: "fs-may8",  label: "Fri 8 May",  active: true },
        { id: "fs-may15", label: "Fri 15 May", active: true },
        { id: "fs-may22", label: "Fri 22 May", active: true },
        { id: "fs-may29", label: "Fri 29 May", active: false, note: "Half term" },
        { id: "fs-jun5",  label: "Fri 5 Jun",  active: true },
        { id: "fs-jun12", label: "Fri 12 Jun", active: true },
        { id: "fs-jun19", label: "Fri 19 Jun", active: true },
        { id: "fs-jun26", label: "Fri 26 Jun", active: true },
      ],
      perSessionPrice: 6, blockSessions: 10, blockPrice: 60, isFree: false, dailyLabel: "Drop-in", termlyLabel: "Summer term 2026",
    },
    29: {
      about: "Archery Club teaches the fundamentals of target archery in a safe, supervised environment. Children learn stance, aim, and release under qualified coaches, building focus and precision over the term.",
      bullets: ["All equipment provided", "Safe and supervised by qualified instructors", "Beginners welcome — friendly progression"],
      sessionDates: [
        { id: "arch-apr17-b", label: "Fri 17 Apr", active: true },
        { id: "arch-apr24-b", label: "Fri 24 Apr", active: true },
        { id: "arch-may1-b",  label: "Fri 1 May",  active: true },
        { id: "arch-may8-b",  label: "Fri 8 May",  active: true },
        { id: "arch-may15-b", label: "Fri 15 May", active: true },
        { id: "arch-may22-b", label: "Fri 22 May", active: true },
        { id: "arch-may29-b", label: "Fri 29 May", active: false, note: "Half term" },
        { id: "arch-jun5-b",  label: "Fri 5 Jun",  active: true },
        { id: "arch-jun12-b", label: "Fri 12 Jun", active: true },
        { id: "arch-jun19-b", label: "Fri 19 Jun", active: true },
      ],
      perSessionPrice: 5, blockSessions: 10, blockPrice: 50, isFree: false, dailyLabel: "Drop-in", termlyLabel: "Summer term 2026",
    },
    16: {
      about: "Chess Club is open to all abilities, from complete beginners to more experienced players. Children learn the rules and strategies of the game in a calm, focused setting — building patience, concentration, and problem-solving skills.",
      bullets: ["No experience needed", "All equipment provided", "Friendly matches and puzzles each session"],
      sessionDates: [
        { id: "mon-apr13", label: "Mon 13 Apr",  active: true },
        { id: "mon-apr20", label: "Mon 20 Apr",  active: true },
        { id: "mon-apr27", label: "Mon 27 Apr",  active: true },
        { id: "mon-may4",  label: "Mon 4 May",     active: true },
        { id: "mon-may11", label: "Mon 11 May",    active: true },
        { id: "mon-may18", label: "Mon 18 May",    active: true },
        { id: "mon-may25", label: "Mon 25 May",    active: false, note: "Half term" },
        { id: "mon-jun1",  label: "Mon 1 Jun",    active: true },
        { id: "mon-jun8",  label: "Mon 8 Jun",    active: true },
        { id: "mon-jun15", label: "Mon 15 Jun",   active: true },
        { id: "mon-jun22", label: "Mon 22 Jun",   active: true },
        { id: "mon-jul6",  label: "Mon 6 Jul",    active: true },
      ],
      perSessionPrice: 0, blockSessions: 11, blockPrice: 0, isFree: true, dailyLabel: "Drop-in",
    },
    18: {
      about: "School Choir is open to all voices — no audition required. Children learn songs spanning pop, folk, and classical styles, developing vocal skills and musicality in a welcoming, energetic group. The choir performs at school assemblies and end-of-term events.",
      bullets: ["All voices welcome — no audition", "Explores a range of musical styles", "Performs at assemblies and school events"],
      sessionDates: [
        { id: "tue-apr14", label: "Tue 14 Apr",  active: true },
        { id: "tue-apr21", label: "Tue 21 Apr",  active: true },
        { id: "tue-apr28", label: "Tue 28 Apr",  active: true },
        { id: "tue-may5",  label: "Tue 5 May",     active: true },
        { id: "tue-may12", label: "Tue 12 May",    active: true },
        { id: "tue-may19", label: "Tue 19 May",    active: true },
        { id: "tue-may26", label: "Tue 26 May",    active: false, note: "Half term" },
        { id: "tue-jun2",  label: "Tue 2 Jun",    active: true },
        { id: "tue-jun9",  label: "Tue 9 Jun",    active: true },
        { id: "tue-jun16", label: "Tue 16 Jun",   active: true },
        { id: "tue-jun23", label: "Tue 23 Jun",   active: true },
        { id: "tue-jul7",  label: "Tue 7 Jul",    active: true },
      ],
      perSessionPrice: 0, blockSessions: 11, blockPrice: 0, isFree: true, termlyLabel: "Summer term 2026",
    },
    20: {
      about: "Gymnastics Club builds strength, flexibility, and coordination through structured sessions led by qualified coaches. Children progress through floor work, vaulting, and balances, developing body awareness and confidence at their own pace.",
      bullets: ["All levels welcome", "Qualified gymnastics coaches", "Safe progression through the British Gymnastics framework"],
      sessionDates: [
        { id: "fri-apr17", label: "Fri 17 Apr",  active: true },
        { id: "fri-apr24", label: "Fri 24 Apr",  active: true },
        { id: "fri-may1",  label: "Fri 1 May",     active: true },
        { id: "fri-may8",  label: "Fri 8 May",     active: true },
        { id: "fri-may15", label: "Fri 15 May",    active: true },
        { id: "fri-may22", label: "Fri 22 May",    active: true },
        { id: "fri-may29", label: "Fri 29 May",    active: false, note: "Half term" },
        { id: "fri-jun5",  label: "Fri 5 Jun",    active: true },
        { id: "fri-jun12", label: "Fri 12 Jun",   active: true },
        { id: "fri-jun19", label: "Fri 19 Jun",   active: true },
        { id: "fri-jun26", label: "Fri 26 Jun",   active: true },
        { id: "fri-jul10", label: "Fri 10 Jul",   active: true },
      ],
      perSessionPrice: 9, blockSessions: 11, blockPrice: 99, isFree: false, dailyLabel: "Drop-in", termlyLabel: "Summer term 2026",
    },
    21: {
      about: "Drama Club is a space for children to build confidence, creativity, and teamwork through performance. Sessions cover improvisation, character work, and scripted scenes — all building towards a short performance at the end of term.",
      bullets: ["No experience needed", "Runs on Mondays and Thursdays", "End-of-term performance for parents"],
      sessionDates: [
        { id: "mon-apr13", label: "Mon 13 Apr",  active: true,  weekLabel: "Mon 13 – Fri 17 Apr" },
        { id: "thu-apr16", label: "Thu 16 Apr",  active: true },
        { id: "mon-apr20", label: "Mon 20 Apr",  active: true,  weekLabel: "Mon 20 – Fri 24 Apr" },
        { id: "thu-apr23", label: "Thu 23 Apr",  active: true },
        { id: "mon-apr27", label: "Mon 27 Apr",  active: true,  weekLabel: "Mon 27 Apr – Fri 1 May" },
        { id: "thu-apr30", label: "Thu 30 Apr",  active: true },
        { id: "mon-may4",  label: "Mon 4 May",     active: true,  weekLabel: "Mon 4 – Fri 8 May" },
        { id: "thu-may7",  label: "Thu 7 May",     active: true },
        { id: "mon-may11", label: "Mon 11 May",    active: true,  weekLabel: "Mon 11 – Fri 15 May" },
        { id: "thu-may14", label: "Thu 14 May",    active: true },
        { id: "mon-may18", label: "Mon 18 May",    active: true,  weekLabel: "Mon 18 – Fri 22 May" },
        { id: "thu-may21", label: "Thu 21 May",    active: true },
        { id: "mon-may25", label: "Mon 25 May",    active: false, note: "Half term", weekLabel: "Mon 25 – Fri 29 May" },
        { id: "thu-may28", label: "Thu 28 May",    active: false, note: "Half term" },
        { id: "mon-jun1",  label: "Mon 1 Jun",    active: true,  weekLabel: "Mon 1 – Fri 5 Jun" },
        { id: "thu-jun4",  label: "Thu 4 Jun",    active: true },
        { id: "mon-jun8",  label: "Mon 8 Jun",    active: true,  weekLabel: "Mon 8 – Fri 12 Jun" },
        { id: "thu-jun11", label: "Thu 11 Jun",   active: true },
        { id: "mon-jun15", label: "Mon 15 Jun",   active: true,  weekLabel: "Mon 15 – Fri 19 Jun" },
        { id: "thu-jun18", label: "Thu 18 Jun",   active: true },
        { id: "mon-jun22", label: "Mon 22 Jun",   active: true,  weekLabel: "Mon 22 – Fri 26 Jun" },
        { id: "thu-jun25", label: "Thu 25 Jun",   active: true },
        { id: "mon-jul6",  label: "Mon 6 Jul",    active: true,  weekLabel: "Mon 6 – Fri 10 Jul" },
        { id: "thu-jul9",  label: "Thu 9 Jul",    active: true },
      ],
      perSessionPrice: 8, blockSessions: 22, blockPrice: 176, isFree: false, dailyLabel: "Drop-in", termlyLabel: "Summer term 2026",
    },
    // ── Secondary clubs (Ethan, Riverside Secondary) ──
    40: { // Football (per-session, drop-in)
      about: "Competitive and recreational football coaching for all year groups, building fitness, technique and teamwork ahead of inter-school fixtures.",
      bullets: ["All abilities welcome", "FA-qualified coaching staff", "Boots and shin pads required"],
      sessionDates: secTueDates, perSessionPrice: 6, isFree: false, dailyLabel: "Drop-in",
    },
    41: { // Debate club (free, drop-in)
      about: "A weekly forum for developing public speaking, argument and critical thinking, with regular in-house debates and entry to inter-school competitions.",
      bullets: ["No experience needed", "Builds confidence and public speaking", "Run by the English department"],
      sessionDates: secThuDates, isFree: true, dailyLabel: "Drop-in",
    },
    42: { // STEM & robotics (termly block)
      about: "Hands-on engineering and coding sessions where students design, build and program robots, working towards a regional STEM challenge.",
      bullets: ["All equipment and kits provided", "No prior coding experience needed", "Led by the science and DT departments"],
      sessionDates: secMonDates, blockSessions: 10, blockPrice: 80, isFree: false, termlyLabel: "Summer term 2026",
    },
    43: { // Basketball (per-session, drop-in)
      about: "Fast-paced basketball training covering shooting, ball-handling and game play, with friendly fixtures against other schools through the term.",
      bullets: ["All abilities welcome", "Indoor courts, all weather", "Trainers required"],
      sessionDates: secFriDates, perSessionPrice: 6, isFree: false, dailyLabel: "Drop-in",
    },
    44: { // Senior choir (free, drop-in, morning)
      about: "A morning choir rehearsing a varied repertoire and preparing for school concerts and community performances. Open to all voices.",
      bullets: ["No audition required", "All sheet music provided", "Performance opportunities through the year"],
      sessionDates: secWedDates, isFree: true, dailyLabel: "Drop-in",
    },
    45: { // Drama (termly block)
      about: "Practical drama workshops exploring performance, improvisation and stagecraft, culminating in an end-of-term showcase for families.",
      bullets: ["All abilities welcome", "Ends with a family showcase", "Run by the drama department"],
      sessionDates: secThuDates, blockSessions: 10, blockPrice: 70, isFree: false, termlyLabel: "Summer term 2026",
    },
    // ── Year 6 club (Lucas, Oakwood Primary) ──
    46: { // SATs booster (free, drop-in, morning)
      about: "A relaxed morning session offering extra support with reading, writing and maths in the run-up to the summer assessments. Light breakfast snacks provided.",
      bullets: ["Small groups with a class teacher", "Helps build confidence before assessments", "No booking commitment — come when it helps"],
      sessionDates: secWedDates, isFree: true, dailyLabel: "Drop-in",
    },
  };

  return (
    <>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulseWarning { 0% { box-shadow: 0 0 0 0 rgba(228, 114, 13, 0.45); } 70% { box-shadow: 0 0 0 8px rgba(228, 114, 13, 0); } 100% { box-shadow: 0 0 0 0 rgba(228, 114, 13, 0); } }`}</style>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "stretch" : "center",
        height: isMobile ? "100dvh" : undefined,
        minHeight: isMobile ? undefined : "100vh",
        width: "100%",
        background: isMobile ? "#fff" : "#e8e8e8",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        padding: isMobile ? 0 : 20,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: isMobile ? "100%" : 390,
          height: isMobile ? "100dvh" : 844,
          background: "#F8F8F8",
          borderRadius: isMobile ? 0 : 40,
          boxShadow: isMobile ? "none" : "0 4px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: isMobile ? "none" : "6px solid #222",
          position: "relative",
        }}
      >
        {hasStarted && (<>
        {/* Full-screen detail pages */}
        {/* ==================== SHARED S1 CLUBS FLOW ==================== */}

        {/* Club detail page — unified 3-card layout */}
        {detailPage === "club-detail" && !flowStep && selectedClub && (() => {
          const extras = clubExtras[selectedClub.id];
          const clubPeriods   = periodsForClub(selectedClub, extras);
          const clubTimesVary = new Set(clubPeriods.map(p => `${p.start}–${p.end}`)).size > 1;
          const clubDaysVary  = new Set(clubPeriods.map(p => p.days)).size > 1;
          const fmtPrice  = (n) => extras.isFree ? "Free" : (n % 1 === 0 ? `£${n}` : `£${n.toFixed(2)}`);
          const cDailyPds  = clubPeriods.filter(p => p.type === "daily");
          const cTermlyPds = clubPeriods.filter(p => p.type === "termly");
          const minDaily   = cDailyPds.length  ? Math.min(...cDailyPds.map(p => p.price))  : null;
          const minTermly  = cTermlyPds.length ? Math.min(...cTermlyPds.map(p => p.price)) : null;
          const allDates   = extras.sessionDates || [];
          const upcomingDates = allDates.filter(d => !d.past && d.active !== false);
          const priceHint  = extras.isFree ? "Free" : minDaily !== null
            ? (clubPeriods.length > 1 ? `From ${fmtPrice(minDaily)}` : fmtPrice(minDaily)) + " per session"
            : (clubPeriods.length > 1 ? `From ${fmtPrice(extras.blockPrice)}` : fmtPrice(extras.blockPrice)) + ` for ${extras.blockSessions} sessions`;
          const isMixedC  = cDailyPds.length > 0 && cTermlyPds.length > 0;
          const isSingleC = clubPeriods.length === 1;
          const effectivePeriod = selectedBkPeriod ?? (isSingleC ? clubPeriods[0] : null);
          // Per-option fullness: a period is full if the school marked it full, or it raced full this session.
          const isPeriodFull = (p) => p.full === true || racedPeriodIds.has(p.id);
          const availablePeriods = clubPeriods.filter(p => !isPeriodFull(p));
          const getContentC = (period) => {
            const d = expandDay(period.days);
            if (period.label) return { primary: period.label, secondary: `${d} · ${period.start}–${period.end}` };
            if (clubTimesVary && clubDaysVary) return { primary: `${d} · ${period.start}–${period.end}`, secondary: period.name };
            if (clubTimesVary) return { primary: `${period.start}–${period.end}`, secondary: `${period.name} · ${d}` };
            if (clubDaysVary)  return { primary: d, secondary: `${period.name} · ${period.start}–${period.end}` };
            return { primary: period.name, secondary: `${d} · ${period.start}–${period.end}` };
          };
          const scrollAfterRenderC = (el) => requestAnimationFrame(() => {
            const container = bkDetailRef.current;
            if (!container || !el) return;
            const cRect = container.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();
            if (eRect.bottom > cRect.bottom - 88) container.scrollTop += (eRect.bottom - cRect.bottom) + 88 + 8;
          });

          const monthOrder   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const termlyTotal  = effectivePeriod?.price ?? extras.blockPrice ?? 0;
          const isVariable   = selectedClub.paymentModel === "variable";
          const ctaLabel     = effectivePeriod?.type === "daily" ? "Choose sessions" : extras.isFree ? "Confirm booking" : `Pay now · £${termlyTotal.toFixed(2)}`;
          const onCta        = () => {
            if (!effectivePeriod) return;
            // Arbor-side space gate: re-check at the commit tap, before any handoff. If gone, interrupt with the "just filled up" sheet.
            // Granularity matters: the option you picked may have gone while siblings are still open (→ "option" sheet, stay in club),
            // or it was the last bookable option (→ "club" sheet, eject to browse).
            const willRace = (effectivePeriod.raceFull || selectedClub.raceOnCommit) && !isPeriodFull(effectivePeriod);
            if (willRace && !selectedClub.full) {
              const othersLeft = availablePeriods.some(p => p.id !== effectivePeriod.id);
              if (othersLeft) { const periodType = effectivePeriod.type === "termly" ? "full term" : "per session"; const baseLabel = effectivePeriod.label || selectedClub.title; setRaceSheet({ scope: "option", title: selectedClub.title, optionLabel: `${baseLabel} (${periodType})`, periodId: effectivePeriod.id }); }
              else setRaceSheet({ scope: "club", title: selectedClub.title });
              return;
            }
            if (!selectedBkPeriod) { setSelectedBkPeriod(effectivePeriod); setBookingOption(effectivePeriod.type === "termly" ? "term" : "individual"); }
            if (effectivePeriod.type === "daily") { setFlowStep("choose-dates"); setSelectedDates({}); setClubDatesError(false); }
            else if (extras.isFree) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }
            else { setTakeoverPaymentAmount(termlyTotal); setPaymentMethod("card"); setCardFilled(false); setShowStripeSheet(true); }
          };
          // Race sheet handlers.
          // CLUB variant (whole club gone): mark the club full so detail + browse show the A full-state.
          //   X / scrim stays on the now-full detail; "Browse other clubs" returns to the list.
          const markRacedFull = () => setRaceFilledIds(prev => { const n = new Set(prev); n.add(selectedClub.id); return n; });
          const dismissRace = () => { setRaceSheet(null); markRacedFull(); setSelectedClub(prev => prev ? { ...prev, full: true } : prev); };
          const browseFromRace = () => { setRaceSheet(null); markRacedFull(); setDetailPage(null); setSelectedClub(null); setFlowStep(null); setSelectedBkPeriod(null); };
          // OPTION variant (just that option gone, others remain): record the period as full, clear the selection,
          //   stay on the detail so the parent can pick another option (now showing the raced one flagged Full).
          const resolveOptionRace = () => { if (raceSheet?.periodId) setRacedPeriodIds(prev => { const n = new Set(prev); n.add(raceSheet.periodId); return n; }); setSelectedBkPeriod(null); setBookingOption(null); setRaceSheet(null); };
          const closeRaceSheet  = () => { if (raceSheet?.scope === "option") resolveOptionRace(); else dismissRace(); };
          const racePrimaryAction = () => { if (raceSheet?.scope === "option") resolveOptionRace(); else browseFromRace(); };
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-grey-050)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); setDetailDatesExpanded(false); setSelectedBkPeriod(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); setDetailDatesExpanded(false); setSelectedBkPeriod(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div ref={bkDetailRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "var(--color-white)", borderRadius: 8, margin: "8px 16px 0", border: "1px solid var(--color-grey-100)", paddingBottom: 24 }}>
                <div style={{ padding: "20px 16px 0" }}>
                  {/* Group 1: Title */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif", flex: "1 1 auto", minWidth: 0 }}>{selectedClub.title}</h2>
                    {selectedClub.full
                      ? <div style={{ flexShrink: 0 }}><Tag variant="neutral">Full</Tag></div>
                      : (() => {
                      const browseToday = new Date(2026, 3, 9);
                      const daysUntil = selectedClub.deadline ? Math.ceil((selectedClub.deadline - browseToday) / (1000 * 60 * 60 * 24)) : Infinity;
                      const isUrgent = daysUntil <= 7;
                      return isUrgent && selectedClub.deadlineLabel ? <div style={{ flexShrink: 0 }}><Tag variant="default">Sign up by {selectedClub.deadlineLabel}</Tag></div> : null;
                    })()}
                  </div>
                  <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.2 }}>For {selectedChild.name}</p>
                  <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                  {/* Group 2: Schedule */}
                  <div style={{ marginTop: 0 }}>
                    <div style={{ marginBottom: 12 }}>
                      {(() => {
                        const parts = getClubScheduleDetailParts(selectedClub, extras);
                        if (parts.multiDay) {
                          return (
                            <>
                              {parts.pairs.map((p, i) => (
                                <p key={i} style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: i === 0 ? 0 : "6px 0 0" }}>{p.label}</p>
                              ))}
                            </>
                          );
                        }
                        return <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{parts.label}</p>;
                      })()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, marginTop: 0, marginBottom: 0 }}>
                      <button onClick={() => setDetailDatesExpanded(!detailDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View all dates</span>
                        <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: detailDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                      </button>
                    </div>
                    {detailDatesExpanded && (() => {
                      const groups = {};
                      allDates.filter(d => !d.past).forEach(d => {
                        const parts = d.label.split(" ");
                        const month = parts[parts.length - 1];
                        const dayDisplay = parts.slice(0, -1).join(" ");
                        if (!groups[month]) groups[month] = [];
                        groups[month].push({ ...d, dayDisplay });
                      });
                      const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                      return (
                        <div style={{ marginTop: 12, textAlign: "left" }}>
                          {sortedMonths.map((month, mi) => (
                            <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                              {groups[month].map(d => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                  <span style={{ fontSize: "var(--font-size-3)", color: d.active !== false ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active !== false ? "none" : "line-through" }}>{d.label}</span>
                                  {d.active !== false
                                    ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{d.time || `${clubPeriods[0].start}–${clubPeriods[0].end}`}</span>
                                    : d.note && <Tag variant="neutral">{d.note}</Tag>}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  {(selectedClub.location || selectedClub.clubLead) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                      {selectedClub.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                          <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                          {selectedClub.location}
                        </span>
                      )}
                      {selectedClub.clubLead && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                          <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                          {selectedClub.clubLead}
                        </span>
                      )}
                    </div>
                  )}
                  {!bkAboutExpanded ? (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{extras.about}</p>
                      <button onClick={() => setBkAboutExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit", display: "block" }}>Read more</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: extras.bullets?.length ? "24px 0 6px" : "24px 0 0" }}>
                        {extras.about}
                        {!extras.bullets?.length && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                      </p>
                      {extras.bullets?.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {extras.bullets.map((pt, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", lineHeight: "1.5" }}>•</span>
                              <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: "1.5" }}>
                                {pt}{i === extras.bullets.length - 1 && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {/* Group 3: Booking — hidden when full (nothing to select) */}
                  {!selectedClub.full && (
                  <div style={{ marginTop: 24 }}>
                  {!isSingleC && <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: isVariable ? 4 : 12 }}>Booking options</div>}
                  {(() => {
                    const isSuggested = isVariable && (selectedClub.minimumContribution ?? 0) === 0;
                    const isMinThreshold = isVariable && (selectedClub.minimumContribution ?? 0) > 0;
                    const getCardTitle = (period) => period.type === "termly" ? "Full term" : "Per session";
                    const getSchoolName = (period) => period.label || (period.type === "termly" ? (extras.termlyLabel || null) : null);
                    const getSessionCount = (period) => period.type === "termly" ? (period.sessionsRemaining ?? extras.blockSessions ?? null) : null;
                    const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
                    const bkDayOrder = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
                    const sortedPeriods = [...clubPeriods].sort((a, b) => {
                      // Full options sink to the bottom — actionable choices lead.
                      const fA = isPeriodFull(a) ? 1 : 0;
                      const fB = isPeriodFull(b) ? 1 : 0;
                      if (fA !== fB) return fA - fB;
                      const dA = bkDayOrder[a.dayKey] ?? 99;
                      const dB = bkDayOrder[b.dayKey] ?? 99;
                      if (dA !== dB) return dA - dB;
                      if (a.start !== b.start) return toMin(a.start) - toMin(b.start);
                      return a.type === "daily" ? -1 : 1;
                    });
                    if (sortedPeriods.length === 1) {
                      const period = sortedPeriods[0];
                      const price = fmtPrice(period.price);
                      const name = getSchoolName(period);
                      const basis = getCardTitle(period);
                      // One option = no choice, so no radio. Static cost summary, matching the trips/full-state Cost box.
                      // School's membership name leads; the inferred basis (Full term / Per session) qualifies it.
                      // No name → basis promotes to the primary line, collapsing to the trip Cost-box shape.
                      return isMinThreshold ? (
                        <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{name || basis}</div>
                              {name && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{basis}</div>}
                            </div>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>{price}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Minimum deposit</span>
                            <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>£{selectedClub.minimumContribution}</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{name || basis}</div>
                            {name && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{basis}</div>}
                          </div>
                          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                            {isSuggested && <span style={{ fontSize: "var(--font-size-1)", fontWeight: 500, color: "var(--color-text-tertiary)", lineHeight: 1.2 }}>Suggested</span>}
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>{price}</span>
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {sortedPeriods.map((period) => {
                          const isTermly = period.type === "termly";
                          const price = fmtPrice(period.price);
                          const schoolName = getSchoolName(period);
                          // Full option = non-selectable row. No radio (nothing to choose), muted text, grey "Full" tag where
                          // the price/radio would be. A blank spacer keeps the label aligned with the selectable cards.
                          if (isPeriodFull(period)) {
                            return (
                              <div key={period.id} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", background: "var(--color-white)", border: "1px solid var(--color-grey-100)", borderRadius: 10 }}>
                                <div style={{ width: 20, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-secondary)" }}>{schoolName || getCardTitle(period)}</div>
                                  {schoolName && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getCardTitle(period)}</div>}
                                </div>
                                <div style={{ flexShrink: 0 }}><Tag variant="neutral">Full</Tag></div>
                              </div>
                            );
                          }
                          const isSelected = effectivePeriod?.id === period.id;
                          return (
                            <button key={period.id}
                              onClick={(e) => { setSelectedBkPeriod(period); setBookingOption(isTermly ? "term" : "individual"); scrollAfterRenderC(e.currentTarget); }}
                              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", background: isSelected ? "var(--color-brand-050)" : "var(--color-white)", border: isSelected ? "1px solid var(--color-brand-100)" : "1px solid var(--color-grey-100)", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                              <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "2px solid var(--color-brand-600)" : "2px solid var(--color-border-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-brand-600)" }} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{schoolName || getCardTitle(period)}</div>
                                {schoolName && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getCardTitle(period)}</div>}
                              </div>
                              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                                {isSuggested && <span style={{ fontSize: "var(--font-size-1)", fontWeight: 500, color: "var(--color-text-tertiary)", lineHeight: 1.2 }}>Suggested</span>}
                                <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>{price}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                  </div>
                  )}
                  {selectedClub.full && (
                  <div style={{ marginTop: 24 }}>
                    {clubPeriods.length === 1 ? (() => {
                      // Single option: the club-card cost summary (Full term / membership / price).
                      const period = clubPeriods[0];
                      const isTermly = period.type === "termly";
                      const name = period.label || (isTermly ? extras.termlyLabel : null);
                      const basis = isTermly ? "Full term" : "Per session";
                      return (
                        <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{name || basis}</div>
                            {name && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{basis}</div>}
                          </div>
                          <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>{fmtPrice(period.price)}</span>
                        </div>
                      );
                    })() : (
                      // Multiple options collapse to one read-only Cost box (trip shape), NOT a grey stack of the
                      // (now-irrelevant) option cards — that reads as disabled. "From £X" = price context; suffix dropped.
                      <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Cost</div>
                        <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>{extras.isFree ? "Free" : `From ${selectedClub.price}`}</span>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              </div>
            </div>
            {(effectivePeriod || selectedClub.full) && (
              <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)", borderTop: "1px solid var(--color-border-default)" }}>
                {selectedClub.full ? (
                  <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", textAlign: "center", lineHeight: 1.4, padding: "10px 0" }}>This club is full. Contact the school office if you have a question.</div>
                ) : (<>
                {effectivePeriod.type === "termly" && (
                  <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={onCta} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{ctaLabel}</button>
                  {effectivePeriod.type === "termly" && isVariable && (selectedClub.minimumContribution ?? 0) > 0 && (
                    <button onClick={() => { setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 })); setBasketToastFading(false); setBasketToast({ title: selectedClub.title, child: selectedChild.name, amount: termlyTotal }); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                  )}
                  {effectivePeriod.type === "termly" && isVariable && (
                    <button onClick={() => { const min = selectedClub.minimumContribution ?? 0; setPartialAmount(min > 0 ? min : termlyTotal); setPartialAmountFlash(false); setShowPartialSheet(true); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Pay a different amount</button>
                  )}
                  {effectivePeriod.type === "termly" && !extras.isFree && !isVariable && (
                    <button onClick={() => { setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 })); setBasketToastFading(false); setBasketToast({ title: selectedClub.title, child: selectedChild.name, amount: termlyTotal }); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                  )}
                  {effectivePeriod.type === "termly" && selectedClub.paymentModel === "provisional" && (
                    <button onClick={() => { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reserve &amp; pay later</button>
                  )}
                </div>
                </>)}
              </div>
            )}
            {raceSheet && (
              <div onClick={closeRaceSheet} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px", flexShrink: 0 }}>
                    <button onClick={closeRaceSheet} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 20px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", lineHeight: 1.3 }}>{(raceSheet.scope === "option" ? raceSheet.optionLabel : raceSheet.title)} just filled up</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 8, lineHeight: 1.5 }}>{raceSheet.scope === "option" ? "It was taken while you were booking, but other options are still available." : "The last space was taken while you were booking. Contact the school office if you have a question."}</div>
                  </div>
                  <div style={{ padding: "20px 16px 28px", flexShrink: 0 }}>
                    <button onClick={racePrimaryAction} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{raceSheet.scope === "option" ? "Choose another option" : "Browse other clubs"}</button>
                  </div>
                </div>
              </div>
            )}
            {showStripeSheet && !extras.isFree && (
              <div onClick={() => setShowStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                    <button onClick={() => setShowStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 4px" }}>
                    <button onClick={() => { setShowStripeSheet(false); setShowApplePay(true); setTimeout(() => { setShowApplePay(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                      <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                      <span>Pay</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                    <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                      </div>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                    <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                        <div style={{ width: 34, height: 24, borderRadius: 4, background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <button onClick={() => { setShowStripeSheet(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span>Pay £{(isVariable ? takeoverPaymentAmount : termlyTotal).toFixed(2)}</span>
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showApplePay && !extras.isFree && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <button onClick={() => setShowApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                    <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{termlyTotal.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                      <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                  </div>
                </div>
              </div>
            )}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-secondary)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}


        {/* Club choose dates - S1 checklist (single weekday) or week-grouped accordion (2+ weekdays) */}
        {detailPage === "club-detail" && flowStep === "choose-dates" && selectedClub && (() => {
          const extras = clubExtras[selectedClub.id];
          const dayKey = selectedBkPeriod?.dayKey;
          const filteredDates = extras.sessionDates.filter(d => !d.past && (!dayKey || d.dayKey === dayKey));
          const activeDates = filteredDates.filter(d => d.active !== false);
          const count = Object.keys(selectedDates).length;
          const allSelected = count === activeDates.length;
          const total = count * (extras.perSessionPrice || 0);
          const distinctWeekdays = new Set(activeDates.map(d => d.label.split(" ")[0]));
          const useWeekGrouping = distinctWeekdays.size >= 2;
          const weeks = [];
          if (useWeekGrouping) {
            let currentWeek = null;
            filteredDates.forEach(d => {
              if (d.weekLabel) { currentWeek = { label: d.weekLabel, days: [d] }; weeks.push(currentWeek); }
              else if (currentWeek) { currentWeek.days.push(d); }
            });
            weeks.forEach(w => { w.isHalfTerm = w.days.every(d => !d.active); });
          }
          const firstWeek = useWeekGrouping ? weeks.find(w => !w.isHalfTerm) : null;
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => { setFlowStep(null); setClubDatesError(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{selectedClub.title}</span>
                <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>For {selectedChild.name}</span>
              </div>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Select / deselect all — above card, clearly global */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => { if (allSelected) setSelectedDates({}); else { const a = {}; activeDates.forEach(d => { a[d.id] = true; }); setSelectedDates(a); } setClubDatesError(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>{allSelected ? "Deselect all" : "Select all"}</span>
                </button>
              </div>
              {useWeekGrouping ? (
                /* Week-grouped accordion — for clubs that meet on 2+ weekdays */
                <>
                  {weeks.map((week) => {
                    if (week.isHalfTerm) return (
                      <div key={week.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Calendar size={16} color="var(--color-text-tertiary)" strokeWidth={1.5} />
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>{week.label}</span>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>No sessions</span>
                          </div>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", background: "var(--color-grey-100)", borderRadius: 20, padding: "3px 10px" }}>Half term</span>
                      </div>
                    );
                    const isFirst = week === firstWeek;
                    const isExpanded = isFirst || expandedWeeks.has(week.label);
                    const weekSelCount = week.days.filter(d => d.id in selectedDates).length;
                    if (!isExpanded) {
                      return (
                        <button key={week.label} onClick={() => setExpandedWeeks(prev => new Set([...prev, week.label]))}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 16px", background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{week.label}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {weekSelCount > 0 && <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-white)", background: "var(--color-brand-600)", borderRadius: 99, padding: "2px 8px" }}>{weekSelCount}</span>}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        </button>
                      );
                    }
                    return (
                      <div key={week.label} style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "0 16px" }}>
                        <div onClick={!isFirst ? () => setExpandedWeeks(prev => { const next = new Set(prev); next.delete(week.label); return next; }) : undefined}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", cursor: isFirst ? "default" : "pointer" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>{week.label}</span>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>{selectedClub.time}</span>
                          </div>
                          {!isFirst && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 10L8 6L12 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        {week.days.map((d, i) => {
                          const isSelected = d.id in selectedDates;
                          return (
                            <button key={d.id} onClick={() => { if (!d.active) return; const next = { ...selectedDates }; if (isSelected) delete next[d.id]; else next[d.id] = true; setSelectedDates(next); setClubDatesError(false); }}
                              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", width: "100%", background: "none", borderTop: i === 0 ? "none" : "1px solid var(--color-grey-100)", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: d.active ? "pointer" : "default", fontFamily: "inherit", textAlign: "left" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {d.active ? (
                                  <div style={{ width: 16, height: 16, borderRadius: 4, border: isSelected ? "1px solid var(--color-brand-600)" : "1px solid var(--color-border-strong)", background: isSelected ? "var(--color-brand-600)" : "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {isSelected && <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                  </div>
                                ) : <div style={{ width: 16, height: 16, flexShrink: 0 }} />}
                                <span style={{ fontSize: "var(--font-size-4)", color: d.active ? "var(--color-text-primary)" : "var(--color-grey-600)", textDecoration: d.active ? "none" : "line-through" }}>{d.label}</span>
                              </div>
                              {!d.active && d.note && <Tag variant="neutral">{d.note}</Tag>}
                            </button>
                          );
                        })}
                        {isFirst && count > 0 && (
                          <button
                            onClick={() => {
                              setClubDatesError(false);
                              const selectedDays = new Set(Object.keys(selectedDates).map(id => { const d = activeDates.find(s => s.id === id); return d ? d.label.split(" ")[0] : null; }).filter(Boolean));
                              const next = {};
                              activeDates.forEach(d => { if (selectedDays.has(d.label.split(" ")[0])) next[d.id] = true; });
                              setSelectedDates(next);
                              setExpandedWeeks(new Set(weeks.filter(w => !w.isHalfTerm).map(w => w.label)));
                            }}
                            style={{ width: "100%", marginTop: 6, marginBottom: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 0", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)" }}>{(() => { const days = [...new Set(Object.keys(selectedDates).map(id => activeDates.find(s => s.id === id)?.label.split(" ")[0]).filter(Boolean))]; const dayLabel = days.length <= 1 ? days[0] : `${days.slice(0, -1).join(", ")} & ${days[days.length - 1]}`; return `Book every ${dayLabel}`; })()}</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                /* Dates card — month-grouped checklist (default, single-weekday clubs) */
                <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "0 16px" }}>
                  {(() => {
                    const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                    const grps = {};
                    filteredDates.forEach(d => {
                      const parts = d.label.split(" ");
                      const month = parts[parts.length - 1];
                      const dayDisplay = parts.slice(0, -1).join(" ");
                      if (!grps[month]) grps[month] = [];
                      grps[month].push({ ...d, dayDisplay });
                    });
                    const months = Object.keys(grps).sort((a, b) => mo.indexOf(a) - mo.indexOf(b));
                    return months.map((month, mi) => (
                      <div key={month} style={{ marginTop: 12, paddingBottom: mi < months.length - 1 ? 0 : 4 }}>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>{month} 2026</div>
                        {grps[month].map(d => {
                          const isSelected = d.id in selectedDates;
                          return (
                            <button key={d.id} onClick={() => { if (!d.active) return; const next = { ...selectedDates }; if (isSelected) delete next[d.id]; else next[d.id] = true; setSelectedDates(next); setClubDatesError(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", width: "100%", background: "none", borderTop: "1px solid var(--color-grey-100)", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: d.active ? "pointer" : "default", fontFamily: "inherit", textAlign: "left" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {d.active ? (
                                  <div style={{ width: 16, height: 16, borderRadius: 4, border: isSelected ? "1px solid var(--color-brand-600)" : "1px solid var(--color-border-strong)", background: isSelected ? "var(--color-brand-600)" : "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {isSelected && <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                  </div>
                                ) : <div style={{ width: 16, height: 16, flexShrink: 0 }} />}
                                <span style={{ fontSize: "var(--font-size-4)", color: d.active ? "var(--color-text-primary)" : "var(--color-grey-600)", textDecoration: d.active ? "none" : "line-through" }}>{d.label}</span>
                              </div>
                              {!d.active && d.note
                                ? <Tag variant="neutral">{d.note}</Tag>
                                : d.active && <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-tertiary)" }}>{selectedBkPeriod ? `${selectedBkPeriod.start}–${selectedBkPeriod.end}` : selectedClub.time}</span>
                              }
                            </button>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              {clubDatesError && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="6" stroke="var(--color-text-destructive)" strokeWidth="1.3" /><path d="M7 4V7.5" stroke="var(--color-text-destructive)" strokeWidth="1.3" strokeLinecap="round" /><circle cx="7" cy="10" r="0.8" fill="var(--color-text-destructive)" /></svg>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Please select at least one session to continue.</span>
                </div>
              )}
              {count > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-grey-700)" }}>{count} session{count !== 1 ? "s" : ""} selected</span>
                  <span style={{ fontSize: "var(--font-size-4)", fontWeight: 700, color: "var(--color-text-primary)" }}>{extras.isFree ? "Free" : `£${total.toFixed(2)}`}</span>
                </div>
              )}
              <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } setClubDatesError(false); if (extras.isFree) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); } else { setTakeoverPaymentAmount(total); setShowStripeSheet(true); } }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{extras.isFree ? "Confirm booking" : (count > 0 ? `Pay now · £${total.toFixed(2)}` : "Pay now")}</button>
                {selectedClub.paymentModel === "variable" && (
                  <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } setClubDatesError(false); setPartialAmount(total); setPartialAmountFlash(false); setShowPartialSheet(true); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Pay a different amount</button>
                )}
                {!extras.isFree && !(selectedClub.paymentModel === "variable" && (selectedClub.minimumContribution ?? 0) === 0) && (
                  <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } setClubDatesError(false); setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 })); setBasketToastFading(false); setBasketToast({ title: selectedClub.title, child: selectedChild.name, amount: total }); setFlowStep(null); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                )}
                {selectedClub.paymentModel === "provisional" && (
                  <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } setClubDatesError(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reserve &amp; pay later</button>
                )}
              </div>
            </div>
            {showStripeSheet && !extras.isFree && (
              <div onClick={() => setShowStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                    <button onClick={() => setShowStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 4px" }}>
                    <button onClick={() => { setShowStripeSheet(false); setShowApplePay(true); setTimeout(() => { setShowApplePay(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                      <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                      <span>Pay</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                    <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                      </div>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                    <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                        <div style={{ width: 34, height: 24, borderRadius: 4, background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <button onClick={() => { setShowStripeSheet(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span>Pay £{(selectedClub?.paymentModel === "variable" ? takeoverPaymentAmount : total).toFixed(2)}</span>
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showApplePay && !extras.isFree && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <button onClick={() => setShowApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                    <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{total.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                      <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                  </div>
                </div>
              </div>
            )}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* Club review & pay */}
        {detailPage === "club-detail" && flowStep === "payment" && selectedClub && (() => {
          const extras = clubExtras[selectedClub.id];
          const isTerm = bookingOption === "term";
          const count = Object.keys(selectedDates).length;
          const payDayKey = selectedBkPeriod?.dayKey;
          const sessionCount = isTerm ? extras.sessionDates.filter(d => !d.past && d.active !== false && (!payDayKey || d.dayKey === payDayKey)).length : count;
          const total = isTerm ? (selectedBkPeriod?.price ?? extras.blockPrice) : count * extras.perSessionPrice;
          const dateLabels = Object.fromEntries(extras.sessionDates.map(d => [d.id, d.label]));
          const selectedDayAbbrevs = [...new Set(Object.keys(selectedDates).map(id => dateLabels[id]?.split(" ")[0]).filter(Boolean))];
          const dayFullNames = { Mon: "Mondays", Tue: "Tuesdays", Wed: "Wednesdays", Thu: "Thursdays", Fri: "Fridays" };
          const isSingleDay = isTerm ? !selectedClub.days.includes(",") && !selectedClub.days.includes("–") : selectedDayAbbrevs.length === 1;
          const singleDayAbbrev = isTerm ? selectedClub.days.trim() : selectedDayAbbrevs[0];
          const hasOptions = !!selectedClub.bookingNote;
          const paymentBackStep = bookingOption === "individual" ? "choose-dates" : null;
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => { setFlowStep(paymentBackStep); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Review your booking</span>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: "var(--color-bg-secondary)" }}>
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "16px", marginBottom: 20 }}>
                <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 4px", lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>{selectedClub.title}</h2>
                <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.2 }}>For {selectedChild.name}</p>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                <p style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{sessionCount === 1 ? `${isTerm ? extras.sessionDates.filter(d => !d.past && d.active !== false && (!payDayKey || d.dayKey === payDayKey))[0]?.label : dateLabels[Object.keys(selectedDates)[0]]} · ${selectedClub.time}` : isSingleDay ? `${dayFullNames[singleDayAbbrev] ?? singleDayAbbrev} · ${selectedClub.time}` : isTerm ? `Every ${selectedClub.days} · ${selectedClub.time}` : selectedClub.time}</p>
                {(selectedClub.location || selectedClub.clubLead) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    {selectedClub.location && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                        <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                        {selectedClub.location}
                      </span>
                    )}
                    {selectedClub.clubLead && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                        <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                        {selectedClub.clubLead}
                      </span>
                    )}
                  </div>
                )}
                {sessionCount !== 1 && (
                  <>
                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)" }}>{sessionCount} sessions</span>
                      <button onClick={() => setReviewDatesExpanded(!reviewDatesExpanded)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", textDecoration: "underline", textUnderlineOffset: 2 }}>View dates</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: reviewDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M3 4.5L6 7.5L9 4.5" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                    {reviewDatesExpanded && (() => {
                      const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      const dates = isTerm ? extras.sessionDates.filter(d => !d.past) : Object.keys(selectedDates).map(id => ({ id, label: dateLabels[id] || id, active: true }));
                      const groups = {};
                      dates.forEach(d => {
                        const parts = d.label.split(" ");
                        const month = parts[parts.length - 1];
                        const dayDisplay = parts.slice(0, -1).join(" ");
                        if (!groups[month]) groups[month] = [];
                        groups[month].push({ ...d, dayDisplay });
                      });
                      const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                      return (
                        <div style={{ marginTop: 28 }}>
                          {sortedMonths.map((month, mi) => (
                            <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>{month} 2026</div>
                              {groups[month].map(d => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                  <span style={{ fontSize: "var(--font-size-3)", color: d.active !== false ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active !== false ? "none" : "line-through" }}>{d.label}</span>
                                  {d.active !== false
                                    ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{selectedClub.time}</span>
                                    : d.note && <Tag variant="neutral">{d.note}</Tag>
                                  }
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
                {/* TOTAL */}
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 0" }}>
                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Total</span>
                  <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>{extras.isFree ? "Free" : `£${total.toFixed(2)}`}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => {
                  if (extras.isFree) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }
                  else { setShowStripeSheet(true); }
                }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {extras.isFree ? "Confirm booking" : `Pay now · £${total.toFixed(2)}`}
                </button>
                {!(selectedClub.paymentModel === "variable" && (selectedClub.minimumContribution ?? 0) === 0) && (
                  <button onClick={() => { setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 })); setBasketToastFading(false); setBasketToast({ title: selectedClub.title, child: selectedChild.name, amount: total }); setFlowStep(null); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                )}
                {selectedClub.paymentModel === "provisional" && (
                  <button onClick={() => { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reserve &amp; pay later</button>
                )}
              </div>
            </div>
            {showStripeSheet && !extras.isFree && (
              <div onClick={() => setShowStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                    <button onClick={() => setShowStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 4px" }}>
                    <button onClick={() => { setShowStripeSheet(false); setShowApplePay(true); setTimeout(() => { setShowApplePay(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                      <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                      <span>Pay</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                    <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                      </div>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                    <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                        <div style={{ width: 34, height: 24, borderRadius: 4, background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <button onClick={() => { setShowStripeSheet(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span>Pay £{(selectedClub?.paymentModel === "variable" ? takeoverPaymentAmount : total).toFixed(2)}</span>
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showApplePay && !extras.isFree && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <button onClick={() => setShowApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                    <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{total.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                      <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                  </div>
                </div>
              </div>
            )}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* Club booking confirmed */}
        {detailPage === "club-detail" && flowStep === "confirmed" && selectedClub && (() => {
          const extras = clubExtras[selectedClub.id];
          const isTerm = bookingOption === "term";
          const count = Object.keys(selectedDates).length;
          const confDayKey = selectedBkPeriod?.dayKey;
          const sessionCount = isTerm ? extras.sessionDates.filter(d => !d.past && d.active !== false && (!confDayKey || d.dayKey === confDayKey)).length : count;
          const total = selectedClub.paymentModel === "variable"
            ? takeoverPaymentAmount
            : (isTerm ? (selectedBkPeriod?.price ?? extras.blockPrice) : count * extras.perSessionPrice);
          const dateLabels = Object.fromEntries(extras.sessionDates.map(d => [d.id, d.label]));
          const confDates = isTerm
            ? extras.sessionDates.filter(d => !d.past).map(d => ({ ...d, time: selectedClub.time }))
            : Object.keys(selectedDates).map(id => ({ id, label: dateLabels[id] || id, active: true, time: selectedClub.time }));
          return (
            <BookingConfirmedScreen
              isMobile={isMobile}
              clubName={selectedClub.title}
              childName={selectedChild.name}
              days={sessionCount === 1 ? (confDates[0]?.label ?? selectedClub.days) : selectedClub.days}
              time={selectedClub.time}
              location={selectedClub.location}
              clubLead={selectedClub.clubLead}
              sessionCount={sessionCount}
              dates={confDates}
              isFree={extras.isFree}
              total={total}
              paymentModel={selectedClub.paymentModel}
              minimumContribution={selectedClub.minimumContribution}
              outstanding={selectedClub.paymentModel === "variable" && (selectedClub.minimumContribution ?? 0) > 0 ? Math.max(0, (selectedClub.suggestedAmount ?? 0) - total) : 0}
              paymentDeadline={selectedClub.termDates?.includes("–") ? selectedClub.termDates.split("–")[1].trim() : null}
              onClose={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); }}
              onGoToBookings={() => { setFlowStep(null); setBookingNudgeRating(null); setDetailPage(null); setSelectedClub(null); setActiveTab("book-pay"); setBookingsFilter("upcoming"); setSubPage("my-bookings"); }}
              confirmedDatesExpanded={confirmedDatesExpanded}
              setConfirmedDatesExpanded={setConfirmedDatesExpanded}
              bookingNudgeRating={bookingNudgeRating}
              setBookingNudgeRating={setBookingNudgeRating}
              newLayout={true}
            />
          );
        })()}

        {/* Variable contribution — Choose amount sheet (browse flow) */}
        {detailPage === "club-detail" && showPartialSheet && selectedClub?.paymentModel === "variable" && (() => {
          const minContrib = selectedClub.minimumContribution ?? 0;
          const hasTotal = minContrib > 0;
          const maxAmount = hasTotal ? selectedClub.suggestedAmount : Infinity;
          const belowMin = partialAmount < minContrib;
          const aboveMax = hasTotal && partialAmount > maxAmount;
          const invalid = belowMin || aboveMax;
          return (
            <div onClick={() => setShowPartialSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px" }}>
                  <button onClick={() => setShowPartialSheet(false)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <div style={{ padding: "8px 16px 8px", display: "flex", flexDirection: "column" }}>
                  <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>{minContrib === 0 ? "Choose your contribution" : "Choose amount"}</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>
                      {minContrib === 0 ? "Pay what you want, including £0" : `Pay £${minContrib}–£${selectedClub.suggestedAmount} today`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                    <button onClick={() => setPartialAmount(Math.max(minContrib, partialAmount - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${invalid ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)" }}>
                      <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={partialAmount}
                        onChange={(e) => { const v = parseInt(e.target.value) || 0; setPartialAmount(Math.max(0, v)); }}
                        style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${Math.max(2, String(partialAmount).length) * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }}
                      />
                    </div>
                    <button onClick={() => setPartialAmount(Math.min(maxAmount, partialAmount + 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                  </div>
                  <div style={{ height: 22, textAlign: "center", marginBottom: 16 }}>
                    {belowMin && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>{`Minimum is £${minContrib}`}</span>}
                    {aboveMax && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>{`Maximum is £${maxAmount}`}</span>}
                  </div>
                </div>
                <div style={{ padding: "12px 16px 28px", background: "var(--color-white)", display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    onClick={() => {
                      if (invalid) {
                        if (partialFlashTimer.current) clearTimeout(partialFlashTimer.current);
                        setPartialAmountFlash(true);
                        partialFlashTimer.current = setTimeout(() => setPartialAmountFlash(false), 2500);
                        return;
                      }
                      setShowPartialSheet(false);
                      setTakeoverPaymentAmount(partialAmount);
                      if (partialAmount === 0) {
                        setConfirmedDatesExpanded(false);
                        setFlowStep("confirmed");
                      } else {
                        setPaymentMethod("card");
                        setCardFilled(false);
                        setShowStripeSheet(true);
                      }
                    }}
                    style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {partialAmount === 0 ? "Confirm with £0" : `Pay now · £${partialAmount.toFixed(2)}`}
                  </button>
                  {partialAmount > 0 && (
                  <button
                    onClick={() => {
                      if (invalid) {
                        if (partialFlashTimer.current) clearTimeout(partialFlashTimer.current);
                        setPartialAmountFlash(true);
                        partialFlashTimer.current = setTimeout(() => setPartialAmountFlash(false), 2500);
                        return;
                      }
                      setShowPartialSheet(false);
                      setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 }));
                      setBasketToastFading(false);
                      setBasketToast({ title: selectedClub.title, child: selectedChild.name, amount: partialAmount, partialOf: minContrib > 0 && partialAmount < selectedClub.suggestedAmount ? selectedClub.suggestedAmount : undefined });
                      if (flowStep === "choose-dates") setFlowStep(null);
                    }}
                    className="btn-action"
                    style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Add to basket
                  </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== TRIPS FLOW ==================== */}

        {/* Trip detail — Pattern A (chromeless entry) */}
        {detailPage === "trip-detail" && !flowStep && selectedClub && (() => {
          const t = selectedClub;
          const extras = tripExtras[t.id] || {};
          const model = t.paymentModel; // "free" | "fixed" | "variable" | "instalment"
          const isFree = model === "free";
          const isVoluntary = model === "variable";
          const isInstalment = model === "instalment";
          const browseToday = new Date(2026, 3, 9);
          const looming = !t.full && t.deadline && Math.ceil((t.deadline - browseToday) / 86400000) <= 7;
          const closeAll = () => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); setBkAboutExpanded(false); };
          const basketAmount = isInstalment ? t.deposit : isVoluntary ? (t.suggestedAmount ?? 0) : (t.cost ?? 0);
          const openStripe = (amount) => { setTakeoverPaymentAmount(amount); setPaymentMethod("card"); setCardFilled(false); setShowApplePay(false); setShowStripeSheet(true); };
          const confirmFree = () => { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); };
          const openContribution = () => { setPartialAmount(isInstalment ? t.deposit : (t.suggestedAmount ?? 0)); setPartialAmountFlash(false); setShowPartialSheet(true); };
          const addToBasket = (amount = basketAmount) => {
            setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 }));
            setBasketToastFading(false);
            setBasketToast({ title: t.title, child: selectedChild.name, amount });
          };
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-grey-050)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={closeAll} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={closeAll} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "var(--color-white)", borderRadius: 8, margin: "8px 16px 0", border: "1px solid var(--color-grey-100)", paddingBottom: 24 }}>
                <div style={{ padding: "20px 16px 0" }}>
                  {/* Title + sign-up pill */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif", flex: "1 1 auto", minWidth: 0 }}>{t.title}</h2>
                    {looming && <div style={{ flexShrink: 0 }}><Tag variant="default">Sign up by {t.deadlineLabel}</Tag></div>}
                    {t.full && <div style={{ flexShrink: 0 }}><Tag variant="neutral">Full</Tag></div>}
                  </div>
                  <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.2 }}>For {selectedChild.name}</p>
                  <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                  {/* Date + time */}
                  <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{[t.dateRange, t.time].filter(Boolean).join(" · ")}</p>
                  {(t.location || t.clubLead || (!looming && t.deadlineLabel)) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                      {t.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                          <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />{t.location}
                        </span>
                      )}
                      {t.clubLead && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                          <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />{t.clubLead}
                        </span>
                      )}
                      {!looming && t.deadlineLabel && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                          <Clock size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />Sign up by {t.deadlineLabel}
                        </span>
                      )}
                    </div>
                  )}
                  {/* About */}
                  {extras.about && (!bkAboutExpanded ? (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{extras.about}</p>
                      <button onClick={() => setBkAboutExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit", display: "block" }}>Read more</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: extras.bullets?.length ? "24px 0 6px" : "24px 0 0" }}>
                        {extras.about}
                        {!extras.bullets?.length && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                      </p>
                      {extras.bullets?.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {extras.bullets.map((pt, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", lineHeight: "1.5" }}>•</span>
                              <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: "1.5" }}>
                                {pt}{i === extras.bullets.length - 1 && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ))}
                  {/* Cost */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
                      {isInstalment ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Total</span>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>£{t.totalCost}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Minimum deposit</span>
                            <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>£{t.deposit}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{isVoluntary ? "Suggested contribution" : "Cost"}</div>
                            {isVoluntary && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>Pay what you want, including £0</div>}
                          </div>
                          <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>{isFree ? "Free" : `£${isVoluntary ? t.suggestedAmount : t.cost}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer CTA */}
            <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)", borderTop: "1px solid var(--color-border-default)" }}>
              {t.full ? (
                <div style={{ textAlign: "center", fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", lineHeight: 1.4, padding: "10px 0" }}>This trip is full. Contact the school office if you have a question.</div>
              ) : (
                <>
                  <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this trip.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {isFree ? (
                      <button onClick={confirmFree} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Confirm booking</button>
                    ) : isVoluntary ? (
                      <>
                        <button onClick={() => openStripe(t.suggestedAmount)} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Pay now · £{t.suggestedAmount.toFixed(2)}</button>
                        <button onClick={openContribution} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Pay a different amount</button>
                      </>
                    ) : isInstalment ? (
                      <>
                        <button onClick={() => openStripe(t.totalCost)} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Pay in full · £{t.totalCost.toFixed(2)}</button>
                        <button onClick={() => addToBasket(t.totalCost)} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                        <button onClick={openContribution} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "none", background: "none", color: "var(--color-brand-600)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Pay a different amount</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openStripe(t.cost)} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Pay now · £{t.cost.toFixed(2)}</button>
                        <button onClick={() => addToBasket(t.cost)} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          );
        })()}

        {/* Trip payment sheets — rendered over the detail page (no separate payment step) */}
        {detailPage === "trip-detail" && selectedClub && (showStripeSheet || showApplePay || showPartialSheet) && (() => {
          const t = selectedClub;
          const isVoluntary = t.paymentModel === "variable";
          const isInstalment = t.paymentModel === "instalment";
          return (
          <>

            {/* Trip Stripe sheet */}
            {showStripeSheet && (
              <div onClick={() => setShowStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                    <button onClick={() => setShowStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 4px" }}>
                    <button onClick={() => { setShowStripeSheet(false); setShowApplePay(true); setTimeout(() => { setShowApplePay(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                      <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                      <span>Pay</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                    <button onClick={() => { setShowStripeSheet(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, background: "var(--color-white)", cursor: "pointer", fontFamily: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                      </div>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>···· 7492</span>
                    </button>
                    <button onClick={() => { setShowStripeSheet(false); setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span>Pay £{takeoverPaymentAmount.toFixed(2)}</span>
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showApplePay && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <button onClick={() => setShowApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                    <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{takeoverPaymentAmount.toFixed(2)}</div>
                  </div>
                  <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                      <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Brown</div></div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trip contribution / instalment amount sheet */}
            {showPartialSheet && (isVoluntary || isInstalment) && (() => {
              const minAmount = isInstalment ? t.deposit : 0;
              const maxAmount = isInstalment ? t.totalCost : (t.suggestedAmount ?? Infinity);
              const belowMin = partialAmount < minAmount;
              const subTwo = isVoluntary && partialAmount > 0 && partialAmount < 2;
              const aboveMax = partialAmount > maxAmount;
              const invalid = belowMin || aboveMax || subTwo;
              return (
                <div onClick={() => setShowPartialSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                      <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px" }}>
                      <button onClick={() => setShowPartialSheet(false)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                    <div style={{ padding: "8px 16px 8px", display: "flex", flexDirection: "column" }}>
                      <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>{isInstalment ? "Choose amount" : "Choose your contribution"}</div>
                        <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>{isInstalment ? `Pay £${t.deposit}–£${t.totalCost} today` : "Pay what you want, including £0"}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                        <button onClick={() => setPartialAmount(Math.max(minAmount, partialAmount - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${invalid ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)" }}>
                          <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                          <input type="number" inputMode="numeric" value={partialAmount} onChange={(e) => { const v = parseInt(e.target.value) || 0; setPartialAmount(Math.max(0, v)); }} style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${Math.max(2, String(partialAmount).length) * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }} />
                        </div>
                        <button onClick={() => setPartialAmount(Math.min(maxAmount, partialAmount + 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                      </div>
                      <div style={{ height: 22, textAlign: "center", marginBottom: 16 }}>
                        {belowMin && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>{`Minimum is £${minAmount}`}</span>}
                        {subTwo && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Card payments must be £2 or more. Enter £0 or £2+.</span>}
                        {aboveMax && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>{`Maximum is £${maxAmount}`}</span>}
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px 28px", background: "var(--color-white)", display: "flex", flexDirection: "column", gap: 10 }}>
                      <button onClick={() => { if (invalid) { setPartialAmountFlash(true); return; } setShowPartialSheet(false); setTakeoverPaymentAmount(partialAmount); if (partialAmount === 0) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); } else { setPaymentMethod("card"); setCardFilled(false); setShowStripeSheet(true); } }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{partialAmount === 0 ? "Confirm with £0" : `Pay now · £${partialAmount.toFixed(2)}`}</button>
                      {partialAmount > 0 && (
                        <button onClick={() => { if (invalid) { setPartialAmountFlash(true); return; } setShowPartialSheet(false); setBasketsBySchool(prev => ({ ...prev, [selectedChild.school]: (prev[selectedChild.school] || 0) + 1 })); setBasketToastFading(false); setBasketToast({ title: t.title, child: selectedChild.name, amount: partialAmount, partialOf: partialAmount < t.totalCost ? t.totalCost : undefined }); setFlowStep(null); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add to basket</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
          );
        })()}

        {/* Trip confirmed */}
        {detailPage === "trip-detail" && flowStep === "confirmed" && selectedClub && (() => {
          const t = selectedClub;
          const model = t.paymentModel;
          const isFree = model === "free";
          const isVoluntary = model === "variable";
          const isInstalment = model === "instalment";
          const goBookings = (filter) => { setFlowStep(null); setBookingNudgeRating(null); setDetailPage(null); setSelectedClub(null); setActiveTab("book-pay"); setBookingsFilter(filter); setSubPage("my-bookings"); };
          return (
            <BookingConfirmedScreen
              isMobile={isMobile}
              clubName={t.title}
              childName={selectedChild.name}
              days={t.dateRange}
              time={t.time}
              location={t.location}
              clubLead={t.clubLead}
              sessionCount={1}
              dates={[]}
              isFree={isFree}
              feedbackNoun="trip"
              total={isVoluntary ? takeoverPaymentAmount : isInstalment ? takeoverPaymentAmount : (t.cost ?? 0)}
              amountPaidNow={isVoluntary ? takeoverPaymentAmount : isInstalment ? takeoverPaymentAmount : (t.cost ?? 0)}
              paymentComplete={false}
              paymentModel={isVoluntary ? "variable" : undefined}
              minimumContribution={isVoluntary ? 0 : undefined}
              instalment={isInstalment}
              depositPaid={isInstalment ? takeoverPaymentAmount : undefined}
              balanceRemaining={isInstalment ? Math.max(0, t.totalCost - takeoverPaymentAmount) : undefined}
              paymentDeadline={isInstalment ? "before the trip" : null}
              onClose={() => { setDetailPage(null); setFlowStep(null); setSelectedClub(null); }}
              onGoToBookings={() => goBookings(isInstalment && (t.totalCost - takeoverPaymentAmount) > 0 ? "needs-attention" : "upcoming")}
              confirmedDatesExpanded={confirmedDatesExpanded}
              setConfirmedDatesExpanded={setConfirmedDatesExpanded}
              bookingNudgeRating={bookingNudgeRating}
              setBookingNudgeRating={setBookingNudgeRating}
              newLayout={true}
            />
          );
        })()}

        {/* ==================== AFTER SCHOOL CLUB FLOW ==================== */}

        {/* After school - Detail page */}
        {detailPage === "after-school" && !flowStep && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-grey-050)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setDetailDatesExpanded(false); setBookingOption(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setDetailDatesExpanded(false); setBookingOption(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div ref={bkDetailRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "var(--color-white)", borderRadius: 8, margin: "8px 16px 0", border: "1px solid var(--color-grey-100)", paddingBottom: 24 }}>
                <div style={{ padding: "20px 16px 0" }}>
                  <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>{wraparoundClubConfig?.name}</h2>
                  <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "4px 0 0", lineHeight: 1.2 }}>For {selectedChild.name}</p>
                  <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                  <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{wraparoundClubConfig?.timeDisplay} · 15:30–17:00</p>
                  <button onClick={() => setDetailDatesExpanded(!detailDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View all dates</span>
                    <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: detailDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                  {detailDatesExpanded && (() => {
                    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                    const groups = {};
                    wraparoundClubConfig.sessionDates.forEach(d => {
                      const month = d.date.split(" ").pop();
                      if (!groups[month]) groups[month] = [];
                      groups[month].push(d);
                    });
                    const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                    return (
                      <div style={{ marginTop: 12, textAlign: "left" }}>
                        {sortedMonths.map((month, mi) => (
                          <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                            <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                            {groups[month].map(d => (
                              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                <span style={{ fontSize: "var(--font-size-3)", color: d.active ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active ? "none" : "line-through" }}>{d.date}</span>
                                {d.active
                                  ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>15:30–17:00</span>
                                  : d.note && <Tag variant="neutral">{d.note}</Tag>}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                      <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                      Main Hall
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                      <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                      School staff
                    </span>
                  </div>
                  {!bkAboutExpanded ? (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>Our {wraparoundClubConfig?.name} provides a safe and fun environment for children to relax, play and socialise after the school day. Activities include arts and crafts, outdoor games, board games and supervised homework time. A light snack and drink are provided.</p>
                      <button onClick={() => setBkAboutExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit", display: "block" }}>Read more</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 6px" }}>Our {wraparoundClubConfig?.name} provides a safe and fun environment for children to relax, play and socialise after the school day. Activities include arts and crafts, outdoor games, board games and supervised homework time. A light snack and drink are provided.</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {["Snack and drink included", "Outdoor and indoor activities", "Supervised homework time available"].map((point, i, arr) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", lineHeight: "1.5" }}>•</span>
                            <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: "1.5" }}>
                              {point}{i === arr.length - 1 && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 12 }}>Booking options</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {(() => {
                        const isFreeConfig = !!wraparoundClubConfig?.isFree;
                        const termSessions = (wraparoundClubConfig?.sessionDates || []).filter(d => d.active).length || 12;
                        return [
                          { id: "individual", title: "Individual sessions", subtitle: "Drop in", price: isFreeConfig ? "Free" : "£10", sessionCount: null, type: "daily" },
                          { id: "term", title: "Full term", subtitle: "Summer term 2026", price: isFreeConfig ? "Free" : `£${termSessions * 10}`, sessionCount: termSessions, type: "termly" }
                        ];
                      })().map(opt => {
                        const isSelected = bookingOption === opt.id;
                        const isTermly = opt.type === "termly";
                        const isFreeConfig = !!wraparoundClubConfig?.isFree;
                        return (
                          <button key={opt.id} onClick={() => setBookingOption(opt.id)}
                            style={{ display: "block", width: "100%", padding: "14px 16px", background: isSelected ? "var(--color-brand-050)" : "var(--color-white)", border: isSelected ? "1px solid var(--color-brand-100)" : "1px solid var(--color-grey-100)", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left", position: "relative" }}>
                            <div style={{ position: "absolute", top: 14, left: 16, width: 20, height: 20, borderRadius: "50%", border: isSelected ? "2px solid var(--color-brand-600)" : "2px solid var(--color-border-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-brand-600)" }} />}
                            </div>
                            <div style={{ paddingLeft: 32 }}>
                              <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{opt.title}</div>
                              {opt.subtitle && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.subtitle}</div>}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
                                <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly && opt.sessionCount ? `${opt.sessionCount} sessions` : ""}</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
                                  <span style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)" }}>{opt.price}</span>
                                  {!isFreeConfig && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly ? "total" : "each"}</span>}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {bookingOption && (
              <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)", borderTop: "1px solid var(--color-border-default)" }}>
                {bookingOption === "individual" && wraparoundClubConfig?.sameDayCutoff && <p style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)", textAlign: "center", margin: "0 0 10px" }}>{wraparoundClubConfig.sameDayCutoff}</p>}
                {bookingOption === "term" && wraparoundClubConfig?.blockDeadlineLabel && <p style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)", textAlign: "center", margin: "0 0 10px" }}>Booking closes {wraparoundClubConfig.blockDeadlineLabel}</p>}
                {wraparoundClubConfig?.isFree && bookingOption === "term" && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>}
                <button onClick={() => {
                  const isFreeConfig = !!wraparoundClubConfig?.isFree;
                  if (bookingOption === "individual") { setFlowStep("choose-dates"); setSelectedGridDates({}); }
                  else if (isFreeConfig) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }
                  else { setFlowStep("payment"); setReviewDatesExpanded(false); }
                }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {bookingOption === "individual" ? "Choose sessions" : (wraparoundClubConfig?.isFree ? "Confirm booking" : "Continue")}
                </button>
              </div>
            )}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-secondary)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
        )}

        {/* After school - Choose dates (S1 checklist) */}
        {detailPage === "after-school" && flowStep === "choose-dates" && (() => {
          const sessionDates = wraparoundClubConfig?.sessionDates || [];
          const activeDates = sessionDates.filter(d => d.active);
          const count = Object.keys(selectedGridDates).length;
          const allSelected = count === activeDates.length;
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => setFlowStep(null)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{wraparoundClubConfig?.name}</span>
                <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>For {selectedChild.name}</span>
              </div>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Select / deselect all — above card */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => { if (allSelected) setSelectedGridDates({}); else { const a = {}; activeDates.forEach(d => { a[d.id] = true; }); setSelectedGridDates(a); } }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>{allSelected ? "Deselect all" : "Select all"}</span>
                </button>
              </div>
              {/* Dates card */}
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "0 16px" }}>
                {(() => {
                  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const moFull = { Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December" };
                  const grps = {};
                  sessionDates.forEach(d => {
                    const parts = d.date.split(" ");
                    const month = parts[parts.length - 1];
                    if (!grps[month]) grps[month] = [];
                    grps[month].push(d);
                  });
                  const months = Object.keys(grps).sort((a, b) => mo.indexOf(a) - mo.indexOf(b));
                  return months.map((month, mi) => (
                    <div key={month} style={{ marginTop: 12, paddingBottom: mi < months.length - 1 ? 0 : 4 }}>
                      <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>{moFull[month] || month} 2026</div>
                      {grps[month].map(d => {
                        const parts = d.date.split(" ");
                        const dayDisplay = parts.slice(0, -1).join(" ");
                        const isSelected = d.id in selectedGridDates;
                        return (
                          <button key={d.id} onClick={() => { if (!d.active) return; const next = { ...selectedGridDates }; if (isSelected) delete next[d.id]; else next[d.id] = true; setSelectedGridDates(next); setClubDatesError(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", width: "100%", background: "none", borderTop: "1px solid var(--color-grey-100)", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: d.active ? "pointer" : "default", fontFamily: "inherit", textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {d.active ? (
                                <div style={{ width: 16, height: 16, borderRadius: 4, border: isSelected ? "1px solid var(--color-brand-600)" : "1px solid var(--color-border-strong)", background: isSelected ? "var(--color-brand-600)" : "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {isSelected && <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                              ) : <div style={{ width: 16, height: 16, flexShrink: 0 }} />}
                              <span style={{ fontSize: "var(--font-size-4)", color: d.active ? "var(--color-text-primary)" : "var(--color-grey-600)", textDecoration: d.active ? "none" : "line-through" }}>{d.date}</span>
                            </div>
                            {d.active
                              ? <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-tertiary)" }}>15:30–17:00</span>
                              : d.note && <Tag variant="neutral">{d.note}</Tag>
                            }
                          </button>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              {count > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>{count} session{count !== 1 ? "s" : ""} selected</span>
                  <span style={{ fontSize: "var(--font-size-4)", fontWeight: 700, color: "var(--color-text-primary)" }}>{wraparoundClubConfig?.isFree ? "Free" : `£${count * 10}`}</span>
                </div>
              )}
              {clubDatesError && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="6" stroke="var(--color-text-destructive)" strokeWidth="1.3" /><path d="M7 4V7.5" stroke="var(--color-text-destructive)" strokeWidth="1.3" strokeLinecap="round" /><circle cx="7" cy="10" r="0.8" fill="var(--color-text-destructive)" /></svg>
                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Please select at least one session to continue.</span>
                </div>
              )}
              {wraparoundClubConfig?.isFree && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>}
              <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } if (wraparoundClubConfig?.isFree) { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); } else { setFlowStep("payment"); setReviewDatesExpanded(false); } }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{wraparoundClubConfig?.isFree ? "Confirm booking" : "Continue"}</button>
            </div>
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* After school - Payment (balance check) */}
        {detailPage === "after-school" && flowStep === "payment" && !topUpCardScreen && (() => {
          const isTerm = bookingOption === "term";
          const sessionCount = isTerm ? (wraparoundClubConfig?.sessionDates?.filter(d => d.active).length || 12) : Object.keys(selectedGridDates).length;
          const total = sessionCount * 10;
          const shortfall = total - wraparoundBalance;
          const hasToppedUp = toppedUpAmount > 0;
          const minTopUp = Math.max(2, Math.ceil(shortfall));
          const isHardBlock = shortfall > 0 && !wraparoundClubConfig?.allowSignUpIfLowBalance;
          const isSoftWarn = shortfall > 0 && !!wraparoundClubConfig?.allowSignUpIfLowBalance;
          const isPostTopUp = hasToppedUp && shortfall <= 0;
          const chargeOnAttendance = wraparoundClubConfig?.chargeOnAttendance ?? false;
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={() => setFlowStep(isTerm ? null : "choose-dates")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setToppedUpAmount(0); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 20px", background: "var(--color-bg-secondary)" }}>
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "16px", marginBottom: 20 }}>
                <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>{wraparoundClubConfig?.name}</h2>
                <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "4px 0 0", lineHeight: 1.2 }}>For {selectedChild.name}</p>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{sessionCount === 1 ? `${(isTerm ? (wraparoundClubConfig?.sessionDates?.filter(d => d.active)[0]?.date) : (wraparoundClubConfig?.sessionDates || []).find(d => d.id === Object.keys(selectedGridDates)[0])?.date) ?? wraparoundClubConfig?.timeDisplay} · 15:30–17:00` : `${wraparoundClubConfig?.timeDisplay} · 15:30–17:00`}</p>
                {sessionCount !== 1 && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{sessionCount} sessions selected</span>
                      <button onClick={() => setReviewDatesExpanded(!reviewDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View dates</span>
                        <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: reviewDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                      </button>
                    </div>
                    {reviewDatesExpanded && (() => {
                      const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      const allDates = isTerm
                        ? (wraparoundClubConfig?.sessionDates || [])
                        : Object.keys(selectedGridDates).map(id => (wraparoundClubConfig?.sessionDates || []).find(d => d.id === id)).filter(Boolean);
                      const groups = {};
                      allDates.forEach(d => {
                        const month = d.date.split(" ").pop();
                        if (!groups[month]) groups[month] = [];
                        groups[month].push(d);
                      });
                      const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                      return (
                        <div style={{ marginTop: 12, textAlign: "left" }}>
                          {sortedMonths.map((month, mi) => (
                            <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                              {groups[month].map(d => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                  <span style={{ fontSize: "var(--font-size-3)", color: d.active ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active ? "none" : "line-through" }}>{d.date}</span>
                                  {d.active
                                    ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>15:30–17:00</span>
                                    : d.note && <Tag variant="neutral">{d.note}</Tag>
                                  }
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    Main Hall
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    School staff
                  </span>
                </div>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Total</span>
                  <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>£{total.toFixed(2)}</span>
                </div>
                {chargeOnAttendance && (
                  <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginTop: 10 }}>
                    You only pay £10 for each session {selectedChild.name} attends. Missed sessions stay in your balance.
                  </div>
                )}
              </div>
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SunMoon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)" }}>From</div>
                    <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Wraparound account</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "12px 0" }} />
                {chargeOnAttendance && shortfall <= 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)" }}>Your balance covers this booking</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 4 }}>
                        Current balance · £{wraparoundBalance.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-success-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Booking cost</span>
                      <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>£{total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Current balance</span>
                      <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>£{wraparoundBalance.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 0 12px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      {shortfall <= 0 ? (
                        <>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>After booking</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>£{(wraparoundBalance - total).toFixed(2)}</span>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-success-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          </div>
                        </>
                      ) : isSoftWarn ? (
                        <>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Balance after booking</span>
                          <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-warning)" }}>−£{shortfall.toFixed(2)}</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Top up to book</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-warning)" }}>£{shortfall.toFixed(2)}</span>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--color-warning-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <AlertTriangle size={12} color="var(--color-warning-700)" strokeWidth={2} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              {!isHardBlock && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>}
              {isHardBlock ? (
                <button onClick={() => { setShowTopUpSheet(true); setTopUpAmount(minTopUp); setTopUpPaymentMethod("card"); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Top up £{shortfall.toFixed(2)} to continue
                </button>
              ) : (
                <button onClick={() => { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Book {selectedChild.name} in
                </button>
              )}
            </div>
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>

            {/* ===== Top-up bottom sheet ===== */}
            {showTopUpSheet && (
              <div onClick={() => setShowTopUpSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", minHeight: 520, maxHeight: "85%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px", flexShrink: 0 }}>
                    <button onClick={() => setShowTopUpSheet(false)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 8px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Top up {selectedChild.name}'s Wraparound</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>Current balance · £{wraparoundBalance.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                      <button onClick={() => { if (topUpAmount <= minTopUp) flashTopUpMinError(); else setTopUpAmount(topUpAmount - 1); }} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${(topUpAmount < minTopUp || topUpMinFlash) ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)", transition: "border-color 0.15s ease" }}>
                        <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={topUpAmount}
                          onChange={(e) => { const v = parseInt(e.target.value) || 0; setTopUpAmount(Math.max(0, v)); }}
                          style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${String(topUpAmount).length * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />
                      </div>
                      <button onClick={() => setTopUpAmount(topUpAmount + 1)} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                    </div>
                    <div style={{ height: 22, textAlign: "center", marginBottom: 24 }}>
                      {(topUpAmount < minTopUp || topUpMinFlash) && (
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Minimum top-up is £{minTopUp}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                      {[10, 25, 50].map((inc) => (
                        <button key={inc} onClick={() => setTopUpAmount(topUpAmount + inc)} className="btn-pill" style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid var(--color-border-default)", background: "var(--color-white)", fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer", fontFamily: "inherit" }}>
                          +£{inc}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button onClick={() => setTopUpAmount(minTopUp)} style={{ background: "none", border: "none", fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Reset to minimum</button>
                    </div>
                  </div>
                  <div style={{ padding: "12px 16px 28px", flexShrink: 0, background: "var(--color-white)" }}>
                    <button onClick={() => { if (topUpAmount < minTopUp) setTopUpAmount(minTopUp); setShowTopUpStripeSheet(true); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{topUpAmount < minTopUp ? `Top up minimum £${minTopUp}` : `Top up £${topUpAmount}.00 now`}</button>
                  </div>
                </div>
                {showTopUpStripeSheet && (
                  <div onClick={() => setShowTopUpStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 10 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                        <button onClick={() => setShowTopUpStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                      <div style={{ padding: "0 16px 4px" }}>
                        <button onClick={() => { setShowTopUpStripeSheet(false); setShowTopUpStripeApplePay(true); setTimeout(() => { setToppedUpAmount(prev => prev + topUpAmount); setShowTopUpStripeApplePay(false); setShowTopUpSheet(false); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                          <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                          <span>Pay</span>
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                        </div>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                        <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                          </div>
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                          <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                        </div>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                        <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                            <div style={{ width: 34, height: 24, borderRadius: 4, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="#888" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                            </div>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                            <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        </div>
                        <button onClick={() => { setShowTopUpStripeSheet(false); setToppedUpAmount(prev => prev + topUpAmount); setShowTopUpSheet(false); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                          <span>Top up £{topUpAmount}.00</span>
                          <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {showTopUpStripeApplePay && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                    <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <button onClick={() => setShowTopUpStripeApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                      </div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                        <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{topUpAmount}.00</div>
                      </div>
                      <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                          <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {/* After school - Top-up card entry screen */}
        {(detailPage === "after-school" || detailPage === "breakfast") && flowStep === "payment" && topUpCardScreen && (() => {
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => { setTopUpCardScreen(false); setShowTopUpSheet(true); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Payment details</span>
              <button onClick={() => { setTopUpCardScreen(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", background: "var(--color-bg-secondary)" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>Top-up amount</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)" }}>£{topUpAmount}.00</div>
              </div>
              {["Name on card", "Card number", "Expiry date", "CVV"].map((label, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-tertiary)", marginBottom: 6 }}>{label}</div>
                  <button onClick={() => setTopUpCardFilled(true)} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--color-border-default)", background: "var(--color-white)", fontSize: "var(--font-size-3)", color: topUpCardFilled ? "var(--color-text-primary)" : "var(--color-text-tertiary)", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                    {topUpCardFilled ? (i === 0 ? "Kate Burns" : i === 1 ? "4289 3920 1847 5562" : i === 2 ? "09/28" : "••••") : (i === 0 ? "Full name" : i === 1 ? "0000 0000 0000 0000" : i === 2 ? "MM/YY" : "•••")}
                  </button>
                </div>
              ))}
              {topUpCardFilled && (
                <div style={{ background: "var(--color-bg-secondary)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 30, borderRadius: 6, background: "#1a1f71", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>VISA</span></div>
                  <div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>····5562</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>Expires 09/28</div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              <button onClick={() => { if (topUpCardFilled) { setToppedUpAmount(topUpAmount); setTopUpCardScreen(false); } }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: topUpCardFilled ? "var(--color-brand-600)" : "var(--color-border-default)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: topUpCardFilled ? "pointer" : "default", fontFamily: "inherit" }}>
                Top up £{topUpAmount}.00 now
              </button>
            </div>
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* After school - Confirmed */}
        {detailPage === "after-school" && flowStep === "confirmed" && (() => {
          const isTerm = bookingOption === "term";
          const isFreeConfig = !!wraparoundClubConfig?.isFree;
          const termSessions = (wraparoundClubConfig?.sessionDates || []).filter(d => d.active).length || 12;
          const sessionCount = isTerm ? termSessions : Object.keys(selectedGridDates).length;
          const total = isFreeConfig ? 0 : sessionCount * 10;
          const asDayLabelsConf = Object.fromEntries((wraparoundClubConfig?.sessionDates || []).filter(d => d.active).map(d => [d.id, d.date]));
          const asDates = isTerm
            ? (wraparoundClubConfig?.sessionDates || []).filter(d => d.active).map(d => ({ id: d.id || d.date, label: d.date }))
            : Object.keys(selectedGridDates).map(id => ({ id, label: asDayLabelsConf[id] || id }));
          return (
            <BookingConfirmedScreen
              isMobile={isMobile}
              clubName={wraparoundClubConfig?.name}
              childName={selectedChild.name}
              days={sessionCount === 1 ? (asDates[0]?.label ?? wraparoundClubConfig?.timeDisplay) : wraparoundClubConfig?.timeDisplay}
              time="15:30–17:00"
              location="Main Hall"
              clubLead="School staff"
              sessionCount={sessionCount}
              dates={asDates}
              isFree={isFreeConfig}
              fromAccount={!isFreeConfig}
              total={total}
              onClose={() => { setDetailPage(null); setFlowStep(null); setToppedUpAmount(0); }}
              onGoToBookings={() => { setFlowStep(null); setBookingNudgeRating(null); setDetailPage(null); setSelectedClub(null); setActiveTab("book-pay"); setBookingsFilter("upcoming"); setSubPage("my-bookings"); }}
              confirmedDatesExpanded={confirmedDatesExpanded}
              setConfirmedDatesExpanded={setConfirmedDatesExpanded}
              bookingNudgeRating={bookingNudgeRating}
              setBookingNudgeRating={setBookingNudgeRating}
              newLayout={true}
            />
          );
        })()}


        {/* ==================== BREAKFAST CLUB FLOW ==================== */}

        {/* Breakfast - Detail page */}
        {detailPage === "breakfast" && !flowStep && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-grey-050)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setDetailDatesExpanded(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setDetailDatesExpanded(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div ref={bkDetailRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {(() => {
                const fmtPrice = (n) => bkIsFree ? "Free" : (n % 1 === 0 ? `£${n}` : `£${n.toFixed(2)}`);
                // Score each period's days string by which weekday it extends to —
                // used to surface the broadest day coverage in the header.
                const bkDayEndScore = (s) => ({ Fri: 5, Thu: 4, Wed: 3, Tue: 2, Mon: 1 }[Object.keys({ Fri: 5, Thu: 4, Wed: 3, Tue: 2, Mon: 1 }).find(d => s.includes(d))] ?? 0);
                const broadestDays = [...activeBkPeriods].sort((a, b) => bkDayEndScore(b.days) - bkDayEndScore(a.days))[0].days;
                const earliestStart = activeBkPeriods.map(p => p.start).sort()[0];
                const bkTimeHeader = activeBkTimesVary ? `From ${earliestStart}` : `${activeBkPeriods[0].start}–${activeBkPeriods[0].end}`;

                const getSubtitle = (period) => {
                  if (period.name && period.name !== "Standard") return period.name;
                  return period.type === "termly" ? "Summer term 2026" : "Drop in";
                };
                const sortedPeriods = [...activeBkPeriods];
                const isSingle = sortedPeriods.length === 1;

                const scrollAfterRender = (el) => requestAnimationFrame(() => {
                  const container = bkDetailRef.current;
                  if (!container || !el) return;
                  const cRect = container.getBoundingClientRect();
                  const eRect = el.getBoundingClientRect();
                  if (eRect.bottom > cRect.bottom - 88) container.scrollTop += (eRect.bottom - cRect.bottom) + 88 + 8;
                });

                return (
                <div style={{ background: "var(--color-white)", borderRadius: 8, margin: "8px 16px 0", border: "1px solid var(--color-grey-100)", paddingBottom: 24 }}>
                  <div style={{ padding: "20px 16px 0" }}>
                    <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>Breakfast club</h2>
                    <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "4px 0 0", lineHeight: 1.2 }}>For {selectedChild.name}</p>
                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                    <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{expandDay(broadestDays)} · {bkTimeHeader}</p>
                    <button onClick={() => setDetailDatesExpanded(!detailDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View all dates</span>
                      <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: detailDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </button>
                    {detailDatesExpanded && (() => {
                      const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      const weeks = breakfastSessionDates.filter(d => d.weekLabel);
                      const groups = {};
                      weeks.forEach(d => { const month = d.label.split(" ").pop(); if (!groups[month]) groups[month] = []; groups[month].push(d); });
                      const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                      return (
                        <div style={{ marginTop: 12, textAlign: "left" }}>
                          {sortedMonths.map((month, mi) => (
                            <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                              {groups[month].map(d => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                  <span style={{ fontSize: "var(--font-size-3)", color: d.active ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active ? "none" : "line-through" }}>{d.weekLabel}</span>
                                  {d.active
                                    ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{(() => { const p = selectedBkPeriod ?? activeBkPeriods[0]; return p ? `${p.start}–${p.end}` : ""; })()}</span>
                                    : d.note && <Tag variant="neutral">{d.note}</Tag>}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                        <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                        Dining Hall
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                        <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                        School staff
                      </span>
                    </div>
                    {!bkAboutExpanded ? (
                      <>
                        <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>Start the day right with our breakfast club. Children enjoy a healthy breakfast including toast, cereal, fruit and juice, with time for reading, drawing and quiet activities before the school day begins. Staff supervise children and ensure they're ready for class.</p>
                        <button onClick={() => setBkAboutExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit", display: "block" }}>Read more</button>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 6px" }}>Start the day right with our breakfast club. Children enjoy a healthy breakfast including toast, cereal, fruit and juice, with time for reading, drawing and quiet activities before the school day begins. Staff supervise children and ensure they're ready for class.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {["Healthy breakfast provided", "Quiet activities before school", "Supervised by trained staff"].map((point, i, arr) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", lineHeight: "1.5" }}>•</span>
                              <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: "1.5" }}>
                                {point}{i === arr.length - 1 && <>{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button></>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 12 }}>Booking options</div>
                      {isSingle ? (() => {
                        const period = sortedPeriods[0];
                        const isTermly = period.type === "termly";
                        const price = fmtPrice(period.price);
                        const subtitle = getSubtitle(period);
                        const sessionCount = isTermly ? (period.sessionsRemaining ?? null) : null;
                        return (
                          <div style={{ background: "var(--color-brand-050)", border: "1px solid var(--color-brand-100)", borderRadius: 8, padding: "14px 16px", position: "relative" }}>
                            <div style={{ position: "absolute", top: 14, left: 16, width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--color-brand-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-brand-600)" }} />
                            </div>
                            <div style={{ paddingLeft: 32 }}>
                              <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{isTermly ? "Full term" : "Individual sessions"}</div>
                              {subtitle && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
                                <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly && sessionCount ? `${sessionCount} sessions` : ""}</span>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
                                  <span style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)" }}>{price}</span>
                                  {!bkIsFree && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly ? "total" : "each"}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {sortedPeriods.map(period => {
                            const isSelected = selectedBkPeriod?.id === period.id;
                            const isTermly = period.type === "termly";
                            const price = fmtPrice(period.price);
                            const subtitle = getSubtitle(period);
                            const sessionCount = isTermly ? (period.sessionsRemaining ?? null) : null;
                            return (
                              <button key={period.id}
                                onClick={(e) => { setSelectedBkPeriod(period); setBookingOption(isTermly ? "term" : "individual"); scrollAfterRender(e.currentTarget); }}
                                style={{ display: "block", width: "100%", padding: "14px 16px", background: isSelected ? "var(--color-brand-050)" : "var(--color-white)", border: isSelected ? "1px solid var(--color-brand-100)" : "1px solid var(--color-grey-100)", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left", position: "relative" }}>
                                <div style={{ position: "absolute", top: 14, left: 16, width: 20, height: 20, borderRadius: "50%", border: isSelected ? "2px solid var(--color-brand-600)" : "2px solid var(--color-border-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-brand-600)" }} />}
                                </div>
                                <div style={{ paddingLeft: 32 }}>
                                  <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{isTermly ? "Full term" : "Individual sessions"}</div>
                                  {subtitle && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div>}
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
                                    <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly && sessionCount ? `${sessionCount} sessions` : ""}</span>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
                                      <span style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)" }}>{price}</span>
                                      {!bkIsFree && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{isTermly ? "total" : "each"}</span>}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>
            {(selectedBkPeriod || activeBkPeriods.length === 1) && (() => {
              const effectiveBkPeriod = selectedBkPeriod ?? activeBkPeriods[0];
              return (
              <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)", borderTop: "1px solid var(--color-border-default)" }}>
                {effectiveBkPeriod.type === "daily" && breakfastClubConfig.sameDayCutoff && <p style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)", textAlign: "center", margin: "0 0 10px" }}>{breakfastClubConfig.sameDayCutoff}</p>}
                {effectiveBkPeriod.type === "termly" && breakfastClubConfig.blockDeadlineLabel && <p style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)", textAlign: "center", margin: "0 0 10px" }}>Booking closes {breakfastClubConfig.blockDeadlineLabel}</p>}
                <button
                  onClick={() => {
                    if (!selectedBkPeriod) { setSelectedBkPeriod(effectiveBkPeriod); setBookingOption(effectiveBkPeriod.type === "termly" ? "term" : "individual"); }
                    if (effectiveBkPeriod.type === "termly") { setFlowStep("payment"); setReviewDatesExpanded(false); }
                    else { setFlowStep("choose-dates"); setSelectedDates2({}); setBkPatternApplied(false); setExpandedWeeks(new Set()); setClubDatesError(false); }
                  }}
                  className="btn-action"
                  style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  {effectiveBkPeriod.type === "termly" ? "Continue" : "Choose sessions"}
                </button>
              </div>
              );
            })()}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-secondary)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
        )}

        {/* Breakfast - Booking options */}
        {detailPage === "breakfast" && flowStep === "booking-options" && (() => {
          const getBkTitle = (period) => {
            if (period.name) return period.name;
            if (activeBkTimesVary && activeBkDaysVary) return `${expandDay(period.days)} · ${period.start}–${period.end}`;
            if (activeBkTimesVary) return `${period.start}–${period.end}`;
            if (activeBkDaysVary)  return expandDay(period.days);
            return period.type === "daily" ? "Individual sessions" : "All sessions";
          };
          const getBkSubtitle = (period) => {
            if (period.type !== "daily") return null;
            return period.name ? "Individual sessions" : null;
          };
          const bkToMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
          const sortedBkPeriods = [...activeBkPeriods].sort((a, b) => {
            if (a.type !== b.type) return a.type === "daily" ? -1 : 1;
            return bkToMin(a.start) - bkToMin(b.start);
          });
          const effectiveBkPeriod = selectedBkPeriod ?? (activeBkPeriods.length === 1 ? activeBkPeriods[0] : null);
          const effectiveBkOption = bookingOption ?? (effectiveBkPeriod?.type === "termly" ? "term" : "individual");
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f5f5f5" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "#fff", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => { setFlowStep(null); setBookingOption(null); setSelectedBkPeriod(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#333" }}>Booking options</span>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setSelectedBkPeriod(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="#333" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="#333" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f5f5f5", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Context */}
              <div style={{ padding: "4px 0 8px" }}>
                <div style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-grey-900)" }}>Breakfast club</div>
                <div style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-grey-900)", marginTop: 2 }}>Mon–Fri</div>
                <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-grey-500)", marginTop: 3 }}>For {selectedChild.name}</div>
              </div>
              {/* One card per membership period. Each period is either daily or termly — set by school in Arbor. */}
              {sortedBkPeriods.map((period) => {
                const isSelected = effectiveBkPeriod?.id === period.id;
                const isTermly = period.type === "termly";
                const subtitle = getBkSubtitle(period);
                return (
                  <button key={period.id} onClick={() => { setSelectedBkPeriod(period); setBookingOption(isTermly ? "term" : "individual"); setTermExpanded(false); }}
                    style={{ display: "flex", alignItems: "center", width: "100%", padding: isSelected ? "13px 15px" : "14px 16px", background: "#fff", borderRadius: 12, border: isSelected ? "2px solid var(--color-brand-600)" : "1px solid var(--color-grey-100)", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSelected ? "2px solid var(--color-brand-600)" : "2px solid var(--color-border-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-brand-600)" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{getBkTitle(period)}</div>
                      {subtitle && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>{subtitle}</div>}
                      {isTermly && period.sessionsRemaining && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{period.sessionsRemaining} sessions remaining</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>£{period.price}</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 1 }}>{isTermly ? "all sessions" : "per session"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {effectiveBkPeriod && (
              <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                {effectiveBkOption === "term" ? (
                  <button onClick={() => { setFlowStep("payment"); setReviewDatesExpanded(false); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Continue</button>
                ) : (
                  <button onClick={() => { setFlowStep("choose-dates"); setSelectedDates2({}); setBkPatternApplied(false); setExpandedWeeks(new Set()); setClubDatesError(false); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Choose sessions</button>
                )}
              </div>
            )}
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "#ddd", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* Breakfast - Choose dates (S3 week grid, 1 row) */}
        {detailPage === "breakfast" && flowStep === "choose-dates" && (() => {
          const count = Object.keys(selectedDates2).length;

          // Group into weeks; derive isHalfTerm per week
          const weeks = [];
          let currentWeek = null;
          breakfastSessionDates.forEach(d => {
            if (d.weekLabel) { currentWeek = { label: d.weekLabel, days: [d] }; weeks.push(currentWeek); }
            else if (currentWeek) { currentWeek.days.push(d); }
          });
          weeks.forEach(w => { w.isHalfTerm = w.days.every(d => !d.active); });
          const activeWeeks = weeks.filter(w => !w.isHalfTerm);




          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0, background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
              <button onClick={() => {
                setFlowStep(null);
              }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Breakfast club</span>
                <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>For {selectedChild.name}</span>
              </div>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div ref={bkScrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Select all / Deselect all */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    if (count > 0) {
                      setSelectedDates2({});
                    } else {
                      const next = {};
                      breakfastSessionDates.filter(d => d.active).forEach(d => { next[d.id] = true; });
                      setSelectedDates2(next);
                      setExpandedWeeks(new Set(weeks.filter(w => !w.isHalfTerm).map(w => w.label)));
                    }
                    setClubDatesError(false);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)" }}>
                    {count > 0 ? "Deselect all" : "Select all"}
                  </span>
                </button>
              </div>

              {/* Choose sessions — accordion by week */}
              {(() => {
                const firstWeek = weeks.find(w => !w.isHalfTerm);

                const BkCheckRow = ({ d, isFirst }) => {
                  const isSelected = d.id in selectedDates2;
                  return (
                    <button onClick={() => { setSelectedDates2(prev => { const next = { ...prev }; if (isSelected) delete next[d.id]; else next[d.id] = true; return next; }); setClubDatesError(false); }}
                      style={{ display: "flex", alignItems: "center", padding: "11px 0", width: "100%", background: "none", borderTop: isFirst ? "none" : "1px solid var(--color-grey-100)", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: isSelected ? "1px solid var(--color-brand-600)" : "1px solid var(--color-border-strong)", background: isSelected ? "var(--color-brand-600)" : "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        <span style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)" }}>{d.label}</span>
                      </div>
                    </button>
                  );
                };

                return (
                  <>
                    {weeks.map((week) => {
                      if (week.isHalfTerm) return (
                        <div key={week.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Calendar size={16} color="var(--color-text-tertiary)" strokeWidth={1.5} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>{week.label}</span>
                              <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>No sessions</span>
                            </div>
                          </div>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", background: "var(--color-grey-100)", borderRadius: 20, padding: "3px 10px" }}>Half term</span>
                        </div>
                      );

                      const isFirst = week === firstWeek;
                      const isExpanded = isFirst || expandedWeeks.has(week.label);
                      const weekSelCount = week.days.filter(d => d.id in selectedDates2).length;

                      if (!isExpanded) {
                        return (
                          <button key={week.label} onClick={() => setExpandedWeeks(prev => new Set([...prev, week.label]))}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 16px", background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{week.label}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {weekSelCount > 0 && <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-white)", background: "var(--color-brand-600)", borderRadius: 99, padding: "2px 8px" }}>{weekSelCount}</span>}
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <div key={week.label} style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "0 16px" }}>
                          <div onClick={!isFirst ? () => setExpandedWeeks(prev => { const next = new Set(prev); next.delete(week.label); return next; }) : undefined}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", cursor: isFirst ? "default" : "pointer" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>{week.label}</span>
                              {selectedBkPeriod && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>{selectedBkPeriod.start}–{selectedBkPeriod.end}</span>}
                            </div>
                            {!isFirst && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 10L8 6L12 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          {week.days.map((d, i) => <BkCheckRow key={d.id} d={d} isFirst={i === 0} />)}
                          {isFirst && (
                            <>
                              {clubDatesError && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="6" stroke="var(--color-text-destructive)" strokeWidth="1.3" /><path d="M7 4V7.5" stroke="var(--color-text-destructive)" strokeWidth="1.3" strokeLinecap="round" /><circle cx="7" cy="10" r="0.8" fill="var(--color-text-destructive)" /></svg>
                                  <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Select at least one session to continue.</span>
                                </div>
                              )}
                              {count > 0 && (
                                <button
                                  onClick={() => {
                                    setClubDatesError(false);
                                    const selectedDays = new Set(Object.keys(selectedDates2).map(id => { const d = breakfastSessionDates.find(s => s.id === id); return d ? d.label.split(" ")[0] : null; }).filter(Boolean));
                                    const next = {};
                                    breakfastSessionDates.filter(d => d.active).forEach(d => { if (selectedDays.has(d.label.split(" ")[0])) next[d.id] = true; });
                                    setSelectedDates2(next);
                                    setExpandedWeeks(new Set(weeks.filter(w => !w.isHalfTerm).map(w => w.label)));
                                  }}
                                  style={{ width: "100%", marginTop: 14, marginBottom: 16, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 0", display: "flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)" }}>{(() => { const days = [...new Set(Object.keys(selectedDates2).map(id => breakfastSessionDates.find(s => s.id === id)?.label.split(" ")[0]).filter(Boolean))]; const dayLabel = days.length === 5 ? "weekday" : days.length <= 1 ? days[0] : `${days.slice(0, -1).join(", ")} & ${days[days.length - 1]}`; return `Book every ${dayLabel}`; })()}</span>
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                );
              })()}

            </div>

            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
                {count > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>{count} session{count !== 1 ? "s" : ""} selected</span>
                    <span style={{ fontSize: "var(--font-size-4)", fontWeight: 700, color: "var(--color-text-primary)" }}>£{count * (selectedBkPeriod?.price ?? 5)}</span>
                  </div>
                )}
                <button onClick={() => { if (count === 0) { setClubDatesError(true); return; } setClubDatesError(false); setFlowStep("payment"); setReviewDatesExpanded(false); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Continue</button>
            </div>

            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>
          </div>
          );
        })()}

        {/* Breakfast - Payment (wraparound, enough balance) */}
        {detailPage === "breakfast" && flowStep === "payment" && (() => {
          const isTerm = bookingOption === "term";
          const sessionCount = isTerm ? breakfastSessionDates.filter(d => d.active).length : Object.keys(selectedDates2).length;
          const total = isTerm ? (selectedBkPeriod?.price ?? 0) : sessionCount * (selectedBkPeriod?.price ?? 5);
          const hasEnough = wraparoundBalance >= total;
          const shortfall = total - wraparoundBalance;
          const hasToppedUp = toppedUpAmount > 0;
          const minTopUp = Math.max(2, Math.ceil(shortfall));
          const isHardBlock = shortfall > 0 && !breakfastClubConfig.allowSignUpIfLowBalance;
          const isSoftWarn = shortfall > 0 && !!breakfastClubConfig.allowSignUpIfLowBalance;
          const isPostTopUp = hasToppedUp && shortfall <= 0;
          const dayAbbrevs = ["Mon","Tue","Wed","Thu","Fri"];
          const uniqueSelectedDays = isTerm ? dayAbbrevs : [...new Set(Object.keys(selectedDates2).map(id => { const d = breakfastSessionDates.find(s => s.id === id); return d ? d.label.split(" ")[0] : null; }).filter(Boolean))].sort((a,b) => dayAbbrevs.indexOf(a) - dayAbbrevs.indexOf(b));
          const bkDayFullNames = { Mon: "Mondays", Tue: "Tuesdays", Wed: "Wednesdays", Thu: "Thursdays", Fri: "Fridays" };
          const daysLabel = uniqueSelectedDays.length === 1 ? (bkDayFullNames[uniqueSelectedDays[0]] ?? uniqueSelectedDays[0]) : uniqueSelectedDays.length === 5 ? "Mon–Fri" : uniqueSelectedDays.join(", ");
          return (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-bg-secondary)", position: "relative" }}>
            <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 120, height: 28, background: "var(--color-text-primary)", borderRadius: 14, display: isMobile ? "none" : "block" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
              <button onClick={() => setFlowStep(isTerm ? "booking-options" : "choose-dates")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { setDetailPage(null); setFlowStep(null); setToppedUpAmount(0); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 20px", background: "var(--color-bg-secondary)" }}>
              {/* Order summary card */}
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "16px", marginBottom: 20 }}>
                <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>Breakfast club</h2>
                <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "4px 0 0", lineHeight: 1.2 }}>For {selectedChild.name}</p>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{sessionCount === 1 ? `${breakfastSessionDates.find(s => s.id === Object.keys(selectedDates2)[0])?.label ?? daysLabel} · ${selectedBkPeriod.start}–${selectedBkPeriod.end}` : `${daysLabel} · ${selectedBkPeriod.start}–${selectedBkPeriod.end}`}</p>
                {sessionCount !== 1 && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{sessionCount} sessions selected</span>
                      <button onClick={() => setReviewDatesExpanded(!reviewDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>View dates</span>
                        <ChevronDown size={14} color="var(--color-brand-600)" strokeWidth={2} style={{ transform: reviewDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                      </button>
                    </div>
                    {reviewDatesExpanded && (() => {
                      const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      if (isTerm) {
                        const weeks = breakfastSessionDates.filter(d => d.weekLabel);
                        const groups = {};
                        weeks.forEach(d => { const m = d.label.split(" ").pop(); if (!groups[m]) groups[m] = []; groups[m].push(d); });
                        const months = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                        return (
                          <div style={{ marginTop: 12, textAlign: "left" }}>
                            {months.map((month, mi) => (
                              <div key={month} style={{ marginBottom: mi < months.length - 1 ? 20 : 0 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                                {groups[month].map(d => (
                                  <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                    <span style={{ fontSize: "var(--font-size-3)", color: d.active ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active ? "none" : "line-through" }}>{d.weekLabel}</span>
                                    {d.active
                                      ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{selectedBkPeriod ? `${selectedBkPeriod.start}–${selectedBkPeriod.end}` : ""}</span>
                                      : d.note && <Tag variant="neutral">{d.note}</Tag>
                                    }
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        const selected = Object.keys(selectedDates2).map(id => ({ id, session: breakfastSessionDates.find(s => s.id === id), time: selectedDates2[id] })).filter(x => x.session);
                        const groups = {};
                        selected.forEach(x => { const m = x.session.label.split(" ").pop(); if (!groups[m]) groups[m] = []; groups[m].push(x); });
                        const months = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                        return (
                          <div style={{ marginTop: 12, textAlign: "left" }}>
                            {months.map((month, mi) => (
                              <div key={month} style={{ marginBottom: mi < months.length - 1 ? 20 : 0 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 12 }}>{month} 2026</div>
                                {groups[month].map(x => (
                                  <div key={x.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                    <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)" }}>{x.session.label}</span>
                                    {selectedBkPeriod && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{selectedBkPeriod.start}–{selectedBkPeriod.end}</span>}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      }
                    })()}
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    Dining Hall
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                    <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                    School staff
                  </span>
                </div>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Total</span>
                  <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>£{total.toFixed(2)}</span>
                </div>
                {breakfastClubConfig.chargeOnAttendance && (
                  <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginTop: 10 }}>
                    You only pay £{(selectedBkPeriod?.price ?? 0).toFixed(2)} for each session {selectedChild.name} attends. Missed sessions stay in your balance.
                  </div>
                )}
              </div>
              <div style={{ background: "var(--color-white)", borderRadius: 12, border: "1px solid var(--color-grey-100)", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SunMoon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-secondary)" }}>From</div>
                    <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Wraparound account</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "var(--color-grey-100)", margin: "12px 0" }} />
                {breakfastClubConfig.chargeOnAttendance && shortfall <= 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-primary)" }}>Your balance covers this booking</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 4 }}>
                        Current balance · £{wraparoundBalance.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-success-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Booking cost</span>
                      <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>£{total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Current balance</span>
                      <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>£{wraparoundBalance.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 0 12px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      {shortfall <= 0 ? (
                        <>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>After booking</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>£{(wraparoundBalance - total).toFixed(2)}</span>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="var(--color-success-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Top up to book</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-warning)" }}>£{shortfall.toFixed(2)}</span>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--color-warning-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <AlertTriangle size={12} color="var(--color-warning-700)" strokeWidth={2} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: "12px 16px 20px", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, background: "var(--color-white)" }}>
              {shortfall <= 0 && <div style={{ fontSize: "var(--font-size-1)", color: "var(--color-text-tertiary)", textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>By booking, you consent to your child attending this activity.</div>}
              {shortfall > 0 ? (
                <button onClick={() => { setShowTopUpSheet(true); setTopUpAmount(minTopUp); setTopUpPaymentMethod("card"); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Top up £{shortfall.toFixed(2)} to continue
                </button>
              ) : (
                <button onClick={() => { setConfirmedDatesExpanded(false); setFlowStep("confirmed"); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Book {selectedChild.name} in
                </button>
              )}
            </div>
            <div style={{ height: isMobile ? 0 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: 134, height: 5, background: "var(--color-border-default)", borderRadius: 3 }} />
            </div>

            {/* ===== Top-up bottom sheet ===== */}
            {showTopUpSheet && (
              <div onClick={() => setShowTopUpSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", minHeight: 520, maxHeight: "85%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px", flexShrink: 0 }}>
                    <button onClick={() => setShowTopUpSheet(false)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 8px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Top up {selectedChild.name}'s Wraparound</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>Current balance · £{wraparoundBalance.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                      <button onClick={() => { if (topUpAmount <= minTopUp) flashTopUpMinError(); else setTopUpAmount(topUpAmount - 1); }} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${(topUpAmount < minTopUp || topUpMinFlash) ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)", transition: "border-color 0.15s ease" }}>
                        <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={topUpAmount}
                          onChange={e => setTopUpAmount(Math.max(0, Number(e.target.value)))}
                          style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${String(topUpAmount).length * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />
                      </div>
                      <button onClick={() => setTopUpAmount(topUpAmount + 1)} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                    </div>
                    <div style={{ height: 22, textAlign: "center", marginBottom: 24 }}>
                      {(topUpAmount < minTopUp || topUpMinFlash) && (
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Minimum top-up is £{minTopUp}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                      {[10, 25, 50].map(amt => (
                        <button key={amt} onClick={() => setTopUpAmount(prev => prev + amt)} style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid var(--color-border-default)", background: "var(--color-white)", fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer", fontFamily: "inherit" }}>+£{amt}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "12px 16px 28px", background: "var(--color-white)", flexShrink: 0 }}>
                    <button onClick={() => { if (topUpAmount < minTopUp) setTopUpAmount(minTopUp); setShowTopUpStripeSheet(true); }} className="btn-action" style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{topUpAmount < minTopUp ? `Top up minimum £${minTopUp}` : `Top up £${topUpAmount}.00 now`}</button>
                  </div>
                </div>
                {showTopUpStripeSheet && (
                  <div onClick={() => setShowTopUpStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 10 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                        <button onClick={() => setShowTopUpStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                      <div style={{ padding: "0 16px 4px" }}>
                        <button onClick={() => { setShowTopUpStripeSheet(false); setShowTopUpStripeApplePay(true); setTimeout(() => { setToppedUpAmount(prev => prev + topUpAmount); setShowTopUpStripeApplePay(false); setShowTopUpSheet(false); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                          <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                          <span>Pay</span>
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                        </div>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                        <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                          </div>
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                          <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                        </div>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                        <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                            <div style={{ width: 34, height: 24, borderRadius: 4, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="#888" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                            </div>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                            <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        </div>
                        <button onClick={() => { setShowTopUpStripeSheet(false); setToppedUpAmount(prev => prev + topUpAmount); setShowTopUpSheet(false); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                          <span>Top up £{topUpAmount}.00</span>
                          <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {showTopUpStripeApplePay && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                    <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <button onClick={() => setShowTopUpStripeApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                      </div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                        <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{topUpAmount}.00</div>
                      </div>
                      <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                          <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                        </div>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {/* Breakfast - Confirmed */}
        {detailPage === "breakfast" && flowStep === "confirmed" && (() => {
          const isTerm = bookingOption === "term";
          const sessionCount = isTerm ? 60 : Object.keys(selectedDates2).length;
          const total = isTerm ? (selectedBkPeriod?.price ?? 0) : sessionCount * (selectedBkPeriod?.price ?? 5);
          const dayAbbrevs = ["Mon","Tue","Wed","Thu","Fri"];
          const uniqueSelectedDays = isTerm ? dayAbbrevs : [...new Set(Object.keys(selectedDates2).map(id => { const d = breakfastSessionDates.find(s => s.id === id); return d ? d.label.split(" ")[0] : null; }).filter(Boolean))].sort((a,b) => dayAbbrevs.indexOf(a) - dayAbbrevs.indexOf(b));
          const daysLabel = uniqueSelectedDays.length === 5 ? "Mon–Fri" : uniqueSelectedDays.length === 1 ? expandDay(uniqueSelectedDays[0]) : uniqueSelectedDays.join(", ");
          const bkTimeLabel = selectedBkPeriod ? `${selectedBkPeriod.start}–${selectedBkPeriod.end}` : "07:45–08:30";
          const bkDates = Object.keys(selectedDates2).map(id => ({ id, label: breakfastSessionDates.find(s => s.id === id)?.label || id, time: bkTimeLabel }));
          const periodLabel = selectedBkPeriod ? `${selectedBkPeriod.name}${activeBkPeriodMeta(selectedBkPeriod) ? ` · ${activeBkPeriodMeta(selectedBkPeriod)}` : ""}` : undefined;
          return (
            <BookingConfirmedScreen
              isMobile={isMobile}
              clubName="Breakfast club"
              childName={selectedChild.name}
              days={sessionCount === 1 ? (bkDates[0]?.label ?? daysLabel) : daysLabel}
              time={selectedBkPeriod ? `${selectedBkPeriod.start}–${selectedBkPeriod.end}` : "07:45–08:30"}
              location="Dining Hall"
              clubLead="School staff"
              sessionCount={sessionCount}
              dates={bkDates}
              isFree={false}
              fromAccount={true}
              total={total}
              onClose={() => { setDetailPage(null); setFlowStep(null); }}
              onGoToBookings={() => { setFlowStep(null); setBookingNudgeRating(null); setDetailPage(null); setSelectedClub(null); setActiveTab("book-pay"); setBookingsFilter("upcoming"); setSubPage("my-bookings"); }}
              confirmedDatesExpanded={confirmedDatesExpanded}
              setConfirmedDatesExpanded={setConfirmedDatesExpanded}
              bookingNudgeRating={bookingNudgeRating}
              setBookingNudgeRating={setBookingNudgeRating}
              newLayout={true}
            />
          );
        })()}
        {/* Regular app content */}
        {!detailPage && (<>
        {!(subPage === "my-bookings" && selectedUpcomingItem?.paymentModel) && (<>
        {/* Status bar area */}
        <div
          style={{
            height: isMobile ? 20 : 50,
            background: activeTab === "home" && !subPage ? "var(--color-brand-050)" : "var(--color-white)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 4,
          }}
        >
          <div
            style={{
              width: 120,
              height: 28,
              background: "#222",
              borderRadius: 14,
              display: isMobile ? "none" : "block",
            }}
          />
        </div>

        <TopNav
          selectedChild={selectedChild}
          onSwitchChild={(c) => { setSelectedChild(c); setAllChildren(false); }}
          allChildren={allChildren}
          onSelectAll={() => setAllChildren(true)}
          showAllOption={activeTab === "home"}
          hideChildSwitcher={activeTab === "messages"}
          onProfileOpen={() => { setShowProfile(true); setProfileChild(null); setProfileScreen(null); }}
          surface={activeTab === "home" && !subPage ? "brand" : "default"}
        />
        </>)}

        {/* Content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {/* Sub-pages with back button */}
          {subPage === "my-bookings" && selectedUpcomingItem && (() => {
            const item = (selectedUpcomingItem.id === "t1" && pglTrip.balanceOwed > 0) ? pglTrip
              : (selectedUpcomingItem.id === archeryBooking.id && archeryBooking.balanceOwed > 0) ? archeryBooking
              : selectedUpcomingItem;
            const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const bookingNavTitle = (() => {
              const base = { "Club": "Club booking", "Wraparound": "Wraparound booking", "Trip": "Trip booking", "Meals": "Meal order", "Parents' evening": "Parents' evening", "Shop": "Shop order" }[item.category] ?? item.category;
              return item.status === "attended" ? `Past ${base.charAt(0).toLowerCase()}${base.slice(1)}` : base;
            })();
            const closeBookingDetail = () => { setSelectedUpcomingItem(null); setBookingDetailDatesExpanded(false); setPaymentTakeoverConfirmed(false); if (bookingReturnTo === "landing") { setSubPage(null); setBookingReturnTo("list"); } };
            const handlePaymentSuccess = () => {
              if (item.paymentModel === "variable" || item.paymentModel === "instalment") {
                const paid = takeoverPaymentAmount;
                const prevPaid = item.id === "t1" ? pglAmountPaid : archeryAmountPaid;
                const newAmountPaid = prevPaid + paid;
                const remaining = item.totalCost - newAmountPaid;
                if (item.id === "t1") setPglAmountPaid(newAmountPaid); else setArcheryAmountPaid(newAmountPaid);
                if (remaining <= 0) {
                  setPaymentTakeoverConfirmed(true);
                } else {
                  setPartialPaymentToast({ paid, remaining });
                }
              } else {
                setPaymentTakeoverConfirmed(true);
              }
            };
            if (item.paymentModel && paymentTakeoverConfirmed) {
              const confDates = (item.dates || []).filter(d => !d.past).map(d => ({ ...d, time: item.time }));
              return (
                <BookingConfirmedScreen
                  isMobile={isMobile}
                  clubName={item.title}
                  childName={item.child || selectedChild.name}
                  days={item.sessions === 1 && confDates[0] ? confDates[0].label : item.days}
                  time={item.time}
                  location={item.location}
                  clubLead={item.clubLead}
                  sessionCount={item.sessions}
                  dates={confDates}
                  isFree={false}
                  total={item.totalCost}
                  onClose={closeBookingDetail}
                  onGoToBookings={() => { setBookingsFilter("upcoming"); closeBookingDetail(); }}
                  confirmedDatesExpanded={confirmedDatesExpanded}
                  setConfirmedDatesExpanded={setConfirmedDatesExpanded}
                  bookingNudgeRating={bookingNudgeRating}
                  setBookingNudgeRating={setBookingNudgeRating}
                  newLayout={true}
                  paymentComplete={item.paymentModel === "variable"}
                  amountPaidNow={takeoverPaymentAmount}
                />
              );
            }
            return (
              <div style={{ background: "var(--color-grey-050)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
                {/* Header — Pattern A (chromeless) for payment flows, Pattern C (sub-page) otherwise */}
                {item.paymentModel ? (
                  <>
                    <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
                      <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 0", flexShrink: 0 }}>
                      <button onClick={closeBookingDetail} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button onClick={closeBookingDetail} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 4L4 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={closeBookingDetail} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>{bookingNavTitle}</span>
                  </div>
                )}

                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>
                  {/* Summary card */}
                  <div style={{ background: "var(--color-white)", borderRadius: 8, padding: "20px 16px 24px", border: "1px solid var(--color-grey-100)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 2px" }}>{item.title}</h2>
                      {item.status === "cancelled" && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", flexShrink: 0, marginTop: 4 }}>Cancelled</span>}
                    </div>
                    {item.child && <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0 }}>For {item.child}</p>}
                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />
                    <p style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 8px" }}>{item.category === "Trip" ? `${item.dateRange}${item.time ? ` · ${item.time}` : ""}` : item.sessions === 1 && item.dates?.[0] ? `${item.dates[0].label} · ${item.time}` : item.status === "attended" && item.sub ? `${item.sub} · ${item.time}` : getClubScheduleLabel(item, clubExtras[item.id])}</p>

                    {/* Sessions count + view dates */}
                    {item.sessions && item.sessions > 1 && (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{item.status === "attended" ? `${item.sessions} sessions` : `${item.sessions} sessions booked`}</span>
                          {item.dates && (
                            <button onClick={() => setBookingDetailDatesExpanded(!bookingDetailDatesExpanded)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                              <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500 }}>{item.status === "attended" ? "View session history" : "View dates"}</span>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: bookingDetailDatesExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M3 4.5L6 7.5L9 4.5" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          )}
                        </div>
                        {bookingDetailDatesExpanded && item.dates && (() => {
                          const upcomingDates = item.status === "attended" ? item.dates : item.dates.filter(d => !d.past);
                          const groups = {};
                          upcomingDates.forEach(d => {
                            const parts = d.label.split(" ");
                            const month = parts[parts.length - 1];
                            const dayDisplay = parts.slice(0, -1).join(" ");
                            if (!groups[month]) groups[month] = [];
                            groups[month].push({ ...d, dayDisplay });
                          });
                          const sortedMonths = Object.keys(groups).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                          const multiMonth = sortedMonths.length > 1;
                          return (
                            <div style={{ marginTop: 28 }}>
                              {multiMonth ? sortedMonths.map((month, mi) => (
                                <div key={month} style={{ marginBottom: mi < sortedMonths.length - 1 ? 20 : 0 }}>
                                  <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>{month} 2026</div>
                                  {groups[month].map(d => (
                                    <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                      <span style={{ fontSize: "var(--font-size-3)", color: d.active !== false ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active !== false ? "none" : "line-through" }}>{d.label}</span>
                                      {d.active !== false
                                        ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{item.time}</span>
                                        : d.note && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)", borderRadius: 20, padding: "2px 10px" }}>{d.note}</span>
                                      }
                                    </div>
                                  ))}
                                </div>
                              )) : upcomingDates.map(d => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--color-grey-100)" }}>
                                  <span style={{ fontSize: "var(--font-size-3)", color: d.active !== false ? "var(--color-text-primary)" : "var(--color-text-disabled)", textDecoration: d.active !== false ? "none" : "line-through" }}>{d.label}</span>
                                  {d.active !== false
                                    ? <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{item.time}</span>
                                    : d.note && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)", borderRadius: 20, padding: "2px 10px" }}>{d.note}</span>
                                  }
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </>
                    )}

                    {/* Location / provider */}
                    {(item.location || item.clubLead) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                        {item.location && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                            <MapPin size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                            {item.location}
                          </span>
                        )}
                        {item.clubLead && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                            <Users size={12} color="var(--color-text-secondary)" strokeWidth={1.5} />
                            {item.clubLead}
                          </span>
                        )}
                      </div>
                    )}

                    {/* About — inline */}
                    {item.description && (
                      !bkAboutExpanded ? (
                        <>
                          <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                          <button onClick={() => setBkAboutExpanded(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit", display: "block" }}>Read more</button>
                        </>
                      ) : (
                        <p style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)", lineHeight: 1.6, margin: "24px 0 0" }}>
                          {item.description}{" "}<button onClick={() => setBkAboutExpanded(false)} style={{ display: "inline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", fontWeight: 500, fontFamily: "inherit" }}>Read less</button>
                        </p>
                      )
                    )}

                    {/* Paid */}
                    {item.paid !== undefined && (
                      <div style={{ marginTop: 20 }}>
                        {item.status === "cancelled" ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--color-bg-secondary)", borderRadius: 10 }}>
                            <div>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>Refund processing</div>
                              <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>Takes 3–5 working days</div>
                            </div>
                            <div style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>{`£${item.paid.toFixed(2)}`}</div>
                          </div>
                        ) : item.status === "attended" ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--color-bg-secondary)", borderRadius: 10 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)" }}>{item.paid > 0 ? "Paid" : "Cost"}</span>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)" }}>{item.paid > 0 ? `£${item.paid.toFixed(2)}` : "Free"}</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--color-success-050)", borderRadius: 10 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-success-700)" }}>{item.paid > 0 ? "Paid" : "Cost"}</span>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-success-700)" }}>{item.paid > 0 ? `£${item.paid.toFixed(2)}` : "Free"}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment summary — Provisional / Variable Contributions */}
                    {item.paymentModel && (() => {
                      const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
                      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      const parseStr = (s) => { const [d,m,y] = s.split(" "); return new Date(+y, monthMap[m], +d); };
                      const fmtDate = (d) => `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                      const todayDate = new Date(2026, 4, 29);
                      const deadlineDate = item.paymentDeadline || (item.dateRange?.includes("–") ? parseStr(item.dateRange.split("–")[1].trim()) : null);
                      const isOverdue = deadlineDate && todayDate > deadlineDate && item.paymentModel === "variable";
                      const deadlineLabel = deadlineDate ? fmtDate(deadlineDate) : null;
                      const outstandingColor = isOverdue ? "var(--color-text-destructive)" : "var(--color-text-primary)";
                      return (
                        <div style={{ marginTop: 24, background: "var(--color-grey-050)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Total</span>
                            <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>{`£${item.totalCost.toFixed(2)}`}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>Paid so far</span>
                            <span style={{ fontSize: "var(--font-size-5)", color: "var(--color-text-secondary)" }}>{`£${item.amountPaid.toFixed(2)}`}</span>
                          </div>
                          <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 0 12px" }} />
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: outstandingColor }}>Outstanding</div>
                              {deadlineLabel && (item.paymentModel === "variable" || item.paymentModel === "instalment") && (
                                <div style={{ fontSize: "var(--font-size-3)", color: isOverdue ? "var(--color-text-destructive)" : "var(--color-text-secondary)", marginTop: 2 }}>
                                  {isOverdue ? `Overdue since ${deadlineLabel}` : `Full amount by ${deadlineLabel}`}
                                </div>
                              )}
                            </div>
                            <span style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: outstandingColor, flexShrink: 0 }}>{`£${item.balanceOwed.toFixed(2)}`}</span>
                          </div>
                          {item.paymentModel === "provisional" && (
                            <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "12px 0 0", lineHeight: 1.4 }}>We're holding this place until payment clears.</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {item.paymentModel && (
                  <div style={{ padding: "12px 16px 20px", background: "var(--color-white)", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => { setPaymentMethod("card"); setCardFilled(false); setTakeoverPaymentAmount(item.balanceOwed); setShowStripeSheet(true); }} style={{ width: "100%", padding: "13px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {item.paymentModel === "variable" || item.paymentModel === "instalment" ? `Pay in full · £${item.balanceOwed.toFixed(2)}` : `Pay now · £${item.balanceOwed.toFixed(2)}`}
                    </button>
                    {(item.paymentModel === "variable" || item.paymentModel === "instalment") && (
                      <button onClick={() => { setPartialAmount(0); setShowPartialSheet(true); }} style={{ width: "100%", padding: "12px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Pay a different amount
                      </button>
                    )}
                  </div>
                )}
                {showStripeSheet && (
                  <div onClick={() => setShowStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                        <button onClick={() => setShowStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                      <div style={{ padding: "0 16px 4px" }}>
                        <button onClick={() => { setShowStripeSheet(false); setShowTakeoverApplePay(true); setTimeout(() => { setShowTakeoverApplePay(false); handlePaymentSuccess(); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                          <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                          <span>Pay</span>
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                          <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                        </div>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                        <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                            <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                          </div>
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                          <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                        </div>
                        <button onClick={() => { setShowStripeSheet(false); handlePaymentSuccess(); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                          <span>Pay £{takeoverPaymentAmount.toFixed(2)}</span>
                          <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {showTakeoverApplePay && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                    <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                        <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{takeoverPaymentAmount.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: "center", fontSize: "var(--font-size-3)", color: "#999" }}>Processing…</div>
                    </div>
                  </div>
                )}
                {showPartialSheet && (item.paymentModel === "variable" || item.paymentModel === "instalment") && (() => {
                  const valid = partialAmount > 0 && partialAmount <= item.balanceOwed;
                  const overBalance = partialAmount > item.balanceOwed;
                  return (
                    <div onClick={() => setShowPartialSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px" }}>
                          <button onClick={() => setShowPartialSheet(false)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          </button>
                        </div>
                        <div style={{ padding: "8px 16px 8px", display: "flex", flexDirection: "column" }}>
                          <div style={{ textAlign: "center", marginBottom: 28 }}>
                            <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Choose amount</div>
                            <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>Outstanding · £{item.balanceOwed.toFixed(2)}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                            <button onClick={() => setPartialAmount(Math.max(0, partialAmount - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${overBalance ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)" }}>
                              <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={partialAmount}
                                onChange={(e) => { const v = parseInt(e.target.value) || 0; setPartialAmount(Math.max(0, v)); }}
                                style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${String(partialAmount).length * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }}
                              />
                            </div>
                            <button onClick={() => setPartialAmount(Math.min(item.balanceOwed, partialAmount + 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                          </div>
                          <div style={{ height: 22, textAlign: "center", marginBottom: 16 }}>
                            {overBalance && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Can't pay more than £{item.balanceOwed.toFixed(2)}</span>}
                            {!overBalance && partialAmountFlash && partialAmount <= 0 && <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Enter an amount to pay</span>}
                          </div>
                        </div>
                        <div style={{ padding: "12px 16px 28px", background: "var(--color-white)" }}>
                          <button
                            onClick={() => {
                              if (!valid) {
                                if (partialFlashTimer.current) clearTimeout(partialFlashTimer.current);
                                setPartialAmountFlash(true);
                                partialFlashTimer.current = setTimeout(() => setPartialAmountFlash(false), 2500);
                                return;
                              }
                              setTakeoverPaymentAmount(partialAmount);
                              setShowPartialSheet(false);
                              setPaymentMethod("card");
                              setCardFilled(false);
                              setShowStripeSheet(true);
                            }}
                            style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            {`Pay now · £${partialAmount.toFixed(2)}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {partialPaymentToast && (
                  <div style={{ position: "absolute", bottom: 100, left: 16, right: 16, zIndex: 50 }}>
                    <Toast
                      variant="success"
                      message={`£${partialPaymentToast.paid.toFixed(2)} paid · £${partialPaymentToast.remaining.toFixed(2)} remaining`}
                      onClose={() => setPartialPaymentToast(null)}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {subPage === "my-bookings" && !selectedUpcomingItem && (() => {
            const needsAttentionItems = [
              { id: "u4", title: "Art club", category: "Club", status: "cancelled", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Wed 9 Apr", child: "Molly", childColour: children[0].avatarColour, sessions: 1, days: "Wed", time: "15:30–16:30", paid: 6, location: "Art Room", description: "Art Club gives children the freedom to explore drawing, painting, printmaking, and mixed media in a relaxed creative space. Each session focuses on a different technique or theme, encouraging imagination and self-expression.", dates: [{ id: "art-apr9", label: "Wed 9 Apr" }] },
              ...(pglTrip.balanceOwed > 0 ? [pglTrip] : []),
              /* ARCHIVED 2026-05-29 — Coding Club provisional booking. Provisional model is portal-only for now. Restore by uncommenting + bumping bookingsNeedsAttentionCount base back to 2.
              {
                id: "c1",
                title: "Coding club",
                category: "Club",
                status: "pending-payment",
                paymentModel: "provisional",
                icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,
                sub: "6 Apr – 17 Jul 2026",
                dateRange: "6 Apr – 17 Jul 2026",
                nextSession: "Mon 6 Apr",
                days: "Mon",
                time: "15:30–16:30",
                sessions: 11,
                child: "Molly",
                childColour: children[0].avatarColour,
                totalCost: 77,
                amountPaid: 0,
                balanceOwed: 77,
                location: "ICT Suite",
                description: "Coding Club introduces children to programming through hands-on projects using Scratch, Python, and web basics. Sessions are accessible and engaging, helping children develop logical thinking and problem-solving skills.",
                dates: [
                  { id: "code-apr6",  label: "Mon 6 Apr",  past: true },
                  { id: "code-apr13", label: "Mon 13 Apr", past: true },
                  { id: "code-apr20", label: "Mon 20 Apr", past: true },
                  { id: "code-apr27", label: "Mon 27 Apr", past: true },
                  { id: "code-may4",  label: "Mon 4 May",  past: true },
                  { id: "code-may11", label: "Mon 11 May", past: true },
                  { id: "code-may18", label: "Mon 18 May", past: true },
                  { id: "code-may25", label: "Mon 25 May", past: true },
                  { id: "code-jun1",  label: "Mon 1 Jun" },
                  { id: "code-jun8",  label: "Mon 8 Jun" },
                  { id: "code-jun15", label: "Mon 15 Jun" },
                ],
              },
              */
              ...(archeryBooking.balanceOwed > 0 ? [archeryBooking] : []),
            ].filter(i => (i.category === "Club" || i.category === "Wraparound" || i.category === "Trip") && i.child === selectedChild.name).sort((a, b) => {
              const todayDate = new Date(2026, 4, 29);
              const aOverdue = a.paymentDeadline && todayDate > a.paymentDeadline ? 1 : 0;
              const bOverdue = b.paymentDeadline && todayDate > b.paymentDeadline ? 1 : 0;
              return bOverdue - aOverdue;
            });
            const upcomingItems = [
              { id: "u1", title: "Drumming",         category: "Club",             status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,   sub: "6 Apr – 17 Jul 2026", nextSession: "Mon 4 May",         child: "Molly", childColour: children[0].avatarColour, sessions: 10, days: "Mon", time: "15:30–16:15", termDates: "6 Apr – 17 Jul 2026", dates: drummingSessionDates, paid: 110, location: "Music Block R1", clubLead: "Beat Academy", description: "Our Drumming Club introduces children to the exciting world of percussion in a fun, supportive group setting. They'll develop rhythm, coordination, and timing skills while learning a variety of drumming styles and techniques — building confidence and working towards a group performance." },
              { id: "u2", title: "Breakfast club",   category: "Wraparound",       status: "confirmed", icon: <SunMoon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,  sub: "Mon 7 – Fri 11 Apr",                      child: "Molly", childColour: children[0].avatarColour, sessions: 5, days: "Mon – Fri", time: "07:45–08:30", paid: 25, location: "Dining Hall", clubLead: "School staff", description: "Start the day right with our breakfast club. Children enjoy a healthy breakfast including toast, cereal, fruit and juice, with time for reading, drawing and quiet activities before the school day begins. Staff supervise children and ensure they're ready for class.", dates: [{ id: "bk-apr7", label: "Mon 7 Apr", active: true }, { id: "bk-apr8", label: "Tue 8 Apr", active: true }, { id: "bk-apr9", label: "Wed 9 Apr", active: true }, { id: "bk-apr10", label: "Thu 10 Apr", active: true }, { id: "bk-apr11", label: "Fri 11 Apr", active: true }] },
              { id: "u3", title: "Football",         category: "Club",             status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,   sub: "Tue 8 Apr",                                 child: "Molly", childColour: children[0].avatarColour, sessions: 1, days: "Tue", time: "15:30–16:30", paid: 8, location: "Sports Hall", description: "Join our Football Club and develop your skills on the pitch in a fun, structured environment. Players work on passing, shooting, and tactical awareness across the term, building teamwork and finishing with a mini tournament.", dates: [{ id: "fb-apr8", label: "Tue 8 Apr" }] },
              { id: "u5", title: "Year 3 farm visit", category: "Trip", status: "confirmed", icon: <Bus size={24} color={catColours["Trip"].iconColor} strokeWidth={1.5} />, dateRange: "Fri 17 Apr 2026", sub: "Fri 17 Apr 2026", time: "09:00 – 14:30", child: "Molly", childColour: children[0].avatarColour, paid: 14, location: "Oakwood Farm Park", clubLead: "Miss Bennett", description: "A day at Oakwood Farm Park for Year 3, meeting the animals and taking part in a guided minibeast workshop. Travel by coach with school staff. Children should bring a packed lunch." },
              ...(pglTrip.balanceOwed === 0 ? [{ ...pglTrip, status: "confirmed", paid: pglTrip.totalCost, paymentModel: undefined }] : []),
              ...(archeryBooking.balanceOwed === 0 ? [{ ...archeryBooking, status: "confirmed", paid: archeryBooking.totalCost, paymentModel: undefined }] : []),
              // ── Lucas (Year 6, Oakwood Primary) ──
              { id: "lu1", title: "Chess club", category: "Club", status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "6 Apr – 17 Jul 2026", nextSession: "Mon 15 Jun", child: "Lucas", childColour: children[1].avatarColour, sessions: 10, days: "Mon", time: "15:30–16:30", termDates: "6 Apr – 17 Jul 2026", dates: secMonDates, paid: 0, location: "Library", clubLead: "Mr Harris", description: "Chess Club builds focus, strategy and problem-solving in a friendly setting, from first moves through to club tournaments." },
              { id: "lu2", title: "Football", category: "Club", status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Tue 9 Jun", child: "Lucas", childColour: children[1].avatarColour, sessions: 1, days: "Tue", time: "15:30–16:30", paid: 8, location: "Sports Hall", description: "Join our Football Club and develop your skills on the pitch in a fun, structured environment.", dates: [{ id: "lu-fb-jun9", label: "Tue 9 Jun" }] },
              // ── Ethan (Year 9, Riverside Secondary) ──
              { id: "et1", title: "Football", category: "Club", status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Tue 9 Jun", child: "Ethan", childColour: children[2].avatarColour, sessions: 1, days: "Tue", time: "15:45–17:00", paid: 6, location: "Sports Hall", clubLead: "Mr Reed", description: "Competitive and recreational football coaching building fitness, technique and teamwork ahead of inter-school fixtures.", dates: [{ id: "et-fb-jun9", label: "Tue 9 Jun" }] },
              { id: "et2", title: "Debate club", category: "Club", status: "confirmed", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "6 Apr – 17 Jul 2026", nextSession: "Thu 11 Jun", child: "Ethan", childColour: children[2].avatarColour, sessions: 10, days: "Thu", time: "16:00–17:00", termDates: "6 Apr – 17 Jul 2026", dates: secThuDates, paid: 0, location: "Room 14", clubLead: "Ms Okafor", description: "A weekly forum for developing public speaking, argument and critical thinking, with regular debates and inter-school competitions." },
            ].filter(i => (i.category === "Club" || i.category === "Wraparound" || i.category === "Trip") && i.child === selectedChild.name);
            const pastItems = [
              { id: "p0", title: "Parents' evening", category: "Parents' evening", status: "attended", icon: <ParentsEveningIcon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Thu 10 Apr · 17:40 (10 min slot)", child: "Molly", childColour: children[0].avatarColour },
              { id: "p1", title: "Drumming",       category: "Club",       status: "attended", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,   sub: "5 Jan – 28 Mar 2026", child: "Molly", childColour: children[0].avatarColour, sessions: 11, paid: 110, days: "Mon", time: "15:30–16:15", location: "Music Block R1", clubLead: "Beat Academy", description: "Our Drumming Club introduces children to the exciting world of percussion in a fun, supportive group setting. They'll develop rhythm, coordination, and timing skills while learning a variety of drumming styles and techniques — building confidence and working towards a group performance.", dates: [{ id: "pd-jan5", label: "Mon 5 Jan" }, { id: "pd-jan12", label: "Mon 12 Jan" }, { id: "pd-jan19", label: "Mon 19 Jan" }, { id: "pd-jan26", label: "Mon 26 Jan" }, { id: "pd-feb2", label: "Mon 2 Feb" }, { id: "pd-feb9", label: "Mon 9 Feb" }, { id: "pd-feb23", label: "Mon 23 Feb" }, { id: "pd-mar2", label: "Mon 2 Mar" }, { id: "pd-mar9", label: "Mon 9 Mar" }, { id: "pd-mar16", label: "Mon 16 Mar" }, { id: "pd-mar23", label: "Mon 23 Mar" }] },
              { id: "p2", title: "Football",       category: "Club",       status: "attended", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,   sub: "Tue 4 Mar", child: "Molly", childColour: children[0].avatarColour, sessions: 1, paid: 8, days: "Tue", time: "15:30–16:30", location: "Sports Hall", description: "Join our Football Club and develop your skills on the pitch in a fun, structured environment. Players work on passing, shooting, and tactical awareness across the term, building teamwork and finishing with a mini tournament.", dates: [{ id: "fb-mar4", label: "Tue 4 Mar" }] },
              { id: "p3", title: "Breakfast club", category: "Wraparound", status: "attended", icon: <SunMoon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,  sub: "Mon 3 – Fri 7 Mar", child: "Molly", childColour: children[0].avatarColour, sessions: 5, days: "Mon – Fri", time: "07:45–08:30", paid: 25, location: "Dining Hall", clubLead: "School staff", description: "Start the day right with our breakfast club. Children enjoy a healthy breakfast including toast, cereal, fruit and juice, with time for reading, drawing and quiet activities before the school day begins. Staff supervise children and ensure they're ready for class.", dates: [{ id: "bk-mar3", label: "Mon 3 Mar", active: true }, { id: "bk-mar4", label: "Tue 4 Mar", active: true }, { id: "bk-mar5", label: "Wed 5 Mar", active: true }, { id: "bk-mar6", label: "Thu 6 Mar", active: true }, { id: "bk-mar7", label: "Fri 7 Mar", active: true }] },
              { id: "p4", title: "Tate Modern",    category: "Trip",       status: "attended", icon: <Bus size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,      sub: "Fri 28 Feb", dateRange: "Fri 28 Feb 2026", time: "09:30 – 15:00", child: "Molly", childColour: children[0].avatarColour, paid: 15, location: "Tate Modern, London", clubLead: "Mr Harris", description: "A guided visit to Tate Modern, exploring modern and contemporary art as part of the term's art topic. Children travelled by coach with school staff and took part in a sketching workshop in the gallery." },
              { id: "p5", title: "Meals",          category: "Meals",                          icon: <Utensils size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "w/c 3 Mar · 5 of 5 days selected", child: "Molly", childColour: children[0].avatarColour },
              { id: "p6", title: "Meals",          category: "Meals",                          icon: <Utensils size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "w/c 24 Feb · 4 of 5 days selected", child: "Molly", childColour: children[0].avatarColour },
              { id: "p7", title: "Art club",       category: "Club",       status: "attended", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />,   sub: "Wed 5 Mar", child: "Molly", childColour: children[0].avatarColour, sessions: 1, paid: 6, days: "Wed", time: "15:30–16:30", location: "Art Room", description: "Art Club gives children the freedom to explore drawing, painting, printmaking, and mixed media in a relaxed creative space. Each session focuses on a different technique or theme, encouraging imagination and self-expression.", dates: [{ id: "art-mar5", label: "Wed 5 Mar" }] },
              { id: "p8", title: "School tie",     category: "Shop",       status: "received", icon: <ShoppingBag size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Order #1042", child: "Molly", childColour: children[0].avatarColour },
              // ── Lucas (Year 6, Oakwood Primary) ──
              { id: "lp1", title: "Chess club", category: "Club", status: "attended", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "6 Jan – 27 Mar 2026", child: "Lucas", childColour: children[1].avatarColour, sessions: 11, paid: 0, days: "Mon", time: "15:30–16:30", location: "Library", clubLead: "Mr Harris", description: "Chess Club builds focus, strategy and problem-solving in a friendly setting, from first moves through to club tournaments.", dates: [{ id: "lp-chess", label: "Spring term 2026" }] },
              // ── Ethan (Year 9, Riverside Secondary) ──
              { id: "ep1", title: "Football", category: "Club", status: "attended", icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, sub: "Tue 3 Mar", child: "Ethan", childColour: children[2].avatarColour, sessions: 1, paid: 6, days: "Tue", time: "15:45–17:00", location: "Sports Hall", clubLead: "Mr Reed", description: "Competitive and recreational football coaching building fitness, technique and teamwork ahead of inter-school fixtures.", dates: [{ id: "ep-fb-mar3", label: "Tue 3 Mar" }] },
            ].filter(i => (i.category === "Club" || i.category === "Wraparound" || i.category === "Trip") && i.child === selectedChild.name);

            // If the active filter is "needs attention" but this child has none (e.g. they were switched
            // to while the page was open, or arrived with a stale filter), fall back to Upcoming so the
            // list is never blank with no pill selected.
            const effectiveBookingsFilter = (bookingsFilter === "needs-attention" && needsAttentionItems.length === 0)
              ? "upcoming" : bookingsFilter;
            const activeItems = effectiveBookingsFilter === "needs-attention" ? needsAttentionItems
              : effectiveBookingsFilter === "upcoming" ? upcomingItems
              : pastItems;

            return (
              <div style={{ background: "#F8F8F8", minHeight: "100%", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                  <button onClick={() => { setSubPage(null); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>Bookings & orders</span>
                </div>

                {/* Pills */}
                <div style={{ display: "flex", gap: 8, padding: "4px 16px 12px", flexShrink: 0, overflowX: "auto", scrollbarWidth: "none", background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
                  {needsAttentionItems.length > 0 && (
                    <button
                      onClick={() => setBookingsFilter("needs-attention")}
                      style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-round)", border: bookingsFilter === "needs-attention" ? "1px solid #0e8a0e" : "1px solid #ddd", background: bookingsFilter === "needs-attention" ? "#F0FAF3" : "#fff", cursor: "pointer", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-3)", fontWeight: 600, color: bookingsFilter === "needs-attention" ? "#005700" : "#595959" }}
                    >
                      Needs attention
                      <span style={{ minWidth: 18, height: 18, borderRadius: 99, background: "var(--color-warning-600)", color: "var(--color-white)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{bookingsNeedsAttentionCount}</span>
                    </button>
                  )}
                  {[
                    { id: "upcoming", label: "Upcoming", count: upcomingItems.length },
                    { id: "past",     label: "Past",     count: pastItems.length },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setBookingsFilter(f.id)}
                      style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-round)", border: effectiveBookingsFilter === f.id ? "1px solid #0e8a0e" : "1px solid #ddd", background: effectiveBookingsFilter === f.id ? "#F0FAF3" : "#fff", cursor: "pointer", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-3)", fontWeight: 600, color: effectiveBookingsFilter === f.id ? "#005700" : "#595959" }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 32px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeItems.map((item, i) => (
                      effectiveBookingsFilter === "needs-attention" ? (
                        // Structured needs-attention card
                        <Card key={item.id} padding="none" style={{ overflow: "hidden", cursor: item.status === "pending-payment" && !item.remaining && !item.paymentModel ? "default" : "pointer" }} onClick={() => { if (item.status === "pending-payment" && !item.remaining && !item.paymentModel) return; setBookingDetailDatesExpanded(false); setBkAboutExpanded(false); setSelectedUpcomingItem(item); }}>
                          <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 3 }}>{item.title}</div>
                              <div style={{ fontSize: "var(--font-size-3)" }}>
                                <span style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>{item.nextSession || item.dateRange || item.sub}</span>
                                {item.time && <span style={{ color: "var(--color-text-tertiary)" }}> · {item.time}</span>}
                              </div>
                              {item.sessions > 1 && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{`${item.sessions} sessions`}</div>}
                              <div style={{ marginTop: 8 }}>
                                {item.status === "cancelled" && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>Cancelled · Refund processing</span>}
                                {item.status === "pending-payment" && item.paymentModel === "provisional" && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Pay to confirm booking</span>}
                                {item.status === "pending-payment" && item.paymentModel === "variable" && (() => {
                                  const todayDate = new Date(2026, 4, 29);
                                  const isOverdue = item.paymentDeadline && todayDate > item.paymentDeadline;
                                  return (
                                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: isOverdue ? "#FEF2F2" : "#FFFBEB", color: isOverdue ? "#B91C1C" : "#B45309", border: `1px solid ${isOverdue ? "#FECACA" : "#FDE68A"}` }}>{isOverdue ? `Overdue · £${item.balanceOwed}` : `Outstanding · £${item.balanceOwed}`}</span>
                                  );
                                })()}
                                {item.status === "pending-payment" && !item.paymentModel && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Awaiting payment</span>}
                                {!item.status && item.category === "Trip" && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Outstanding · £{item.balanceOwed}</span>}
                                {!item.status && item.category !== "Trip" && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Outstanding payment</span>}
                              </div>
                            </div>
                            {!(item.status === "pending-payment" && !item.remaining && !item.paymentModel) && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                        </Card>
                      ) : bookingsFilter === "upcoming" ? (
                        // Upcoming — confirmed, no action needed
                        <Card key={item.id} padding="none" style={{ overflow: "hidden", cursor: (item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") ? "pointer" : "default" }} onClick={() => { if (item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") { setBookingDetailDatesExpanded(false); setBkAboutExpanded(false); setSelectedUpcomingItem(item); } }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                                <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{item.title}</div>
                              </div>
                              <div style={{ marginBottom: (item.status === "cancelled" || item.status === "pending-payment" || item.status === "pending-approval") ? 8 : 0 }}>
                                <div style={{ fontSize: "var(--font-size-3)" }}>
                                  <span style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>{item.nextSession || item.dateRange || item.sub}</span>
                                  {item.time && <span style={{ color: "var(--color-text-tertiary)" }}> · {item.time}</span>}
                                </div>
                                {item.sessions > 1 && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{`${item.sessions} sessions booked`}</div>}
                              </div>
                              {item.status === "cancelled"  && <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>Cancelled</span>}
                              {item.status === "pending-payment"  && <Tag variant="default" style={{ background: "var(--color-warning-050)", color: "var(--color-icon-warning)" }}>Pending · awaiting payment</Tag>}
                              {item.status === "pending-approval" && <Tag variant="default" style={{ background: "var(--color-warning-050)", color: "var(--color-icon-warning)" }}>Awaiting school confirmation</Tag>}
                            </div>
                            {(item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                        </Card>
                      ) : (
                        // Past — historical record
                        <Card key={item.id} padding="none" style={{ overflow: "hidden", cursor: (item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") ? "pointer" : "default" }} onClick={() => { if (item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") { setBookingDetailDatesExpanded(false); setBkAboutExpanded(false); setSelectedUpcomingItem(item); } }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                                <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>{item.title}</div>
                              </div>
                              <div style={{ marginBottom: item.status === "received" ? 8 : 0 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)" }}>{item.sub}</div>
                                {item.sessions > 1 && <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{`${item.sessions} sessions`}</div>}
                              </div>
                              {item.status === "received" && <Tag variant="neutral">Received</Tag>}
                            </div>
                            {(item.category === "Club" || item.category === "Wraparound" || item.category === "Trip") && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                        </Card>
                      )
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {subPage === "browse" && (() => {
            const today = new Date(2026, 3, 9);
            const clubIcon = <Shapes size={16} color="var(--color-brand-600)" strokeWidth={1.5} />;
            const wraparoundIcon = <SunMoon size={16} color="var(--color-brand-600)" strokeWidth={1.5} />;
            const tripIcon = <Bus size={16} color="var(--color-brand-600)" strokeWidth={1.5} />;

            const uniqueBkTimes = new Set(activeBkPeriods.map(p => `${p.start}–${p.end}`));
            const bkTimeDisplay = uniqueBkTimes.size === 1 ? [...uniqueBkTimes][0] : "Multiple times";

            const browseItems = [
              { id: 1, type: "clubs", title: "Drumming", icon: clubIcon, days: "Mon", dayOrder: [1], time: "15:30\u201316:15", price: "\u00a3110", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 2), deadlineLabel: "2 May", places: 0, full: true, blockOnly: true, location: "Music Block R1", clubLead: "Beat Academy" },
              { id: 16, type: "clubs", title: "Chess club", icon: clubIcon, days: "Mon", dayOrder: [1], time: "15:30\u201316:30", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 5), deadlineLabel: "5 May", places: 24, individualOnly: true, location: "Library", clubLead: "Mr Harris" },
              { id: 5, type: "clubs", title: "Football", icon: clubIcon, days: "Tue, Wed", dayOrder: [2, 3], time: "15:30\u201316:30", price: "\u00a38", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 9), deadlineLabel: "9 May", places: 15, location: "Sports Hall" },
              { id: 18, type: "clubs", title: "Choir", icon: clubIcon, days: "Tue", dayOrder: [2], time: "08:00\u201308:45", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 3, 17), deadlineLabel: "17 Apr", places: 3, raceOnCommit: true, location: "Music Block R2" },
              // ARCHIVED 2026-05-29 \u2014 Coding Club + provisional payment model. Provisional bookings are portal-only for now. Restore by uncommenting (and matching entries in clubBrowseDetails + needsAttentionItems c1).
              // { id: 7, type: "clubs", title: "Coding club", icon: clubIcon, days: "Thu", dayOrder: [4], time: "15:30\u201316:30", price: "\u00a37", priceLabel: "per session", paymentModel: "provisional", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 8), deadlineLabel: "8 May", places: 20, location: "ICT Suite" },
              { id: 21, type: "clubs", title: "Drama", icon: clubIcon, days: "Mon, Thu", dayOrder: [1, 4], time: "15:30\u201316:30", price: "\u00a38", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 3, 15), deadlineLabel: "15 Apr", places: 5, location: "Drama Studio" },
              { id: 20, type: "clubs", title: "Beginner gymnastics & tumbling skills", icon: clubIcon, days: "Fri", dayOrder: [5], time: "15:30\u201316:30", price: "\u00a39", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 4), deadlineLabel: "4 May", places: 8, location: "Sports Hall" },
              { id: 28, type: "clubs", title: "Forest school", icon: clubIcon, days: "Fri", dayOrder: [5], time: "15:30\u201316:30", price: "\u00a36", priceLabel: "per session", paymentModel: "variable", suggestedAmount: 60, minimumContribution: 0, termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 6), deadlineLabel: "6 May", places: 12, location: "School Grounds", clubLead: "Mrs Hughes" },
              { id: 29, type: "clubs", title: "Archery", icon: clubIcon, days: "Fri", dayOrder: [5], time: "15:30\u201316:30", price: "\u00a350", priceLabel: "", paymentModel: "variable", suggestedAmount: 50, minimumContribution: 10, termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 4, 1), deadlineLabel: "1 May", places: 8, blockOnly: true, location: "Sports Field", clubLead: "Mr Patel" },
              { id: 2,  type: "wraparound", title: "Monday After School Club",    icon: wraparoundIcon, days: "Mon",    dayOrder: [1], time: "15:30\u201317:00", price: "\u00a310", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", paymentTiming: "Charged at time of booking", bookingModel: "daily", dailyCutoffTime: "12:30", deadline: null, deadlineLabel: null, places: 40 },
              { id: 26, type: "wraparound", title: "Football After School Club", icon: wraparoundIcon, days: "Wed", dayOrder: [3], time: "15:30\u201317:00", price: "\u00a310", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", paymentTiming: "Charged at time of booking", bookingModel: "daily", dailyCutoffTime: "12:30", deadline: null, deadlineLabel: null, places: 22 },
              { id: 27, type: "wraparound", title: "Recorder Club", icon: wraparoundIcon, days: "Thu", dayOrder: [4], time: "15:30\u201317:00", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", paymentTiming: "Free club", bookingModel: "both", dailyCutoffTime: "12:30", deadline: new Date(2026, 3, 15), deadlineLabel: "15 Apr", places: 18 },
              { id: 3, type: "wraparound", title: "Breakfast club", icon: wraparoundIcon, days: "Mon \u2013 Fri", dayOrder: [1,2,3,4,5], time: bkTimeDisplay, price: "\u00a35", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", paymentTiming: "Charged per session when your child attends", bookingModel: "daily", sameDayCutoff: "Book by 15:00 the day before", deadline: null, deadlineLabel: null, places: 29, individualOnly: true },
              // \u2500\u2500 Trips \u2500\u2500 one-off events; no recurring days. Sorted by trip date; sign-up deadline shown as a card pill.
              { id: 31, type: "trips", title: "Science Museum", icon: tripIcon, years: ["Year 6"], paymentModel: "fixed", price: "\u00a312", priceLabel: "", cost: 12, dateRange: "Thu 30 Apr 2026", tripDate: new Date(2026, 3, 30), time: "09:00\u201315:30", academicYear: "2025/2026", deadline: new Date(2026, 3, 16), deadlineLabel: "16 Apr", places: 18, location: "Science Museum, South Kensington", clubLead: "Mr Harris" },
              { id: 33, type: "trips", title: "Year 4 residential \u2013 PGL", icon: tripIcon, years: ["Year 4"], paymentModel: "instalment", price: "\u00a3185", priceLabel: "", totalCost: 185, deposit: 85, installmentDeadline: "before the trip", dateRange: "Tue 12 \u2013 Thu 14 May 2026", tripDate: new Date(2026, 4, 12), time: "08:00\u201317:00", academicYear: "2025/2026", deadline: new Date(2026, 3, 30), deadlineLabel: "30 Apr", places: 12, location: "Marchants Hill, Surrey", clubLead: "Mrs Hughes" },
              { id: 32, type: "trips", title: "Local woodland habitat study", icon: tripIcon, years: ["Year 4"], paymentModel: "variable", suggestedAmount: 8, minimumContribution: 0, price: "\u00a38", priceLabel: "", dateRange: "Wed 13 May 2026", tripDate: new Date(2026, 4, 13), time: "09:30\u201312:00", academicYear: "2025/2026", deadline: new Date(2026, 4, 6), deadlineLabel: "6 May", places: 30, location: "Oakwood Local Nature Reserve", clubLead: "Miss Bennett" },
              { id: 4, type: "trips", title: "The Lion King", icon: tripIcon, paymentModel: "free", price: "Free", priceLabel: "", dateRange: "Fri 22 May 2026", tripDate: new Date(2026, 4, 22), time: "11:00\u201317:00", academicYear: "2025/2026", deadline: new Date(2026, 4, 8), deadlineLabel: "8 May", places: 32, location: "Lyceum Theatre, London", clubLead: "Mrs Hughes" },
              { id: 35, type: "trips", title: "Theatre trip \u2013 Matilda", icon: tripIcon, years: ["Year 6"], paymentModel: "fixed", price: "\u00a316", priceLabel: "", cost: 16, full: true, dateRange: "Tue 9 Jun 2026", tripDate: new Date(2026, 5, 9), time: "17:30\u201322:00", academicYear: "2025/2026", deadline: new Date(2026, 4, 22), deadlineLabel: "22 May", places: 0, location: "Cambridge Theatre, London", clubLead: "Mr Harris" },
              { id: 34, type: "trips", title: "Year 5 residential \u2013 France", icon: tripIcon, years: ["Year 4"], paymentModel: "instalment", price: "\u00a3525", priceLabel: "", totalCost: 525, deposit: 95, installmentDeadline: "before the trip", futureYear: true, dateRange: "Tue 6 \u2013 Sun 11 Jul 2027", tripDate: new Date(2027, 6, 6), time: "06:00\u201320:00", academicYear: "2026/2027", deadline: new Date(2026, 5, 30), deadlineLabel: "30 Jun 2026", places: 40, location: "Normandy, France", clubLead: "Mrs Hughes" },
              { id: 36, type: "trips", title: "Leavers' residential \u2013 PGL Liddington", icon: tripIcon, years: ["Year 6"], paymentModel: "instalment", price: "\u00a3295", priceLabel: "", totalCost: 295, deposit: 90, installmentDeadline: "before the trip", dateRange: "Mon 6 \u2013 Fri 10 Jul 2026", tripDate: new Date(2026, 6, 6), time: "09:00\u201316:00", academicYear: "2025/2026", deadline: new Date(2026, 5, 19), deadlineLabel: "19 Jun", places: 30, location: "PGL Liddington, Wiltshire", clubLead: "Mr Harris" },
              // \u2500\u2500 Secondary clubs (Ethan, Riverside Secondary) \u2500\u2500
              { id: 40, type: "clubs", title: "Football", icon: clubIcon, school: "Riverside Secondary", days: "Tue", dayOrder: [2], time: "15:45\u201317:00", price: "\u00a36", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", deadline: null, deadlineLabel: null, places: 18, individualOnly: true, location: "Sports Hall", clubLead: "Mr Reed" },
              { id: 41, type: "clubs", title: "Debate club", icon: clubIcon, school: "Riverside Secondary", days: "Thu", dayOrder: [4], time: "16:00\u201317:00", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 5, 18), deadlineLabel: "18 Jun", places: 20, individualOnly: true, location: "Room 14", clubLead: "Ms Okafor" },
              { id: 42, type: "clubs", title: "STEM & robotics", icon: clubIcon, school: "Riverside Secondary", days: "Mon", dayOrder: [1], time: "15:45\u201317:15", price: "\u00a380", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 5, 15), deadlineLabel: "15 Jun", places: 12, blockOnly: true, location: "Science Lab 2", clubLead: "Dr Nasser" },
              { id: 43, type: "clubs", title: "Basketball", icon: clubIcon, school: "Riverside Secondary", days: "Fri", dayOrder: [5], time: "16:00\u201317:30", price: "\u00a36", priceLabel: "per session", termDates: "6 Apr \u2013 17 Jul 2026", deadline: null, deadlineLabel: null, places: 16, individualOnly: true, location: "Sports Hall", clubLead: "Mr Reed" },
              { id: 44, type: "clubs", title: "Senior choir", icon: clubIcon, school: "Riverside Secondary", days: "Wed", dayOrder: [3], time: "08:00\u201308:45", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: null, deadlineLabel: null, places: 30, individualOnly: true, location: "Music Room", clubLead: "Miss Hartley" },
              { id: 45, type: "clubs", title: "Drama", icon: clubIcon, school: "Riverside Secondary", days: "Thu", dayOrder: [4], time: "15:45\u201317:15", price: "\u00a370", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: new Date(2026, 5, 12), deadlineLabel: "12 Jun", places: 14, blockOnly: true, location: "Drama Studio", clubLead: "Mr Lyle" },
              // \u2500\u2500 Secondary trips (Ethan, Riverside Secondary) \u2500\u2500
              { id: 37, type: "trips", title: "Natural History Museum", icon: tripIcon, school: "Riverside Secondary", paymentModel: "fixed", price: "\u00a318", priceLabel: "", cost: 18, dateRange: "Fri 12 Jun 2026", tripDate: new Date(2026, 5, 12), time: "08:15\u201316:00", academicYear: "2025/2026", deadline: new Date(2026, 5, 1), deadlineLabel: "1 Jun", places: 24, location: "Natural History Museum, South Kensington", clubLead: "Mrs Clarke" },
              { id: 38, type: "trips", title: "National Theatre", icon: tripIcon, school: "Riverside Secondary", paymentModel: "fixed", price: "\u00a322", priceLabel: "", cost: 22, dateRange: "Thu 25 Jun 2026", tripDate: new Date(2026, 5, 25), time: "17:30\u201322:30", academicYear: "2025/2026", deadline: new Date(2026, 5, 11), deadlineLabel: "11 Jun", places: 20, location: "National Theatre, South Bank", clubLead: "Mr Dawson" },
              { id: 39, type: "trips", title: "Duke of Edinburgh Bronze expedition", icon: tripIcon, school: "Riverside Secondary", paymentModel: "fixed", price: "\u00a325", priceLabel: "", cost: 25, dateRange: "Sat 4 \u2013 Sun 5 Jul 2026", tripDate: new Date(2026, 6, 4), time: "08:00\u201317:00", academicYear: "2025/2026", deadline: new Date(2026, 5, 20), deadlineLabel: "20 Jun", places: 16, location: "Surrey Hills", clubLead: "Mr Reed" },
              // \u2500\u2500 Year 6 club (Lucas, Oakwood Primary) \u2500\u2500
              { id: 46, type: "clubs", title: "SATs booster", icon: clubIcon, years: ["Year 6"], days: "Wed", dayOrder: [3], time: "08:00\u201308:45", price: "Free", priceLabel: "", termDates: "6 Apr \u2013 17 Jul 2026", deadline: null, deadlineLabel: null, places: 20, individualOnly: true, location: "Library", clubLead: "Mrs Doyle" },
            ];

            const closingSoonDays = 7;

            // Scope the catalogue to the active child. Clubs are a school-level offering (untagged → whole-school,
            // so siblings at one school share them); trips/residentials carry `years` and show only to that year group.
            // `school`/`years` are internal keys — nothing here is surfaced in the parent UI.
            const childBrowseItems = browseItems.filter(i => {
              const itemSchool = i.school || "Oakwood Primary";
              if (itemSchool !== selectedChild.school) return false;
              return !i.years || i.years.includes(selectedChild.year);
            });
            const clubsOnly = childBrowseItems.filter(i => i.type === "clubs");

            const dayFilters = [
              { id: "all", label: "All" },
              { id: "mon", label: "Mon", dayOrder: 1 },
              { id: "tue", label: "Tue", dayOrder: 2 },
              { id: "wed", label: "Wed", dayOrder: 3 },
              { id: "thu", label: "Thu", dayOrder: 4 },
              { id: "fri", label: "Fri", dayOrder: 5 },
            ];

            const dayCounts = {
              all: clubsOnly.length,
              ...Object.fromEntries(
                dayFilters.filter(d => d.id !== "all").map(d => [d.id, clubsOnly.filter(i => i.dayOrder.includes(d.dayOrder)).length])
              ),
            };

            const typeFilters = [
              { id: "wraparound", label: "Wraparound care" },
              { id: "trips", label: "Trips" },
              { id: "parents-evening", label: "Parents' evenings" },
            ];

            const wraparoundOnly = childBrowseItems.filter(i => i.type === "wraparound");
            const showWraparoundDayFilters = wraparoundOnly.length > 1;
            const activeWraparoundDayOrder = wraparoundDayFilter ? dayFilters.find(d => d.id === wraparoundDayFilter)?.dayOrder : null;
            const wraparoundDayCounts = {
              all: wraparoundOnly.length,
              ...Object.fromEntries(
                dayFilters.filter(d => d.id !== "all").map(d => [d.id, wraparoundOnly.filter(i => i.dayOrder.includes(d.dayOrder)).length])
              ),
            };

            const activeDayOrder = clubDayFilter ? dayFilters.find(d => d.id === clubDayFilter)?.dayOrder : null;

            // Trips: one-off events filtered by academic year, sorted by trip date.
            const tripsOnly = childBrowseItems.filter(i => i.type === "trips");
            const tripYears = [...new Set(tripsOnly.map(t => t.academicYear))].sort();
            // Academic-year pills only help when there's more than one year to pick between. With a single
            // year (e.g. a child whose trips all fall in the current year), the pills are noise — hide them.
            const showTripYearFilters = tripYears.length > 1;

            const filtered = browseFilter === "clubs"
              ? (activeDayOrder === null || activeDayOrder === undefined ? clubsOnly : clubsOnly.filter(i => i.dayOrder.includes(activeDayOrder)))
              : browseFilter === "wraparound"
              ? (activeWraparoundDayOrder === null || activeWraparoundDayOrder === undefined ? wraparoundOnly : wraparoundOnly.filter(i => i.dayOrder.includes(activeWraparoundDayOrder)))
              : browseFilter === "trips"
              ? (tripYearFilter ? tripsOnly.filter(t => t.academicYear === tripYearFilter) : tripsOnly)
              : childBrowseItems.filter(i => i.type === browseFilter);
            const sorted = browseFilter === "trips"
              ? [...filtered].sort((a, b) => (a.tripDate - b.tripDate) || a.title.localeCompare(b.title))
              : [...filtered].sort((a, b) => {
              // Sort key: the matching day when filtered, otherwise the earliest day
              const aDayKey = activeDayOrder ? (a.dayOrder.includes(activeDayOrder) ? activeDayOrder : Math.min(...a.dayOrder)) : Math.min(...(Array.isArray(a.dayOrder) ? a.dayOrder : [a.dayOrder]));
              const bDayKey = activeDayOrder ? (b.dayOrder.includes(activeDayOrder) ? activeDayOrder : Math.min(...b.dayOrder)) : Math.min(...(Array.isArray(b.dayOrder) ? b.dayOrder : [b.dayOrder]));
              if (aDayKey !== bDayKey) return aDayKey - bDayKey;
              // Same day — sort alphabetically by title for scannability
              return a.title.localeCompare(b.title);
            });
            const tripsUnavailable = browseFilter === "trips" && tripsConfig !== "ENABLED";

            const getDaysUntil = (date) => {
              if (!date) return Infinity;
              return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
            };

            return (
            <div style={{ background: "#f5f5f5", minHeight: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: "#fff",
                }}
              >
                <button
                  onClick={() => { setSubPage(null); setBrowseFilter("all"); setClubDayFilter(null); setWraparoundDayFilter(null); setTripYearFilter(null); }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="var(--color-text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>{browseFilter === "wraparound" ? "Wraparound care" : browseFilter === "clubs" ? "Clubs" : browseFilter === "trips" ? "Trips" : "What's available"}</span>
              </div>

              {!(browseFilter === "trips" && !showTripYearFilters) && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "4px 16px 12px",
                  background: "#fff",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {tripsUnavailable
                  ? null
                  : browseFilter === "trips"
                  ? [{ id: "all", label: "All" }, ...tripYears.map((y) => ({ id: y, label: y }))].map((f) => {
                      const isActive = f.id === "all" ? tripYearFilter === null : tripYearFilter === f.id;
                      const count = f.id === "all" ? tripsOnly.length : tripsOnly.filter((t) => t.academicYear === f.id).length;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setTripYearFilter(f.id === "all" ? null : f.id)}
                          style={{
                            flex: "0 0 auto",
                            padding: "6px 14px",
                            borderRadius: 20,
                            border: isActive ? "1px solid #0e8a0e" : "1px solid #ddd",
                            background: isActive ? "#F0FAF3" : "#fff",
                            color: isActive ? "#005700" : "#595959",
                            fontSize: "var(--font-size-3)",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {f.label}
                          {count > 0 && (
                            <span style={{ fontSize: "var(--font-size-1)", fontWeight: 400, color: isActive ? "#16a33d" : "#aaa" }}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })
                  : (browseFilter === "clubs" || (browseFilter === "wraparound" && showWraparoundDayFilters))
                  ? dayFilters.map((f) => {
                      const isClubs = browseFilter === "clubs";
                      const isActive = f.id === "all"
                        ? (isClubs ? clubDayFilter === null : wraparoundDayFilter === null)
                        : (isClubs ? clubDayFilter === f.id : wraparoundDayFilter === f.id);
                      const counts = isClubs ? dayCounts : wraparoundDayCounts;
                      return (
                        <button
                          key={f.id}
                          onClick={() => isClubs
                            ? setClubDayFilter(f.id === "all" ? null : f.id)
                            : setWraparoundDayFilter(f.id === "all" ? null : f.id)
                          }
                          style={{
                            flex: "0 0 auto",
                            padding: "6px 14px",
                            borderRadius: 20,
                            border: isActive ? "1px solid #0e8a0e" : "1px solid #ddd",
                            background: isActive ? "#F0FAF3" : "#fff",
                            color: isActive ? "#005700" : "#595959",
                            fontSize: "var(--font-size-3)",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {f.label}
                          {counts[f.id] > 0 && (
                            <span style={{ fontSize: "var(--font-size-1)", fontWeight: 400, color: isActive ? "#16a33d" : "#aaa" }}>
                              {counts[f.id]}
                            </span>
                          )}
                        </button>
                      );
                    })
                  : typeFilters.filter(f => f.id === browseFilter).map((f) => (
                      <button
                        key={f.id}
                        style={{
                          flex: "0 0 auto",
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: "1px solid #0e8a0e",
                          background: "#F0FAF3",
                          color: "#005700",
                          fontSize: "var(--font-size-3)",
                          fontWeight: 600,
                          cursor: "default",
                          fontFamily: "inherit",
                        }}
                      >
                        {f.label}
                      </button>
                    ))
                }
              </div>
              )}

              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

                {tripsUnavailable && (
                  <div style={{ padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-grey-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bus size={24} color="var(--color-text-tertiary)" strokeWidth={1.5} />
                    </div>
                    <p style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
                      {tripsConfig === "UNAVAILABLE_NOT_ROLLED_OUT" ? "Trips aren't available in the app yet" : "Trips aren't switched on for you"}
                    </p>
                    <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0, maxWidth: 280 }}>
                      {tripsConfig === "UNAVAILABLE_NOT_ROLLED_OUT"
                        ? "Your school hasn't started using trips in the app. They'll let you know when it's ready."
                        : "Your school manages trips a different way for your family. Contact the school office if you have a question about a trip."}
                    </p>
                  </div>
                )}

                {!tripsUnavailable && sorted.map((item) => {
                  const hasBothOptions = item.type !== "trips" && !item.blockOnly && !item.individualOnly && item.price !== "Free";
                  const isVoluntary = item.paymentModel === "variable" && (item.minimumContribution ?? 0) === 0;
                  const isInstalment = item.paymentModel === "instalment";
                  const isMinThreshold = item.paymentModel === "variable" && (item.minimumContribution ?? 0) > 0;
                  const blockOnlySessions = item.blockOnly ? clubExtras[item.id]?.blockSessions : null;
                  const displayPrice = isInstalment || isMinThreshold
                    ? (isInstalment ? item.price : `£${item.suggestedAmount}`)
                    : isVoluntary
                    ? (item.blockOnly ? `£${item.suggestedAmount}` : item.price)
                    : (hasBothOptions ? `From ${item.price}` : item.price);
                  const displayPriceLabel = isInstalment
                    ? `£${item.deposit} deposit`
                    : isMinThreshold
                    ? `£${item.minimumContribution} deposit`
                    : isVoluntary
                    ? "Suggested"
                    : (blockOnlySessions ? `${blockOnlySessions} sessions` : item.priceLabel);

                  return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if ([1, 5, 6, 7, 8, 16, 17, 18, 19, 20, 21, 28, 29, 40, 41, 42, 43, 44, 45, 46].includes(item.id)) { const ps = periodsForClub(item, clubExtras[item.id]); const autoPeriod = ps.length === 1 ? ps[0] : null; setDetailPage("club-detail"); setSelectedClub(raceFilledIds.has(item.id) ? { ...item, full: true } : item); setFlowStep(null); setSelectedBkPeriod(autoPeriod); setBookingOption(autoPeriod ? (autoPeriod.type === "termly" ? "term" : "individual") : null); setTermExpanded(false); setSelectedDates({}); setClubDatesError(false); setClubCardError(false); setCardFilled(false); setBkAboutExpanded(false); setDetailDatesExpanded(false); }
                      else if ([2, 26, 27].includes(item.id)) { const keys = ["mon","wedFootball","thuRecorder"]; setWraparoundClubConfig(afterSchoolClubConfigs[keys[[2,26,27].indexOf(item.id)]]); setDetailPage("after-school"); setFlowStep(null); setBookingOption(null); setTermExpanded(false); setSelectedGridDates({}); }
                      else if (item.id === 3) { setDetailPage("breakfast"); setFlowStep(null); setConsentChecked(false); setConsentError(false); setBkScenarioId("s1"); setBkIsFree(false); setSelectedBkPeriod(bkPeriodsS1[0]); setBookingOption("individual"); setBkAboutExpanded(false); setTermExpanded(false); setSelectedGridDates2({}); }
                      else if (item.type === "trips") { setDetailPage("trip-detail"); setSelectedClub(item); setFlowStep(null); setConsentChecked(false); setConsentError(false); setBkAboutExpanded(false); setShowPartialSheet(false); setPartialAmount(0); }
                    }}
                    style={{
                      background: "var(--color-bg-primary)",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      width: "100%",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "stretch" }}>
                      {/* Left: title, days/time, tags */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div>
                          <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-grey-900)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.title}
                          </span>
                        </div>
                        {item.type === "trips" && item.dateRange && (
                          <div style={{ marginTop: 3 }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{item.dateRange}</span>
                          </div>
                        )}
                        {item.days && (
                          <div style={{ marginTop: 3 }}>
                            {(() => {
                              const label = getClubScheduleLabel(item, clubExtras[item.id]);
                              const parts = label.split(' · ');
                              if (parts.length === 2) {
                                return (
                                  <span style={{ fontSize: "var(--font-size-3)", whiteSpace: "nowrap" }}>
                                    <span style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>{parts[0]}</span>
                                    <span style={{ color: "var(--color-text-tertiary)" }}> · {parts[1]}</span>
                                  </span>
                                );
                              }
                              return <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{label}</span>;
                            })()}
                          </div>
                        )}
                        {item.type === "trips" ? (() => {
                          const looming = !item.full && item.deadline && getDaysUntil(item.deadline) <= closingSoonDays;
                          if (!item.full && !looming) return null;
                          return (
                            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {item.full && <Tag variant="neutral">Full</Tag>}
                              {looming && <Tag variant="default">Sign up by {item.deadlineLabel}</Tag>}
                            </div>
                          );
                        })() : (() => {
                          if (item.full || raceFilledIds.has(item.id)) {
                            return <div style={{ marginTop: 8 }}><Tag variant="neutral">Full</Tag></div>;
                          }
                          const isTermly = !item.bookingModel || item.bookingModel === "termly" || item.bookingModel === "both";
                          const isDaily = item.bookingModel === "daily" || item.bookingModel === "both";
                          const termPillEligible = item.deadline && isTermly && getDaysUntil(item.deadline) <= closingSoonDays;
                          const dayOrders = Array.isArray(item.dayOrder) ? item.dayOrder : [item.dayOrder];
                          const todayIsSessionDay = dayOrders.includes(today.getDay());
                          const dailyPillEligible = item.dailyCutoffTime && isDaily && todayIsSessionDay;

                          if (termPillEligible) {
                            return <div style={{ marginTop: 8 }}><Tag variant="default">Sign up by {item.deadlineLabel}</Tag></div>;
                          }
                          if (dailyPillEligible) {
                            return <div style={{ marginTop: 8 }}><Tag variant="default">Book today by {item.dailyCutoffTime}</Tag></div>;
                          }
                          if (item.sameDayCutoff) {
                            return <div style={{ marginTop: 8 }}><Tag variant="default">{item.sameDayCutoff}</Tag></div>;
                          }
                          return null;
                        })()}
                      </div>

                      {/* Vertical divider — always present */}
                      <div style={{ width: 1, background: "var(--color-grey-100)", margin: "0 14px", flexShrink: 0 }} />
                      {/* Price column — fixed width, pinned to top */}
                      <div style={{ width: 80, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "var(--font-size-4)", fontWeight: 700, color: "var(--color-grey-900)" }}>{displayPrice}</span>
                        {displayPriceLabel && (
                          <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{displayPriceLabel}</span>
                        )}
                      </div>

                      {/* Chevron — far right */}
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, alignSelf: "flex-start", marginLeft: 10 }}>
                        <path d="M7 5L11 9L7 13" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                  );
                })}
                {!tripsUnavailable && sorted.length === 0 && (
                  <div style={{ padding: 32, textAlign: "center" }}>
                    <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--font-size-3)" }}>{browseFilter === "trips" ? "No trips available right now" : "Nothing available right now"}</p>
                  </div>
                )}
              </div>
            </div>
            );
          })()}

          {subPage === "tx-history" && (() => {
            const isWraparound = txHistoryAccount === "wraparound";
            const isMilk = txHistoryAccount === "milk";
            const accountName = isWraparound ? "Wraparound account" : isMilk ? "Milk account" : "Meals account";
            const balance = isWraparound ? wraparoundBalance : isMilk ? -5.20 : mealsBalance;
            const isOverdrawn = balance < 0;
            const isLow = !isOverdrawn && balance <= lowFundsThreshold;

            const mollyTransactions = {
              meals: [...dynamicTransactions.meals,
                { date: "29 Apr", month: "April 2026", description: "Top-up", amount: 10.00, paidBy: "you" },
                { date: "28 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "25 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "24 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "23 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "22 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "17 Apr", month: "April 2026", description: "Top-up", amount: 20.00, paidBy: "James Brown" },
                { date: "14 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "11 Apr", month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "9 Apr",  month: "April 2026", description: "School meal", amount: -2.65 },
                { date: "8 Apr",  month: "April 2026", description: "School meal", amount: -2.65 },
              ],
              milk: [
                { date: "29 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "28 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "25 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "24 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "23 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "22 Apr", month: "April 2026", description: "Top-up", amount: 5.00, paidBy: "you" },
                { date: "17 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "16 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "15 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "14 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "11 Apr", month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "9 Apr",  month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "8 Apr",  month: "April 2026", description: "Milk", amount: -0.27 },
                { date: "7 Apr",  month: "April 2026", description: "Top-up", amount: 5.00, paidBy: "James Brown" },
              ],
              wraparound: [...dynamicTransactions.wraparound,
                { date: "29 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "28 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "25 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "22 Apr", month: "April 2026", description: "Top-up", amount: 50.00, paidBy: "you" },
                { date: "17 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "16 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "15 Apr", month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "9 Apr",  month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "8 Apr",  month: "April 2026", description: "Breakfast club", amount: -5.00 },
                { date: "7 Apr",  month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "4 Apr",  month: "April 2026", description: "Top-up", amount: 25.00, paidBy: "James Brown" },
                { date: "2 Apr",  month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "1 Apr",  month: "April 2026", description: "After school club", amount: -10.00 },
                { date: "28 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "27 Mar", month: "March 2026", description: "Breakfast club", amount: -5.00 },
                { date: "26 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "25 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "20 Mar", month: "March 2026", description: "Top-up", amount: 50.00, paidBy: "you" },
                { date: "19 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "18 Mar", month: "March 2026", description: "Breakfast club", amount: -5.00 },
                { date: "14 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "13 Mar", month: "March 2026", description: "After school club", amount: -10.00 },
                { date: "12 Mar", month: "March 2026", description: "Breakfast club", amount: -5.00 },
              ],
            };

            // Per-child histories. Lucas: healthy Meals, a Wraparound wallet that's run low.
            // Ethan (secondary): Meals only — no wraparound or milk wallet.
            const lucasTransactions = {
              meals: [...dynamicTransactions.meals,
                { date: "5 Jun",  month: "June 2026",  description: "School meal", amount: -2.65 },
                { date: "4 Jun",  month: "June 2026",  description: "School meal", amount: -2.65 },
                { date: "3 Jun",  month: "June 2026",  description: "School meal", amount: -2.65 },
                { date: "1 Jun",  month: "June 2026",  description: "Top-up", amount: 30.00, paidBy: "you" },
                { date: "28 May", month: "May 2026",   description: "School meal", amount: -2.65 },
                { date: "27 May", month: "May 2026",   description: "School meal", amount: -2.65 },
                { date: "22 May", month: "May 2026",   description: "Top-up", amount: 20.00, paidBy: "James Brown" },
                { date: "21 May", month: "May 2026",   description: "School meal", amount: -2.65 },
              ],
              wraparound: [...dynamicTransactions.wraparound,
                { date: "5 Jun",  month: "June 2026",  description: "After school club", amount: -10.00 },
                { date: "3 Jun",  month: "June 2026",  description: "After school club", amount: -10.00 },
                { date: "1 Jun",  month: "June 2026",  description: "Top-up", amount: 20.00, paidBy: "you" },
                { date: "27 May", month: "May 2026",   description: "After school club", amount: -10.00 },
                { date: "22 May", month: "May 2026",   description: "Top-up", amount: 15.00, paidBy: "James Brown" },
              ],
            };
            const ethanTransactions = {
              meals: [...dynamicTransactions.meals,
                { date: "5 Jun",  month: "June 2026",  description: "School meal", amount: -2.80 },
                { date: "4 Jun",  month: "June 2026",  description: "School meal", amount: -2.80 },
                { date: "3 Jun",  month: "June 2026",  description: "School meal", amount: -2.80 },
                { date: "1 Jun",  month: "June 2026",  description: "Top-up", amount: 40.00, paidBy: "you" },
                { date: "28 May", month: "May 2026",   description: "School meal", amount: -2.80 },
                { date: "27 May", month: "May 2026",   description: "School meal", amount: -2.80 },
                { date: "20 May", month: "May 2026",   description: "Top-up", amount: 30.00, paidBy: "you" },
              ],
            };
            const allTransactions = selectedChild.name === "Lucas" ? lucasTransactions
              : selectedChild.name === "Ethan" ? ethanTransactions
              : mollyTransactions;

            const previewEmpty = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("empty") === "1";
            const transactions = previewEmpty ? [] : (allTransactions[txHistoryAccount] || []);
            let rb = balance;
            const transactionsWithBalance = transactions.map(tx => {
              const balanceAfter = rb;
              rb -= tx.amount;
              return { ...tx, balanceAfter };
            });
            const groups = transactionsWithBalance.reduce((acc, tx) => {
              const last = acc[acc.length - 1];
              if (!last || last.month !== tx.month) acc.push({ month: tx.month, items: [tx] });
              else last.items.push(tx);
              return acc;
            }, []);

            const REVEAL_WIDTH = 80;
            const baseOffset = txBalanceRevealed ? REVEAL_WIDTH : 0;
            const swipeOffset = txDragDx !== null
              ? Math.max(0, Math.min(REVEAL_WIDTH, baseOffset - txDragDx))
              : baseOffset;

            const closeTxHistory = () => { setSubPage(null); setTxHistoryAccount(null); setTxBalanceRevealed(false); setTxDragDx(null); };

            const transactionsContent = transactions.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>No transactions yet</div>
                <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                  Top-ups and {isWraparound ? "session" : isMilk ? "milk" : "meal"} charges will appear here.
                </div>
              </div>
            ) : (
              <div
                onPointerDown={(e) => {
                  if (e.pointerType === "mouse" && e.button !== 0) return;
                  txPointerStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId, captured: false };
                }}
                onPointerMove={(e) => {
                  const s = txPointerStartRef.current;
                  if (!s || s.pointerId !== e.pointerId) return;
                  const dx = e.clientX - s.x;
                  const dy = e.clientY - s.y;
                  if (!s.captured) {
                    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
                    if (Math.abs(dy) > Math.abs(dx)) { txPointerStartRef.current = null; return; }
                    s.captured = true;
                    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
                  }
                  setTxDragDx(dx);
                }}
                onPointerUp={(e) => {
                  const s = txPointerStartRef.current;
                  if (!s || s.pointerId !== e.pointerId) { setTxDragDx(null); return; }
                  const dx = e.clientX - s.x;
                  const finalOffset = Math.max(0, Math.min(REVEAL_WIDTH, (txBalanceRevealed ? REVEAL_WIDTH : 0) - dx));
                  setTxBalanceRevealed(finalOffset > REVEAL_WIDTH / 2);
                  setTxDragDx(null);
                  txPointerStartRef.current = null;
                }}
                onPointerCancel={() => { setTxDragDx(null); txPointerStartRef.current = null; }}
                style={{ touchAction: "pan-y", userSelect: "none", paddingBottom: "var(--spacing-m)" }}
              >
                <div style={{
                  transform: `translateX(${-swipeOffset}px)`,
                  transition: txDragDx !== null ? "none" : "transform 200ms ease",
                }}>
                {groups.map((group, gi) => (
                  <div key={group.month}>
                    <div style={{ position: "relative", padding: gi > 0 ? "var(--spacing-xl) var(--spacing-l) 0" : "var(--spacing-l) var(--spacing-l) 0" }}>
                      <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-grey-600)" }}>{group.month}</div>
                      <div style={{ position: "absolute", left: "100%", top: 0, bottom: 0, width: REVEAL_WIDTH, paddingTop: gi > 0 ? "var(--spacing-xl)" : "var(--spacing-l)", paddingRight: 16, paddingBottom: 0, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-grey-600)" }}>
                        Balance
                      </div>
                    </div>
                    {group.items.map((tx, i) => (
                      <div key={i}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                          <div style={{ width: 48, flexShrink: 0 }}>
                            <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{tx.date}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-primary)" }}>{tx.description}</div>
                            {tx.paidBy && (
                              <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>
                                {tx.paidBy === "you" ? "Added by you" : `Added by ${(() => { const parts = tx.paidBy.trim().split(" "); return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]; })()}`}
                              </div>
                            )}
                          </div>
                          <div style={{ flexShrink: 0, fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", fontVariantNumeric: "tabular-nums", color: tx.amount > 0 ? "var(--color-brand-600)" : "var(--color-text-primary)", ...(tx.amount > 0 && { background: "var(--color-brand-050)", borderRadius: 20, padding: "2px 8px" }) }}>
                            {tx.amount > 0 ? `+£${tx.amount.toFixed(2)}` : `−£${Math.abs(tx.amount).toFixed(2)}`}
                          </div>
                          <div style={{ position: "absolute", left: "100%", top: 0, bottom: 0, width: REVEAL_WIDTH, paddingRight: 16, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
                            {tx.balanceAfter < 0 ? `−£${Math.abs(tx.balanceAfter).toFixed(2)}` : `£${tx.balanceAfter.toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                </div>
              </div>
            );

            return (
              <div style={{ background: "var(--color-bg-secondary)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
                {/* Pattern C nav header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--color-white)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                  <button onClick={closeTxHistory} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>{isWraparound ? "Wraparound account" : isMilk ? "Milk account" : "Meals account"}</span>
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, padding: "16px 16px 24px" }}>
                  <Card style={{ borderRadius: 16, overflow: "hidden", padding: 0 }}>
                    {/* Hero inside the card — unified wraparound layout for all accounts */}
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, padding: "32px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>Balance</div>
                        <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 8 }}>
                          <span style={{ fontSize: "var(--font-size-8)", fontWeight: "var(--font-weight-bold)", lineHeight: 0.8, color: isOverdrawn ? "var(--color-text-destructive)" : isLow ? "var(--color-warning-600)" : "var(--color-text-primary)", fontVariantNumeric: "tabular-nums" }}>{isOverdrawn ? `−£${Math.abs(balance).toFixed(2)}` : `£${balance.toFixed(2)}`}</span>
                          {isOverdrawn && <Tag variant="error">Owed</Tag>}
                          {isLow && <Tag variant="default">Low</Tag>}
                        </div>
                      </div>
                      <button onClick={() => { setStandaloneTopUpAccount(txHistoryAccount); setTopUpAmount(10); setShowStandaloneTopUp(true); setStandaloneTopUpAddedToBasket(false); setStandaloneTopUpSuccess(false); }} style={{ flexShrink: 0, height: 44, padding: "0 20px", borderRadius: 22, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-3)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Top up</button>
                    </div>

                    {/* Divider — inset to match row padding, only when there are transactions */}
                    {transactions.length > 0 && <div style={{ margin: "0 16px", borderTop: "1px solid var(--color-grey-100)" }} />}

                    {transactionsContent}
                  </Card>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Main tab content */}
          {!subPage && activeTab === "book-pay" && EXPLORE_BOOK_PAY && (
            <BookPayLandingV2
              basketCount={basketCount}
              bookingsSectionState={bookingsSectionState}
              setBookingsSectionState={setBookingsSectionState}
              bookingsNeedsAttentionCount={bookingsNeedsAttentionCount}
              upcomingCount={selectedChild.name === "Molly" ? 3 : 2}
              pastCount={selectedChild.name === "Molly" ? 4 : 1}
              setBookingsFilter={setBookingsFilter}
              setSubPage={setSubPage}
              familyChildren={children}
              selectedChild={selectedChild}
              drummingSessionDates={drummingSessionDates}
              mealsBalance={mealsBalance}
              wraparoundBalance={wraparoundBalance}
              lowFundsThreshold={lowFundsThreshold}
              setTxHistoryAccount={setTxHistoryAccount}
              setStandaloneTopUpAccount={setStandaloneTopUpAccount}
              setTopUpAmount={setTopUpAmount}
              setShowStandaloneTopUp={setShowStandaloneTopUp}
              setStandaloneTopUpAddedToBasket={setStandaloneTopUpAddedToBasket}
              setStandaloneTopUpSuccess={setStandaloneTopUpSuccess}
              setBrowseFilter={setBrowseFilter}
              setBookingDetailDatesExpanded={setBookingDetailDatesExpanded}
              setBookingReturnTo={setBookingReturnTo}
              setSelectedUpcomingItem={setSelectedUpcomingItem}
              archeryBooking={archeryBooking}
              browseSectionRef={browseSectionRef}
            />
          )}
          {!subPage && activeTab === "book-pay" && !EXPLORE_BOOK_PAY && (
            <div className="paper-grain" style={{ backgroundColor: "var(--color-bg-secondary)", minHeight: "100%", padding: "20px 0 32px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

              {/* Basket banner */}
              {basketCount > 0 && (
                <div onClick={() => {}} style={{ margin: "0 16px", padding: "12px 16px", borderRadius: 12, background: "var(--color-brand-600)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="12.5" r="0.8" fill="white"/><circle cx="11" cy="12.5" r="0.8" fill="white"/></svg>
                    <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-white)" }}>{basketCount} item{basketCount !== 1 ? "s" : ""} in basket</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}

              {/* Bookings & balances */}
              <div style={{ padding: "0 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Bookings &amp; balances</div>
                  {/* Prototype state toggle */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {[{ id: "attention", label: "⚠" }, { id: "clear", label: "✓" }, { id: "empty", label: "∅" }].map(s => (
                      <button key={s.id} onClick={() => setBookingsSectionState(s.id)} style={{ padding: "2px 7px", borderRadius: 6, border: "1px solid", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderColor: bookingsSectionState === s.id ? "var(--color-brand-600)" : "var(--color-border-default)", background: bookingsSectionState === s.id ? "var(--color-brand-600)" : "var(--color-bg-primary)", color: bookingsSectionState === s.id ? "var(--color-white)" : "var(--color-text-tertiary)" }}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <Card padding="none" style={{ overflow: "hidden" }}>
                  {(() => {
                    const upcomingItems = (bookingsSectionState !== "empty" ? [
                      { id: "u1", title: "Drumming",       nextDate: new Date(2026, 4,  4), icon: <Shapes  size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Mon 4 May · 15:30–16:15",          category: "Club",       status: "confirmed", sub: "6 Apr – 17 Jul 2026", child: "Molly", childColour: children[0].avatarColour, sessions: 10, days: "Mon", time: "15:30–16:15", termDates: "6 Apr – 17 Jul 2026", dates: drummingSessionDates, paid: 110, location: "Music Block R1", clubLead: "Beat Academy", description: "Our Drumming Club introduces children to the exciting world of percussion in a fun, supportive group setting. They'll develop rhythm, coordination, and timing skills while learning a variety of drumming styles and techniques — building confidence and working towards a group performance." },
                      { id: "u2", title: "Breakfast club", nextDate: new Date(2026, 3,  7), icon: <SunMoon size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Mon 7 – Fri 11 Apr · 07:45–08:30", category: "Wraparound", status: "confirmed", sub: "Mon 7 – Fri 11 Apr", child: "Molly", childColour: children[0].avatarColour, sessions: 5, days: "Mon – Fri", time: "07:45–08:30", paid: 25, location: "Dining Hall", clubLead: "School staff", description: "Start the day right with our breakfast club. Children enjoy a healthy breakfast including toast, cereal, fruit and juice, with time for reading, drawing and quiet activities before the school day begins. Staff supervise children and ensure they're ready for class.", dates: [{ id: "bk-apr7", label: "Mon 7 Apr", active: true }, { id: "bk-apr8", label: "Tue 8 Apr", active: true }, { id: "bk-apr9", label: "Wed 9 Apr", active: true }, { id: "bk-apr10", label: "Thu 10 Apr", active: true }, { id: "bk-apr11", label: "Fri 11 Apr", active: true }] },
                      // ── Lucas (Year 6, Oakwood Primary) ──
                      { id: "lu2", title: "Football", nextDate: new Date(2026, 5, 9), icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Tue 9 Jun · 15:30–16:30", category: "Club", status: "confirmed", sub: "Tue 9 Jun", child: "Lucas", childColour: children[1].avatarColour, sessions: 1, days: "Tue", time: "15:30–16:30", paid: 8, location: "Sports Hall", description: "Join our Football Club and develop your skills on the pitch in a fun, structured environment.", dates: [{ id: "lu-fb-jun9", label: "Tue 9 Jun" }] },
                      { id: "lu1", title: "Chess club", nextDate: new Date(2026, 5, 15), icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Mon 15 Jun · 15:30–16:30", category: "Club", status: "confirmed", sub: "6 Apr – 17 Jul 2026", child: "Lucas", childColour: children[1].avatarColour, sessions: 10, days: "Mon", time: "15:30–16:30", termDates: "6 Apr – 17 Jul 2026", dates: secMonDates, paid: 0, location: "Library", clubLead: "Mr Harris", description: "Chess Club builds focus, strategy and problem-solving in a friendly setting, from first moves through to club tournaments." },
                      // ── Ethan (Year 9, Riverside Secondary) ──
                      { id: "et1", title: "Football", nextDate: new Date(2026, 5, 9), icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Tue 9 Jun · 15:45–17:00", category: "Club", status: "confirmed", sub: "Tue 9 Jun", child: "Ethan", childColour: children[2].avatarColour, sessions: 1, days: "Tue", time: "15:45–17:00", paid: 6, location: "Sports Hall", clubLead: "Mr Reed", description: "Competitive and recreational football coaching building fitness, technique and teamwork ahead of inter-school fixtures.", dates: [{ id: "et-fb-jun9", label: "Tue 9 Jun" }] },
                      { id: "et2", title: "Debate club", nextDate: new Date(2026, 5, 11), icon: <Shapes size={24} color="var(--color-grey-900)" strokeWidth={1.5} />, meta: "Thu 11 Jun · 16:00–17:00", category: "Club", status: "confirmed", sub: "6 Apr – 17 Jul 2026", child: "Ethan", childColour: children[2].avatarColour, sessions: 10, days: "Thu", time: "16:00–17:00", termDates: "6 Apr – 17 Jul 2026", dates: secThuDates, paid: 0, location: "Room 14", clubLead: "Ms Okafor", description: "A weekly forum for developing public speaking, argument and critical thinking, with regular debates and inter-school competitions." },
                    ] : []).filter(i => i.child === selectedChild.name).sort((a, b) => a.nextDate - b.nextDate);

                    return (
                      <>
                        {/* Outstanding payment banner — Archery (Molly's booking only) */}
                        {bookingsSectionState === "attention" && selectedChild.name === "Molly" && (
                          <div style={{ margin: "12px 16px 4px", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--color-warning-050)", borderRadius: 10 }}>
                            <AlertTriangle size={16} color="var(--color-icon-warning)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-warning)" }}>{`£${archeryBooking.balanceOwed.toFixed(2)} outstanding for ${archeryBooking.title}`}</span>
                            <button
                              onClick={() => { setBookingDetailDatesExpanded(false); setBookingReturnTo("landing"); setSelectedUpcomingItem(archeryBooking); setSubPage("my-bookings"); }}
                              style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 99, border: "none", background: "var(--color-warning-700)", color: "var(--color-white)", fontSize: "var(--font-size-2)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                            >
                              Pay now
                            </button>
                          </div>
                        )}

                        {/* Next up — single inset card, hidden when empty */}
                        {bookingsSectionState !== "empty" && <>
                          <div style={{ padding: "12px 16px 8px" }}>
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>Next up</span>
                          </div>
                          {upcomingItems[0] && (
                            <div style={{ margin: "0 16px 4px" }}>
                              <button
                                onClick={() => { setBookingDetailDatesExpanded(false); setBookingReturnTo("landing"); setSelectedUpcomingItem(upcomingItems[0]); setSubPage("my-bookings"); }}
                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 12px", width: "100%", background: "var(--color-bg-secondary)", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                              >
                                <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {upcomingItems[0].icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", marginBottom: 2 }}>{upcomingItems[0].title}</div>
                                  <div style={{ fontSize: "var(--font-size-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    <span style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>{upcomingItems[0].meta.split(" · ")[0]}</span>
                                    {upcomingItems[0].meta.includes(" · ") && <span style={{ color: "var(--color-text-tertiary)" }}> · {upcomingItems[0].meta.split(" · ")[1]}</span>}
                                  </div>
                                </div>
                              </button>
                            </div>
                          )}

                          {/* View all CTA */}
                          <button
                            onClick={() => { setBookingsFilter("upcoming"); setSubPage("my-bookings"); }}
                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 16px 10px", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                          >
                            <span style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-brand)" }}>View bookings &amp; orders</span>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="var(--color-text-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>

                        </>}

                      </>
                    );
                  })()}
                </Card>
              </div>

              {/* Account balances */}
              <div>
                <div style={{ padding: "0 16px", marginBottom: 10 }}>
                  <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Account balances</div>
                </div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingLeft: 16, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                  {[
                    { id: "meals",      label: "Meals",      balance: mealsBalance,      Icon: Utensils,    showTopUp: true  },
                    { id: "wraparound", label: "Wraparound", balance: wraparoundBalance, Icon: SunMoon,     showTopUp: false },
                    { id: "milk",       label: "Milk",       balance: 8.50,              Icon: ShoppingBag, showTopUp: false },
                  ].map((account, i, arr) => {
                    const isLow = account.balance <= lowFundsThreshold;
                    return (
                      <div key={account.id} style={{ flexShrink: 0, width: 156, paddingRight: i === arr.length - 1 ? 16 : 0 }}>
                        <Card padding="none" style={{ overflow: "hidden", height: "100%" }}>
                          <button
                            onClick={() => { setTxHistoryAccount(account.id); setSubPage("tx-history"); }}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 14px 10px", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                          >
                            <account.Icon size={16} color="var(--color-grey-900)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>{account.label}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                          <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-bold)", color: isLow ? "var(--color-text-destructive)" : "var(--color-text-primary)", fontVariantNumeric: "tabular-nums" }}>£{account.balance.toFixed(2)}</span>
                              {isLow && <Tag variant="default">Low</Tag>}
                            </div>
                            {account.showTopUp && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setStandaloneTopUpAccount(account.id); setTopUpAmount(10); setShowStandaloneTopUp(true); setStandaloneTopUpAddedToBasket(false); setStandaloneTopUpSuccess(false); }}
                                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
                              >
                                <span style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-brand)" }}>Top up</span>
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="var(--color-text-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                            )}
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Browse */}
              <div ref={browseSectionRef}>
                <div style={{ padding: "0 16px", marginBottom: 10 }}>
                  <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Browse &amp; book</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px" }}>
                  {[
                    { id: "clubs",           label: "Clubs",             sub: "11 available",                icon: <Shapes size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,      onClick: () => { setBrowseFilter("clubs"); setSubPage("browse"); },      variant: "BC" },
                    { id: "wraparound",      label: "Wraparound",        sub: "6 available",                 icon: <SunMoon size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,     onClick: () => { setBrowseFilter("wraparound"); setSubPage("browse"); }, variant: "BC" },
                    { id: "meals",           label: "Meals",             sub: "Next week's menu available",  icon: <Utensils size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,    onClick: () => {},                                                        variant: "BC" },
                    { id: "trips",           label: "Trips",             sub: "1 open to book",              icon: <Bus size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,          onClick: () => { setBrowseFilter("trips"); setSubPage("browse"); },       variant: "BC" },
                    { id: "school-shop",     label: "School shop",       sub: "5 new items",                 icon: <ShoppingBag size={20} color="var(--color-brand-600)" strokeWidth={1.5} />, onClick: () => {},                                                        variant: "BC" },
                    { id: "parents-evening", label: "Parents' evening",  sub: "Booking opens 12 Jun",        icon: (
                      <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                        <rect x="3" y="5" width="22" height="19" rx="2.5" stroke="var(--color-brand-600)" strokeWidth="1.5" />
                        <path d="M3 11H25" stroke="var(--color-brand-600)" strokeWidth="1.5" />
                        <path d="M9 3V6" stroke="var(--color-brand-600)" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M19 3V6" stroke="var(--color-brand-600)" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="17" r="1.8" fill="var(--color-brand-600)" opacity="0.8" />
                        <circle cx="18" cy="17" r="1.8" fill="var(--color-brand-600)" opacity="0.8" />
                      </svg>
                    ), onClick: () => { setBrowseFilter("parents-evening"); setSubPage("browse"); }, variant: "BC" },
                  ].map((item) => {
                    const label = null; // unused — rendered inline below

                    // Option A — tonal header strip, icon inside, label below
                    if (item.variant === "A") return (
                      <Card key={item.id} padding="none" style={{ cursor: "pointer", overflow: "hidden" }} onClick={item.onClick}>
                        <div style={{ background: item.headerBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 12px 14px" }}>
                          {item.icon}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px 14px" }}>
                          {label}
                        </div>
                      </Card>
                    );

                    // Option B — top accent line, layout unchanged
                    if (item.variant === "B") return (
                      <Card key={item.id} padding="none" style={{ cursor: "pointer", borderTop: `4px solid ${item.lineBg}`, overflow: "hidden" }} onClick={item.onClick}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 12px" }}>
                          {item.icon}
                          {label}
                        </div>
                      </Card>
                    );

                    // Option BC — centred, no accent strip
                    if (item.variant === "BC") return (
                      <Card key={item.id} padding="none" style={{ cursor: "pointer" }} onClick={item.onClick}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 12px 10px", textAlign: "center" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {item.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", lineHeight: 1.3 }}>{item.label}</div>
                            <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2, lineHeight: 1.3 }}>{item.sub}</div>
                          </div>
                        </div>
                      </Card>
                    );

                    // Option C — layered shadow depth, layout unchanged
                    if (item.variant === "C") return (
                      <Card key={item.id} padding="none" style={{ cursor: "pointer", boxShadow: "0 4px 12px -2px rgba(0,0,0,0.10), 0 1px 4px -1px rgba(0,0,0,0.06)" }} onClick={item.onClick}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 12px" }}>
                          {item.icon}
                          {label}
                        </div>
                      </Card>
                    );

                    // Default — no treatment
                    return (
                      <Card key={item.id} padding="none" style={{ cursor: "pointer" }} onClick={item.onClick}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 12px" }}>
                          {item.icon}
                          {label}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>


            </div>
          )}

          {/* Home — soft-launch demo dashboard */}
          {!subPage && activeTab === "home" && (() => {
            const todayId = "30-Jun";
            const days = [
              // w/c 1 Jun — start of the second half of summer term (after May half-term)
              { id: "1-Jun",  label: "Mon", date: 1,  month: "Jun", weekday: "Monday" },
              { id: "2-Jun",  label: "Tue", date: 2,  month: "Jun", weekday: "Tuesday" },
              { id: "3-Jun",  label: "Wed", date: 3,  month: "Jun", weekday: "Wednesday" },
              { id: "4-Jun",  label: "Thu", date: 4,  month: "Jun", weekday: "Thursday" },
              { id: "5-Jun",  label: "Fri", date: 5,  month: "Jun", weekday: "Friday" },
              // w/c 8 Jun
              { id: "8-Jun",  label: "Mon", date: 8,  month: "Jun", weekday: "Monday" },
              { id: "9-Jun",  label: "Tue", date: 9,  month: "Jun", weekday: "Tuesday" },
              { id: "10-Jun", label: "Wed", date: 10, month: "Jun", weekday: "Wednesday" },
              { id: "11-Jun", label: "Thu", date: 11, month: "Jun", weekday: "Thursday" },
              { id: "12-Jun", label: "Fri", date: 12, month: "Jun", weekday: "Friday" },
              // w/c 15 Jun
              { id: "15-Jun", label: "Mon", date: 15, month: "Jun", weekday: "Monday" },
              { id: "16-Jun", label: "Tue", date: 16, month: "Jun", weekday: "Tuesday" },
              { id: "17-Jun", label: "Wed", date: 17, month: "Jun", weekday: "Wednesday" },
              { id: "18-Jun", label: "Thu", date: 18, month: "Jun", weekday: "Thursday" },
              { id: "19-Jun", label: "Fri", date: 19, month: "Jun", weekday: "Friday" },
              // w/c 22 Jun
              { id: "22-Jun", label: "Mon", date: 22, month: "Jun", weekday: "Monday" },
              { id: "23-Jun", label: "Tue", date: 23, month: "Jun", weekday: "Tuesday" },
              { id: "24-Jun", label: "Wed", date: 24, month: "Jun", weekday: "Wednesday" },
              { id: "25-Jun", label: "Thu", date: 25, month: "Jun", weekday: "Thursday" },
              { id: "26-Jun", label: "Fri", date: 26, month: "Jun", weekday: "Friday" },
              // w/c 29 Jun — this week
              { id: "29-Jun", label: "Mon", date: 29, month: "Jun", weekday: "Monday" },
              { id: "30-Jun", label: "Tue", date: 30, month: "Jun", weekday: "Tuesday" },
              { id: "1-Jul",  label: "Wed", date: 1,  month: "Jul", weekday: "Wednesday" },
              { id: "2-Jul",  label: "Thu", date: 2,  month: "Jul", weekday: "Thursday" },
              { id: "3-Jul",  label: "Fri", date: 3,  month: "Jul", weekday: "Friday" },
              // w/c 6 Jul
              { id: "6-Jul",  label: "Mon", date: 6,  month: "Jul", weekday: "Monday" },
              { id: "7-Jul",  label: "Tue", date: 7,  month: "Jul", weekday: "Tuesday" },
              { id: "8-Jul",  label: "Wed", date: 8,  month: "Jul", weekday: "Wednesday" },
              { id: "9-Jul",  label: "Thu", date: 9,  month: "Jul", weekday: "Thursday" },
              { id: "10-Jul", label: "Fri", date: 10, month: "Jul", weekday: "Friday" },
              // w/c 13 Jul
              { id: "13-Jul", label: "Mon", date: 13, month: "Jul", weekday: "Monday" },
              { id: "14-Jul", label: "Tue", date: 14, month: "Jul", weekday: "Tuesday" },
              { id: "15-Jul", label: "Wed", date: 15, month: "Jul", weekday: "Wednesday" },
              { id: "16-Jul", label: "Thu", date: 16, month: "Jul", weekday: "Thursday" },
              { id: "17-Jul", label: "Fri", date: 17, month: "Jul", weekday: "Friday" },
              // w/c 20 Jul — summer holidays
              { id: "20-Jul", label: "Mon", date: 20, month: "Jul", weekday: "Monday" },
              { id: "21-Jul", label: "Tue", date: 21, month: "Jul", weekday: "Tuesday" },
              { id: "22-Jul", label: "Wed", date: 22, month: "Jul", weekday: "Wednesday" },
              { id: "23-Jul", label: "Thu", date: 23, month: "Jul", weekday: "Thursday" },
              { id: "24-Jul", label: "Fri", date: 24, month: "Jul", weekday: "Friday" },
              // w/c 27 Jul
              { id: "27-Jul", label: "Mon", date: 27, month: "Jul", weekday: "Monday" },
              { id: "28-Jul", label: "Tue", date: 28, month: "Jul", weekday: "Tuesday" },
              { id: "29-Jul", label: "Wed", date: 29, month: "Jul", weekday: "Wednesday" },
              { id: "30-Jul", label: "Thu", date: 30, month: "Jul", weekday: "Thursday" },
              { id: "31-Jul", label: "Fri", date: 31, month: "Jul", weekday: "Friday" },
              // w/c 3 Aug
              { id: "3-Aug",  label: "Mon", date: 3,  month: "Aug", weekday: "Monday" },
              { id: "4-Aug",  label: "Tue", date: 4,  month: "Aug", weekday: "Tuesday" },
              { id: "5-Aug",  label: "Wed", date: 5,  month: "Aug", weekday: "Wednesday" },
              { id: "6-Aug",  label: "Thu", date: 6,  month: "Aug", weekday: "Thursday" },
              { id: "7-Aug",  label: "Fri", date: 7,  month: "Aug", weekday: "Friday" },
              // w/c 10 Aug
              { id: "10-Aug", label: "Mon", date: 10, month: "Aug", weekday: "Monday" },
              { id: "11-Aug", label: "Tue", date: 11, month: "Aug", weekday: "Tuesday" },
              { id: "12-Aug", label: "Wed", date: 12, month: "Aug", weekday: "Wednesday" },
              { id: "13-Aug", label: "Thu", date: 13, month: "Aug", weekday: "Thursday" },
              { id: "14-Aug", label: "Fri", date: 14, month: "Aug", weekday: "Friday" },
              // w/c 17 Aug
              { id: "17-Aug", label: "Mon", date: 17, month: "Aug", weekday: "Monday" },
              { id: "18-Aug", label: "Tue", date: 18, month: "Aug", weekday: "Tuesday" },
              { id: "19-Aug", label: "Wed", date: 19, month: "Aug", weekday: "Wednesday" },
              { id: "20-Aug", label: "Thu", date: 20, month: "Aug", weekday: "Thursday" },
              { id: "21-Aug", label: "Fri", date: 21, month: "Aug", weekday: "Friday" },
              // w/c 24 Aug
              { id: "24-Aug", label: "Mon", date: 24, month: "Aug", weekday: "Monday" },
              { id: "25-Aug", label: "Tue", date: 25, month: "Aug", weekday: "Tuesday" },
              { id: "26-Aug", label: "Wed", date: 26, month: "Aug", weekday: "Wednesday" },
              { id: "27-Aug", label: "Thu", date: 27, month: "Aug", weekday: "Thursday" },
              { id: "28-Aug", label: "Fri", date: 28, month: "Aug", weekday: "Friday" },
              // w/c 31 Aug — back to school (bank holiday, INSET, first day)
              { id: "31-Aug", label: "Mon", date: 31, month: "Aug", weekday: "Monday" },
              { id: "1-Sep",  label: "Tue", date: 1,  month: "Sep", weekday: "Tuesday" },
              { id: "2-Sep",  label: "Wed", date: 2,  month: "Sep", weekday: "Wednesday" },
              { id: "3-Sep",  label: "Thu", date: 3,  month: "Sep", weekday: "Thursday" },
              { id: "4-Sep",  label: "Fri", date: 4,  month: "Sep", weekday: "Friday" },
            ];

            // Event icon taxonomy. Reuse the Book & Pay vocabulary for bookable things so an
            // event reads identically across tabs; everything else maps to a fixed school-life
            // category. Keep this in sync when adding events — don't pick glyphs ad hoc.
            //   Shapes            → Clubs (only genuine clubs — matches Book & Pay Club)
            //   SunMoon           → Wraparound / holiday clubs (matches Book & Pay Wraparound)
            //   Bus               → Trips (matches Book & Pay Trip)
            //   ParentsEveningIcon→ Parents' evening (shared component, matches Book & Pay)
            //   Trophy            → Sport & PE (fixtures and lessons)
            //   ClipboardList     → Academic / exams / options
            //   PartyPopper       → Celebration / community / performance
            //   Book              → Reading / literacy
            //   Info              → Notices / reminders
            //   School            → Term transitions (first day, move-up)
            //   CalendarX         → Closures / INSET (muted marker treatment)
            const events = {
              // Past weeks — lighter, for context when scrolling back.
              "3-Jun": [
                { id: "p1", title: "School photos",                       time: "Morning",                  icon: PartyPopper,   child: "Whole school", school: "Oakwood Primary", source: "Newsletter", sourceIcon: Newspaper },
              ],
              "11-Jun": [
                { id: "p2", title: "Year 9 mock exams begin",             time: "09:00 – 12:00",            icon: ClipboardList, child: "Ethan", source: "Email", sourceIcon: Mail },
              ],
              "17-Jun": [
                { id: "p3", title: "KS2 inter-school athletics",          time: "13:30 – 15:30",            icon: Trophy,        child: "Lucas", source: "App booking", sourceIcon: Smartphone },
              ],
              "23-Jun": [
                { id: "p4", title: "Year 5 museum trip",                  time: "Depart 09:00 · Return 15:30", icon: Bus,        child: "Molly", source: "App booking", sourceIcon: Smartphone },
              ],
              "26-Jun": [
                { id: "p5", title: "End-of-year reports published",       time: "All day",                  icon: Book,          child: "Whole school", school: "Oakwood Primary", source: "App booking", sourceIcon: Smartphone },
              ],
              "29-Jun": [
                { id: "m1", title: "Football club",                       time: "15:30 – 16:30",            icon: Shapes,        child: "Molly", source: "App booking",       sourceIcon: Smartphone,    reminder: "Bring full PE kit and water bottle" },
                { id: "m2", title: "Year 7 swimming gala",                time: "13:30 – 15:30",            icon: Trophy,        child: "Ethan", source: "Email", sourceIcon: Mail,          reminder: "Swimsuit, towel, goggles · £2 for ice cream" },
                { id: "m3", title: "Wimbledon week — tennis taster",      time: "Lunchtime · all week",     icon: Trophy,        child: "Lucas", source: "Newsletter",        sourceIcon: Newspaper },
              ],
              "30-Jun": [
                { id: "t1", title: "Year 5 Parents' evening",             time: "16:30 – 16:40",            icon: ParentsEveningIcon, child: "Molly", source: "App booking",       sourceIcon: Smartphone,    reminder: "Prep questions about Year 6 transition" },
                { id: "t2", title: "Year 9 GCSE options afternoon",       time: "14:00 – 15:30",            icon: ClipboardList, child: "Ethan", source: "Email", sourceIcon: Mail,          reminder: "Options form deadline Fri 3 Jul" },
                { id: "t3", title: "Reading volunteer slot",              time: "09:00 – 10:00",            icon: Book,          child: "Lucas", source: "Text",   sourceIcon: MessageCircle, reminder: "Sign in at reception · DBS lanyard" },
                { id: "t4", title: "Choir practice",                      time: "15:30 – 16:00",            icon: Shapes,        child: "Molly", source: "App booking",       sourceIcon: Smartphone },
              ],
              "1-Jul": [
                { id: "w1", title: "Plastic Free July assembly",          time: "09:15 – 09:45",            icon: PartyPopper,   child: "Molly & Lucas", source: "Newsletter", sourceIcon: Newspaper,    reminder: "Bring a reusable water bottle" },
                { id: "w2", title: "Natural History Museum",              time: "Depart 08:30 · Return 16:00", icon: Bus,        child: "Lucas", source: "App booking",       sourceIcon: Smartphone,    reminder: "Packed lunch, school uniform, sun hat" },
                { id: "w3", title: "KS2 swimming lesson",                 time: "13:00 – 14:00",            icon: Trophy,        child: "Molly", source: "School calendar",   sourceIcon: Calendar,      reminder: "Swimsuit, towel, swimming cap" },
              ],
              "2-Jul": [
                { id: "th1", title: "Sports Day",                         time: "09:30 – 14:00",            icon: Trophy,        child: "Molly & Lucas", source: "Newsletter", sourceIcon: Newspaper,    reminder: "Full PE kit, sunhat, sunscreen, water, packed lunch" },
                { id: "th2", title: "Year 9 Geography fieldwork briefing", time: "11:00 – 12:00",           icon: ClipboardList, child: "Ethan", source: "In-app message",    sourceIcon: MessageCircle },
                { id: "th3", title: "Tennis club",                        time: "15:30 – 16:30",            icon: Shapes,        child: "Lucas", source: "App booking",       sourceIcon: Smartphone,    reminder: "Tennis racket if you have one" },
              ],
              "3-Jul": [
                { id: "f1", title: "Non-uniform day",                     time: "All day",                  icon: PartyPopper,   child: "Whole school", school: "Oakwood Primary", source: "Newsletter", sourceIcon: Newspaper,     reminder: "£1 donation in named envelope" },
                { id: "f2", title: "Summer Fair",                         time: "15:30 – 18:00",            icon: PartyPopper,   child: "Molly & Lucas", source: "Newsletter", sourceIcon: Newspaper,    reminder: "Cake donations welcome at drop-off" },
                { id: "f3", title: "Sports awards assembly",              time: "14:30 – 15:30",            icon: Trophy,        child: "Ethan", source: "Email", sourceIcon: Mail },
                { id: "f4", title: "Football club",                       time: "15:30 – 16:30",            icon: Shapes,        child: "Molly", source: "App booking",       sourceIcon: Smartphone },
              ],
              "6-Jul": [
                { id: "n1", title: "Year 6 leavers' production rehearsal", time: "13:30 – 15:00",           icon: PartyPopper,   child: "Molly", source: "Newsletter",        sourceIcon: Newspaper },
              ],
              "7-Jul": [
                { id: "n2", title: "Year 9 Parents' evening",             time: "17:00 – 17:10",            icon: ParentsEveningIcon, child: "Ethan", source: "App booking",       sourceIcon: Smartphone,    reminder: "Bring options form discussion notes" },
              ],
              "8-Jul": [
                { id: "n3", title: "Sun safety reminder",                 time: "All week",                 icon: Info,          child: "Whole school", school: "Oakwood Primary", source: "Newsletter", sourceIcon: Newspaper,     reminder: "Send hats and sunscreen daily" },
                { id: "n4", title: "Year 4 swimming lesson",              time: "13:00 – 14:00",            icon: Trophy,        child: "Lucas", source: "School calendar",   sourceIcon: Calendar },
              ],
              "9-Jul": [
                { id: "n5", title: "Year 5 trip — Kew Gardens",           time: "Depart 09:00 · Return 15:30", icon: Bus,        child: "Molly", source: "App booking",       sourceIcon: Smartphone,    reminder: "Packed lunch, raincoat just in case" },
              ],
              "10-Jul": [
                { id: "n6", title: "PTA cake sale",                       time: "After school",             icon: PartyPopper,   child: "Whole school", school: "Oakwood Primary", source: "Newsletter", sourceIcon: Newspaper,     reminder: "Bring change · proceeds to library refurb" },
              ],
              "13-Jul": [],
              "14-Jul": [
                { id: "n7", title: "Move-up morning",                     time: "09:00 – 12:00",            icon: School,        child: "Molly & Lucas", source: "Newsletter", sourceIcon: Newspaper,    reminder: "Meet next year's teacher" },
              ],
              "15-Jul": [],
              "16-Jul": [
                { id: "n8", title: "Year 6 production — The Lion King",   time: "18:00 – 19:30",            icon: PartyPopper,   child: "Molly", source: "App booking",       sourceIcon: Smartphone,    reminder: "Tickets purchased · Doors open 17:30" },
              ],
              "17-Jul": [
                { id: "n9", title: "Last day of summer term",             time: "Finishes 13:30",           icon: PartyPopper,   child: "Molly & Lucas", source: "Newsletter", sourceIcon: Newspaper },
              ],
              // Summer holidays — mostly clear, with the odd holiday-club booking and notice.
              "20-Jul": [
                { id: "h1", title: "Summer Reading Challenge",            time: "All summer",               icon: Book,          child: "Whole school", school: "Oakwood Primary", source: "Newsletter", sourceIcon: Newspaper },
              ],
              "21-Jul": [],
              "22-Jul": [],
              "23-Jul": [],
              "24-Jul": [],
              "27-Jul": [
                { id: "h2", title: "Oakwood Summer Holiday Club",         time: "08:30 – 15:30",            icon: SunMoon,       child: "Molly & Lucas", source: "App booking", sourceIcon: Smartphone },
              ],
              "28-Jul": [
                { id: "h3", title: "Oakwood Summer Holiday Club",         time: "08:30 – 15:30",            icon: SunMoon,       child: "Molly & Lucas", source: "App booking", sourceIcon: Smartphone },
              ],
              "29-Jul": [],
              "30-Jul": [],
              "31-Jul": [],
              "3-Aug": [],
              "4-Aug": [],
              "5-Aug": [],
              "6-Aug": [],
              "7-Aug": [],
              "10-Aug": [],
              "11-Aug": [],
              "12-Aug": [],
              "13-Aug": [],
              "14-Aug": [],
              "17-Aug": [],
              "18-Aug": [],
              "19-Aug": [],
              "20-Aug": [],
              "21-Aug": [],
              "24-Aug": [],
              "25-Aug": [],
              "26-Aug": [],
              "27-Aug": [],
              "28-Aug": [],
              // Back to school — bank holiday, INSET days, first day back (schools differ by a day).
              "31-Aug": [
                { id: "bh1", title: "Summer bank holiday",                time: "All day",                  icon: CalendarX,     kind: "closure", child: "Whole school", note: "Schools closed." },
              ],
              "1-Sep": [
                { id: "in1", title: "INSET day",                          time: "All day",                  icon: CalendarX,     kind: "inset", child: "Whole school", note: "Staff training. No pupils in school." },
              ],
              "2-Sep": [
                { id: "in2", title: "INSET day",                          time: "All day",                  icon: CalendarX,     kind: "inset", child: "Whole school", school: "Oakwood Primary", note: "Staff training. No pupils in school." },
                { id: "bk1", title: "Autumn term begins",                 time: "Starts 08:40",             icon: School,        child: "Ethan", source: "School calendar", sourceIcon: Calendar },
              ],
              "3-Sep": [
                { id: "bk2", title: "Autumn term begins",                 time: "Starts 08:50",             icon: School,        child: "Molly & Lucas", source: "School calendar", sourceIcon: Calendar },
              ],
              "4-Sep": [],
            };

            const monthNum = { Jun: 6, Jul: 7, Aug: 8, Sep: 9 };
            const monthFull = m => ({ Jun: "June", Jul: "July", Aug: "August", Sep: "September" }[m] || m);
            const dayOrd = d => monthNum[d.month] * 100 + d.date;

            // Coming Up is paged by week (Mon–Fri). The strip scrolls horizontally and snaps
            // week by week. The range runs to the end of the summer holidays, finishing on the
            // week schools return — so parents can swipe ahead to find the first day back.
            const weeks = [];
            for (let i = 0; i < days.length; i += 5) weeks.push(days.slice(i, i + 5));
            const currentWeekIndex = Math.max(0, weeks.findIndex(wd => wd.some(d => d.id === homeDay)));
            const todayWeekIndex = weeks.findIndex(wd => wd.some(d => d.id === todayId));
            const weekDaysShown = weeks[currentWeekIndex] || [];

            // Time-of-day greeting from the real clock.
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

            // Who the calendar subscription covers — follows the active scope (all children vs one).
            const subscribeWho = allChildren
              ? children.map(c => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")
              : selectedChild.name;

            // School calendar — each school's last day of summer term and first day back.
            // Riverside Secondary breaks up and returns a day earlier than Oakwood Primary.
            const schoolList = [...new Set(children.map(c => c.school))];
            const termCalendar = {
              "Oakwood Primary":     { breakUp: dayOrd({ date: 17, month: "Jul" }), returns: dayOrd({ date: 3, month: "Sep" }) },
              "Riverside Secondary": { breakUp: dayOrd({ date: 10, month: "Jul" }), returns: dayOrd({ date: 2, month: "Sep" }) },
            };
            const onSummerHoliday = (school, d) => {
              const t = termCalendar[school];
              return t ? (dayOrd(d) > t.breakUp && dayOrd(d) < t.returns) : false;
            };
            // A school counts as "on holiday this week" only if every weekday falls in its summer break.
            const schoolsHolidayThisWeek = schoolList.filter(s => weekDaysShown.length > 0 && weekDaysShown.every(d => onSummerHoliday(s, d)));
            // Scope: Home (all children) considers every school; filtered to one child, just theirs.
            const relevantSchools = allChildren ? schoolList : [selectedChild.school];
            const relevantOnHoliday = relevantSchools.filter(s => schoolsHolidayThisWeek.includes(s));
            // True only when everyone the view concerns is off — drives the warm empty-state copy.
            const allRelevantOnHoliday = relevantOnHoliday.length > 0 && relevantOnHoliday.length === relevantSchools.length;
            // Name the school only when it disambiguates — i.e. some but not all relevant schools are off.
            const holidayLines = relevantOnHoliday.length === 0
              ? []
              : (allRelevantOnHoliday
                  ? ["Summer holidays"]
                  : relevantOnHoliday.map(s => `${s} · Summer holidays`));

            // An event involves the selected child if they're named, or it's a school-level notice
            // for their school (a school-less "Whole school" item applies to every school).
            const involvesChild = (ev) => {
              if (allChildren) return true;
              if (ev.child === "Whole school") return !ev.school || ev.school === selectedChild.school;
              return ev.child.split(" & ").map(s => s.trim()).includes(selectedChild.name);
            };

            // Sort a day's events earliest → latest. All-day / status items sit at the top.
            const timeKey = (time) => {
              if (!time) return 9 * 60;
              const m = time.match(/(\d{1,2}):(\d{2})/);
              if (m) return (+m[1]) * 60 + (+m[2]);
              const t = time.toLowerCase();
              if (t.startsWith("all ")) return -1;
              if (t.includes("lunch")) return 12 * 60;
              if (t.includes("after school")) return 15 * 60;
              return 9 * 60;
            };

            const selectedEvents = (events[homeDay] || []).filter(involvesChild).slice().sort((a, b) => timeKey(a.time) - timeKey(b.time));

            // When scoped to one child who has nothing on, work out which of the parent's other
            // children DO have something this day. Any event the filter hides belongs to a sibling,
            // so the empty state can name them and point to the switcher rather than falsely
            // implying the whole household is free ("You're all clear for the day").
            const siblingsWithEvents = (allChildren || selectedEvents.length > 0)
              ? []
              : [...new Set((events[homeDay] || []).flatMap(ev => {
                  const names = ev.child === "Whole school"
                    ? (ev.school ? children.filter(c => c.school === ev.school).map(c => c.name) : children.map(c => c.name))
                    : ev.child.split(" & ").map(s => s.trim());
                  return names.filter(n => n !== selectedChild.name && children.some(c => c.name === n));
                }))];
            const siblingsLabel = siblingsWithEvents.join(", ").replace(/, ([^,]*)$/, " and $1");
            const siblingsPlural = siblingsWithEvents.length > 1;
            // Three-way empty state: everyone on holiday → break; this child free but a sibling busy
            // → name them; genuinely nothing for anyone → all clear (now only fires when true).
            const emptyTitle = allRelevantOnHoliday
              ? "Enjoy the break"
              : (siblingsWithEvents.length > 0 ? `Nothing for ${selectedChild.name}` : "Nothing scheduled");
            const emptySubtitle = allRelevantOnHoliday
              ? "No school events this day."
              : (siblingsWithEvents.length > 0
                  ? `${siblingsLabel} ${siblingsPlural ? "have" : "has"} something on this day. Switch child to see ${siblingsPlural ? "them" : "it"}.`
                  : "You're all clear for the day.");

            const selectedDay = days.find(d => d.id === homeDay) || days[1];
            const selectedDateLabel = `${selectedDay.weekday} ${selectedDay.date} ${monthFull(selectedDay.month)}`;

            // Child badge — matches the child switcher: pastel bg, dark coloured letter, regular weight.
            // Child name is the primary attribution (it implies the school). School name is shown
            // as secondary only for school-level notices, where the child name can't carry it.
            const ChildBadge = ({ name, school }) => {
              // Resolve who an item concerns. School-level notices ("Whole school") map to the
              // affected children. Attribution rule, keyed off the resolved count:
              //   1 child  → avatar + name (friendly, no wrap risk)
              //   2+ child → avatars only (names would wrap; avatars carry who, including the school)
              const kids = name === "Whole school"
                ? (school ? children.filter(c => c.school === school) : children)
                : name.split(" & ").map(p => children.find(c => c.name === p)).filter(Boolean);
              if (kids.length === 0) {
                return <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{name}</span>;
              }
              const label = kids.length === 1 ? kids[0].name : "";
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>
                  <span style={{ display: "flex" }}>
                    {kids.map((c, i) => (
                      <span key={c.name} style={{ width: 20, height: 20, borderRadius: "50%", background: c.avatarColour.bg, border: `1px solid ${c.avatarColour.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: i > 0 ? -6 : 0 }}>
                        <span style={{ fontSize: "var(--font-size-1)", fontWeight: 400, color: c.avatarColour.text, lineHeight: 1 }}>{c.initials}</span>
                      </span>
                    ))}
                  </span>
                  {label}
                </span>
              );
            };

            // On scroll/snap, move the selected day to the week nearest the viewport centre,
            // unless the current selection is already in that week (user tapped a day).
            const onStripScroll = () => {
              const el = homeStripRef.current;
              if (!el) return;
              const center = el.scrollLeft + el.clientWidth / 2;
              let best = 0, bestDist = Infinity;
              Array.from(el.children).forEach((child, i) => {
                const dist = Math.abs((child.offsetLeft + child.offsetWidth / 2) - center);
                if (dist < bestDist) { bestDist = dist; best = i; }
              });
              const wd = weeks[best];
              if (!wd || wd.some(d => d.id === homeDay)) return;
              const today = wd.find(d => d.id === todayId);
              setHomeDay((today || wd[0]).id);
            };

            // Chevron paging — smooth-scroll the strip to a week; onStripScroll then syncs the day.
            const scrollToWeek = (idx) => {
              const el = homeStripRef.current;
              const child = el && el.children[idx];
              if (!child) return;
              el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
            };

            return (
              <div style={{ flex: 1, overflowY: "auto", background: "var(--color-bg-secondary)" }}>
                {/* Hero panel */}
                <div style={{ background: `radial-gradient(100% 100% at 50% 55%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg, var(--color-brand-050) 0%, var(--color-brand-100) 100%)`, padding: "28px 16px 24px", borderBottomLeftRadius: 36, borderBottomRightRadius: 36, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "relative" }}>
                    <h1 style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2, letterSpacing: -0.4 }}>{greeting}, Kate</h1>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 6 }}>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{selectedDateLabel}</div>
                      {currentWeekIndex !== todayWeekIndex && (
                        <button onClick={() => { setHomeDay(todayId); scrollToWeek(todayWeekIndex); }} style={{ flexShrink: 0, border: "none", background: "transparent", color: "var(--color-brand-600)", padding: 0, fontSize: "var(--font-size-3)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Today</button>
                      )}
                    </div>

                    {/* Week strip — Mon–Fri per page, snapped. Chevrons page between weeks (swipe
                        also works); they hide at the term boundaries rather than disabling. */}
                    <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 22 }}>
                      <button onClick={() => scrollToWeek(currentWeekIndex - 1)} aria-label="Previous week" style={{ width: 22, height: 44, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, visibility: currentWeekIndex > 0 ? "visible" : "hidden" }}>
                        <ChevronLeft size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                      </button>
                      <div ref={homeStripRef} onScroll={onStripScroll} className="no-scrollbar" style={{ flex: 1, minWidth: 0, display: "flex", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
                      {weeks.map((wd, wi) => (
                        <div key={wi} data-current-week={wi === currentWeekIndex ? "1" : undefined} style={{ flex: "0 0 100%", scrollSnapAlign: "center", display: "flex", gap: 4, boxSizing: "border-box" }}>
                          {wd.map(d => {
                            const selected = homeDay === d.id;
                            const isToday = d.id === todayId;
                            return (
                              <button key={d.id} onClick={() => setHomeDay(d.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 0 10px", background: selected ? "var(--color-bg-primary)" : "transparent", border: "none", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", boxShadow: selected ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "background 0.15s" }}>
                                <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: selected ? "var(--color-brand-600)" : "var(--color-text-secondary)" }}>{d.label}</span>
                                <span style={{ width: 32, height: 32, borderRadius: 999, background: selected ? "var(--color-brand-600)" : "transparent", color: selected ? "var(--color-white)" : "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.date}</span>
                                <span style={{ fontSize: 10, lineHeight: "12px", height: 12, fontWeight: 600, color: selected ? "var(--color-brand-600)" : "var(--color-grey-900)" }}>{isToday ? "Today" : ""}</span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                      </div>
                      <button onClick={() => scrollToWeek(currentWeekIndex + 1)} aria-label="Next week" style={{ width: 22, height: 44, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, visibility: currentWeekIndex < weeks.length - 1 ? "visible" : "hidden" }}>
                        <ChevronRight size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Day content */}
                <div style={{ padding: "20px 16px 24px" }}>
                  {/* Holiday context — a small centred info pill, only when a school is on a break this week. */}
                  {holidayLines.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 16 }}>
                      {holidayLines.map(line => (
                        <div key={line} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "var(--color-bg-info)", color: "var(--color-text-info)", fontSize: "var(--font-size-3)", fontWeight: 400 }}>
                          <Sun size={16} color="var(--color-icon-info)" strokeWidth={1.5} />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedEvents.length === 0 ? (
                    <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border-default)", borderRadius: 12, padding: "32px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-grey-900)" }}>{emptyTitle}</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 4 }}>{emptySubtitle}</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedEvents.map(ev => {
                        const ItemIcon = ev.icon;
                        const SourceIcon = ev.sourceIcon;
                        // Calendar markers (INSET days, closures) read as muted status, not activities.
                        const marker = ev.kind === "inset" || ev.kind === "closure";
                        // Icon treatment matches the Bookings & orders cards: bare 24px glyph in
                        // grey-900, no tile. Markers stay muted (secondary) to read as status.
                        return (
                          <div key={ev.id} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border-default)", borderRadius: 12, padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <ItemIcon size={24} color={marker ? "var(--color-text-secondary)" : "var(--color-grey-900)"} strokeWidth={1.5} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.3 }}>{ev.title}</div>
                                <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>{marker ? ev.note : ev.time}</div>

                                {(ev.child || ev.source) && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                                    {ev.child && <ChildBadge name={ev.child} school={ev.school} />}
                                    {ev.source && (
                                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)" }}>
                                        <SourceIcon size={14} color="var(--color-icon-secondary)" strokeWidth={1.5} />
                                        {ev.source}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Subscribe to calendar — neutral set-and-forget action; a subtle text link */}
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--color-grey-100)", textAlign: "center" }}>
                    <button onClick={() => setShowCalendarSync(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)" }}>Subscribe to your Arbor calendar</button>
                  </div>
                </div>

                {/* Placeholder subscribe sheet — matches the app's bottom-sheet chrome. Entry point only. */}
                {showCalendarSync && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 30 }}>
                    <div onClick={() => setShowCalendarSync(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--color-bg-primary)", borderRadius: "20px 20px 0 0", zIndex: 1 }}>
                      <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)", margin: "12px auto 8px" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 4px 16px" }}>
                        <span style={{ fontSize: "var(--font-size-5)", fontWeight: 500, color: "var(--color-text-primary)" }}>Subscribe to your Arbor calendar</span>
                        <button type="button" onClick={() => setShowCalendarSync(false)} style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                          <X size={20} color="var(--color-icon-default)" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div style={{ height: 1, background: "var(--color-border-default)", margin: "0 16px" }} />
                      <div style={{ padding: "16px 16px 36px" }}>
                        <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "0 0 12px", lineHeight: 1.4 }}>Everything for {subscribeWho}: clubs, trips, term dates and events, all kept up to date in your own calendar.</p>
                        {[{ label: "Apple Calendar", icon: Calendar }, { label: "Google Calendar", icon: Calendar }, { label: "Outlook", icon: Calendar }, { label: "Copy link", icon: Link2 }].map((opt, i, arr) => {
                          const OptIcon = opt.icon;
                          return (
                            <button key={opt.label} type="button" onClick={() => setShowCalendarSync(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 0", background: "none", border: "none", borderBottom: i < arr.length - 1 ? "1px solid var(--color-grey-100)" : "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                              <OptIcon size={24} color="var(--color-text-secondary)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: "var(--font-size-4)", color: "var(--color-text-primary)" }}>{opt.label}</span>
                              <ChevronRight size={16} color="var(--color-icon-default)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {!subPage && activeTab === "messages" && (() => {
            const formatMessageDate = (dateStr, timeStr) => {
              const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
              const [d, mon, yr] = dateStr.split(" ");
              const msgDate = new Date(parseInt(yr), months[mon], parseInt(d));
              const today = new Date(); today.setHours(0,0,0,0);
              const diffDays = Math.round((today - msgDate) / 86400000);
              if (diffDays === 0) return timeStr;
              if (diffDays === 1) return "Yesterday";
              if (diffDays < 7) return msgDate.toLocaleDateString("en-GB", { weekday: "long" });
              if (msgDate.getFullYear() === new Date().getFullYear()) return msgDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
              return msgDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            };

            const allInboxMessages = [
              { id: 1, subject: "Sports Day – Fri 27 Jun", sender: "Mrs Patterson", school: "Oakwood Primary", preview: "Please ensure your child comes to school in their PE kit on Friday. They will need sunscreen applied before...", body: "Dear Parents,\n\nPlease ensure your child comes to school in their PE kit on Friday 27 Jun for Sports Day.\n\nThey will need sunscreen applied before arriving and a water bottle. Please also send in a hat if the weather is warm.\n\nEvents begin at 9:30am. Parents are welcome to attend from 9:15am — please enter via the main gate.\n\nMany thanks,\nMrs Patterson", date: "28 Feb 2026", time: "08:42", hasReply: false },
              { id: 2, subject: "Year 3 swimming lessons", sender: "School Office", school: "Oakwood Primary", preview: "Swimming lessons for Year 3 will begin on Monday 14 Apr. Please complete the consent form in the app by...", body: "Dear Parents,\n\nSwimming lessons for Year 3 will begin on Monday 14 Apr and run every Monday until the end of term.\n\nPlease complete the consent form in the app by Friday 7 Mar.\n\nYour child will need a swimsuit, towel, and swimming cap (caps are available from the school office for £2).\n\nChildren with long hair must tie it back. Goggles are permitted but not required.\n\nIf you have any questions, please don't hesitate to get in touch.\n\nKind regards,\nSchool Office", date: "13 Mar 2026", time: "14:15", hasReply: false },
              { id: 3, subject: "Homework club cancelled this week", sender: "Mr Davies", school: "Oakwood Primary", preview: "Just to let you know that homework club will not be running this Thursday due to staff training. Normal service...", body: "Dear Parents,\n\nJust to let you know that homework club will not be running this Thursday (27 Feb) due to staff training.\n\nNormal service will resume next Thursday.\n\nApologies for any inconvenience.\n\nMr Davies", date: "16 Mar 2026", time: "16:30", hasReply: false },
              { id: 4, subject: "Re: Molly's reading log", sender: "Miss Taylor", school: "Oakwood Primary", preview: "Thank you for letting me know. I'll make sure Molly gets a new reading log book tomorrow morning. She's been...", body: "Dear Mrs Collini,\n\nThank you for letting me know. I'll make sure Molly gets a new reading log book tomorrow morning.\n\nShe's been making brilliant progress with her reading this term — really lovely to see!\n\nBest wishes,\nMiss Taylor", date: "22 Feb 2026", time: "09:10", hasReply: true },
              { id: 5, subject: "School photos – 12 Mar", sender: "School Office", school: "Oakwood Primary", preview: "Individual and sibling school photos will be taken on Thursday 12 Mar. If you would like a sibling photo...", body: "Dear Parents,\n\nIndividual and sibling school photos will be taken on Thursday 12 Mar.\n\nIf you would like a sibling photo taken, please let the office know by Friday 7 Mar so we can add them to the list.\n\nChildren should wear full school uniform. Proof sheets and ordering details will be sent home the following week.\n\nSchool Office", date: "14 Mar 2026", time: "10:00", hasReply: false },
              { id: 6, subject: "World Book Day costumes", sender: "Mrs Patterson", school: "Oakwood Primary", preview: "A reminder that World Book Day is on Thursday 6 Mar. Children are invited to come to school dressed as...", body: "Dear Parents,\n\nA reminder that World Book Day is on Thursday 6 Mar.\n\nChildren are invited to come to school dressed as their favourite book character. There's no need to spend money — homemade costumes and accessories are absolutely fine!\n\nEach class will be sharing their favourite books and there will be a costume parade at 2:30pm in the hall.\n\nWe look forward to seeing everyone's creativity!\n\nMrs Patterson", date: "18 Feb 2026", time: "11:20", hasReply: false },
              { id: 7, subject: "Breakfast club price update from April", sender: "School Office", school: "Oakwood Primary", preview: "We wanted to let you know that from the summer term, the cost of breakfast club will increase slightly from...", body: "Dear Parents,\n\nWe wanted to let you know that from the summer term (April 2026), the cost of breakfast club will increase slightly from £4.50 to £5.00 per session.\n\nThis is the first price change in two years and reflects increased food and staffing costs. We have worked hard to keep the increase as small as possible.\n\nIf you have any questions, please contact the school office.\n\nKind regards,\nSchool Office", date: "14 Feb 2026", time: "09:30", hasReply: false },
              { id: 11, subject: "Parent governor vacancy", sender: "Mrs Patterson", school: "Oakwood Primary", preview: "We have a vacancy for a parent governor on our governing board. This is a great opportunity to help shape...", body: "Dear Parents,\n\nWe have a vacancy for a parent governor on our governing board.\n\nThis is a great opportunity to help shape the future of our school. Governors meet approximately six times a year and also sit on subcommittees.\n\nIf you are interested or would like to find out more, please contact the school office by Friday 20 Mar.\n\nMany thanks,\nMrs Patterson", date: "10 Feb 2026", time: "11:00", hasReply: false },
              { id: 12, subject: "Year 2 class assembly – 5 Mar", sender: "Miss Taylor", school: "Oakwood Primary", preview: "You are warmly invited to Year 2's class assembly on Thursday 5 Mar at 9:15am in the school hall. The...", body: "Dear Parents,\n\nYou are warmly invited to Year 2's class assembly on Thursday 5 Mar at 9:15am in the school hall.\n\nThe children have been working very hard on their performance and we hope you can join us. Please be seated by 9:10am.\n\nSiblings are welcome to attend.\n\nBest wishes,\nMiss Taylor", date: "7 Feb 2026", time: "14:20", hasReply: false },
              { id: 13, subject: "New lunchtime menu from March", sender: "School Office", school: "Oakwood Primary", preview: "Our new spring and summer lunch menu will be available from Monday 2 Mar. Please log in to the app to...", body: "Dear Parents,\n\nOur new spring and summer lunch menu will be available from Monday 2 Mar.\n\nPlease log in to the app to view the updated menu and make any changes to your child's meal choices before the end of this week.\n\nChildren who bring a packed lunch are not affected.\n\nKind regards,\nSchool Office", date: "3 Feb 2026", time: "15:45", hasReply: false },
              { id: 14, subject: "Headlice notification", sender: "School Office", school: "Oakwood Primary", preview: "We have been made aware of a case of headlice in school. Please check your child's hair this evening and...", body: "Dear Parents,\n\nWe have been made aware of a case of headlice in school.\n\nPlease check your child's hair this evening and treat promptly if necessary. Treatments are available from pharmacies without a prescription.\n\nChildren with headlice should not attend school until treatment has begun.\n\nThank you for your cooperation.\n\nSchool Office", date: "28 Jan 2026", time: "13:10", hasReply: false },
              { id: 15, subject: "Scholastic book fair – w/c 10 Feb", sender: "Mrs Patterson", school: "Oakwood Primary", preview: "The Scholastic book fair will be in school from Monday 10 to Friday 14 Feb. Children will have the...", body: "Dear Parents,\n\nThe Scholastic book fair will be in school from Monday 10 to Friday 14 Feb.\n\nChildren will have the opportunity to browse and buy books during the school day. You can also visit after school from 3:30–4:15pm.\n\nPayment can be made by card or cash. Every purchase earns free books for the school.\n\nMrs Patterson", date: "24 Jan 2026", time: "10:30", hasReply: false },
              { id: 8, subject: "Year 9 options evening – 18 Mar", sender: "Mr Hughes", school: "Riverside Secondary", preview: "A reminder that Year 9 options evening is on Wednesday 18 Mar from 5:30pm. Please attend with your child...", body: "Dear Parents/Carers,\n\nA reminder that Year 9 options evening is on Wednesday 18 Mar from 5:30pm to 7:30pm in the main hall.\n\nPlease attend with your child to discuss GCSE subject choices. Subject teachers will be available at information stands and there will be a short presentation at 5:45pm.\n\nThe options form deadline is Friday 28 Mar.\n\nPlease contact the school office if you have any questions.\n\nKind regards,\nMr Hughes\nHead of Year 9", date: "19 Mar 2026", time: "10:15", hasReply: false },
              { id: 9, subject: "Science trip to Natural History Museum", sender: "Dr Anand", school: "Riverside Secondary", preview: "Year 9 have been offered a trip to the Natural History Museum on Friday 4 Apr. The cost is £18 per student...", body: "Dear Parents/Carers,\n\nYear 9 have been offered a trip to the Natural History Museum on Friday 4 Apr.\n\nThe cost is £18 per student, which covers coach travel and a guided workshop. Students will need a packed lunch.\n\nPlease give consent and make payment via the app by Friday 21 Mar.\n\nStudents should wear school uniform and meet at the bus bay at 8:15am. We expect to return by 4:00pm.\n\nMany thanks,\nDr Anand\nHead of Science", date: "18 Mar 2026", time: "15:40", hasReply: false },
              { id: 10, subject: "Re: Ethan's homework extension", sender: "Mrs Clarke", school: "Riverside Secondary", preview: "Thanks for getting in touch. I'm happy to give Ethan until Monday to finish the essay given the circumstances...", body: "Dear Mrs Collini,\n\nThanks for getting in touch. I'm happy to give Ethan until Monday to finish the essay given the circumstances.\n\nHe's been doing really well in English this term so no concerns at all.\n\nBest wishes,\nMrs Clarke", date: "19 Feb 2026", time: "12:05", hasReply: true },
            ];
            const allSentMessages = [
              { id: 101, subject: "Molly's reading log", sender: "You", school: "Oakwood Primary", preview: "Hi Miss Taylor, just to let you know that Molly has lost her reading log book. Could she have a new one...", body: "Hi Miss Taylor,\n\nJust to let you know that Molly has lost her reading log book. Could she have a new one please?\n\nShe's been reading every evening so I'd hate for her to lose track.\n\nMany thanks", date: "21 Feb 2026", time: "19:45", hasReply: true },
              { id: 102, subject: "Absence notification – Lucas", sender: "You", school: "Oakwood Primary", preview: "Good morning, Lucas won't be in school today as he has a temperature. I'll keep you updated on when he'll...", body: "Good morning,\n\nLucas won't be in school today as he has a temperature. I'll keep you updated on when he'll be back.\n\nThank you", date: "17 Feb 2026", time: "07:52", hasReply: false },
              { id: 103, subject: "After school collection change – 14 Feb", sender: "You", school: "Oakwood Primary", preview: "Hi, just to let you know that Molly's grandmother will be collecting her today instead of me. Her name is...", body: "Hi,\n\nJust to let you know that Molly's grandmother will be collecting her today instead of me. Her name is Margaret Collini and she is on the approved list.\n\nThank you", date: "14 Feb 2026", time: "08:15", hasReply: false },
              { id: 105, subject: "Re: Homework club cancelled this week", sender: "You", school: "Oakwood Primary", preview: "Thanks for letting us know. Would you be able to confirm next week's session is going ahead as normal?", body: "Hi Mr Davies,\n\nThanks for letting us know.\n\nWould you be able to confirm that next week's session is going ahead as normal?\n\nMany thanks", date: "24 Feb 2026", time: "17:15", hasReply: false, originalMessage: { subject: "Homework club cancelled this week", sender: "Mr Davies", date: "24 Feb 2026", time: "16:30", body: "Dear Parents,\n\nJust to let you know that homework club will not be running this Thursday (27 Feb) due to staff training.\n\nNormal service will resume next Thursday.\n\nApologies for any inconvenience.\n\nMr Davies" } },
              ...extraSentMessages,
            ];

            // Get unique schools from children
            const schools = [...new Set(children.map(c => c.school))];
            const isSingleSchool = schools.length === 1;
            const activeSchool = isSingleSchool ? schools[0] : messagesSchool;

            // School picker
            if (!activeSchool) {
              return (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                  <div style={{ padding: "12px 16px 16px", background: "#F8F8F8", flexShrink: 0 }}>
                    <span style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "#222" }}>Messages</span>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#888", marginTop: 4 }}>Messages are organised by school, not by child</div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 20px", minHeight: 0, background: "#F8F8F8" }}>
                    {schools.map(school => {
                      const schoolUnread = allInboxMessages.filter(m => m.school === school && !readMessages.has(m.id)).length;
                      const schoolChildren = children.filter(c => c.school === school);
                      return (
                        <Card key={school} padding="none" style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => { setMessagesSchool(school); setMessagesFilter("inbox"); }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <School size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ marginBottom: 4 }}>
                                <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#333" }}>{school}</div>
                                <div style={{ fontSize: "var(--font-size-3)", color: "#999" }}>
                                  {schoolChildren.length > 1
                                    ? `${schoolChildren.map(c => c.name).join(" & ")} · shared inbox`
                                    : schoolChildren[0].name}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                              {schoolUnread > 0 && (
                                <div style={{ minWidth: 22, height: 22, borderRadius: 11, background: "var(--color-brand-600)", color: "#fff", fontSize: "var(--font-size-1)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{schoolUnread}</div>
                              )}
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Filtered messages for selected school
            const inboxMessages = allInboxMessages.filter(m => m.school === activeSchool);
            const sentMessages = allSentMessages.filter(m => m.school === activeSchool);
            const messages = (messagesFilter === "inbox" ? inboxMessages : sentMessages).sort((a, b) => {
              const da = new Date(a.date + " " + a.time);
              const db = new Date(b.date + " " + b.time);
              return db - da;
            });
            const unreadCount = inboxMessages.filter(m => !readMessages.has(m.id)).length;

            // Thread / message detail view
            if (selectedMessage) {
              const canReply = repliesEnabledSchools.includes(activeSchool) && messagesFilter === "inbox";
              const replies = threadReplies[selectedMessage.id] || [];

              const handleSendReply = () => {
                if (replySending) return;
                if (!replyText.trim()) { setReplyError(true); return; }
                setReplyError(false);
                setReplySending(true);
                setTimeout(() => {
                  const replyBody = replyText.trim();
                  const replyDate = "3 Mar 2026";
                  const replyTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                  const newReply = {
                    id: "r" + selectedMessage.id + "-" + (replies.length + 1),
                    sender: "You",
                    body: replyBody,
                    date: replyDate,
                    time: replyTime,
                    delivered: true,
                  };
                  setThreadReplies(prev => ({
                    ...prev,
                    [selectedMessage.id]: [...(prev[selectedMessage.id] || []), newReply],
                  }));
                  // Add to sent messages
                  const sentMsg = {
                    id: Date.now(),
                    subject: "Re: " + selectedMessage.subject,
                    sender: "You",
                    school: selectedMessage.school,
                    preview: replyBody.length > 80 ? replyBody.substring(0, 80) + "..." : replyBody,
                    body: replyBody,
                    date: replyDate,
                    time: replyTime,
                    hasReply: false,
                    originalMessage: { subject: selectedMessage.subject, sender: selectedMessage.sender, date: selectedMessage.date, time: selectedMessage.time, body: selectedMessage.body },
                  };
                  setExtraSentMessages(prev => [sentMsg, ...prev]);
                  setReplyText("");
                  setReplyError(false);
                  setReplySending(false);
                  setTimeout(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, 50);
                }, 1200);
              };

              const MessageBubble = ({ sender, body, time, delivered }) => {
                const isYou = sender === "You";
                const isFullWidth = !canReply && !isYou;
                return (
                  <div style={{ display: "flex", justifyContent: isYou ? "flex-end" : "flex-start", marginBottom: 8 }}>
                    <div style={{
                      width: isFullWidth ? "100%" : undefined,
                      maxWidth: isFullWidth ? "none" : (isYou ? 258 : 301),
                      background: isYou ? "#f5fbff" : "#fff",
                      border: `1px solid ${isYou ? "#c7e3f4" : "#efefef"}`,
                      borderRadius: 8,
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}>
                      <div style={{ fontSize: "var(--font-size-4)", color: "#3b3b3b", lineHeight: 1.5, whiteSpace: "pre-line" }}>{body}</div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "var(--font-size-3)", color: "#474747" }}>
                          {time}{isYou && delivered ? " · Delivered" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => { setSelectedMessage(null); setReplyText(""); setReplyError(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedMessage.subject}</div>
                    </div>
                  </div>
                  {/* Thread content */}
                  <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px", minHeight: 0, background: "#f8f8f8" }}>
                    {(() => {
                      const formatThreadDate = (dateStr) => {
                        const parts = dateStr.split(" ");
                        if (parts.length !== 3) return dateStr;
                        const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                        const d = new Date(parseInt(parts[2]), monthIndex[parts[1]], parseInt(parts[0]));
                        const today = new Date(2026, 3, 13);
                        if (d.toDateString() === today.toDateString()) return "Today";
                        const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        return `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;
                      };
                      const parseThreadDate = (dateStr, timeStr) => {
                        const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                        const parts = dateStr.split(" ");
                        const d = new Date(parseInt(parts[2]), monthIndex[parts[1]], parseInt(parts[0]));
                        if (timeStr) { const [h, m] = timeStr.split(":"); d.setHours(parseInt(h), parseInt(m)); }
                        return d;
                      };
                      const allItems = [
                        { sender: selectedMessage.sender, body: selectedMessage.body, date: selectedMessage.date, time: selectedMessage.time },
                        ...replies,
                      ].sort((a, b) => parseThreadDate(a.date, a.time) - parseThreadDate(b.date, b.time));
                      let lastDate = null;
                      return allItems.map((item, i) => {
                        const showDatePill = item.date !== lastDate;
                        lastDate = item.date;
                        return (
                          <div key={i}>
                            {showDatePill && (
                              <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                                <span style={{ background: "#fff", border: "1px solid #efefef", color: "#2f2f2f", fontSize: "var(--font-size-3)", borderRadius: 99, padding: "4px 12px" }}>
                                  {formatThreadDate(item.date)}
                                </span>
                              </div>
                            )}
                            <MessageBubble sender={item.sender} body={item.body} time={item.time} delivered={item.delivered} />
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Reply composer */}
                  {canReply && (
                    <div style={{ background: "#fff", borderTop: "1px solid #efefef", padding: 16, flexShrink: 0 }}>
                      <div style={{ position: "relative" }}>
                        <textarea
                          value={replyText}
                          onChange={(e) => { setReplyText(e.target.value); if (replyError) setReplyError(false); }}
                          placeholder="Write a reply to the school..."
                          rows={1}
                          onFocus={() => setReplyFocused(true)}
                          onBlur={() => setTimeout(() => setReplyFocused(false), 100)}
                          onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                          style={{
                            display: "block", width: "100%", boxSizing: "border-box",
                            padding: replyText.trim() ? "10px 44px 10px 12px" : "10px 12px",
                            border: "1px solid #dfdfdf", borderRadius: 8, background: "#fff",
                            fontSize: "var(--font-size-3)", fontFamily: "var(--font-family-sans)", color: "#2f2f2f",
                            resize: "none", outline: "none", lineHeight: 1.5, minHeight: 44, maxHeight: 120, overflow: "auto",
                            transition: "padding 0.1s",
                          }}
                        />
                        {replyText.trim() && (
                          <button
                            onClick={handleSendReply}
                            style={{
                              position: "absolute", right: 8, bottom: 8,
                              width: 28, height: 28, borderRadius: "50%", border: "none",
                              background: "#0e8a0e", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {replySending ? (
                              <div style={{ width: 12, height: 12, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L12 2L7 12L6 8L2 7Z" fill="#fff" /></svg>
                            )}
                          </button>
                        )}
                      </div>
                      {replyError && (
                        <div style={{ marginTop: 4, fontSize: "var(--font-size-3)", color: "#B22929" }}>Please write a message before sending</div>
                      )}
                      <div style={{ marginTop: 6, fontSize: "var(--font-size-3)", color: "#474747" }}>Your reply will be sent to the school's shared inbox</div>
                    </div>
                  )}
                  {/* iOS keyboard */}
                  {canReply && replyFocused && (() => {
                    const kbBg = "#CED2D9";
                    const keyWhite = { background: "#fff", borderRadius: 5, boxShadow: "0 1px 0 rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", height: 42, fontSize: "var(--font-size-4)", color: "#000", userSelect: "none", cursor: "default" };
                    const keyGrey = { ...keyWhite, background: "#AEB3BE", fontSize: "var(--font-size-3)" };
                    const Row = ({ children, style }) => <div onMouseDown={e => e.preventDefault()} style={{ display: "flex", gap: 5, padding: "0 3px", marginBottom: 11, ...style }}>{children}</div>;
                    const K = ({ label, style = keyWhite, flex = 1 }) => <div style={{ ...style, flex }}>{label}</div>;
                    return (
                      <div key="keyboard" onMouseDown={e => e.preventDefault()} style={{ background: kbBg, paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
                        <Row>
                          {["Q","W","E","R","T","Y","U","I","O","P"].map(k => <K key={k} label={k} />)}
                        </Row>
                        <Row style={{ paddingLeft: 18, paddingRight: 18 }}>
                          {["A","S","D","F","G","H","J","K","L"].map(k => <K key={k} label={k} />)}
                        </Row>
                        <Row>
                          <K label="⇧" style={keyGrey} flex={1.4} />
                          {["Z","X","C","V","B","N","M"].map(k => <K key={k} label={k} />)}
                          <K label="⌫" style={{ ...keyGrey, fontSize: "var(--font-size-5)" }} flex={1.4} />
                        </Row>
                        <Row style={{ marginBottom: 0 }}>
                          <K label="123" style={{ ...keyGrey, fontSize: "var(--font-size-4)" }} flex={1.5} />
                          <K label="🌐" style={{ ...keyGrey, fontSize: "var(--font-size-5)" }} flex={1} />
                          <K label="space" style={{ ...keyWhite, fontSize: "var(--font-size-4)" }} flex={5} />
                          <K label="return" style={{ ...keyGrey, fontSize: "var(--font-size-4)" }} flex={2} />
                        </Row>
                      </div>
                    );
                  })()}

                  {/* No replies notice for Riverside */}
                  {!canReply && messagesFilter === "inbox" && (
                    <div style={{ padding: "12px 16px 16px", background: "#fff", borderTop: "1px solid #efefef", flexShrink: 0 }}>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", textAlign: "center", lineHeight: 1.4 }}>Replies are not enabled for this school</div>
                    </div>
                  )}
                </div>
              );
            }

            // Compose new message
            if (showCompose) {
              const subjectMax = 100;
              const bodyMax = 2000;

              return (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: "#efefef" }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", padding: "8px 16px 12px", background: "#fff", borderBottom: "1px solid #efefef", flexShrink: 0 }}>
                    <button onClick={() => { setShowCompose(false); setComposeSending(false); setComposeSubject(""); setComposeBody(""); setComposeErrors({}); }} style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#333", flex: 1, textAlign: "center" }}>New message</span>
                    <button
                      onClick={() => {
                        if (composeSending) return;
                        if (!composeBody.trim()) { setComposeErrors({ body: "Please write a message before sending" }); return; }
                        setComposeErrors({});
                        setComposeSending(true);
                        setTimeout(() => {
                          const sentMsg = {
                            id: Date.now(),
                            subject: composeSubject.trim() || "(No subject)",
                            sender: "You",
                            school: composeSchool,
                            preview: composeBody.trim().length > 80 ? composeBody.trim().substring(0, 80) + "..." : composeBody.trim(),
                            body: composeBody.trim(),
                            date: "13 Apr 2026",
                            time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                            hasReply: false,
                            delivered: true,
                          };
                          setExtraSentMessages(prev => [sentMsg, ...prev]);
                          setComposeSending(false);
                          setShowCompose(false);
                          setComposeSubject("");
                          setComposeBody("");
                          setComposeErrors({});
                          setMessagesFilter("sent");
                        }, 1200);
                      }}
                      style={{ height: 34, padding: "0 16px", border: "none", background: "var(--color-brand-600)", borderRadius: 99, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                      {composeSending ? (
                        <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      ) : (
                        <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#fff" }}>Send</span>
                      )}
                    </button>
                  </div>
                  {/* Fields */}
                  <div style={{ background: "#fff", flexShrink: 0 }}>
                    {/* To row */}
                    <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 44, borderBottom: "1px solid #efefef" }}>
                      <span style={{ fontSize: "var(--font-size-4)", color: "#595959", marginRight: 8 }}>To:</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--color-grey-050)", border: "1px solid var(--color-grey-200)", borderRadius: 99, padding: "3px 8px" }}>
                        <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-grey-800)" }}>{composeSchool}</span>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-grey-500)" }}>· shared inbox</span>
                      </div>
                    </div>
                    {/* Subject row */}
                    <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 44, borderBottom: "1px solid #efefef" }}>
                      <span style={{ fontSize: "var(--font-size-4)", color: "#595959", marginRight: 4, flexShrink: 0 }}>Subject:</span>
                      <input
                        type="text"
                        value={composeSubject}
                        onChange={(e) => { setComposeSubject(e.target.value); setComposeErrors(prev => ({...prev, subject: undefined})); }}
                        placeholder="What is your message about?"
                        maxLength={subjectMax + 10}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: "var(--font-size-4)", color: "#222", background: "transparent", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ flex: 1, background: "#fff", padding: "12px 16px", minHeight: 0 }}>
                    <textarea
                      value={composeBody}
                      onChange={(e) => { setComposeBody(e.target.value); setComposeErrors(prev => ({...prev, body: undefined})); }}
                      onFocus={() => setComposeFocused(true)}
                      onBlur={() => setTimeout(() => setComposeFocused(false), 100)}
                      placeholder="Write your message..."
                      maxLength={bodyMax + 100}
                      style={{ width: "100%", height: "100%", border: "none", outline: "none", fontSize: "var(--font-size-4)", color: "#222", background: "transparent", fontFamily: "inherit", resize: "none", lineHeight: 1.5 }}
                      autoFocus
                    />
                  </div>
                  {/* Body error — sits above keyboard so it's always visible */}
                  {composeErrors.body && (
                    <div style={{ background: "#FFF5F5", borderTop: "1px solid #efefef", padding: "8px 16px", flexShrink: 0 }}>
                      <span style={{ fontSize: "var(--font-size-3)", color: "#610202" }}>{composeErrors.body}</span>
                    </div>
                  )}
                  {/* iOS keyboard */}
                  {composeFocused && (() => {
                    const kbBg = "#CED2D9";
                    const keyWhite = { background: "#fff", borderRadius: 5, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-size-4)", color: "#000", boxShadow: "0 1px 0 rgba(0,0,0,0.35)", cursor: "pointer", userSelect: "none" };
                    const keyGrey = { ...keyWhite, background: "#AEB3BE", fontSize: "var(--font-size-3)" };
                    const Row = ({ children, style }) => <div onMouseDown={e => e.preventDefault()} style={{ display: "flex", gap: 5, padding: "0 3px", marginBottom: 11, ...style }}>{children}</div>;
                    const K = ({ label, style = keyWhite, flex = 1 }) => <div style={{ ...style, flex }}>{label}</div>;
                    return (
                      <div key="compose-keyboard" onMouseDown={e => e.preventDefault()} style={{ background: kbBg, paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
                        <Row>{["Q","W","E","R","T","Y","U","I","O","P"].map(k => <K key={k} label={k} />)}</Row>
                        <Row style={{ paddingLeft: 18, paddingRight: 18 }}>{["A","S","D","F","G","H","J","K","L"].map(k => <K key={k} label={k} />)}</Row>
                        <Row>
                          <K label="⇧" style={keyGrey} flex={1.4} />
                          {["Z","X","C","V","B","N","M"].map(k => <K key={k} label={k} />)}
                          <K label="⌫" style={{ ...keyGrey, fontSize: "var(--font-size-5)" }} flex={1.4} />
                        </Row>
                        <Row style={{ marginBottom: 0 }}>
                          <K label="123" style={{ ...keyGrey, fontSize: "var(--font-size-4)" }} flex={1.5} />
                          <K label="🌐" style={{ ...keyGrey, fontSize: "var(--font-size-5)" }} flex={1} />
                          <K label="space" style={{ ...keyWhite, fontSize: "var(--font-size-4)" }} flex={5} />
                          <K label="return" style={{ ...keyGrey, fontSize: "var(--font-size-4)" }} flex={2} />
                        </Row>
                      </div>
                    );
                  })()}
                </div>
              );
            }

            // List view
            return (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, position: "relative" }}>
                {/* Header */}
                <div style={{ padding: "12px 16px 0", background: "#fff", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    {!isSingleSchool && (
                      <button onClick={() => { setMessagesSchool(null); setMessagesFilter("inbox"); setShowCompose(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    )}
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#222", flex: 1 }}>{activeSchool}</span>
                  </div>
                  {/* Inbox/Sent pill filters — only show Sent if there are sent messages */}
                  {(sentMessages.length > 0) && <div style={{ display: "flex", gap: 8, paddingBottom: 12, boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
                    {[
                      { id: "inbox", label: "Inbox" },
                      { id: "sent", label: "Sent" },
                    ].map(f => {
                      const isActive = messagesFilter === f.id;
                      const badgeCount = f.id === "inbox" ? unreadCount : 0;
                      return (
                        <button key={f.id} onClick={() => setMessagesFilter(f.id)} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "6px 14px", borderRadius: "var(--radius-round)",
                          border: isActive ? "1px solid #0e8a0e" : "1px solid #ddd",
                          background: isActive ? "#F0FAF3" : "#fff",
                          cursor: "pointer", fontFamily: "var(--font-family-sans)",
                          fontSize: "var(--font-size-3)", fontWeight: 600,
                          color: isActive ? "#005700" : "#595959",
                        }}>
                          {f.label}
                          {badgeCount > 0 && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: 18, height: 18, borderRadius: "50%",
                              background: "#0e8a0e", color: "#fff",
                              fontSize: 10, fontWeight: 700, padding: "0 4px",
                            }}>{badgeCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>}
                </div>
                {/* Message list */}
                <div ref={msgListRef} onScroll={e => setMsgListScrolled(e.currentTarget.scrollTop > 10)} style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#fff" }}>
                  {messages.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: 12, opacity: 0.3 }}>
                        <rect x="4" y="8" width="32" height="24" rx="3" stroke="#888" strokeWidth="2" />
                        <path d="M4 12L20 24L36 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#888", marginBottom: 4 }}>No {messagesFilter === "inbox" ? "inbox" : "sent"} messages</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "#bbb" }}>{messagesFilter === "inbox" ? "Messages from this school will appear here" : "Messages you send to this school will appear here"}</div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isUnread = messagesFilter === "inbox" && !readMessages.has(msg.id);
                      return (
                        <button key={msg.id} onClick={() => { setSelectedMessage(msg); setShowOriginal(false); setReplyText(""); setReplyError(false); if (messagesFilter === "inbox") setReadMessages(prev => new Set([...prev, msg.id])); }} style={{ display: "flex", gap: 12, padding: "14px 16px", width: "100%", background: isUnread ? "#F0FAF3" : "#fff", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                          {/* Unread dot */}
                          <div style={{ width: 8, flexShrink: 0, paddingTop: 6 }}>
                            {isUnread && <div style={{ width: 8, height: 8, borderRadius: 4, background: "var(--color-brand-600)" }} />}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, marginRight: 8 }}>
                                {(msg.hasReply || (threadReplies[msg.id] && threadReplies[msg.id].length > 0)) && (
                                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}><path d="M4 3L1 6L4 9" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 6H8C10 6 11 7 11 9" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                                <span style={{ fontSize: "var(--font-size-3)", fontWeight: isUnread ? 700 : 500, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</span>
                              </div>
                              <span style={{ fontSize: "var(--font-size-1)", color: "#999", flexShrink: 0 }}>{formatMessageDate(msg.date, msg.time)}</span>
                            </div>
                            <div style={{ fontSize: "var(--font-size-3)", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.preview}</div>
                          </div>
                          {/* Arrow */}
                          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* FAB — compose */}
                {repliesEnabledSchools.includes(activeSchool) && (
                  <button
                    onClick={() => { setShowCompose(true); setComposeSchool(activeSchool); setComposeSubject(""); setComposeBody(""); setComposeErrors({}); setComposeFocused(true); }}
                    style={{
                      position: "absolute", bottom: 20, right: 16,
                      height: 48,
                      width: msgListScrolled ? 48 : "auto",
                      paddingLeft: msgListScrolled ? 0 : 20,
                      paddingRight: msgListScrolled ? 0 : 24,
                      borderRadius: 99,
                      background: "var(--color-brand-600)", border: "none",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: msgListScrolled ? 0 : 8,
                      boxShadow: "0 4px 12px rgba(60,173,81,0.4)",
                      overflow: "hidden",
                      transition: "width 0.2s ease, border-radius 0.2s ease, padding 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M11.5 2.5L13.5 4.5L5.5 12.5L2.5 13.5L3.5 10.5L11.5 2.5Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
                      <path d="M10 4L12 6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    {!msgListScrolled && (
                      <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#fff" }}>Compose</span>
                    )}
                  </button>
                )}
              </div>
            );
          })()}

          {/* Consents page */}
          {!subPage && activeTab === "my-child" && myChildPage === "consents" && (() => {
            const activeChild = consentPageChild;
            const childNoticesAll = allNotices.filter(n => n.child === activeChild.name);
            const childNoticesPending = childNoticesAll.filter(n => !consentDecisions[n.id]);
            const childNoticesResponded = childNoticesAll.filter(n => consentDecisions[n.id]);
            return (
              <div style={{ background: "var(--color-bg-secondary)", minHeight: "100%", display: "flex", flexDirection: "column" }}>
                {/* Pattern C nav header */}
                <div style={{ background: "var(--color-bg-primary)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 0" }}>
                    <button onClick={() => setMyChildPage(null)} style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="var(--color-text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>Consents</span>
                  </div>
                  {/* Child pill filters */}
                  <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto" }}>
                    {children.map(child => {
                      const isActive = activeChild.id === child.id;
                      const noticeCount = allNotices.filter(n => n.child === child.name && !consentDecisions[n.id]).length;
                      return (
                        <button key={child.id} onClick={() => setConsentPageChild(child)} className="btn-pill" style={{
                          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                          padding: "6px 14px", borderRadius: 20,
                          border: isActive ? "1.5px solid var(--color-brand-600)" : "1.5px solid var(--color-border-default)",
                          background: isActive ? "var(--color-brand-600)" : "var(--color-bg-primary)",
                          cursor: "pointer", fontFamily: "inherit",
                          fontSize: "var(--font-size-3)", fontWeight: 600,
                          color: isActive ? "#fff" : "var(--color-text-secondary)",
                        }}>
                          {child.name}
                          {noticeCount > 0 && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: 16, borderRadius: 99,
                              background: isActive ? "#fff" : "#ef6c00",
                              color: isActive ? "var(--color-brand-600)" : "#fff",
                              fontSize: 9, fontWeight: 700, lineHeight: 1, padding: "3px 5px",
                            }}>{noticeCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px", minHeight: 0 }}>
                  {/* All-responded toast */}
                  {consentToast === activeChild.name && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 12, background: "#F0FAF3", border: "1.5px solid var(--color-brand-600)", marginBottom: 12, opacity: consentToastFading ? 0 : 1, transition: "opacity 0.4s" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="8.5" stroke="var(--color-brand-600)" strokeWidth="1.5" fill="none" /><path d="M6.5 10L9 12.5L13.5 7.5" stroke="var(--color-brand-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#1a5c2a" }}>All consents responded to</span>
                    </div>
                  )}
                  {/* Pending consent cards */}
                  {childNoticesPending.length > 0 && (() => {
                    const visibleConsents = showAllConsents[activeChild.id] ? childNoticesPending : childNoticesPending.slice(0, 3);
                    const hiddenCount = childNoticesPending.length - 3;
                    return (
                      <div style={{ marginBottom: 20 }}>
                        {visibleConsents.map(notice => {
                          const fading = fadingConsents[notice.id];
                          const pending = consentPendingAction[notice.id];
                          const detailOpen = consentDetailOpen[notice.id] || false;
                          const isLast = childNoticesPending.length === 1;
                          const handleSubmit = () => {
                            setFadingConsents(prev => ({ ...prev, [notice.id]: true }));
                            setTimeout(() => {
                              setConsentDecisions(prev => ({ ...prev, [notice.id]: { decision: pending, note: consentNotes[notice.id] || "", date: "5 Mar 2026" } }));
                              setConsentPendingAction(prev => { const n = { ...prev }; delete n[notice.id]; return n; });
                              setConsentNotes(prev => { const n = { ...prev }; delete n[notice.id]; return n; });
                              setFadingConsents(prev => { const n = { ...prev }; delete n[notice.id]; return n; });
                              if (isLast) {
                                setConsentToast(activeChild.name);
                                setTimeout(() => { setConsentToastFading(true); setTimeout(() => { setConsentToast(null); setConsentToastFading(false); }, 400); }, 3500);
                              }
                            }, 520);
                          };
                          return (
                            <div key={notice.id} style={{ marginBottom: 12, opacity: fading ? 0 : 1, maxHeight: fading ? 0 : 600, overflow: "hidden", transition: "opacity 0.22s, max-height 0.3s 0.22s" }}>
                              <Card padding="none" style={{ borderLeft: "3px solid #e67e22", overflow: "hidden" }}>
                                <div style={{ padding: "14px 16px 0" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <Tag variant="warning">{notice.type}</Tag>
                                    <span style={{ fontSize: "var(--font-size-1)", color: "#999" }}>Sent {notice.date}</span>
                                  </div>
                                  <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 8 }}>{notice.title}</div>
                                  <button onClick={() => setConsentDetailOpen(prev => ({ ...prev, [notice.id]: !prev[notice.id] }))} style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888", padding: 0, display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: detailOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M3 5L6 8L9 5" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    {detailOpen ? "Hide details" : "View details"}
                                  </button>
                                  {detailOpen && <div style={{ fontSize: "var(--font-size-3)", color: "#555", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 14, padding: "12px", background: "#fafafa", borderRadius: 8, border: "1px solid #f0f0f0" }}>{notice.description}</div>}
                                </div>
                                {!pending ? (
                                  <div style={{ display: "flex", borderTop: "1px solid #f0f0f0" }}>
                                    <button onClick={() => setConsentPendingAction(prev => ({ ...prev, [notice.id]: "given" }))} style={{ flex: 1, padding: "12px", border: "none", borderRight: "1px solid #f0f0f0", background: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="var(--color-brand-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-brand-600)" }}>Give consent</span>
                                    </button>
                                    <button onClick={() => setConsentPendingAction(prev => ({ ...prev, [notice.id]: "declined" }))} style={{ flex: 1, padding: "12px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="#cc3333" strokeWidth="2" strokeLinecap="round" /></svg>
                                      <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#cc3333" }}>Decline</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ padding: "12px 16px 14px", borderTop: "1px solid #f0f0f0" }}>
                                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888", marginBottom: 8 }}>Add a note (optional)</div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                      <div style={{ flex: 1 }}>
                                        <Input type="text" value={consentNotes[notice.id] || ""} onChange={(e) => setConsentNotes(prev => ({ ...prev, [notice.id]: e.target.value }))} placeholder="Optional note..." style={{ width: "100%" }} />
                                      </div>
                                      <Button variant={pending === "given" ? "primary" : "destructive"} size="small" onClick={handleSubmit} style={{ flexShrink: 0 }}>Submit</Button>
                                    </div>
                                    <Button variant="ghost" size="small" onClick={() => setConsentPendingAction(prev => { const n = { ...prev }; delete n[notice.id]; return n; })} style={{ padding: "8px 0 0" }}>Back</Button>
                                  </div>
                                )}
                              </Card>
                            </div>
                          );
                        })}
                        {childNoticesPending.length > 3 && (
                          <button onClick={() => setShowAllConsents(prev => ({ ...prev, [activeChild.id]: !prev[activeChild.id] }))} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888" }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: showAllConsents[activeChild.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M3 5L7 9L11 5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {showAllConsents[activeChild.id] ? "Show fewer" : `View ${hiddenCount} more consent${hiddenCount > 1 ? "s" : ""}`}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                  {/* Empty state */}
                  {childNoticesPending.length === 0 && consentToast !== activeChild.name && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <ClipboardList size={24} color="var(--color-brand-600)" strokeWidth={1.5} />
                      </div>
                      <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 6 }}>No pending consents</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>Nothing needs a response from you right now.</div>
                    </div>
                  )}
                  {/* Past consents */}
                  {childNoticesResponded.length > 0 && (() => {
                    const sortedResponded = [...childNoticesResponded].sort((a, b) => new Date(consentDecisions[b.id].date) - new Date(consentDecisions[a.id].date));
                    const isExpanded = pastConsentsExpanded[activeChild.id];
                    return (
                      <div>
                        <button onClick={() => setPastConsentsExpanded(prev => ({ ...prev, [activeChild.id]: !prev[activeChild.id] }))} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", background: "none", border: "none", cursor: "pointer", marginBottom: isExpanded ? 10 : 0 }}>
                          <span style={{ fontSize: "var(--font-size-1)", fontWeight: 700, color: "var(--color-grey-700)", textTransform: "uppercase", letterSpacing: 0.5 }}>Past consents ({childNoticesResponded.length})</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="M4 6L8 10L12 6" stroke="#aaa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <div style={{ maxHeight: isExpanded ? 2000 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                          {sortedResponded.map(notice => {
                            const d = consentDecisions[notice.id];
                            const isGiven = d.decision === "given";
                            return (
                              <Card key={notice.id} padding="none" style={{ marginBottom: 10 }}>
                                <div style={{ padding: "14px 16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)", flex: 1, marginRight: 8 }}>{notice.title}</div>
                                    <span style={{ padding: "3px 10px", borderRadius: 6, background: isGiven ? "#e8f5e9" : "#fce4ec", color: isGiven ? "#4caf50" : "#c62828", fontSize: "var(--font-size-1)", fontWeight: 700, flexShrink: 0 }}>{isGiven ? "Given" : "Declined"}</span>
                                  </div>
                                  <div style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Responded {d.date}</div>
                                  {d.note && <div style={{ fontSize: "var(--font-size-3)", color: "#888", marginTop: 6, fontStyle: "italic" }}>Note: {d.note}</div>}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })()}

          {!subPage && activeTab === "my-child" && myChildPage === "absences" && (
            <div style={{ background: "var(--color-bg-secondary)", minHeight: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--color-bg-primary)" }}>
                <button
                  onClick={() => setMyChildPage(null)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="var(--color-text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "var(--color-text-primary)" }}>Absences</span>
              </div>
              <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                <Card padding="medium">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", marginBottom: 6 }}>{selectedChild.name} won't be in?</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", lineHeight: "var(--font-line-height-normal)" }}>
                      Keep {selectedChild.school} updated about {selectedChild.name}'s attendance.
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => { resetAbsenceForm(); setMyChildPage("absence-form"); }}
                    style={{ width: "100%" }}
                  >
                    Notify the school
                  </Button>
                </Card>

                <Card padding="none">
                  <div style={{ padding: "14px 16px 10px", fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>History</div>
                  <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />
                  {[
                    { date: "Thu 24 Apr",              time: "08:50 - 15:15", reason: "Illness", status: "pending"  },
                    { date: "Thu 24 Apr - Fri 25 Apr", time: "08:50 - 12:15", reason: "Illness", status: "approved" },
                    { date: "Mon 21 Dec 2025",         time: "08:50 - 10:00", reason: "Illness", status: "approved" },
                  ].map((item, i) => (
                    <div key={i}>
                      {i > 0 && <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 16px", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", marginBottom: 2 }}>{item.date}</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginBottom: 2 }}>{item.time}</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)" }}>{item.reason}</div>
                        </div>
                        {item.status === "pending"
                          ? <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: "var(--font-size-3)", fontWeight: 600, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A", whiteSpace: "nowrap" }}>Awaiting review</span>
                          : <Tag variant="neutral">Recorded</Tag>
                        }
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {!subPage && activeTab === "my-child" && !myChildPage && (
            <div style={{ background: "var(--color-bg-secondary)", minHeight: "100%", padding: "20px 0 32px", display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Absences */}
              <div>
                <div style={{ padding: "0 16px" }}>
                  <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setMyChildPage("absences")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CalendarX size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Absences</div>
                      </div>
                      <ChevronRight size={16} color="var(--color-grey-900)" strokeWidth={1.5} />
                    </div>
                  </Card>
                </div>
              </div>
              {/* Consents */}
              <div>
                <div style={{ padding: "0 16px" }}>
                  {(() => {
                    const totalPending = allNotices.filter(n => !consentDecisions[n.id]).length;
                    return (
                      <Card padding="none" style={{ cursor: "pointer" }} onClick={() => { setConsentPageChild(children[0]); setMyChildPage("consents"); }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ClipboardList size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "var(--font-size-4)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Consents</div>
                          </div>
                          {totalPending > 0 && (
                            <div style={{ minWidth: 20, height: 20, borderRadius: 10, background: "#ef6c00", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", marginRight: 4 }}>{totalPending}</div>
                          )}
                          <ChevronRight size={16} color="var(--color-grey-900)" strokeWidth={1.5} />
                        </div>
                      </Card>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {!selectedMessage && !showCompose && (!myChildPage || myChildPage === "absences" || myChildPage === "consents") && !(subPage === "my-bookings" && selectedUpcomingItem?.paymentModel) && (
          <BottomNavBar activeTab={subPage ? "book-pay" : activeTab} onTabChange={(tab) => { setSubPage(null); setSelectedMessage(null); setMessagesSchool(null); setShowCompose(false); if ((tab === "my-child" || tab === "book-pay") && allChildren) setAllChildren(false); setActiveTab(tab); }} badges={{ messages: unreadCount, "book-pay": bookingsNeedsAttentionCount > 0 ? { count: bookingsNeedsAttentionCount, variant: "warning" } : basketCount }} />
        )}

        {/* Home indicator */}
        <div
          style={{
            height: isMobile ? 0 : 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-white)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 134,
              height: 5,
              background: "#ddd",
              borderRadius: 3,
            }}
          />
        </div>

        {/* Standalone top-up sheet */}
        {showStandaloneTopUp && (
          <div onClick={() => { setShowStandaloneTopUp(false); setStandaloneTopUpSuccess(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 90, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", minHeight: 520, maxHeight: "85%", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "4px 4px 8px", flexShrink: 0 }}>
                <button onClick={() => { setShowStandaloneTopUp(false); setStandaloneTopUpSuccess(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>

              {!standaloneTopUpSuccess && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 8px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
                        {selectedChild.name}'s {standaloneTopUpAccount === "meals" ? "Meals" : standaloneTopUpAccount === "milk" ? "Milk" : "Wraparound"}
                      </div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", marginTop: 4 }}>
                        Current balance · £{(standaloneTopUpAccount === "meals" ? mealsBalance : standaloneTopUpAccount === "milk" ? 8.50 : wraparoundBalance).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 12 }}>
                      <button onClick={() => { if (topUpAmount <= 2) flashTopUpMinError(); else setTopUpAmount(topUpAmount - 1); }} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>−</button>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 2, border: `1px solid ${(topUpAmount < 2 || topUpMinFlash) ? "var(--color-destructive-500)" : "var(--color-border-default)"}`, borderRadius: 8, padding: "6px 20px", background: "var(--color-white)", transition: "border-color 0.15s ease" }}>
                        <span style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1 }}>£</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={topUpAmount}
                          onChange={(e) => { const v = parseInt(e.target.value) || 0; setTopUpAmount(Math.max(0, v)); }}
                          style={{ fontSize: 40, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", letterSpacing: -1, border: "none", outline: "none", background: "transparent", width: `${String(topUpAmount).length * 28}px`, textAlign: "left", fontFamily: "inherit", MozAppearance: "textfield", WebkitAppearance: "none" }}
                        />
                      </div>
                      <button onClick={() => setTopUpAmount(topUpAmount + 1)} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--color-border-default)", background: "var(--color-bg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)", fontSize: 22, fontWeight: 300, flexShrink: 0, fontFamily: "inherit" }}>+</button>
                    </div>
                    <div style={{ height: 22, textAlign: "center", marginBottom: 24 }}>
                      {(topUpAmount < 2 || topUpMinFlash) && (
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-destructive)" }}>Minimum top-up is £2</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      {[5, 10, 20].map((inc) => (
                        <button key={inc} onClick={() => setTopUpAmount(topUpAmount + inc)} className="btn-pill" style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid var(--color-border-default)", background: "var(--color-white)", fontSize: "var(--font-size-3)", fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer", fontFamily: "inherit" }}>
                          +£{inc}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "12px 16px 28px", flexShrink: 0, background: "var(--color-white)", display: "flex", flexDirection: "column", gap: 10 }}>
                    <button onClick={() => { if (topUpAmount < 2) { setTopUpAmount(2); return; } setShowStandaloneTopUpStripeSheet(true); }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {topUpAmount < 2 ? "Top up minimum £2" : `Top up £${topUpAmount}.00 now`}
                    </button>
                    <button onClick={() => { if (topUpAmount < 2) setTopUpAmount(2); setStandaloneTopUpAddedToBasket(true); setTimeout(() => { setStandaloneTopUpAddedToBasket(false); setShowStandaloneTopUp(false); }, 1500); }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "1px solid var(--color-border-default)", background: "var(--color-white)", color: "var(--color-text-primary)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Add to basket
                    </button>
                  </div>
                </>
              )}
              {standaloneTopUpSuccess && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 24px 8px" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}>
                      <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                        <path d="M10 18L16 24L26 12" stroke="var(--color-success-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h1 style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 24px", textAlign: "center" }}>Top-up successful</h1>
                    <div style={{ background: "var(--color-bg-secondary)", borderRadius: 12, padding: 20, width: "100%", border: "1px solid var(--color-grey-100)", textAlign: "center" }}>
                      <div style={{ fontSize: "var(--font-size-8)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: -1, lineHeight: 1, marginBottom: 10 }}>£{topUpAmount}.00</div>
                      <div style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-secondary)", marginBottom: 20, textWrap: "balance" }}>
                        Added to {standaloneTopUpAccount === "meals" ? "Meals" : standaloneTopUpAccount === "milk" ? "Milk" : "Wraparound"} for Molly
                      </div>
                      <div style={{ height: 1, background: "var(--color-grey-100)", marginBottom: 16 }} />
                      <div style={{ fontSize: "var(--font-size-4)", color: "var(--color-text-tertiary)" }}>
                        New balance · <span style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>£{(standaloneTopUpAccount === "meals" ? mealsBalance : standaloneTopUpAccount === "milk" ? 8.50 : wraparoundBalance).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "12px 16px 28px", flexShrink: 0, background: "var(--color-white)" }}>
                    <button onClick={() => { setShowStandaloneTopUp(false); setStandaloneTopUpSuccess(false); setTxHistoryAccount(standaloneTopUpAccount); setSubPage("tx-history"); }} style={{ width: "100%", padding: "14px", borderRadius: 28, border: "none", background: "var(--color-brand-600)", color: "var(--color-white)", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      View transaction history
                    </button>
                  </div>
                </>
              )}
            </div>
            {showStandaloneTopUpStripeSheet && (
              <div onClick={() => setShowStandaloneTopUpStripeSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 10 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-white)", borderRadius: "20px 20px 0 0", paddingBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
                    <button onClick={() => setShowStandaloneTopUpStripeSheet(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-bg-secondary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 2L2 10" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 4px" }}>
                    <button onClick={() => { setShowStandaloneTopUpStripeSheet(false); setShowStandaloneTopUpApplePay(true); setTimeout(() => { if (standaloneTopUpAccount === "wraparound") setToppedUpAmount(prev => prev + topUpAmount); else if (standaloneTopUpAccount === "meals") setMealsTopUpAmount(prev => prev + topUpAmount); setDynamicTransactions(prev => ({ ...prev, [standaloneTopUpAccount]: [{ date: "29 Apr", month: "April 2026", description: "Top-up", amount: topUpAmount, paidBy: "you" }, ...(prev[standaloneTopUpAccount] || [])] })); setShowStandaloneTopUpApplePay(false); setStandaloneTopUpSuccess(true); }, 4500); }} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#000", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, fontFamily: "inherit" }}>
                      <svg width="16" height="19" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)"/><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)"/></svg>
                      <span>Pay</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Or pay using</span>
                      <div style={{ flex: 1, height: 1, background: "var(--color-border-default)" }} />
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>Saved</div>
                    <div style={{ border: "2px solid #5469d4", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#eb001b", marginRight: -7, zIndex: 1 }} />
                        <div style={{ width: 20, height: 13, borderRadius: "50%", background: "#f79e1b" }} />
                      </div>
                      <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1 }}>···· 7492</span>
                      <span style={{ fontSize: "var(--font-size-3)", color: "#5469d4" }}>View more ›</span>
                    </div>
                    <div style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBottom: 8 }}>New payment method</div>
                    <div style={{ border: "1px solid var(--color-border-default)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                        <div style={{ width: 34, height: 24, borderRadius: 4, background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none"><rect x="0.5" y="0.5" width="17" height="12" rx="1.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/><path d="M0.5 4H17.5" stroke="var(--color-icon-default)" strokeWidth="1.1"/></svg>
                        </div>
                        <span style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", flex: 1, textAlign: "left" }}>New card</span>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none"><path d="M1 1L7 6.5L1 12" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <button onClick={() => { if (standaloneTopUpAccount === "wraparound") setToppedUpAmount(prev => prev + topUpAmount); else if (standaloneTopUpAccount === "meals") setMealsTopUpAmount(prev => prev + topUpAmount); setDynamicTransactions(prev => ({ ...prev, [standaloneTopUpAccount]: [{ date: "29 Apr", month: "April 2026", description: "Top-up", amount: topUpAmount, paidBy: "you" }, ...(prev[standaloneTopUpAccount] || [])] })); setShowStandaloneTopUpStripeSheet(false); setStandaloneTopUpSuccess(true); }} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "#5469d4", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span>Top up £{topUpAmount}.00</span>
                      <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2.5 6.5V4.5C2.5 2.57 4.07 1 6 1C7.93 1 9.5 2.57 9.5 4.5V6.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="6.5" width="11" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="6.5" cy="10.5" r="1.2" fill="#5469d4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showStandaloneTopUpApplePay && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 30 }}>
                <div style={{ background: "#1c1c1e", borderRadius: "16px 16px 0 0", padding: "20px 20px 30px", color: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <button onClick={() => setShowStandaloneTopUpApplePay(false)} style={{ background: "none", border: "none", color: "#0a84ff", fontSize: "var(--font-size-4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <svg width="16" height="20" viewBox="0 0 20 24" fill="none"><path d="M14.5 0.8C13.4 2.1 11.7 3.1 10.3 3C10.1 1.6 10.8 0.1 11.8 -0.6C12.9 -1.4 14.4 -1.8 15 -0.2C14.9 0 14.7 0.4 14.5 0.8Z" fill="#fff" transform="translate(0,4)" /><path d="M15 4.5C13.3 4.4 11.8 5.4 11 5.4C10.1 5.4 8.8 4.5 7.4 4.6C5.6 4.6 3.9 5.6 3 7.2C1.1 10.4 2.5 15.2 4.3 17.8C5.2 19.1 6.3 20.5 7.7 20.4C9 20.4 9.5 19.6 11.1 19.6C12.7 19.6 13.2 20.4 14.5 20.4C15.9 20.4 16.9 19.1 17.8 17.8C18.4 16.9 18.9 15.9 19.2 14.8C16.7 13.8 16 10.4 18.4 8.8C17.5 6.3 15.8 4.6 15 4.5Z" fill="#fff" transform="translate(-2,2) scale(0.85)" /></svg>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginBottom: 4 }}>ARBOR EDUCATION</div>
                    <div style={{ fontSize: "var(--font-size-7)", fontWeight: 700, color: "#fff" }}>£{topUpAmount}.00</div>
                  </div>
                  <div style={{ background: "#2c2c2e", borderRadius: 12, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #434343, #666)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>VISA</span></div>
                      <div><div style={{ fontSize: "var(--font-size-3)", color: "#fff" }}>Visa ···· 4289</div><div style={{ fontSize: "var(--font-size-1)", color: "#888" }}>Kate Burns</div></div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M20 2V6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M14 2V8" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M9 18C9 18 11 21 14 21C17 21 19 18 19 18" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M2 8H6" stroke="#999" strokeWidth="2" strokeLinecap="round" /><path d="M22 8H26" stroke="#999" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontSize: "var(--font-size-3)", color: "#999" }}>Confirm with Face ID</span>
                  </div>
                </div>
              </div>
            )}

            {standaloneTopUpAddedToBasket && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", pointerEvents: "none", zIndex: 40, paddingBottom: 100 }}>
                <div style={{ width: "100%", padding: "0 16px" }}>
                  <div style={{ background: "var(--color-text-primary)", color: "var(--color-white)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: "var(--font-size-3)", fontWeight: 600 }}>Added to basket</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile full sheet */}
        {showProfile && (
          <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
            {/* Backdrop */}
            <div onClick={() => { if (!profileScreen) { setShowProfile(false); setProfileChild(null); setProfileScreen(null); } }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
            {/* Sheet */}
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              top: (!profileScreen) ? "auto" : 40,
              maxHeight: (!profileScreen) ? "50%" : undefined,
              zIndex: 1,
              background: "#fff", borderRadius: "20px 20px 0 0",
              display: "flex", flexDirection: "column",
              transition: "max-height 0.25s ease",
            }}>
              {/* Handle bar */}
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px", flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#ddd" }} />
              </div>

              {/* Screen routing */}
              {profileScreen === "security" ? (() => {
                const strength = getPasswordStrength(newPassword);

                const EyeIcon = ({ show, onToggle }) => (
                  <button onClick={onToggle} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                    {show ? (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z" stroke="#888" strokeWidth="1.3" /><circle cx="9" cy="9" r="2.5" stroke="#888" strokeWidth="1.3" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z" stroke="#bbb" strokeWidth="1.3" /><circle cx="9" cy="9" r="2.5" stroke="#bbb" strokeWidth="1.3" /><path d="M3 15L15 3" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    )}
                  </button>
                );

                const handleChangePassword = () => {
                  if (!currentPassword) { setPwError("Please enter your current password"); return; }
                  if (!newPassword) { setPwError("Please enter a new password"); return; }
                  if (newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
                  if (newPassword !== confirmPassword) { setPwError("Passwords do not match"); return; }
                  setPwError("");
                  setPwSaving(true);
                  setTimeout(() => {
                    setPwSaving(false);
                    setSecurityView("password-done");
                  }, 1200);
                };

                return (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                      <button onClick={() => {
                        if (securityView === "change-password") { setSecurityView("overview"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPwError(""); }
                        else if (securityView === "password-done") { setSecurityView("overview"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
                        else { setProfileScreen("account-settings"); }
                      }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>{securityView === "change-password" ? "Change password" : securityView === "password-done" ? "Password changed" : "Login & security"}</span>
                    </div>

                    {/* Password changed confirmation */}
                    {securityView === "password-done" ? (
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14L12 19L21 9" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "#222", marginBottom: 8 }}>Password updated</div>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#888", lineHeight: 1.5 }}>Your password has been changed successfully. Use your new password next time you log in.</div>
                        <Button variant="primary" onClick={() => { setSecurityView("overview"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }} style={{ marginTop: 24 }}>Done</Button>
                      </div>
                    )

                    /* Change password form */
                    : securityView === "change-password" ? (
                      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", minHeight: 0, background: "#fff" }}>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#888", marginBottom: 20, lineHeight: 1.4 }}>Enter your current password to verify your identity, then choose a new password.</div>

                        {/* Current password */}
                        <div style={{ marginBottom: 18 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888", marginBottom: 6 }}>Current password</div>
                          <div style={{ position: "relative" }}>
                            <Input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPwError(""); }} placeholder="Enter current password" autoComplete="current-password" style={{ width: "100%" }} />
                            <EyeIcon show={showCurrentPw} onToggle={() => setShowCurrentPw(p => !p)} />
                          </div>
                        </div>

                        {/* New password */}
                        <div style={{ marginBottom: 6 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888", marginBottom: 6 }}>New password</div>
                          <div style={{ position: "relative" }}>
                            <Input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwError(""); }} placeholder="Enter new password" autoComplete="new-password" style={{ width: "100%" }} />
                            <EyeIcon show={showNewPw} onToggle={() => setShowNewPw(p => !p)} />
                          </div>
                        </div>

                        {/* Strength indicator */}
                        {newPassword && (
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ height: 4, borderRadius: 2, background: "#eee", marginBottom: 4, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
                            </div>
                            <div style={{ fontSize: "var(--font-size-1)", color: strength.color, fontWeight: 600 }}>{strength.label}</div>
                          </div>
                        )}
                        {!newPassword && <div style={{ height: 18 }} />}

                        {/* Confirm password */}
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#888", marginBottom: 6 }}>Confirm new password</div>
                          <div style={{ position: "relative" }}>
                            <Input type={showConfirmPw ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPwError(""); }} placeholder="Re-enter new password" autoComplete="new-password" state={confirmPassword && confirmPassword !== newPassword ? "error" : "default"} error={confirmPassword && confirmPassword !== newPassword ? "Passwords do not match" : undefined} style={{ width: "100%" }} />
                            <EyeIcon show={showConfirmPw} onToggle={() => setShowConfirmPw(p => !p)} />
                          </div>
                        </div>

                        {/* Error */}
                        {pwError && <div style={{ fontSize: "var(--font-size-3)", color: "#c44", marginBottom: 16, padding: "10px 14px", background: "#fef2f2", borderRadius: 10 }}>{pwError}</div>}

                        {/* Submit */}
                        <Button variant="primary" onClick={handleChangePassword} disabled={pwSaving} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {pwSaving ? <><div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Saving</> : "Update password"}
                        </Button>

                        <div style={{ fontSize: "var(--font-size-3)", color: "#bbb", marginTop: 16, lineHeight: 1.4 }}>Your password does not expire. Choose something memorable and unique to this account.</div>
                      </div>
                    )

                    /* Security overview */
                    : (
                      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                        <Card padding="none">
                          <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke="#888" strokeWidth="1.3" /><path d="M7 9V6C7 4.3 8.3 3 10 3C11.7 3 13 4.3 13 6V9" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /></svg>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#333" }}>Password</div>
                                <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Last changed 3 months ago</div>
                              </div>
                            </div>
                            <Button variant="secondary" onClick={() => { setSecurityView("change-password"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPwError(""); setShowCurrentPw(false); setShowNewPw(false); setShowConfirmPw(false); }} style={{ width: "100%" }}>Change password</Button>
                          </div>
                        </Card>

                        <Card padding="none">
                          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7 3C4.2 4.5 3 7.5 3 11C3 14.5 4.2 17.5 7 19" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /><path d="M15 3C17.8 4.5 19 7.5 19 11C19 14.5 17.8 17.5 15 19" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /><path d="M9 6C7.5 7 7 9 7 11C7 13 7.5 15 9 16" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /><path d="M13 6C14.5 7 15 9 15 11C15 13 14.5 15 13 16" stroke="#888" strokeWidth="1.3" strokeLinecap="round" /><circle cx="11" cy="11" r="1.5" fill="#888" /></svg>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#333" }}>Face ID</div>
                              <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Use Face ID to log in to the app</div>
                            </div>
                            <Toggle checked={biometricsEnabled} onChange={() => { setShowBiometricPrompt(true); setTimeout(() => { setShowBiometricPrompt(false); setBiometricsEnabled(p => !p); }, 1000); }} />
                          </div>
                        </Card>
                        {showBiometricPrompt && (
                          <div style={{ padding: "12px 16px", background: "#f0f4ff", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 16, height: 16, border: "2px solid #666", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                            <span style={{ fontSize: "var(--font-size-3)", color: "#555" }}>Verifying with Face ID...</span>
                          </div>
                        )}

                        <Card padding="none">
                          <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" stroke="#888" strokeWidth="1.3" /><path d="M7 10L9 12L13 8" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#333" }}>2FA</div>
                              </div>
                              <Tag variant="neutral">Not set up</Tag>
                            </div>
                            <div style={{ fontSize: "var(--font-size-3)", color: "#999", lineHeight: 1.4, marginBottom: 12 }}>Add an extra layer of security to your account by requiring a verification code when you log in.</div>
                            <Button variant="secondary" style={{ width: "100%" }}>Set up 2FA</Button>
                          </div>
                        </Card>

                        <div style={{ fontSize: "var(--font-size-3)", color: "#bbb", lineHeight: 1.4 }}>Security changes apply across all your schools and children on this account.</div>
                      </div>
                    )}
                  </div>
                );
              })()

              /* === ACCOUNT & SETTINGS SCREEN (combined) === */
              : profileScreen === "account-settings" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen(null)} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Account & settings</span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("your-details")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <CircleUserRound size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Your details</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Name, email, phone & address</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => { setProfileScreen("security"); setSecurityView("overview"); }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Lock size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Login & security</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Password, Face ID & 2FA</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("notifications")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Bell size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Notifications</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Messages, payments, meals & attendance</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("help")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Info size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Help & about</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>FAQs, app version, terms & privacy</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                  </div>
                </div>
              )

              /* === YOUR DETAILS SCREEN === */
              : profileScreen === "your-details" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen("account-settings")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Your details</span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff" }}>
                    {[
                      { label: "Full name", value: "Kate Collini" },
                      { label: "Email", value: "kate.collini@email.com" },
                      { label: "Phone", value: "07700 900123" },
                      { label: "Address", value: "14 Oakfield Road\nSurbiton, KT6 4AA" },
                      { label: "Relationship to children", value: "Mother" },
                    ].map((field, i) => (
                      <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: "var(--font-size-1)", fontWeight: 600, color: "#999", marginBottom: 4 }}>{field.label}</div>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#333", whiteSpace: "pre-line" }}>{field.value}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: "var(--font-size-3)", color: "#bbb", marginTop: 16, lineHeight: 1.4 }}>To update your contact details, please contact the school office.</div>
                  </div>
                </div>
              )

              /* === NOTIFICATIONS SCREEN === */
              : profileScreen === "notifications" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen("account-settings")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Push notifications</span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff" }}>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#888", marginBottom: 16, lineHeight: 1.4 }}>Choose which notifications you receive on this device. These settings apply across all your children and schools.</div>
                    {[
                      { id: "messages", label: "Messages", desc: "New messages and replies from school" },
                      { id: "payments", label: "Payments", desc: "Payment confirmations and balance alerts" },
                      { id: "meals", label: "Meals", desc: "Menu updates and meal order reminders" },
                      { id: "attendance", label: "Attendance", desc: "Absence notifications and attendance alerts" },
                    ].map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#333" }}>{item.label}</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>{item.desc}</div>
                        </div>
                        <Toggle
                          checked={notifToggles[item.id]}
                          onChange={(checked) => setNotifToggles(prev => ({ ...prev, [item.id]: checked }))}
                        />
                      </div>
                    ))}
                    <div style={{ fontSize: "var(--font-size-3)", color: "#bbb", marginTop: 16, lineHeight: 1.4 }}>If notifications are disabled at the system level, you may need to enable them in your device settings.</div>
                  </div>
                </div>
              )

              /* === HELP & ABOUT SCREEN === */
              : profileScreen === "help" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen("account-settings")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Help & about</span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Card padding="none" style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Help centre</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>FAQs, guides and support articles</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("legal")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Legal</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Terms & conditions and privacy policy</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>

                    <Card padding="none">
                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Share usage data</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2, lineHeight: 1.4 }}>Help us improve the app by sharing anonymous usage data</div>
                        </div>
                        <Toggle checked={analyticsEnabled} onChange={() => setAnalyticsEnabled(prev => !prev)} />
                      </div>
                    </Card>

                    <div style={{ textAlign: "center", marginTop: 12 }}>
                      <div style={{ fontSize: "var(--font-size-3)", color: "#bbb" }}>Version 1.0.0 (build 42)</div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <Button variant="destructive-secondary" onClick={() => setProfileScreen("delete-confirm")} style={{ width: "100%" }}>Delete my account</Button>
                    </div>
                  </div>
                </div>
              )

              /* === LEGAL SCREEN === */
              : profileScreen === "legal" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen("help")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Legal</span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 24px", minHeight: 0, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Card padding="none" style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px" }}>
                        <span style={{ flex: 1, fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Terms and conditions</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>
                    <Card padding="none" style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px" }}>
                        <span style={{ flex: 1, fontSize: "var(--font-size-3)", fontWeight: 600, color: "#222" }}>Privacy policy</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>
                  </div>
                </div>
              )

              /* === DELETE CONFIRM === */
              : profileScreen === "delete-confirm" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => setProfileScreen("help")} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Delete account</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 16px" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6" stroke="#c44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "#222", marginBottom: 8 }}>Are you sure?</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "#666", lineHeight: 1.6, marginBottom: 24 }}>This will send a request to delete your account and all associated data. This action cannot be undone. You will be logged out once the request is submitted.</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
                      <button onClick={() => setProfileScreen("delete-done")} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#c44", color: "#fff", fontSize: "var(--font-size-4)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Delete my account</button>
                      <button onClick={() => setProfileScreen("account-settings")} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1.5px solid #ddd", background: "#fff", color: "#666", fontSize: "var(--font-size-4)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                </div>
              )

              /* === DELETE DONE === */
              : profileScreen === "delete-done" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14L12 19L21 9" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "#222", marginBottom: 8 }}>Request submitted</div>
                  <div style={{ fontSize: "var(--font-size-3)", color: "#888", lineHeight: 1.5 }}>Your account deletion request has been sent. You will receive a confirmation email shortly.</div>
                  <button onClick={() => { setShowProfile(false); setProfileScreen(null); }} style={{ marginTop: 24, padding: "12px 32px", borderRadius: 12, border: "none", background: "#444", color: "#fff", fontSize: "var(--font-size-3)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Close</button>
                </div>
              )

              /* === FEEDBACK SCREEN === */
              : profileScreen === "feedback" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                    <button onClick={() => { setProfileScreen(null); setFeedbackCategory(null); setFeedbackText(""); setFeedbackSent(false); setFeedbackError(false); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span style={{ fontSize: "var(--font-size-5)", fontWeight: 600, color: "#333" }}>Share feedback</span>
                  </div>
                  {feedbackSent ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14L12 19L21 9" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "#222", marginBottom: 8 }}>Thanks for your feedback!</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "#888", lineHeight: 1.5 }}>It helps us improve the app for every parent.</div>
                      <Button variant="primary" onClick={() => { setShowProfile(false); setProfileScreen(null); setFeedbackCategory(null); setFeedbackText(""); setFeedbackSent(false); setActiveTab("home"); }} style={{ marginTop: 24 }}>Back to home</Button>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", minHeight: 0, background: "#fff" }}>
                        <div style={{ fontSize: "var(--font-size-4)", fontWeight: 700, color: "#222", marginBottom: 6 }}>How's your experience with the app so far?</div>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#888", marginBottom: 20 }}>Your feedback helps us improve.</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 4 }}>
                          {[["👎", 1, "Not great"], ["👍", 2, "Great"]].map(([face, val, label]) => (
                            <button
                              key={val}
                              onClick={() => { setFeedbackCategory(val); setFeedbackError(false); }}
                              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: feedbackCategory && feedbackCategory !== val ? 0.2 : 1, transition: "opacity 0.15s" }}
                            >
                              <span style={{ fontSize: "var(--font-size-7)", lineHeight: 1 }}>{face}</span>
                              <span style={{ fontSize: "var(--font-size-3)", color: "#666", fontFamily: "var(--font-family-sans)" }}>{label}</span>
                            </button>
                          ))}
                        </div>
                        {feedbackError && (
                          <div style={{ textAlign: "center", fontSize: "var(--font-size-3)", color: "#B22929", marginBottom: 16, marginTop: 8 }}>Please tap a thumb to share your experience</div>
                        )}
                        {!feedbackError && <div style={{ marginBottom: 16 }} />}
                        <TextArea placeholder="Tell us what's working well or what could be improved… (optional)" rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} style={{ width: "100%" }} />
                      </div>
                      <div style={{ padding: "12px 16px 20px", background: "#fff", boxShadow: "0 -1px 0 rgba(0,0,0,0.06)", flexShrink: 0 }}>
                        <Button variant="primary" style={{ width: "100%" }} onClick={() => { if (!feedbackCategory) { setFeedbackError(true); } else { setFeedbackSent(true); } }}>Send feedback</Button>
                      </div>
                    </div>
                  )}
                </div>
              )

              /* === PROFILE OVERVIEW — 2 CARDS === */
              : (
                <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#fff" }}>
                  {/* Header */}
                  <div style={{ padding: "4px 16px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                      <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "#222", marginBottom: 2 }}>Kate Collini</div>
                      <div style={{ fontSize: "var(--font-size-3)", color: "#999" }}>kate.collini@email.com</div>
                      </div>
                      <button onClick={() => { setShowProfile(false); setProfileScreen(null); setProfileChild(null); }} className="btn-icon" style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--color-grey-200)", background: "var(--color-white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="#333" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* 2 cards */}
                  <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Account & settings */}
                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("account-settings")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CircleUserRound size={20} color="var(--color-brand-600)" strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#333" }}>Account & settings</div>
                        <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Your details, security, notifications</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    </Card>

                    {/* Feedback */}
                    <Card padding="none" style={{ cursor: "pointer" }} onClick={() => setProfileScreen("feedback")}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FAF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4C3 3.4 3.4 3 4 3H16C16.6 3 17 3.4 17 4V13C17 13.6 16.6 14 16 14H11L7 17V14H4C3.4 14 3 13.6 3 13V4Z" stroke="var(--color-brand-600)" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 8H13M7 11H10" stroke="var(--color-brand-600)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "#333" }}>Share feedback</div>
                          <div style={{ fontSize: "var(--font-size-3)", color: "#999", marginTop: 2 }}>Help us improve the app</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </Card>
                  </div>

                  {/* Log out */}
                  <div style={{ padding: "20px 16px 24px" }}>
                    <Button variant="destructive-secondary" style={{ width: "100%" }}>Log out</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Absence reporting overlay ───────────────────────────────────── */}
        {myChildPage && myChildPage !== "absences" && activeTab === "my-child" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 90, background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column" }}>

            {/* ── FORM ── */}
            {myChildPage === "absence-form" && (<>
              {/* Safe area / phone notch */}
              <div style={{ height: isMobile ? 20 : 50, background: "var(--color-bg-primary)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
                <div style={{ width: 120, height: 28, background: "#222", borderRadius: 14, display: isMobile ? "none" : "block" }} />
              </div>
              {/* Nav bar */}
              <div style={{ background: "var(--color-bg-primary)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px", flexShrink: 0 }}>
                <button
                  onClick={() => isAbsenceFormDirty ? setShowAbsenceCancelSheet(true) : (resetAbsenceForm(), setMyChildPage("absences"))}
                  style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
                >
                  <ChevronLeft size={20} color="var(--color-icon-default)" strokeWidth={1.5} />
                </button>
                <span style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Report an absence</span>
                <button
                  onClick={() => isAbsenceFormDirty ? setShowAbsenceCancelSheet(true) : (resetAbsenceForm(), setMyChildPage("absences"))}
                  style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <X size={20} color="var(--color-icon-default)" strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable body */}
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

                {/* When card */}
                <div style={{ margin: "16px 16px 0" }}>
                  <Card padding="none">
                    {!absenceMultiDay && (<>
                      <MobileDatePicker
                        label="Date"
                        value={absenceStartDate}
                        error={absenceErrors.startDate}
                        onOpen={() => setAbsenceDatePickerActive("start")}
                      />
                      {absenceErrors.startDate && <div style={{ padding: "0 16px 10px", fontSize: "var(--font-size-1)", color: "var(--color-text-destructive)" }}>{absenceErrors.startDate}</div>}
                    </>)}

                    {absenceMultiDay && (<>
                      <MobileDatePicker
                        label="Start date"
                        value={absenceStartDate}
                        error={absenceErrors.startDate}
                        onOpen={() => setAbsenceDatePickerActive("start")}
                      />
                      {absenceErrors.startDate && <div style={{ padding: "0 16px 10px", fontSize: "var(--font-size-1)", color: "var(--color-text-destructive)" }}>{absenceErrors.startDate}</div>}
                      <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />
                      <MobileDatePicker
                        label="End date"
                        value={absenceEndDate}
                        error={absenceErrors.endDate}
                        onOpen={() => setAbsenceDatePickerActive("end")}
                      />
                      {absenceErrors.endDate && <div style={{ padding: "0 16px 10px", fontSize: "var(--font-size-1)", color: "var(--color-text-destructive)" }}>{absenceErrors.endDate}</div>}
                    </>)}

                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", minHeight: 52 }}>
                      <span style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)" }}>Multiple days</span>
                      <Toggle
                        checked={absenceMultiDay}
                        onChange={(val) => { setAbsenceMultiDay(val); setAbsenceErrors(prev => ({ ...prev, startDate: undefined, endDate: undefined })); }}
                      />
                    </div>

                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />

                    <MobileTimePicker
                      label="Start time"
                      value={absenceStartTime}
                      onOpen={() => setAbsenceTimePickerActive("start")}
                    />

                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />

                    <MobileTimePicker
                      label="End time"
                      value={absenceEndTime}
                      onOpen={() => setAbsenceTimePickerActive("end")}
                    />
                  </Card>
                </div>

                {/* Absence details card */}
                <div style={{ margin: "12px 16px 0" }}>
                  <Card padding="none">
                    <div style={{ padding: "14px 16px 10px" }}>
                      <div style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 8 }}>Reason for absence</div>
                      <Combobox
                        options={absenceReasonOptions}
                        value={absenceReason || undefined}
                        placeholder="Select a reason"
                        state={absenceErrors.reason ? "error" : "default"}
                        error={absenceErrors.reason}
                        onChange={(val) => { setAbsenceReason(val || ""); setAbsenceOtherText(""); setAbsenceErrors(prev => ({ ...prev, reason: undefined, otherText: undefined })); }}
                      />
                    </div>

                    {absenceReason === "Other" && (<>
                      <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />
                      <div style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 8 }}>Please give details</div>
                        <TextArea
                          value={absenceOtherText}
                          onChange={(e) => { setAbsenceOtherText(e.target.value); setAbsenceErrors(prev => ({ ...prev, otherText: undefined })); }}
                          placeholder="Tell the school what's happened..."
                          state={absenceErrors.otherText ? "error" : "default"}
                          error={absenceErrors.otherText}
                          rows={3}
                          style={{ width: "100%", fontSize: "16px" }}
                        />
                      </div>
                    </>)}

                    {absenceReason !== "Other" && (
                      <div style={{ padding: "14px 16px 14px" }}>
                        <div style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 8 }}>
                          Note to school
                        </div>
                        <TextArea
                          value={absenceNote}
                          onChange={(e) => setAbsenceNote(e.target.value)}
                          placeholder="Add any additional details for the school..."
                          rows={3}
                          style={{ width: "100%", fontSize: "16px" }}
                        />
                      </div>
                    )}
                  </Card>
                </div>

                <div style={{ height: 32 }} />
              </div>

              {/* Footer CTA */}
              <div style={{ padding: "12px 16px 20px", background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border-default)", flexShrink: 0 }}>
                <Button
                  variant="primary"
                  style={{ width: "100%" }}
                  onClick={handleAbsenceSubmit}
                >
                  {absenceSending ? (
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "var(--color-white)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  ) : `Send ${selectedChild.name}'s report`}
                </Button>
              </div>

              {/* Date picker sheet */}
              {absenceDatePickerActive && (
                <DatePickerSheet
                  label={absenceDatePickerActive === "start" && !absenceMultiDay ? "Date" : absenceDatePickerActive === "start" ? "Start date" : "End date"}
                  value={absenceDatePickerActive === "start" ? absenceStartDate : absenceEndDate}
                  min={absenceDatePickerActive === "start" ? "2026-04-21" : (absenceStartDate || "2026-04-21")}
                  onChange={(v) => {
                    if (absenceDatePickerActive === "start") {
                      setAbsenceStartDate(v);
                      setAbsenceErrors(prev => ({ ...prev, startDate: undefined }));
                    } else {
                      setAbsenceEndDate(v);
                      setAbsenceErrors(prev => ({ ...prev, endDate: undefined }));
                    }
                  }}
                  onClose={() => setAbsenceDatePickerActive(null)}
                />
              )}

              {/* Time picker sheet */}
              {absenceTimePickerActive && (
                <TimePickerSheet
                  label={absenceTimePickerActive === "start" ? "Start time" : "End time"}
                  value={absenceTimePickerActive === "start" ? absenceStartTime : absenceEndTime}
                  onChange={absenceTimePickerActive === "start" ? setAbsenceStartTime : setAbsenceEndTime}
                  onClose={() => setAbsenceTimePickerActive(null)}
                />
              )}

              {/* Cancel confirmation sheet */}
              {showAbsenceCancelSheet && (
                <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                  <div onClick={() => setShowAbsenceCancelSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--color-bg-primary)", borderRadius: "20px 20px 0 0", padding: "24px 16px 36px", zIndex: 1 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-default)", margin: "0 auto 20px" }} />
                    <div style={{ fontSize: "var(--font-size-5)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, textAlign: "center" }}>Leave without reporting?</div>
                    <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", textAlign: "center", marginBottom: 24 }}>Your absence report won't be sent.</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <Button
                        variant="destructive-secondary"
                        onClick={() => { resetAbsenceForm(); setMyChildPage("absences"); }}
                        style={{ width: "100%" }}
                      >
                        Leave
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setShowAbsenceCancelSheet(false)}
                        style={{ width: "100%" }}
                      >
                        Keep editing
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </>)}

            {/* ── SUCCESS ── */}
            {myChildPage === "absence-success" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Top block with notch + close button */}
                <div style={{ background: "var(--color-grey-050)", flexShrink: 0 }}>
                  <div style={{ height: isMobile ? 20 : 50, background: "var(--color-grey-050)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4 }}>
                    <div style={{ width: 120, height: 28, background: "var(--color-text-primary)", borderRadius: 14, display: isMobile ? "none" : "block" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 16px 0" }}>
                    <button onClick={() => { resetAbsenceForm(); setMyChildPage(null); setActiveTab("home"); }} className="btn-icon" style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /><path d="M14 4L4 14" stroke="var(--color-icon-default)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>

                {/* Scrollable content */}
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "var(--color-grey-050)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 20px" }}>
                  {/* Success circle */}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-success-050)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><path d="M10 18L16 24L26 12" stroke="var(--color-success-700)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h1 style={{ fontSize: "var(--font-size-6)", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 28px", textAlign: "center" }}>Absence reported</h1>

                  {/* Summary card */}
                  <div style={{ background: "var(--color-white)", borderRadius: 12, padding: 16, width: "100%", marginBottom: 16, border: "1px solid var(--color-grey-100)" }}>
                    {/* Child + school */}
                    <h2 style={{ fontSize: "var(--font-size-6)", fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 2px" }}>{selectedChild.name} Brown</h2>
                    <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0 }}>{selectedChild.school}</p>

                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />

                    {/* Date + time */}
                    <p style={{ fontSize: "var(--font-size-4)", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 4px" }}>
                      {absenceMultiDay
                        ? `${formatAbsenceDate(absenceStartDate)} – ${formatAbsenceDate(absenceEndDate)}`
                        : formatAbsenceDate(absenceStartDate)
                      }
                    </p>
                    <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: 0 }}>
                      {formatAbsenceTime(absenceStartTime)} – {formatAbsenceTime(absenceEndTime)}
                    </p>

                    <div style={{ height: 1, background: "var(--color-grey-100)", margin: "14px 0" }} />

                    {/* Reason */}
                    <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Reason</p>
                    {absenceReason === "Other" ? (
                      <>
                        <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", margin: "0 0 4px", lineHeight: 1.5, ...(absenceOtherExpanded ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>
                          {`Other — ${absenceOtherText}`}
                        </p>
                        <button onClick={() => setAbsenceOtherExpanded(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "var(--font-size-3)", color: "var(--color-brand-600)", textDecoration: "underline", textUnderlineOffset: 2, fontFamily: "inherit" }}>
                          {absenceOtherExpanded ? "Read less" : "Read more"}
                        </button>
                      </>
                    ) : (
                      <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", margin: 0, lineHeight: 1.5 }}>
                        {absenceReason}
                      </p>
                    )}
                  </div>

                  {/* What happens next */}
                  <div style={{ background: "var(--color-white)", borderRadius: 12, padding: 16, width: "100%", border: "1px solid var(--color-grey-100)" }}>
                    <p style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", margin: "0 0 12px" }}>What happens next</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <ClipboardList size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: 3 }} />
                        <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", lineHeight: 1.5, margin: 0 }}>The school will review your report shortly</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <MessageCircle size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: 3 }} />
                        <p style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-primary)", lineHeight: 1.5, margin: 0 }}>They may follow up if they need any more information</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "12px 16px 20px", flexShrink: 0, background: "var(--color-white)", borderTop: "1px solid var(--color-border-default)" }}>
                  <Button variant="primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => { resetAbsenceForm(); setMyChildPage(null); setActiveTab("home"); }}>
                    Back to home
                  </Button>
                  <Button variant="secondary" style={{ width: "100%" }} onClick={() => { resetAbsenceForm(); setMyChildPage("absence-form"); }}>
                    Report another absence
                  </Button>
                </div>
              </div>
            )}


          </div>
        )}
        </>)}
        </>)}

        {/* Basket toast */}
        {basketToast && (
          <div style={{ position: "absolute", bottom: 84, left: 16, right: 16, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "var(--color-grey-900)", opacity: basketToastFading ? 0 : 1, transition: "opacity 0.4s", pointerEvents: basketToastFading ? "none" : "auto" }}>
            <span style={{ fontSize: "var(--font-size-3)", fontWeight: 500, color: "var(--color-white)", flex: 1, marginRight: 12 }}>{basketToast.title}{typeof basketToast.amount === "number" ? (typeof basketToast.partialOf === "number" ? ` · part payment £${basketToast.amount.toFixed(2)} of £${basketToast.partialOf.toFixed(2)}` : ` · £${basketToast.amount.toFixed(2)}`) : ""} added for {basketToast.child}</span>
            <button onClick={() => { setBasketToastFading(true); setTimeout(() => { setBasketToast(null); setBasketToastFading(false); }, 400); setSubPage(null); setFlowStep(null); setDetailPage(null); setActiveTab("book-pay"); }} style={{ background: "none", border: "none", color: "var(--color-brand-300)", fontSize: "var(--font-size-3)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: 0, flexShrink: 0 }}>View basket</button>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
