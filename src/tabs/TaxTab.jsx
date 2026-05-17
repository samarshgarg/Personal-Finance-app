import React, { useState, useMemo } from "react";
import { fmt, taxNewRegime, taxOldRegime } from "../store";
import { Metric, Callout, SectionTitle, Field, RupeeInput } from "../ui";

export default function TaxTab() {
  const [gross, setGross] = useState(3000000);
  const [deductions, setDeductions] = useState(450000);

  const taxNew = useMemo(() => taxNewRegime(gross), [gross]);
  const taxOld = useMemo(() => taxOldRegime(gross, deductions), [gross, deductions]);

  const verdict = (() => {
    if (taxNew <= taxOld)
      return {
        tone: "good",
        text: `New regime wins by ${fmt(taxOld - taxNew)}. Stay on it. Re-run this check each year — if your old-regime deductions rise sharply (bigger home loan interest, more 80C investments), the gap can close.`,
      };
    return {
      tone: "warn",
      text: `Old regime would save you ${fmt(taxNew - taxOld)}. Your deductions are high enough to reconsider — but switching has trade-offs. Verify with a CA before changing your declaration.`,
    };
  })();

  return (
    <div className="fade-up">
      <SectionTitle hint="You're on the new regime. Run this once a year — typically in April — to confirm it still beats the old one.">
        Tax Regime Checker
      </SectionTitle>

      <div
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--r-md)",
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <Field label="Annual gross salary (CTC minus employer PF)">
            <RupeeInput value={gross} onChange={(e) => setGross(parseFloat(e.target.value) || 0)} />
          </Field>
        </div>
        <Field label="Total deductions if you chose old regime (80C + 80D + home loan interest + HRA etc.)">
          <RupeeInput
            value={deductions}
            onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
          />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Metric
          label="Tax — New regime"
          value={fmt(taxNew)}
          accent={taxNew <= taxOld ? "var(--green)" : "var(--text)"}
        />
        <Metric
          label="Tax — Old regime"
          value={fmt(taxOld)}
          accent={taxOld < taxNew ? "var(--green)" : "var(--text)"}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Callout tone={verdict.tone}>{verdict.text}</Callout>
      </div>

      <Callout tone="info">
        <strong style={{ color: "var(--text)" }}>One deduction survives the new regime.</strong> Your
        employer's NPS contribution under section 80CCD(2) — up to 14% of basic salary — stays
        deductible even on the new regime. Ask HR whether corporate NPS is available; it's free tax
        saving with no extra outflow from your pocket.
      </Callout>

      <div style={{ marginTop: 14 }}>
        <Callout tone="info">
          <strong style={{ color: "var(--text)" }}>Note:</strong> These figures use FY 2025-26 slab
          rules and the standard deduction. They're an estimate to guide the new-vs-old decision, not
          a filed computation — confirm with a CA or the income tax portal before acting.
        </Callout>
      </div>
    </div>
  );
}
