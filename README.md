# Sam FinStats - Personal Finance OS

A private, offline-first personal finance app. Tracks expenses, runs a monthly
budget review, gives weekly and monthly advice, manages goal buckets, watches
credit card debt, and projects your path to financial independence.

All data lives ONLY in your browser (localStorage). Nothing is uploaded
anywhere. No account, no server, no tracking.

## Features

- Log      - log variable expenses; fixed expenses apply automatically
- Review   - actual spend vs budget, savings rate, 6-month trend, verdict
- Advisor  - weekly and monthly FI-focused guidance from your real numbers
- Goals    - four buckets (emergency fund, FI@50, travel, car) + projection chart
- Cards    - credit card watchdog tracking utilisation, flags revolving debt
- Tax      - new vs old regime checker (FY 2025-26 rules)
- Settings - income/FI plan, fixed expenses, budget, theme, JSON backup

Light and dark mode - toggle in the header or in Settings.
Responsive - wide layout with top navigation on desktop, bottom nav on mobile.

## Fixed expenses

Enter recurring expenses (EMIs, insurance, parental support) as line items in
Settings. Their total flows automatically into the Log and Review tabs every
month - no need to log them manually. Change an amount in Settings and every
tab updates.

## Run locally

Install Node.js 18+ first from https://nodejs.org

  npm install
  npm run dev

Open the printed localhost URL in your browser.

## Deploy free to Vercel

1. Push this folder's CONTENTS (not the folder itself) to a GitHub repository,
   so package.json sits at the top level of the repo.
2. In Vercel, click "New Project" and import the repo. Vercel auto-detects
   Vite - click "Deploy".
3. You get a public URL. On your phone, use "Add to Home Screen" to install
   it like an app.

Do NOT commit node_modules or dist - the included .gitignore handles this.

Build settings (Vercel fills these in automatically):
- Framework preset : Vite
- Build command    : npm run build
- Output directory : dist

## Important notes

- BACK UP YOUR DATA. Clearing browser data/cookies erases everything.
  Use Settings > Export backup regularly.
- Data does NOT sync between devices - each browser keeps its own copy.
- Tax and FI numbers are planning estimates using fixed assumptions, not
  filed computations or guaranteed returns. Consult a CA / SEBI-registered
  advisor for real decisions.
