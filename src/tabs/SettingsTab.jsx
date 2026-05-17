import React from "react";
import { fmt, CATEGORIES, catName, sumFixed } from "../store";
import { Field, RupeeInput, TextInput, Btn, Callout, SectionTitle, Icon } from "../ui";

// budget categories the user edits manually (Fixed is auto from line items)
const BUDGET_CATEGORIES = CATEGORIES.filter((c) => c.id !== "Fixed");

export default function SettingsTab({
  profile, setProfile, budget, setBudget,
  fixedItems, setFixedItems, fixedTotal,
  expenses, goals, cards, theme, setTheme,
}) {
  const setP = (key, val) => setProfile({ ...profile, [key]: parseFloat(val) || 0 });
  const setB = (key, val) => setBudget({ ...budget, [key]: parseFloat(val) || 0 });

  // ---- fixed expense item editing ----
  const updateFixed = (id, field, value) => {
    setFixedItems(
      fixedItems.map((f) =>
        f.id === id ? { ...f, [field]: field === "amount" ? parseFloat(value) || 0 : value } : f
      )
    );
  };
  const addFixed = () => {
    setFixedItems([
      ...fixedItems,
      { id: "f" + Date.now(), name: "New fixed expense", amount: 0 },
    ]);
  };
  const removeFixed = (id) => setFixedItems(fixedItems.filter((f) => f.id !== id));

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify(
        { profile, budget, fixedItems, expenses, goals, cards, theme, exportedAt: new Date().toISOString() },
        null, 2
      )],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sam-finstats-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const wipe = () => {
    if (!window.confirm("Erase ALL data and reset the app? This cannot be undone.")) return;
    localStorage.clear();
    window.location.reload();
  };

  const cardStyle = {
    background: "var(--bg-elev)",
    border: "1px solid var(--border-soft)",
    borderRadius: "var(--r-md)",
    padding: 16,
  };

  return (
    <div className="fade-up">
      <SectionTitle hint="Your numbers drive every calculation. Fixed expenses entered here flow automatically into Log, Review and Advisor.">
        Settings
      </SectionTitle>

      <div className="tab-grid">
        {/* APPEARANCE */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Appearance</div>
          <div style={{ display: "flex", gap: 9 }}>
            {["dark", "light"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "11px 10px",
                  borderRadius: "var(--r-sm)",
                  border:
                    "1px solid " + (theme === t ? "var(--gold)" : "var(--border)"),
                  background: theme === t ? "var(--bg-elev-2)" : "transparent",
                  color: theme === t ? "var(--gold)" : "var(--text-dim)",
                  fontSize: 13,
                  fontWeight: theme === t ? 600 : 400,
                  textTransform: "capitalize",
                }}
              >
                <Icon name={t === "dark" ? "moon" : "sun"} size={16} />
                {t} mode
              </button>
            ))}
          </div>
        </div>

        {/* INCOME & FI PLAN */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Income & FI plan</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Monthly take-home salary">
              <RupeeInput value={profile.salary} onChange={(e) => setP("salary", e.target.value)} />
            </Field>
            <Field label="Current corpus / savings">
              <RupeeInput value={profile.corpus} onChange={(e) => setP("corpus", e.target.value)} />
            </Field>
            <Field label="Current age">
              <TextInput type="number" value={profile.currentAge} onChange={(e) => setP("currentAge", e.target.value)} />
            </Field>
            <Field label="Target FI age">
              <TextInput type="number" value={profile.fiAge} onChange={(e) => setP("fiAge", e.target.value)} />
            </Field>
            <Field label="Monthly SIP target">
              <RupeeInput value={profile.monthlySIP} onChange={(e) => setP("monthlySIP", e.target.value)} />
            </Field>
            <Field label="Annual SIP step-up (%)">
              <TextInput type="number" value={profile.stepUp} onChange={(e) => setP("stepUp", e.target.value)} />
            </Field>
            <Field label="Expected return (%)">
              <TextInput type="number" value={profile.expectedReturn} onChange={(e) => setP("expectedReturn", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* FIXED EXPENSES — the new auto-calculated section */}
        <div style={{ ...cardStyle, gridColumn: "1 / -1" }} className="span-2">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>Fixed monthly expenses</div>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--red)" }}>
              Total: {fmt(fixedTotal)}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12, lineHeight: 1.5 }}>
            EMIs, insurance, money sent to parents — anything that recurs at the same amount. These
            apply automatically every month in Log and Review. No need to log them manually.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {fixedItems.map((f) => (
              <div
                key={f.id}
                style={{ display: "flex", gap: 9, alignItems: "center" }}
              >
                <TextInput
                  value={f.name}
                  onChange={(e) => updateFixed(f.id, "name", e.target.value)}
                  placeholder="Expense name"
                  style={{ flex: 2 }}
                />
                <div style={{ flex: 1, minWidth: 120 }}>
                  <RupeeInput
                    value={f.amount}
                    onChange={(e) => updateFixed(f.id, "amount", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeFixed(f.id)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)",
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-faint)",
                    flexShrink: 0,
                  }}
                  aria-label="Remove fixed expense"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            ))}
          </div>
          <Btn onClick={addFixed} style={{ marginTop: 11 }}>
            <Icon name="plus" size={15} /> Add fixed expense
          </Btn>
        </div>

        {/* VARIABLE BUDGET */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Variable budget by category
          </div>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12, lineHeight: 1.5 }}>
            Monthly spending limits for the categories you log. The Review tab compares your actual
            spend against these.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {BUDGET_CATEGORIES.map((c) => (
              <div
                key={c.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: 10, alignItems: "center" }}
              >
                <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                  {catName(c.id)}
                </span>
                <RupeeInput value={budget[c.id]} onChange={(e) => setB(c.id, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* DATA */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Your data</div>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12, lineHeight: 1.5 }}>
            Everything is stored only on this device, in your browser. Nothing is sent anywhere.
            Export regularly as a backup — clearing browser data will erase it.
          </p>
          <div style={{ display: "flex", gap: 9 }}>
            <Btn onClick={exportData} style={{ flex: 1 }}>
              <Icon name="download" size={15} /> Export backup
            </Btn>
            <Btn variant="danger" onClick={wipe} style={{ flex: 1 }}>
              <Icon name="trash" size={15} /> Reset all
            </Btn>
          </div>
        </div>

        <div className="span-2" style={{ gridColumn: "1 / -1" }}>
          <Callout tone="info">
            Sam FinStats gives general, rule-based guidance — not personalised investment advice. The
            FI projection assumes steady returns, which real markets never deliver. Treat every number
            as a planning estimate and consult a SEBI-registered advisor for decisions that matter.
          </Callout>
        </div>
      </div>
    </div>
  );
}
