import React, { useState, useMemo } from "react";
import {
  usePersistentState, fmt, fmtCompact, monthKey,
  DEFAULT_PROFILE, DEFAULT_BUDGET, DEFAULT_GOALS,
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

export default function App() {
  const [tab, setTab] = useState("log");

  const [profile, setProfile] = usePersistentState("paisa.profile", DEFAULT_PROFILE);
  const [budget, setBudget] = usePersistentState("paisa.budget", DEFAULT_BUDGET);
  const [expenses, setExpenses] = usePersistentState("paisa.expenses", []);
  const [goals, setGoals] = usePersistentState("paisa.goals", DEFAULT_GOALS);
  const [cards, setCards] = usePersistentState("paisa.cards", []);

  // current-month summary for header strip
  const thisMonth = monthKey();
  const summary = useMemo(() => {
    const spent = expenses
      .filter((e) => e.month === thisMonth)
      .reduce((s, e) => s + e.amt, 0);
    const saved = profile.salary - spent;
    const cardDebt = cards.reduce((s, c) => s + c.out, 0);
    return { spent, saved, cardDebt };
  }, [expenses, profile.salary, cards, thisMonth]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 90 }}>
      {/* header */}
      <header
        style={{
          maxWidth: 540,
          margin: "0 auto",
          padding: "26px 18px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(150deg, var(--gold), var(--gold-dim))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--serif)",
              fontWeight: 600,
              fontSize: 19,
              color: "#1a1206",
            }}
          >
            {"\u20b9"}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: 21,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: -0.3,
              }}
            >
              Paisa
            </h1>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
              Personal Finance OS
            </div>
          </div>
        </div>

        {/* summary strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
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
                padding: "10px 11px",
              }}
            >
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 4 }}>{m.k}</div>
              <div
                style={{
                  fontSize: 15,
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

      {/* tab content */}
      <main style={{ maxWidth: 540, margin: "0 auto", padding: "8px 18px 0" }}>
        {tab === "log" && <LogTab expenses={expenses} setExpenses={setExpenses} />}
        {tab === "review" && (
          <ReviewTab expenses={expenses} budget={budget} profile={profile} />
        )}
        {tab === "goals" && (
          <GoalsTab goals={goals} setGoals={setGoals} profile={profile} />
        )}
        {tab === "advisor" && (
          <AdvisorTab
            expenses={expenses}
            budget={budget}
            profile={profile}
            goals={goals}
            cards={cards}
          />
        )}
        {tab === "cards" && <CardsTab cards={cards} setCards={setCards} />}
        {tab === "tax" && <TaxTab />}
        {tab === "settings" && (
          <SettingsTab
            profile={profile}
            setProfile={setProfile}
            budget={budget}
            setBudget={setBudget}
            expenses={expenses}
            goals={goals}
            cards={cards}
          />
        )}
      </main>

      {/* bottom nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(18,19,26,0.94)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 540,
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
                <span style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
