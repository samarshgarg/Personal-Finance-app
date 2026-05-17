# Paisa - Personal Finance OS

A private, offline-first personal finance app. Tracks expenses, runs a monthly
budget review, manages goal buckets, watches credit card debt, and projects your
path to financial independence at 50.

All data lives ONLY in your browser (localStorage). Nothing is uploaded
anywhere. No account, no server, no tracking.

## Features

- Log      - enter expenses by category; switch between months
- Review   - actual spend vs budget, savings rate, 6-month trend, monthly verdict
- Goals    - four buckets (emergency fund, FI@50, travel, car) + corpus projection chart
- Cards    - credit card watchdog tracking utilisation, flags revolving debt
- Tax      - new vs old regime checker (FY 2025-26 rules)
- Settings - edit your income/FI plan and budget; export a JSON backup

## Run locally

Install Node.js 18+ first from https://nodejs.org

  npm install
  npm run dev

Open the printed localhost URL in your browser.

## Deploy free to Vercel

1. Create a free account at https://vercel.com
2. Push this folder to a GitHub repository.
3. In the Vercel dashboard click "New Project", import the repo.
   Vercel auto-detects Vite - just click "Deploy".
4. You get a public URL like paisa-xyz.vercel.app. Open it on your phone
   and use "Add to Home Screen" - it installs like an app (PWA).

Alternatively, with the Vercel CLI:

  npm install -g vercel
  vercel

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
