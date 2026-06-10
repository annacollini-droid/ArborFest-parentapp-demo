import BottomNavBarV2, { TABS_EN, TABS_CY } from "./BottomNavBarV2.jsx";

const TAB_IDS = ["home", "my-child", "book-pay", "messages"];

const BADGE_STATES = [
  { label: "Unread: False", badges: {} },
  { label: "Unread: True",  badges: { messages: 3 } },
];

export function BottomNavBarV2PreviewEN() {
  return <NavPreview lang="English" tabs={TABS_EN} />;
}

export function BottomNavBarV2PreviewCY() {
  return <NavPreview lang="Welsh" tabs={TABS_CY} />;
}

function NavPreview({ lang, tabs }) {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        padding: 40,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 600, color: "#202020", marginBottom: 40 }}>
        Bottom Nav Bar — {lang} — All States
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {TAB_IDS.map((activeTab) => {
          const activeLabel = tabs.find((t) => t.id === activeTab)?.label;
          return BADGE_STATES.map(({ label, badges }) => (
            <div key={`${activeTab}-${label}`}>
              <p
                style={{
                  fontSize: 11,
                  color: "#888",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Active: {activeLabel} — {label}
              </p>
              <div style={{ width: 390, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                <BottomNavBarV2 tabs={tabs} activeTab={activeTab} badges={badges} />
              </div>
            </div>
          ));
        })}
      </div>
    </div>
  );
}

// Default export keeps the combined view for reference
export default function BottomNavBarV2Preview() {
  return (
    <>
      <BottomNavBarV2PreviewEN />
      <BottomNavBarV2PreviewCY />
    </>
  );
}
