import React, { useState } from "react";
import { fmt } from "../store";
import { Icon, Bar, Btn, Field, RupeeInput, TextInput, Callout, SectionTitle } from "../ui";

export default function CardsTab({ cards, setCards }) {
  const [name, setName] = useState("");
  const [outstanding, setOutstanding] = useState("");
  const [limit, setLimit] = useState("");

  const add = () => {
    const out = parseFloat(outstanding) || 0;
    const lim = parseFloat(limit) || 0;
    if (!name.trim() || lim <= 0) return;
    setCards([...cards, { id: Date.now(), name: name.trim(), out, lim }]);
    setName("");
    setOutstanding("");
    setLimit("");
  };

  const remove = (id) => setCards(cards.filter((c) => c.id !== id));

  const update = (id, field, value) => {
    setCards(
      cards.map((c) => (c.id === id ? { ...c, [field]: parseFloat(value) || 0 } : c))
    );
  };

  const totalOut = cards.reduce((s, c) => s + c.out, 0);
  const totalLim = cards.reduce((s, c) => s + c.lim, 0);
  const overallUtil = totalLim ? (totalOut / totalLim) * 100 : 0;

  const verdict = (() => {
    if (cards.length === 0) return null;
    if (totalOut === 0)
      return {
        tone: "good",
        text: "Zero revolving balance across all cards — exactly the goal. Keep paying the full statement amount before the due date every month. Use cards for rewards, never for credit.",
      };
    if (overallUtil > 30)
      return {
        tone: "bad",
        text: `${fmt(totalOut)} outstanding at ${Math.round(overallUtil)}% utilisation. Card interest runs 36-42% a year — higher than any investment return you can earn. Clear this before investing another rupee. High utilisation also drags your credit score.`,
      };
    return {
      tone: "warn",
      text: `${fmt(totalOut)} outstanding. Pay it in full this cycle — partial payment triggers interest on the entire balance, not just the unpaid part. Your target is zero.`,
    };
  })();

  return (
    <div className="fade-up">
      <SectionTitle hint="Your stated goal: zero revolving balance. Track each card's outstanding against its limit. Tap a number to edit it.">
        Credit Card Watchdog
      </SectionTitle>

      {/* card list */}
      {cards.length > 0 && (
        <div className="tab-grid" style={{ marginBottom: 16 }}>
          {cards.map((c) => {
            const util = c.lim ? (c.out / c.lim) * 100 : 0;
            const danger = util > 30;
            const color = c.out === 0 ? "var(--green)" : danger ? "var(--red)" : "var(--amber)";
            return (
              <div
                key={c.id}
                style={{
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--r-md)",
                  padding: "13px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 9,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 12, color, fontFamily: "var(--mono)" }}>
                      {Math.round(util)}% used
                    </span>
                    <button
                      onClick={() => remove(c.id)}
                      style={{ background: "transparent", border: "none", color: "var(--text-faint)", display: "flex" }}
                      aria-label="Remove card"
                    >
                      <Icon name="close" size={15} />
                    </button>
                  </div>
                </div>

                <Bar pct={util} color={color} height={7} />

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 11,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10.5, color: "var(--text-faint)", display: "block", marginBottom: 3 }}>
                      Outstanding
                    </span>
                    <RupeeInput
                      value={c.out}
                      onChange={(e) => update(c.id, "out", e.target.value)}
                      style={{ padding: "7px 10px 7px 24px", fontSize: 13 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10.5, color: "var(--text-faint)", display: "block", marginBottom: 3 }}>
                      Credit limit
                    </span>
                    <RupeeInput
                      value={c.lim}
                      onChange={(e) => update(c.id, "lim", e.target.value)}
                      style={{ padding: "7px 10px 7px 24px", fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {verdict && (
        <div style={{ marginBottom: 16 }}>
          <Callout tone={verdict.tone}>{verdict.text}</Callout>
        </div>
      )}

      {/* add card */}
      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 11 }}>Add a card</div>
        <div style={{ marginBottom: 10 }}>
          <Field label="Card name">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HDFC Millennia"
            />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Field label="Outstanding">
            <RupeeInput value={outstanding} onChange={(e) => setOutstanding(e.target.value)} placeholder="0" />
          </Field>
          <Field label="Credit limit">
            <RupeeInput value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="0" />
          </Field>
        </div>
        <Btn variant="primary" onClick={add} style={{ width: "100%" }}>
          <Icon name="plus" size={16} /> Add card
        </Btn>
      </div>
    </div>
  );
}
