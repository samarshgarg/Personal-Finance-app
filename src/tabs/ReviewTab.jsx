import React, { useState, useMemo } from "react";
import {
  BarChart, Bar as RBar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
} from "recharts";
import { fmt, fmtCompact, CATEGORIES, catMeta, monthKey, monthLabel } from "../store";
import { Metric, Bar, Callout, SectionTitle, SelectInput } from "../ui";

export default function ReviewTab({ expenses, budget, profile }) {
  const [viewMonth, setViewMonth] = useState(monthKey());

  const months = useMemo(() => {
    const set = new Set([monthKey(), ...expenses.map((e) => e.month)]);
    return [...set].sort().reverse();
  }, [expenses]);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.month === viewMonth),
    [expenses, viewMonth]
  );

  const actual = useMemo(() => {
    const a = {};
    CATEGORIES.forEach((c) => (a[c.id] = 0));
    monthExpenses.forEach((e) => (a[e.cat] += e.amt));
    return a;
  }, [monthExpenses]);

  const totalSpent = Object.values(actual).reduce((s, v) => s + v, 0);
  const saved = profile.salary - totalSpent;
  const savingsRate = profile.salary ? (saved / profile.salary) * 100 : 0;

  // 6-month savings trend
  const trend = useMemo(() => {
    return months
      .slice(0, 6)
      .reverse()
      .map((m) => {
        const spent = expenses
          .filter((e) => e.month === m)
          .reduce((s, e) => s + e.amt, 0);
        return { month: monthLabel(m).split(" ")[0], saved: Math.max(profile.salary - spent, 0) };
      });
  }, [months, expenses, profile.salary]);

  const verdict = (() => {
    if (monthExpenses.length === 0)
      return { tone: "info", text: "No expenses logged for this month yet. Head to the Log tab." };
    if (saved < 0)
      return {
        tone: "bad",
        text: `You overspent by ${fmt(-saved)} this month. Expenses exceeded your salary — cut discretionary spend hard next month.`,
      };
    if (saved < profile.monthlySIP)
      return {
        tone: "warn",
        text: `Saved ${fmt(saved)} — below your ${fmt(profile.monthlySIP)} SIP target. FI@50 needs steady ${fmt(profile.monthlySIP)}+ monthly. Check overspent categories below.`,
      };
    return {
      tone: "good",
      text: `Saved ${fmt(saved)} — at or above your ${fmt(profile.monthlySIP)} target. Push the surplus into your FI@50 goal. Side income would accelerate things further.`,
    };
  })();

  return (
    <div className="fade-up">
      <SectionTitle hint="Your actual spend against budget. This is the check Cowork would email you on the 1st — here it runs live.">
        Monthly Review
      </SectionTitle>

      <div style={{ marginBottom: 14 }}>
        <SelectInput
          value={viewMonth}
          onChange={(e) => setViewMonth(e.target.value)}
          style={{ width: "auto", padding: "7px 10px", fontSize: 13 }}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </SelectInput>
      </div>

      {/* category bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {CATEGORIES.map((c) => {
          const act = actual[c.id];
          const bud = budget[c.id] || 0;
          const over = act > bud;
          const pct = bud ? (act / bud) * 100 : act > 0 ? 100 : 0;
          return (
            <div
              key={c.id}
              style={{
                background: "var(--bg-elev)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-sm)",
                padding: "11px 13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12.5,
                  marginBottom: 7,
                }}
              >
                <span style={{ color: "var(--text)" }}>{c.id}</span>
                <span style={{ color: over ? "var(--red)" : "var(--text-dim)", fontFamily: "var(--mono)" }}>
                  {fmt(act)} / {fmt(bud)}
                  {over && " · over"}
                </span>
              </div>
              <Bar pct={pct} color={over ? "var(--red)" : c.color} height={6} />
            </div>
          );
        })}
      </div>

      {/* metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Metric
          label="Saved this month"
          value={fmt(saved)}
          accent={saved < profile.monthlySIP ? "var(--red)" : "var(--green)"}
          sub={Math.round(savingsRate) + "% savings rate"}
        />
        <Metric
          label="vs SIP target"
          value={fmt(profile.monthlySIP)}
          sub={saved >= profile.monthlySIP ? "Target met" : "Behind target"}
          accent={saved >= profile.monthlySIP ? "var(--green)" : "var(--amber)"}
        />
      </div>

      {/* trend chart */}
      {trend.length > 1 && (
        <div
          style={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--r-md)",
            padding: "14px 14px 6px",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>
            Savings trend (last {trend.length} months)
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={trend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-faint)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtCompact(v)}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "var(--bg-elev-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--text-dim)" }}
                formatter={(v) => [fmt(v), "Saved"]}
              />
              <RBar dataKey="saved" radius={[4, 4, 0, 0]}>
                {trend.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.saved >= profile.monthlySIP ? "var(--green)" : "var(--amber)"}
                  />
                ))}
              </RBar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <Callout tone={verdict.tone}>{verdict.text}</Callout>
    </div>
  );
}
