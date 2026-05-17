import React from "react";
import { fmt, CATEGORIES, DEFAULT_PROFILE, DEFAULT_BUDGET } from "../store";
import { Field, RupeeInput, TextInput, Btn, Callout, SectionTitle, Icon } from "../ui";

export default function SettingsTab({
  profile, setProfile, budget, setBudget,
  expenses, goals, cards,
}) {
  const setP = (key, val) => setProfile({ ...profile, [key]: parseFloat(val) || 0 });
  const setB = (key, val) => setBudget({ ...budget, [key]: parseFloat(val) || 0 });

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ profile, budget, expenses, goals, cards, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paisa-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const wipe = () => {
    if (!window.confirm("Erase ALL data and reset the app? This cannot be undone.")) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fade-up">
      <SectionTitle hint="Your numbers drive every calculation in the app. Update these when your situation changes.">
        Settings
      </SectionTitle>

      {/* profile */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 14,
        }}
      >
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

      {/* budget */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Monthly budget by category</div>
        <div style={{ display: "grid", gap: 10 }}>
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: 10, alignItems: "center" }}
            >
              <span style={{ fontSize: 13, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                {c.id}
              </span>
              <RupeeInput value={budget[c.id]} onChange={(e) => setB(c.id, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* data */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Your data</div>
        <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12, lineHeight: 1.5 }}>
          Everything is stored only on this device, in your browser. Nothing is sent anywhere. Export
          regularly as a backup — clearing browser data will erase it.
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

      <Callout tone="info">
        This app gives general, rule-based guidance — not personalised investment advice. The FI
        projection assumes steady returns, which real markets never deliver. Treat every number as a
        planning estimate and consult a SEBI-registered advisor for decisions that matter.
      </Callout>
    </div>
  );
}
