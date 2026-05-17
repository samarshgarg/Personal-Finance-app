import React, { useState, useMemo } from "react";
import { fmt, fmtCompact } from "../store";
import { monthlyInsights, weeklyInsights, fiHeadline } from "../advisor";
import { Callout, SectionTitle, Bar, Icon } from "../ui";

function InsightCard({ insight }) {
  const tones = {
    info: { dot: "var(--blue)", bg: "var(--bg-elev)" },
    good: { dot: "var(--green)", bg: "var(--bg-elev)" },
    warn: { dot: "var(--amber)", bg: "var(--bg-elev)" },
    bad: { dot: "var(--red)", bg: "var(--bg-elev)" },
  };
  const t = tones[insight.tone] || tones.info;
  return (
    <div
      style={{
        background: t.bg,
        border: "1px solid var(--border-soft)",
        borderLeft: "3px solid " + t.dot,
        borderRadius: "var(--r-sm)",
        padding: "13px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
          {insight.title}
        </span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--text-dim)", paddingLeft: 15 }}>
        {insight.body}
      </p>
    </div>
  );
}

export default function AdvisorTab({ expenses, budget, profile, goals, cards, fixedTotal = 0 }) {
  const [mode, setMode] = useState("monthly");

  const monthly = useMemo(
    () => monthlyInsights({ expenses, budget, profile, goals, cards, fixedTotal }),
    [expenses, budget, profile, goals, cards, fixedTotal]
  );
  const weekly = useMemo(
    () => weeklyInsights({ expenses, budget, profile, cards, fixedTotal }),
    [expenses, budget, profile, cards, fixedTotal]
  );
  const fi = useMemo(() => fiHeadline(profile), [profile]);

  const insights = mode === "monthly" ? monthly : weekly;

  return (
    <div className="fade-up">
      <SectionTitle hint="Guidance built from your real numbers, focused on one goal: financial independence. Refresh each week and at month-end.">
        Advisor
      </SectionTitle>

      {/* FI headline */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
            Your FI@{fi.fiAge} trajectory
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 20,
              background:
                fi.tone === "good" ? "var(--green-bg)" : fi.tone === "warn" ? "var(--amber-bg)" : "var(--red-bg)",
              color: fi.tone === "good" ? "var(--green)" : fi.tone === "warn" ? "var(--amber)" : "var(--red)",
            }}
          >
            {fi.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 23, fontFamily: "var(--serif)", fontWeight: 600, color: "var(--gold)" }}>
              {fmtCompact(fi.finalCorpus)}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>
              projected corpus
            </div>
          </div>
          <div>
            <div style={{ fontSize: 23, fontFamily: "var(--serif)", fontWeight: 600, color: "var(--text)" }}>
              {fmt(fi.monthlyIncome)}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>
              monthly income at {fi.fiAge}
            </div>
          </div>
        </div>
      </div>

      {/* weekly / monthly toggle */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          background: "var(--bg-elev-2)",
          padding: 4,
          borderRadius: "var(--r-sm)",
          marginBottom: 16,
        }}
      >
        {[
          { id: "weekly", label: "Weekly check-in" },
          { id: "monthly", label: "Monthly review" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              background: mode === m.id ? "var(--gold)" : "transparent",
              color: mode === m.id ? "#1a1206" : "var(--text-dim)",
              border: "none",
              borderRadius: 6,
              padding: "8px 10px",
              fontSize: 13,
              fontWeight: mode === m.id ? 600 : 400,
              transition: "all 0.15s ease",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* insight list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
        {insights.map((ins, i) => (
          <InsightCard key={i} insight={ins} />
        ))}
      </div>

      <Callout tone="info">
        This advice is rule-based — it reads your logged data and flags patterns. It is not
        personalised investment advice. For fund choices and big money decisions, consult a
        SEBI-registered advisor.
      </Callout>
    </div>
  );
}
