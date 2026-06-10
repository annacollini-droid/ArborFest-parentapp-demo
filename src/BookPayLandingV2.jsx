import { Card, Tag } from '@tonyarbor/components';
import { Utensils, Shapes, SunMoon, Bus, ShoppingBag } from 'lucide-react';

const sectionTitle = {
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-grey-700)",
  marginBottom: 8,
};

export default function BookPayLandingV2({
  mealsBalance = 3.20,
  wraparoundBalance = 24.00,
  lowFundsThreshold = 5.0,
  bookingsNeedsAttentionCount = 0,
  upcomingCount = 3,
  pastCount = 4,
  selectedChild,
  setSubPage,
  setBookingsFilter,
  setTxHistoryAccount,
  setBrowseFilter,
  setStandaloneTopUpAccount,
  setTopUpAmount,
  setShowStandaloneTopUp,
  setStandaloneTopUpAddedToBasket,
  setStandaloneTopUpSuccess,
  setBookingDetailDatesExpanded,
  setBookingReturnTo,
  setSelectedUpcomingItem,
  archeryBooking,
}) {
  const milkBalance = -5.20;
  const childName = selectedChild?.name || "Molly";
  const upcomingState = upcomingCount > 0 ? "has-upcoming" : pastCount > 0 ? "no-upcoming-has-past" : "nothing";

  // Which wallets a child has varies; balances come from props (per-child, set in ParentApp).
  // Lucas (primary): Meals + Wraparound, no milk. Ethan (secondary): Meals only — no wraparound or milk.
  const accounts =
    childName === "Ethan"
      ? [
          { id: "meals", label: "Meals", balance: mealsBalance, Icon: Utensils },
        ]
      : childName === "Lucas"
      ? [
          { id: "meals",      label: "Meals",      balance: mealsBalance,      Icon: Utensils },
          { id: "wraparound", label: "Wraparound", balance: wraparoundBalance, Icon: SunMoon },
        ]
      : [
          { id: "meals",      label: "Meals",      balance: mealsBalance,      Icon: Utensils },
          { id: "wraparound", label: "Wraparound", balance: wraparoundBalance, Icon: SunMoon },
          { id: "milk",       label: "Milk",       balance: milkBalance,       Icon: ShoppingBag },
        ];

  const hasAccounts = accounts.length > 0;
  const overdrawnAccounts = accounts.filter((a) => a.balance < 0);
  const lowAccounts = accounts.filter((a) => a.balance > 0 && a.balance <= lowFundsThreshold);

  const openAccountTopUp = (id, amount) => {
    setStandaloneTopUpAccount(id);
    setTopUpAmount(amount);
    setShowStandaloneTopUp(true);
    setStandaloneTopUpAddedToBasket(false);
    setStandaloneTopUpSuccess(false);
  };

  const formatBalance = (value) =>
    value < 0 ? `−£${Math.abs(value).toFixed(2)}` : `£${value.toFixed(2)}`;

  return (
    <div style={{ backgroundColor: "var(--color-grey-050)", minHeight: "100%", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

      {/* Bookings & orders — destination card */}
      <div>
        <Card padding="none">
          <button
            onClick={() => { setBookingsFilter(bookingsNeedsAttentionCount > 0 ? "needs-attention" : (upcomingState === "has-upcoming" ? "upcoming" : "past")); setSubPage("my-bookings"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)" }}>Bookings &amp; orders</div>
              <div style={{ fontSize: "var(--font-size-3)", color: "var(--color-text-secondary)", marginTop: 2 }}>
                {bookingsNeedsAttentionCount > 0
                  ? `${bookingsNeedsAttentionCount} ${bookingsNeedsAttentionCount === 1 ? "needs" : "need"} attention`
                  : upcomingState === "has-upcoming"
                  ? `${upcomingCount} upcoming booking${upcomingCount === 1 ? "" : "s"}`
                  : upcomingState === "no-upcoming-has-past"
                  ? `No upcoming · ${pastCount} past`
                  : "Nothing booked yet"}
              </div>
            </div>
            {bookingsNeedsAttentionCount > 0 && (
              <span style={{ flexShrink: 0, minWidth: 20, height: 20, borderRadius: 99, background: "var(--color-warning-600)", color: "var(--color-white)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{bookingsNeedsAttentionCount}</span>
            )}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </Card>
      </div>

      {/* Balances */}
      {hasAccounts && (
      <div>
        <div style={sectionTitle}>{accounts.length > 1 ? "Balances" : "Balance"}</div>
        <Card padding="none" style={{ overflow: "hidden" }}>
          {accounts.map((account, i, arr) => {
            const overdrawn = account.balance < 0;
            const isLow = !overdrawn && account.balance > 0 && account.balance <= lowFundsThreshold;
            return (
            <div key={account.id}>
              <button
                onClick={() => { setTxHistoryAccount(account.id); setSubPage("tx-history"); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              >
                <account.Icon size={20} color="var(--color-grey-900)" strokeWidth={1.5} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: "var(--font-size-3)", fontWeight: "var(--font-weight-regular)", color: "var(--color-text-secondary)", lineHeight: "var(--font-line-height-tight)" }}>{account.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "var(--font-size-6)", fontWeight: (overdrawn || isLow) ? "var(--font-weight-semibold)" : "var(--font-weight-medium)", color: overdrawn ? "var(--color-text-destructive)" : isLow ? "var(--color-text-warning)" : "var(--color-text-primary)", fontVariantNumeric: "tabular-nums", lineHeight: "var(--font-line-height-tight)" }}>{formatBalance(account.balance)}</span>
                    {overdrawn && <Tag variant="error">Owed</Tag>}
                    {isLow && <Tag variant="default">Low</Tag>}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M6 4L10 8L6 12" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {i < arr.length - 1 && <div style={{ height: 1, background: "var(--color-grey-100)", margin: "0 16px" }} />}
            </div>
            );
          })}
        </Card>
      </div>
      )}

      {/* Browse & book */}
      <div>
        <div style={sectionTitle}>Browse &amp; book</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { id: "clubs",           label: "Clubs",            icon: <Shapes size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,   onClick: () => { setBrowseFilter("clubs"); setSubPage("browse"); } },
            { id: "wraparound",      label: "Wraparound",       icon: <SunMoon size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,   onClick: () => { setBrowseFilter("wraparound"); setSubPage("browse"); } },
            { id: "meals",           label: "Meals",            icon: <Utensils size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,   onClick: null },
            { id: "trips",           label: "Trips",            icon: <Bus size={20} color="var(--color-brand-600)" strokeWidth={1.5} />,        onClick: () => { setBrowseFilter("trips"); setSubPage("browse"); } },
          ].filter((item) => !(item.id === "wraparound" && childName === "Ethan")).map((item) => (
            <Card key={item.id} padding="none" style={{ cursor: item.onClick ? "pointer" : "default", border: "none", boxShadow: "none", borderRadius: "var(--radius-l)" }}>
              <div
                onClick={item.onClick || undefined}
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, padding: "10px 14px" }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-brand-050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0, alignSelf: "stretch", display: "flex", alignItems: "center", fontSize: "var(--font-size-4)", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.15 }}>{item.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
