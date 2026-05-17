import React, { useState, useMemo } from "react";
import { fmt, CATEGORIES, catMeta, monthKey, monthLabel } from "../store";
import { Icon, Btn, Field, RupeeInput, TextInput, SelectInput, SectionTitle, Metric } from "../ui";

export default function LogTab({ expenses, setExpenses }) {
  const [cat, setCat] = useState("Essentials");
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");
  const [viewMonth, setViewMonth] = useState(monthKey());

  const months = useMemo(() => {
    const set = new Set([monthKey(), ...expenses.map((e) => e.month)]);
    return [...set].sort().reverse();
  }, [expenses]);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.month === viewMonth),
    [expenses, viewMonth]
  );

  const total = monthExpenses.reduce((s, e) => s + e.amt, 0);

  const add = () => {
    const n = parseFloat(amt);
    if (!n || n <= 0) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        cat,
        amt: n,
        note: note.trim() || catMeta(cat).label,
        month: monthKey(),
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setAmt("");
    setNote("");
  };

  const remove = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  return (
    <div className="fade-up">
      <SectionTitle hint="Log each expense as it happens, or sit down at month-end and enter them all. This feeds your Review, Goals and Cards.">
        Expense Log
      </SectionTitle>

      {/* entry form */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Field label="Category">
            <SelectInput value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Amount">
            <RupeeInput
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              placeholder="0"
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </Field>
        </div>
        <Field label="Note">
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Reliance Fresh groceries"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </Field>
        <Btn variant="primary" onClick={add} style={{ width: "100%", marginTop: 12 }}>
          <Icon name="plus" size={16} /> Add expense
        </Btn>
      </div>

      {/* month selector + total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
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
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
          Total: <span style={{ color: "var(--red)", fontWeight: 600 }}>{fmt(total)}</span>
        </div>
      </div>

      {/* list */}
      {monthExpenses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            color: "var(--text-faint)",
            fontSize: 13,
            border: "1px dashed var(--border)",
            borderRadius: "var(--r-md)",
          }}
        >
          No expenses logged for {monthLabel(viewMonth)} yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[...monthExpenses].reverse().map((e) => {
            const meta = catMeta(e.cat);
            return (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--r-sm)",
                  padding: "10px 12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: meta.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {e.note}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                      {e.cat} · {e.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--mono)" }}>
                    {fmt(e.amt)}
                  </span>
                  <button
                    onClick={() => remove(e.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-faint)",
                      display: "flex",
                      padding: 2,
                    }}
                    aria-label="Delete expense"
                  >
                    <Icon name="close" size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
