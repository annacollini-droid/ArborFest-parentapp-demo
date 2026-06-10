import { House, UserRound, CreditCard, Mail } from "lucide-react";

export const TABS_EN = [
  { id: "home",     label: "Home",       Icon: House },
  { id: "my-child", label: "My Child",   Icon: UserRound },
  { id: "book-pay", label: "Book & Pay", Icon: CreditCard },
  { id: "messages", label: "Messages",   Icon: Mail },
];

export const TABS_CY = [
  { id: "home",     label: "Cartref",          Icon: House },
  { id: "my-child", label: "Fy Mhlentyn",      Icon: UserRound },
  { id: "book-pay", label: "Archebu a Thalu",  Icon: CreditCard },
  { id: "messages", label: "Negeseuon",        Icon: Mail },
];

const ACTIVE_COLOR   = "#0e8a0e";
const BUBBLE_BG      = "#F0FAF3";
const INACTIVE_COLOR = "#595959";

export default function BottomNavBarV2({ tabs, activeTab, badges = {} }) {
  return (
    <div
      style={{
        width: 390,
        backgroundColor: "#fff",
        borderTop: "1px solid #e5e7eb",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "flex-start",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const badge    = badges[id];

          return (
            <div
              key={id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Bubble + icon */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 40,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isActive ? BUBBLE_BG : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                  />
                </div>

                {badge > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 7,
                      minWidth: 14,
                      height: 14,
                      borderRadius: 7,
                      background: ACTIVE_COLOR,
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      transform: "translate(50%, -50%)",
                    }}
                  >
                    {badge}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                }}
              >
                {label}
              </span>

              {/* Active dot — always rendered to keep height consistent */}
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: isActive ? ACTIVE_COLOR : "transparent",
                }}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
