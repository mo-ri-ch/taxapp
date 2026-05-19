# TaxClarity — Indian Income Tax Calculator FY 2025-26

**Live Demo:** [https://tax-calculator-app-olive.vercel.app/](https://tax-calculator-app-olive.vercel.app/)

A modern, fast, and completely private single-page web application designed for salaried Indians to calculate their income tax for the Financial Year 2025-26. 

TaxClarity helps you compare the **Old vs New Tax Regime**, determine which one saves you more money, and see your detailed TDS refund or payable status.

## Features

- **Side-by-Side Comparison:** Instantly see your tax liability under both the Old and New tax regimes.
- **Smart Recommendations:** Automatically calculates and highlights the regime that saves you the most money.
- **Comprehensive Coverage:** Supports basic salary, bonuses, HRA, professional tax, home loan interest, 80C deductions, medical insurance (80D), NPS, and other income sources (like FD/Savings interest).
- **Live Preview Panel:** As you enter your details, see a real-time breakdown of your tax estimate on the right side of the screen.
- **100% Private & Secure:** No backend, no databases, no cookies. All calculations run strictly in your browser. Your data never leaves your device.
- **Beautiful UI:** Built with React and Tailwind CSS for a smooth, intuitive, and jargon-free user experience.

## Tech Stack

- **Framework:** React 18 (via Vite 6)
- **Styling:** Tailwind CSS 3.4
- **Fonts:** Inter (Google Fonts)
- **Deployment:** Zero-config static site (can be deployed anywhere)

## Running Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd TaxCalculatorApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready static files will be generated in the `dist` directory.

## Constraints & Scope

- **Target Audience:** Salaried employees (not freelancers, businesses, or professionals).
- **Out of Scope:** Surcharge, capital gains, rental income (as landlord), and freelance income.
- **Architecture:** Client-side only. State is managed via React `useState` without external routing libraries.

## License

This project is intended for educational and personal use.
