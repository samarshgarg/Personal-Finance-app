import React, { useState, useMemo, useEffect } from "react";
import {
  usePersistentState, fmt, monthKey,
  DEFAULT_PROFILE, DEFAULT_BUDGET, DEFAULT_GOALS, DEFAULT_FIXED, sumFixed,
} from "./store";
import { Icon } from "./ui";
import LogTab from "./tabs/LogTab";
import ReviewTab from "./tabs/ReviewTab";
import GoalsTab from "./tabs/GoalsTab";
import CardsTab from "./tabs/CardsTab";
import TaxTab from "./tabs/TaxTab";
import AdvisorTab from "./tabs/AdvisorTab";
import SettingsTab from "./tabs/SettingsTab";

const TABS = [
  { id: "log", label: "Log", icon: "ledger" },
  { id: "review", label: "Review", icon: "chart" },
  { id: "advisor", label: "Advisor", icon: "bulb" },
  { id: "goals", label: "Goals", icon: "target" },
  { id: "cards", label: "Cards", icon: "card" },
  { id: "tax", label: "Tax", icon: "tax" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// hook: is the viewport desktop-width?
function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 900 : false
  );
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return desktop;
}

export default function App() {
  const [tab, setTab] = useState("log");
  const isDesktop = useIsDesktop();

  const [theme, setTheme] = usePersistentState("paisa.theme", "dark");
  const [profile, setProfile] = usePersistentState("paisa.profile", DEFAULT_PROFILE);
  const [budget, setBudget] = usePersistentState("paisa.budget", DEFAULT_BUDGET);
  const [expenses, setExpenses] = usePersistentState("paisa.expenses", []);
  const [goals, setGoals] = usePersistentState("paisa.goals", DEFAULT_GOALS);
  const [cards, setCards] = usePersistentState("paisa.cards", []);
  const [fixedItems, setFixedItems] = usePersistentState("paisa.fixed", DEFAULT_FIXED);

  // apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // total of all fixed expense line items — the single source of truth
  const fixedTotal = useMemo(() => sumFixed(fixedItems), [fixedItems]);

  // budget with the Fixed category always synced to the itemised total
  const effectiveBudget = useMemo(
    () => ({ ...budget, Fixed: fixedTotal }),
    [budget, fixedTotal]
  );

  // header summary — counts the auto fixed total + logged variable expenses
  const thisMonth = monthKey();
  const summary = useMemo(() => {
    const variableSpent = expenses
      .filter((e) => e.month === thisMonth)
      .reduce((s, e) => s + e.amt, 0);
    const spent = variableSpent + fixedTotal;
    const saved = profile.salary - spent;
    const cardDebt = cards.reduce((s, c) => s + c.out, 0);
    return { spent, saved, cardDebt };
  }, [expenses, profile.salary, cards, thisMonth, fixedTotal]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: isDesktop ? 32 : 90 }}>
      {/* ===== HEADER ===== */}
      <header className="app-shell" style={{ paddingTop: 24, paddingBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(150deg, var(--gold), var(--gold-dim))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--serif)",
                fontWeight: 600,
                fontSize: 20,
                color: "#1a1206",
              }}
            >
              {"\u20b9"}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: -0.3,
                }}
              >
                Sam FinStats
              </h1>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 3 }}>
                Personal Finance OS
              </div>
            </div>
          </div>

          {/* desktop nav + theme toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {isDesktop && (
              <nav style={{ display: "flex", gap: 2 }}>
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      style={{
                        background: active ? "var(--bg-elev-2)" : "transparent",
                        border: "none",
                        borderRadius: "var(--r-sm)",
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: active ? "var(--gold)" : "var(--text-dim)",
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon name={t.icon} size={16} strokeWidth={active ? 2 : 1.6} />
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle light or dark mode"
              style={{
                background: "var(--bg-elev)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-sm)",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-dim)",
                flexShrink: 0,
              }}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
          </div>
        </div>

        {/* summary strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginTop: 18,
          }}
        >
          {[
            { k: "Take-home", v: fmt(profile.salary), c: "var(--text)" },
            {
              k: "Saved this month",
              v: fmt(summary.saved),
              c: summary.saved >= profile.monthlySIP ? "var(--green)" : "var(--amber)",
            },
            {
              k: "Card debt",
              v: fmt(summary.cardDebt),
              c: summary.cardDebt > 0 ? "var(--red)" : "var(--green)",
            },
          ].map((m) => (
            <div
              key={m.k}
              style={{
                background: "var(--bg-elev)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-sm)",
                padding: "11px 13px",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 5 }}>
                {m.k}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "var(--mono)",
                  color: m.c,
                }}
              >
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ===== TAB CONTENT ===== */}
      <main className="app-shell" style={{ paddingTop: 8 }}>
        {tab === "log" && (
          <LogTab
            expenses={expenses}
            setExpenses={setExpenses}
            fixedItems={fixedItems}
            fixedTotal={fixedTotal}
          />
        )}
        {tab === "review" && (
          <ReviewTab
            expenses={expenses}
            budget={effectiveBudget}
            profile={profile}
            fixedTotal={fixedTotal}
          />
        )}
        {tab === "advisor" && (
          <AdvisorTab
            expenses={expenses}
            budget={effectiveBudget}
            profile={profile}
            goals={goals}
            cards={cards}
            fixedTotal={fixedTotal}
          />
        )}
        {tab === "goals" && (
          <GoalsTab goals={goals} setGoals={setGoals} profile={profile} />
        )}
        {tab === "cards" && <CardsTab cards={cards} setCards={setCards} />}
        {tab === "tax" && <TaxTab />}
        {tab === "settings" && (
          <SettingsTab
            profile={profile}
            setProfile={setProfile}
            budget={budget}
            setBudget={setBudget}
            fixedItems={fixedItems}
            setFixedItems={setFixedItems}
            fixedTotal={fixedTotal}
            expenses={expenses}
            goals={goals}
            cards={cards}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </main>

      {/* ===== BOTTOM NAV (mobile only) ===== */}
      {!isDesktop && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--nav-bg)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              padding: "8px 4px",
            }}
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 2px",
                    color: active ? "var(--gold)" : "var(--text-faint)",
                    transition: "color 0.15s ease",
                  }}
                >
                  <Icon name={t.icon} size={18} strokeWidth={active ? 2 : 1.6} />
                  <span style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
