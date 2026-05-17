import { fmt, fmtCompact, monthKey, monthLabel, projectCorpus, CATEGORIES } from "./store";

// ---- helpers ----
function prevMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function sumByCat(list) {
  const a = {};
  CATEGORIES.forEach((c) => (a[c.id] = 0));
  list.forEach((e) => (a[e.cat] += e.amt));
  return a;
}

// ---- MONTHLY ADVISOR ----
// Returns ordered list of insight objects: { tone, title, body, priority }
export function monthlyInsights({ expenses, budget, profile, goals, cards }) {
  const out = [];
  const tm = monthKey();
  const thisMonth = expenses.filter((e) => e.month === tm);
  const pm = prevMonthKey(tm);
  const prevMonth = expenses.filter((e) => e.month === pm);

  const spent = thisMonth.reduce((s, e) => s + e.amt, 0);
  const saved = profile.salary - spent;
  const rate = profile.salary ? (saved / profile.salary) * 100 : 0;
  const actual = sumByCat(thisMonth);
  const prevActual = sumByCat(prevMonth);

  // 1. No data yet
  if (thisMonth.length === 0) {
    out.push({
      tone: "info",
      priority: 1,
      title: "Log this month to unlock advice",
      body: "Once you record this month's expenses in the Log tab, this section turns into a tailored monthly review built on your real numbers.",
    });
    return out;
  }

  // 2. Savings vs target — the headline
  if (saved < 0) {
    out.push({
      tone: "bad",
      priority: 1,
      title: "You overspent this month",
      body: `Expenses exceeded your salary by ${fmt(-saved)}. Nothing reaches investments when this happens. Find the largest non-fixed category below and cut it hard next month — this is the single thing standing between you and FI.`,
    });
  } else if (saved < profile.monthlySIP) {
    const gap = profile.monthlySIP - saved;
    out.push({
      tone: "warn",
      priority: 1,
      title: `Saved ${fmt(saved)} — ${fmt(gap)} short of target`,
      body: `Your FI plan needs ${fmt(profile.monthlySIP)}/month invested. You're ${fmt(gap)} below. Every month under target pushes your FI date past ${profile.fiAge}. Trim discretionary spend to close the gap.`,
    });
  } else {
    const extra = saved - profile.monthlySIP;
    out.push({
      tone: "good",
      priority: 2,
      title: `On track — saved ${fmt(saved)}`,
      body:
        extra > 2000
          ? `You beat your ${fmt(profile.monthlySIP)} target by ${fmt(extra)}. Don't let it sit idle in your bank — move the surplus into your FI@50 goal or a lump-sum SIP this week.`
          : `You hit your ${fmt(profile.monthlySIP)} SIP target. Steady months like this are exactly what compounding rewards. Keep going.`,
    });
  }

  // 3. Category overspends vs budget
  CATEGORIES.forEach((c) => {
    if (c.id === "Fixed" || c.id === "CreditCard") return;
    const over = actual[c.id] - (budget[c.id] || 0);
    if (over > 1000) {
      out.push({
        tone: "warn",
        priority: 3,
        title: `${c.id} ran ${fmt(over)} over budget`,
        body: `You budgeted ${fmt(budget[c.id])} for ${c.id.toLowerCase()} but spent ${fmt(actual[c.id])}. If this repeats every month, that's ${fmt(over * 12)} a year not invested — roughly ${fmtCompact(over * 12 * 8)} of lost corpus over a decade once compounded.`,
      });
    }
  });

  // 4. Month-over-month spending jump
  if (prevMonth.length > 0) {
    const prevSpent = prevMonth.reduce((s, e) => s + e.amt, 0);
    const jump = spent - prevSpent;
    if (jump > 8000) {
      out.push({
        tone: "warn",
        priority: 4,
        title: `Spending rose ${fmt(jump)} vs ${monthLabel(pm)}`,
        body: `Your total outflow climbed from ${fmt(prevSpent)} to ${fmt(spent)}. Check which category grew — lifestyle creep is the quiet enemy of FI. A rise is fine if it was one-off; a problem if it's the new normal.`,
      });
    } else if (jump < -8000) {
      out.push({
        tone: "good",
        priority: 4,
        title: `Spending dropped ${fmt(-jump)} vs ${monthLabel(pm)}`,
        body: `Good control — outflow fell from ${fmt(prevSpent)} to ${fmt(spent)}. If this wasn't a fluke, raise your monthly SIP target in Settings to lock in the saving before it gets spent.`,
      });
    }
  }

  // 5. Credit card debt
  const cardDebt = cards.reduce((s, c) => s + c.out, 0);
  if (cardDebt > 0) {
    out.push({
      tone: "bad",
      priority: 1,
      title: `${fmt(cardDebt)} sitting on credit cards`,
      body: `Card interest runs 36-42% a year — no investment beats that. Clearing this debt is a guaranteed 40% return. Pause fresh investing if needed and kill the card balance first; then never revolve again.`,
    });
  }

  // 6. Emergency fund check
  const ef = goals.find((g) => g.id === "emergency");
  if (ef && ef.current < ef.target) {
    const monthsCovered = spent > 0 ? ef.current / spent : 0;
    if (monthsCovered < 3) {
      out.push({
        tone: "warn",
        priority: 2,
        title: "Emergency fund still thin",
        body: `Your emergency fund covers roughly ${monthsCovered.toFixed(1)} months of expenses. Aim for 6. Until it's there, one job loss or medical surprise could force you to sell investments at a bad time. Build this before chasing higher returns.`,
      });
    }
  }

  // 7. Subscriptions nudge
  if (actual.Subscriptions > 4000) {
    out.push({
      tone: "info",
      priority: 5,
      title: "Subscription spend worth a glance",
      body: `You spent ${fmt(actual.Subscriptions)} on subscriptions. Tools that power your freelance income are productive spend — keep those. Cancel anything you haven't used this month.`,
    });
  }

  return out.sort((a, b) => a.priority - b.priority);
}

// ---- WEEKLY ADVISOR ----
// Lighter, action-oriented nudges based on this month's pace so far.
export function weeklyInsights({ expenses, budget, profile, cards }) {
  const out = [];
  const tm = monthKey();
  const thisMonth = expenses.filter((e) => e.month === tm);
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthFraction = dayOfMonth / daysInMonth;

  const spent = thisMonth.reduce((s, e) => s + e.amt, 0);
  const totalBudget = Object.values(budget).reduce((s, v) => s + v, 0);

  if (thisMonth.length === 0) {
    out.push({
      tone: "info",
      title: "Nothing logged yet this month",
      body: "Log expenses as they happen — even a 5-second entry. Weekly nudges need fresh data to be useful.",
    });
    return out;
  }

  // pace check — are we spending faster than the month is passing?
  const expectedByNow = totalBudget * monthFraction;
  if (spent > expectedByNow * 1.15) {
    out.push({
      tone: "warn",
      title: "Spending ahead of pace",
      body: `You're ${Math.round(monthFraction * 100)}% through the month but have spent ${fmt(spent)} — above the ${fmt(expectedByNow)} you'd expect by now. Ease off discretionary spend for the rest of the month to protect your SIP.`,
    });
  } else if (spent < expectedByNow * 0.85 && monthFraction > 0.3) {
    out.push({
      tone: "good",
      title: "Comfortably under pace",
      body: `${Math.round(monthFraction * 100)}% through the month and only ${fmt(spent)} spent. You're tracking well — if it holds, you'll have surplus to invest beyond your SIP target.`,
    });
  } else {
    out.push({
      tone: "info",
      title: "Spending roughly on pace",
      body: `${fmt(spent)} spent, ${Math.round(monthFraction * 100)}% through the month. Steady. Keep logging so the monthly review is accurate.`,
    });
  }

  // discretionary watch
  const discThisMonth = thisMonth
    .filter((e) => e.cat === "Discretionary")
    .reduce((s, e) => s + e.amt, 0);
  if (discThisMonth > (budget.Discretionary || 0) * monthFraction * 1.3) {
    out.push({
      tone: "warn",
      title: "Discretionary spend is the one to watch",
      body: `Dining and shopping are already at ${fmt(discThisMonth)} this month. This is the most controllable category — a quiet week here directly becomes invested money.`,
    });
  }

  // card reminder
  const cardDebt = cards.reduce((s, c) => s + c.out, 0);
  if (cardDebt > 0) {
    out.push({
      tone: "bad",
      title: "Clear card dues before the due date",
      body: `${fmt(cardDebt)} outstanding. Pay the full statement amount — not the minimum — before the due date this week. Partial payment triggers interest on everything.`,
    });
  }

  // weekly habit nudge
  out.push({
    tone: "info",
    title: "This week's one action",
    body: "Pick a single lever: skip two food deliveries, or move any idle bank balance into your SIP. One concrete action a week compounds into the FI trajectory.",
  });

  return out;
}

// ---- FI TRAJECTORY HEADLINE ----
export function fiHeadline(profile) {
  const proj = projectCorpus(profile);
  const finalCorpus = proj[proj.length - 1].corpus;
  const monthlyIncome = (finalCorpus * 0.04) / 12;
  let status, tone;
  if (finalCorpus < 15000000) {
    status = "Off track";
    tone = "bad";
  } else if (finalCorpus < 30000000) {
    status = "Lean — needs a push";
    tone = "warn";
  } else {
    status = "On track";
    tone = "good";
  }
  return { finalCorpus, monthlyIncome, status, tone, fiAge: profile.fiAge };
}
