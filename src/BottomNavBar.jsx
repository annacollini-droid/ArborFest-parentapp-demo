import { useState } from "react";
import { CalendarDays, UserRound, CreditCard, Mail } from "lucide-react";

const tabs = [
  { id: "home", label: "Coming up", Icon: CalendarDays },
  { id: "my-child", label: "My Child", Icon: UserRound },
  { id: "book-pay", label: "Book & Pay", Icon: CreditCard },
  { id: "messages", label: "Messages", Icon: Mail },
];

const BAR_BG = "var(--color-white)";
const ACTIVE_COLOR = "var(--color-brand-600)";
const ACTIVE_BUBBLE_BG = "#F0FAF3";
const INACTIVE_COLOR = "var(--color-grey-600)";

export default function BottomNavBar({ activeTab, onTabChange, badges = {} }) {
  const [active, setActive] = useState(activeTab ?? "home");

  function handleTabClick(id) {
    setActive(id);
    onTabChange?.(id);
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: BAR_BG,
        borderTop: "1px solid var(--color-grey-200)",
        fontFamily: "var(--font-family-sans)",
        flexShrink: 0,
      }}
    >
      <nav
        style={{
          width: "100%",
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const rawBadge = badges[id];
          const badge = typeof rawBadge === "object" && rawBadge !== null ? rawBadge : { count: rawBadge, variant: "brand" };
          const badgeBg = badge.variant === "warning" ? "var(--color-warning-600)" : "var(--color-brand-600)";
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                position: "relative",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 14px",
                }}
              >
                <div style={{ position: "relative", width: 40, height: 28 }}>
                  <div style={{
                    width: 40,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isActive ? ACTIVE_BUBBLE_BG : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                    />
                  </div>
                  {badge.count > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        right: 7,
                        minWidth: 14,
                        height: 14,
                        borderRadius: 7,
                        background: badgeBg,
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
                      {badge.count}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Safe area */}
      <div style={{ height: 'env(safe-area-inset-bottom, 34px)', backgroundColor: BAR_BG }} />
    </div>
  );
}
