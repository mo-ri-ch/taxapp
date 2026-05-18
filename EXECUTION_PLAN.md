# TaxClarity — Phased Execution Plan

A session-sized rollout of the PRD ([prdtax.md](prdtax.md)). Each phase produces a runnable build you can open in the browser, click through, and decide whether to keep going. Nothing is "finished" until you can see it work end-to-end at that phase's scope.

**Conventions used in every phase:**
- "Runnable" = `npm run dev` boots, no console errors, all screens reachable up to that phase's scope.
- "Stop condition" = the concrete thing you should look at before deciding to continue.
- Phases are ordered so earlier phases never need to be rewritten by later ones — they just get hooked into.

---

## Phase 1 — Scaffold + Landing Page

**Goal:** Get a Vite + React + Tailwind app booting with a finished-looking landing screen. No interactivity beyond clicking the CTA into a placeholder.

**Scope:**
- Initialize Vite project (React + JSX, no TypeScript).
- Install Tailwind 3.4.17, autoprefixer, postcss; wire `tailwind.config.js`, `postcss.config.js`.
- Add Inter font preconnects in `index.html`; set page title + description.
- Create `src/index.css` with `@tailwind` directives, body base styles, `card-enter` and `reveal` keyframes.
- Build `S01_Landing.jsx` — header (logo + FY badge), hero (badge pill, H1 with indigo underline span, description, three trust bullets, two CTAs), right-column mock result card (static), four feature cards, bottom trust strip, footer.
- `App.jsx` renders only `S01_Landing`. The "Start calculation" CTA can console.log or do nothing for now.

**Stop condition:** Open the dev server, see the hero, confirm typography/spacing matches the design tokens in PRD §5. Decide if visual polish is on track.

---

## Phase 2 — App Shell, State, and First Two Wizard Steps

**Goal:** The Start button now leads somewhere real. Wizard scaffolding works; you can move forward and back through two pre-data screens.

**Scope:**
- In `App.jsx`: add `INITIAL_STATE` (PRD §6), `step`/`data`/`results` state, and `update` / `goNext` / `goBack` / `skipTo` / `reset` functions. Add the step switch that renders S01–S03.
- Build shared `ProgressBar.jsx` (dot indicator, completed/current/upcoming states, `PROGRESS_STEPS` window of 10).
- Build `StepWrapper.jsx` — sticky nav (logo → reset, back pill, progress bar, "100% Private" trust badge), two-column grid (left card, right column left empty for now), footer.
- Build `S02_FinancialYear.jsx` — pre-selected locked FY card, info text, gradient Continue button.
- Build `S03_AgeGroup.jsx` — three radio cards (below60 / senior / superSenior) with custom radio style, validation requiring a selection, error message slot.

**Out of scope this phase:** `TaxPreviewPanel` (right column stays empty/hidden), `CommonQuestions` (skip the FAQ accordion on S03 for now — add a TODO comment).

**Stop condition:** Click Start → land on S02 → Continue → S03 → pick an age → Continue advances `step` to 4 (which renders nothing yet — show a "Step 4 placeholder" stub). Verify Back button works, progress dots update, logo click resets to S01.

---

## Phase 3 — Reusable Inputs + Salary Steps (S04, S05)

**Goal:** All the numeric-input plumbing the rest of the wizard needs, plus the two most input-heavy steps.

**Scope:**
- Build `NumberInput.jsx` — digit-strip on change, `formatINR` display via `toLocaleString('en-IN')`, green checkmark + green border when valid, hint/note slots, prefix support.
- Build `FrequencyInput.jsx` — Monthly/Per year pill toggle, always stores annual under the hood, shows annual-equivalent hint when in monthly mode.
- Build `CommonQuestions.jsx` (with `forwardRef` + `openAndScroll()`) and `ConfusedLink.jsx` — wire one example FAQ into S03 retroactively to confirm the accordion behavior.
- Build `S04_SalaryDetails.jsx` — side-by-side take-home and basic inputs, live annual preview, amber warnings (basic > take-home, surcharge > ₹50L), bonus Yes/No → `FrequencyInput`, combined preview, validation, 5-item FAQ.
- Build `S05_SalaryComponents.jsx` — three checkbox cards (HRA, Professional Tax, Employer NPS), expanding sub-inputs, validation that any checked item has amount > 0, 5-item FAQ.

**Out of scope this phase:** Live tax math — the right column is still empty.

**Stop condition:** Walk S01 → S05 entering realistic numbers; confirm green validation states, monthly↔annual toggles, the surcharge warning at ₹4.2L/month, and the basic-greater-than-takehome warning. The right column is still blank, and that's expected.

---

## Phase 4 — Tax Engine, Constants, and Live Preview Panel

**Goal:** The right column comes alive. The user can see a live tax estimate update as they fill in steps 4–5 (and onward, for free, in later phases).

**Scope:**
- Build `constants.js` — all caps and three slab arrays (PRD §12) verbatim.
- Build `utils.js` — `fmt`, `fmtNum`, `toNum`, `calc80CTotal`.
- Build `taxEngine.js` — `applySlabs`, `calculateGrossIncome`, `calculateHRAExemption`, `calculateNewRegimeTax`, `calculateOldRegimeTax`, `compareRegimes`, `calculateTDSPosition`, `computeTax`. All caps applied, marginal relief for new regime, 87A logic per age, employer NPS 14% cap.
- Build `TaxPreviewPanel.jsx` — header, regime toggle pills with auto/manual override (`userPickedRegime`), empty state when no income, hero gradient card, breakdown sections A/B/C with the 4-column slab table, savings banner, privacy footer. Use the `EMPTY_REGIME` fallback so partial data doesn't throw.
- Hook `TaxPreviewPanel` into `StepWrapper`'s right column for steps 2–12.

**Out of scope this phase:** Steps 6–14 (the preview will simply show whatever take-home + components are already entered).

**Stop condition:** From the salary step, watch the right-column estimate update in real time. Toggle between Old/New manually, confirm "Best" badge moves, and check that an income of exactly ₹12.75L under new regime shows ₹0 tax.

---

## Phase 5 — Other Income + Housing (S06, S07, S08)

**Goal:** Two more wizard screens plus the first non-linear navigation (skip S08 when not paying rent). HRA exemption now feeds the live preview.

**Scope:**
- Build `S06_OtherIncome.jsx` — two explainer cards, Yes/No, two `FrequencyInput`s for FD and savings interest, blue tip box, validation, 6-item FAQ. On "No", clear `fdInterest` and `savingsInterest` on Continue.
- Build `S07_PaysRent.jsx` — Yes/No, amber warning on No, `skipTo(9)` when No / `goNext()` when Yes, validation, 3-item FAQ.
- Build `S08_RentDetails.jsx` — monthly rent input, metro/non-metro radio, "HRA in salary?" Yes/No, all-fields validation, 4-item FAQ.
- Wire all three into the App switch.

**Stop condition:** A user paying ₹25K/month rent in a metro with HRA in salary should now see a non-zero HRA exemption line in the preview's old-regime breakdown. Confirm S07 "No" jumps directly to S09 placeholder.

---

## Phase 6 — Investments, Insurance, Home Loan (S09, S10, S11)

**Goal:** All old-regime deductions wired up. The preview's old-regime column finally has everything it needs to win against the new regime in deduction-heavy scenarios.

**Scope:**
- Build `S09_TaxSavingInvestments.jsx` — 7 80C checkbox items with per-item local frequency state, `FreqToggle` sub-component, 80C running total bar (capped at ₹1.5L, green at cap), personal NPS Yes/No + `FrequencyInput` with separate `npsFreq` state, custom back nav that skips S08 when `!paysRent`, 5-item FAQ.
- Build `S10_HealthInsurance.jsx` — two `InsuranceCard` instances (self, parents) with filled Yes/No buttons, age sub-question inside parent card, "neither pays" amber feedback, age-dependent caps (25K/50K), 5-item FAQ.
- Build `S11_HomeLoan.jsx` — Yes/No, three ownership radio options, amber warning for "other", interest input with joint-share hint, validation, 5-item FAQ.

**Stop condition:** Enter the "Gross ₹10L, max 80C + HRA + 80D + NPS" scenario from PRD §16; the preview should now flip the recommended regime to Old.

---

## Phase 7 — TDS, Calculating Animation, Basic Results (S12, S13, S14)

**Goal:** End-to-end flow. The wizard now reaches a real results page. Polish of the result components comes in Phase 8.

**Scope:**
- Build `S12_TDS.jsx` — blue 4-step explainer, Yes/No, employer TDS input, conditional bank-TDS section (only when `hasOtherIncome && fdInterest > 0`), green-gradient "Calculate My Tax →" CTA, validation, 7-item FAQ.
- Build `S13_Calculating.jsx` — no StepWrapper, spinner, 6-step animation list with done/active/upcoming states, `useRef` StrictMode guard, calls `computeTax(data)` and `setResults` after ~2.6s, then `goNext()`.
- Build a thin first cut of `S14_Results.jsx` — sticky nav with "Your Tax Result" + FY badge, two-column grid, **simple placeholders** for each of SectionA–E (just card shells showing `results.recommended` and `results.savings`), disclaimer, "Go back and edit" → `skipTo(4)`, "Start Over" → `reset()`, 3-item trust strip.

**Stop condition:** Run the full happy path from S01 to S14. The calculating animation plays, results appear, edit/start-over both work. The results page looks rough but the numbers are correct.

---

## Phase 8 — Detailed Result Sections + Final Polish

**Goal:** Replace the Phase-7 placeholders with the full PRD §10 result components, then sweep for animation, accessibility, and edge-case wording.

**Scope:**
- `SectionA_Verdict.jsx` — `getVerdictSentence` with all four templates (zero tax, very close, new wins, old wins with dynamic reasons), indigo/emerald background based on winner.
- `SectionB_TaxSummary.jsx` — side-by-side regime cards with "Best for you" badge, TDS line with employer+bank breakdown, refund/payable/settled message via `TDSMessage`, advance-tax warning when FD income + payable.
- `SectionC_DetailedBreakdown.jsx` — collapsible accordion, all six steps (income, deductions, taxable, slabs, rebate/relief/cess, final), side-by-side `SlabTable`s, "——" for new-regime-only rows.
- `SectionD_Education.jsx` — collapsible "How did we calculate this?", dynamic rows from PRD §10 conditional table.
- `SectionE_NextSteps.jsx` — up to 9 conditional suggestion cards, first highlighted, financial-advice disclaimer footer.
- Polish pass: confirm `card-enter` and `reveal` animations fire on the right elements, run the 18 verification cases in PRD §16, fix any wording or cap drift, test mobile breakpoint (right column hides below `lg`).

**Stop condition:** All 18 test scenarios in PRD §16 pass. Mobile flow is usable. You consider the product done — or list whatever's left as a Phase 9 punch list.

---

## What's Intentionally NOT a Phase

These come from PRD §17 "Known Out-of-Scope" and are not part of this rollout:
- Surcharge, capital gains, rental income, freelance income, multi-house property, 80E/80G/80EEA/80EEB, LTA exemption, marginal relief for old regime.
- TypeScript migration, SSR, localStorage persistence, automated tests, PDF export, URL routing.

If any of these become must-haves, they slot in as Phase 9+.
