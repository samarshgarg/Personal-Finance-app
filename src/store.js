import { useState, useEffect } from "react";

// ---- localStorage-backed state hook ----
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

// ---- formatting ----
export const fmt = (n) =>
  "\u20b9" + Math.round(n || 0).toLocaleString("en-IN");

export const fmtCompact = (n) => {
  const a = Math.abs(n || 0);
  if (a >= 1e7) return "\u20b9" + (n / 1e7).toFixed(2) + " Cr";
  if (a >= 1e5) return "\u20b9" + (n / 1e5).toFixed(1) + " L";
  if (a >= 1e3) return "\u20b9" + (n / 1e3).toFixed(0) + "K";
  return "\u20b9" + Math.round(n || 0);
};

export const monthKey = (d = new Date()) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");

export const monthLabel = (key) => {
  const [y, m] = key.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[+m - 1] + " " + y;
};

// ---- expense categories ----
export const CATEGORIES = [
  { id: "Fixed", label: "Fixed (EMI / Insurance / Parents)", color: "#e9655f" },
  { id: "Essentials", label: "Essentials (food / fuel / utility)", color: "#e0a23c" },
  { id: "Discretionary", label: "Discretionary (dining / shopping)", color: "#e08db0" },
  { id: "Subscriptions", label: "Subscriptions (AI / OTT)", color: "#6aa3e0" },
  { id: "CreditCard", label: "Credit Card Payment", color: "#9a8de0" },
];

export const catMeta = (id) =>
  CATEGORIES.find((c) => c.id === id) || { label: id, color: "#9b9aa3" };

// ---- default monthly budget ----
export const DEFAULT_BUDGET = {
  Fixed: 108000,
  Essentials: 32000,
  Discretionary: 18000,
  Subscriptions: 3360,
  CreditCard: 0,
};

// ---- profile defaults (editable in Settings) ----
export const DEFAULT_PROFILE = {
  salary: 200000,
  currentAge: 39,
  fiAge: 50,
  corpus: 100000,
  monthlySIP: 32000,
  stepUp: 10,
  expectedReturn: 11,
};

// ---- default goals ----
export const DEFAULT_GOALS = [
  { id: "emergency", name: "Emergency Fund", icon: "shield", target: 1000000, current: 100000, color: "#e0a23c" },
  { id: "fi50", name: "FI@50 Corpus", icon: "target", target: 30000000, current: 0, color: "#5cc98a" },
  { id: "travel", name: "Travel Fund", icon: "plane", target: 300000, current: 0, color: "#6aa3e0" },
  { id: "car", name: "Car Replacement", icon: "car", target: 800000, current: 0, color: "#9a8de0" },
];

// ---- tax calculators (FY 2025-26 rules) ----
export function taxNewRegime(grossIncome) {
  const taxable = Math.max(grossIncome - 75000, 0); // standard deduction
  const slabs = [
    [400000, 0], [400000, 0.05], [400000, 0.1],
    [400000, 0.15], [400000, 0.2], [800000, 0.25], [Infinity, 0.3],
  ];
  let tax = 0, rem = taxable;
  for (const [width, rate] of slabs) {
    const slice = Math.min(rem, width);
    tax += slice * rate;
    rem -= slice;
    if (rem <= 0) break;
  }
  if (taxable <= 1200000) tax = 0; // 87A rebate
  return Math.round(tax * 1.04); // + 4% cess
}

export function taxOldRegime(grossIncome, deductions) {
  const taxable = Math.max(grossIncome - 50000 - deductions, 0);
  const slabs = [
    [250000, 0], [250000, 0.05], [500000, 0.2], [Infinity, 0.3],
  ];
  let tax = 0, rem = taxable;
  for (const [width, rate] of slabs) {
    const slice = Math.min(rem, width);
    tax += slice * rate;
    rem -= slice;
    if (rem <= 0) break;
  }
  if (taxable <= 500000) tax = 0;
  return Math.round(tax * 1.04);
}

// ---- FI projection: returns array of {age, corpus} ----
export function projectCorpus({ corpus, monthlySIP, stepUp, expectedReturn, currentAge, fiAge }) {
  const years = Math.max(fiAge - currentAge, 0);
  const r = expectedReturn / 100;
  const step = stepUp / 100;
  let bal = corpus;
  let yearlySIP = monthlySIP * 12;
  const series = [{ age: currentAge, corpus: bal }];
  for (let y = 1; y <= years; y++) {
    bal = (bal + yearlySIP) * (1 + r);
    series.push({ age: currentAge + y, corpus: Math.round(bal) });
    yearlySIP *= 1 + step;
  }
  return series;
}
