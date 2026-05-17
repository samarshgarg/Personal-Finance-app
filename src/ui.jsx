import React from "react";

// ---- minimal inline icon set (stroke-based) ----
const paths = {
  ledger: "M4 4h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2zM8 8h6M8 12h6",
  chart: "M4 20V10M10 20V4M16 20v-7M20 20H3",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
  card: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h4",
  tax: "M9 3h6l1 4H8zM6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM9 12l6 6M15 12l-6 6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  plane: "M10 3L4 14l3 1 1 3 11-6-2-2 3-6z",
  car: "M5 13l2-6h10l2 6M4 13h16v5H4zM7 18v2M17 18v2M7 13.5h0M17 13.5h0",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4 4L19 7",
  alert: "M12 9v4M12 17h0M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  download: "M12 3v12M7 11l5 5 5-5M5 21h14",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  wallet: "M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 7v10a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3M3 7h15M17 12h4v4h-4a2 2 0 0 1 0-4z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
};

export function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.7, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d={paths[name] || ""} />
    </svg>
  );
}

// ---- metric card ----
export function Metric({ label, value, accent, sub }) {
  return (
    <div
      style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--r-md)",
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: 0.2 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontFamily: "var(--serif)",
          fontWeight: 600,
          color: accent || "var(--text)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ---- progress bar ----
export function Bar({ pct, color, height = 8, track = "var(--border)" }) {
  return (
    <div style={{ height, background: track, borderRadius: height / 2, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: Math.min(Math.max(pct, 0), 100) + "%",
          background: color,
          borderRadius: height / 2,
          transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

// ---- button ----
export function Btn({ children, onClick, variant = "default", style, type = "button", disabled }) {
  const base = {
    fontSize: 14,
    fontWeight: 500,
    padding: "10px 16px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    transition: "all 0.15s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };
  const variants = {
    default: { background: "var(--bg-elev-2)", color: "var(--text)" },
    primary: { background: "var(--gold)", color: "#1a1206", border: "1px solid var(--gold)", fontWeight: 600 },
    ghost: { background: "transparent", color: "var(--text-dim)" },
    danger: { background: "var(--red-bg)", color: "var(--red)", border: "1px solid #4a2424" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {children}
    </button>
  );
}

// ---- text/number input ----
export function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      {label && (
        <span style={{ fontSize: 12, color: "var(--text-dim)", display: "block", marginBottom: 5 }}>
          {label}
        </span>
      )}
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-sm)",
  color: "var(--text)",
  fontSize: 14,
  padding: "10px 12px",
  outline: "none",
};

export function TextInput(props) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => (e.target.style.borderColor = "var(--gold-dim)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

export function RupeeInput(props) {
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-faint)",
          fontSize: 14,
          pointerEvents: "none",
        }}
      >
        {"\u20b9"}
      </span>
      <input
        {...props}
        type="number"
        style={{ ...inputStyle, paddingLeft: 26, ...props.style }}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold-dim)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

export function SelectInput(props) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => (e.target.style.borderColor = "var(--gold-dim)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    >
      {props.children}
    </select>
  );
}

// ---- callout box ----
export function Callout({ tone = "info", children }) {
  const tones = {
    info: { bg: "var(--bg-elev-2)", border: "var(--border)", text: "var(--text-dim)" },
    good: { bg: "var(--green-bg)", border: "#1f4030", text: "var(--green)" },
    warn: { bg: "var(--amber-bg)", border: "#473714", text: "var(--amber)" },
    bad: { bg: "var(--red-bg)", border: "#4a2424", text: "var(--red)" },
  };
  const t = tones[tone];
  return (
    <div
      style={{
        background: t.bg,
        border: "1px solid " + t.border,
        borderLeft: "3px solid " + t.text,
        borderRadius: "var(--r-sm)",
        padding: "12px 14px",
        fontSize: 13,
        lineHeight: 1.6,
        color: t.text,
      }}
    >
      {children}
    </div>
  );
}

// ---- section heading ----
export function SectionTitle({ children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: 20,
          fontWeight: 600,
          color: "var(--text)",
        }}
      >
        {children}
      </h2>
      {hint && (
        <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 3, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
