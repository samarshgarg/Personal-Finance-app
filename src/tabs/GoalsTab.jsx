import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { fmt, fmtCompact, projectCorpus } from "../store";
import { Icon, Bar, Btn, Metric, Callout, SectionTitle, RupeeInput } from "../ui";

function ContributeRow({ goal, onContribute }) {
  const [amt, setAmt] = useState("");
  const submit = () => {
    const n = parseFloat(amt);
    if (!n || n <= 0) return;
    onContribute(goal.id, n);
    setAmt("");
  };
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <div style={{ flex: 1 }}>
        <RupeeInput
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          placeholder="Add contribution"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ padding: "8px 12px 8px 26px", fontSize: 13 }}
        />
      </div>
      <Btn onClick={submit} style={{ padding: "8px 14px", fontSize: 13 }}>
        <Icon name="plus" size={14} /> Add
      </Btn>
    </div>
  );
}

export default function GoalsTab({ goals, setGoals, profile }) {
  const contribute = (id, amount) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, current: g.current + amount } : g))
    );
  };

  const reset = (id) => {
    if (!window.confirm("Reset this goal's balance to zero?")) return;
    setGoals(goals.map((g) => (g.id === id ? { ...g, current: 0 } : g)));
  };

  const projection = useMemo(() => projectCorpus(profile), [profile]);
  const finalCorpus = projection[projection.length - 1].corpus;
  const monthlyIncome = (finalCorpus * 0.04) / 12;

  const fiVerdict = (() => {
    if (finalCorpus < 15000000)
      return {
        tone: "bad",
        text: `Projected corpus ${fmtCompact(finalCorpus)} falls short of a comfortable retirement. At a 4% withdrawal that's only ${fmt(monthlyIncome)}/month. Raise your SIP or push FI age to 53-55.`,
      };
    if (finalCorpus < 30000000)
      return {
        tone: "warn",
        text: `Projected ${fmtCompact(finalCorpus)} supports a lean retirement — basics plus modest travel (${fmt(monthlyIncome)}/month). Side income from your HCP freelance work would lift this into comfortable territory.`,
      };
    if (finalCorpus < 50000000)
      return {
        tone: "good",
        text: `Projected ${fmtCompact(finalCorpus)} — comfortable FI. A 4% withdrawal gives ${fmt(monthlyIncome)}/month, enough for a good lifestyle with regular travel.`,
      };
    return {
      tone: "good",
      text: `Projected ${fmtCompact(finalCorpus)} — well beyond target. Premium lifestyle, frequent travel and a cushion all covered.`,
    };
  })();

  return (
    <div className="fade-up">
      <SectionTitle hint="Four buckets, each with its own target. Add a contribution whenever you invest or transfer money toward a goal.">
        Goal Tracker
      </SectionTitle>

      {/* goal cards */}
      <div className="tab-grid" style={{ marginBottom: 22 }}>
        {goals.map((g) => {
          const pct = g.target ? (g.current / g.target) * 100 : 0;
          return (
            <div
              key={g.id}
              style={{
                background: "var(--bg-elev)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-md)",
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: g.color + "22",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={g.icon} size={16} color={g.color} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{g.name}</span>
                </div>
                <button
                  onClick={() => reset(g.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-faint)",
                    display: "flex",
                  }}
                  aria-label="Reset goal"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12.5,
                  marginBottom: 8,
                  fontFamily: "var(--mono)",
                  color: "var(--text-dim)",
                }}
              >
                <span style={{ color: g.color }}>{fmt(g.current)}</span>
                <span>{fmt(g.target)}</span>
              </div>

              <Bar pct={pct} color={g.color} height={9} />

              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 7 }}>
                {pct.toFixed(1)}% funded
                {pct >= 100 && " · goal reached"}
              </div>

              <ContributeRow goal={g} onContribute={contribute} />
            </div>
          );
        })}
      </div>

      {/* FI projection */}
      <SectionTitle hint="Based on your Settings: SIP, annual step-up and expected return.">
        Path to FI@{profile.fiAge}
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Metric label={"Corpus at " + profile.fiAge} value={fmtCompact(finalCorpus)} accent="var(--gold)" />
        <Metric
          label="Monthly income (4% rule)"
          value={fmt(monthlyIncome)}
          sub="Safe withdrawal"
        />
      </div>

      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: "14px 12px 6px",
          marginBottom: 14,
        }}
      >
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={projection} margin={{ top: 6, right: 8, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-soft)" vertical={false} />
            <XAxis
              dataKey="age"
              tick={{ fill: "var(--text-faint)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-faint)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmtCompact(v)}
              width={52}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-elev-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-dim)" }}
              labelFormatter={(v) => "Age " + v}
              formatter={(v) => [fmtCompact(v), "Corpus"]}
            />
            <Area
              type="monotone"
              dataKey="corpus"
              stroke="var(--gold)"
              strokeWidth={2}
              fill="url(#corpusGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <Callout tone={fiVerdict.tone}>{fiVerdict.text}</Callout>
    </div>
  );
}
