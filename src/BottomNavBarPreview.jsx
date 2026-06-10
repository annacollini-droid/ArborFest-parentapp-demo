import BottomNavBar from "./BottomNavBar.jsx";

const states = [
  { label: "Active tab: Home — Unread: False",        activeTab: "home",     badges: {} },
  { label: "Active tab: Home — Unread: True",         activeTab: "home",     badges: { messages: 3 } },
  { label: "Active tab: My Child — Unread: False",    activeTab: "my-child", badges: {} },
  { label: "Active tab: My Child — Unread: True",     activeTab: "my-child", badges: { messages: 3 } },
  { label: "Active tab: Book & Pay — Unread: False",  activeTab: "book-pay", badges: {} },
  { label: "Active tab: Book & Pay — Unread: True",   activeTab: "book-pay", badges: { messages: 3 } },
  { label: "Active tab: Messages — Unread: False",    activeTab: "messages", badges: {} },
  { label: "Active tab: Messages — Unread: True",     activeTab: "messages", badges: { messages: 3 } },
];

export default function BottomNavBarPreview() {
  return (
    <div style={{
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
      padding: 40,
      fontFamily: "'Inter', sans-serif",
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: "#202020", marginBottom: 32 }}>
        Bottom Nav Bar — All States
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {states.map(({ label, activeTab, badges }) => (
          <div key={label}>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </p>
            <div style={{ width: 390, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <BottomNavBar activeTab={activeTab} badges={badges} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
