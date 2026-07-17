# Midori — Waste Bank Platform

> **Japandi Minimalist Eco-tech** — Turn recyclable waste into digital rewards.

A Progressive Web Application (PWA) for digitising community waste-bank operations. Residents deposit recyclables, staff/admin log collections in real-time, and points are redeemed for eco-friendly rewards. Backed by a Prisma + SQLite database for full session, user, and transaction persistence.

---

## ✨ Features

| Area                  | What it does                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| **Landing page**      | Japandi minimalist marketing page with a liquid image mask frame, centered timeline, and 2-button CTA containing dual-platform iOS/Android scan-to-download PWA/APK badges. |
| **Auth System**       | Real database authentication with session tokens (`login`, `register`, `me`, `logout`). Supporting roles for `member`, `staff`, and `admin`. |
| **Home Dashboard**    | Live point balance, dynamic recycled weight progress tracker, CO₂ saved offset, active daily challenge progress, and dynamic pie chart visualization. |
| **Recycle Chart**     | SVG line chart showing real-time `Recycle Breakdown` dynamically computed from database logs over `DAY`, `WEEK`, and `MONTH` periods with clean edge tooltips. |
| **Deposit System**    | Member cart basket deposits and staff-facing collection queue triggers with comprehensive verification checklists and quality checks. |
| **Voucher Marketplace**| Balance-aware item redemption with expiration tracking and dynamic generated barcodes. |
| **Real QR Codes**     | Dynamically generated scannable QR codes for download links, member IDs, vouchers, and booking passes using `qrcode`. |

---

## 🗂 Project Structure

```
midori-waste-bank/
├── prisma/
│   ├── schema.prisma        # Database models (User, Session, DepositRequest, TransactionLog)
│   ├── dev.db               # SQLite local database (ignored in git)
│   └── seed.js              # Initial database seed (user01 points, stats, and logs alignment)
│
├── src/
│   ├── app/
│   │   ├── api/             # Backend route handlers (auth, deposit, staff, rewards, goal)
│   │   ├── globals.css      # Core styles, design tokens, and CSS animations
│   │   ├── layout.tsx       # Root layout shell
│   │   └── page.tsx         # Next.js app entry point
│   │
│   ├── components/
│   │   ├── app/
│   │   │   ├── modals/      # Dialog popups (QrModal, BookingPassModal, RedemptionModal)
│   │   │   ├── DepositTab.tsx   # Member basket deposit cart
│   │   │   ├── HomeTab.tsx      # Dashboard stats, challenge trackers, and dynamic SVG line chart
│   │   │   ├── ProfileTab.tsx   # User profile, dynamic tier progression, and eco-marketplace
│   │   │   ├── MobileApp.tsx    # Root member shell, modal handlers, and state syncer
│   │   │   └── staff/           # Staff views (AdminLogTab, AdminCollectTab, StaffDashboard)
│   │   ├── auth/
│   │   │   └── AuthPage.tsx     # Clean login, registration, and onboarding panels
│   │   └── landing/
│   │       └── LandingPage.tsx  # Marketing page, interactive rate calculator, and brand concepts
│   │
│   ├── lib/
│   │   ├── auth.ts          # JWT-based session security handlers
│   │   ├── db.ts            # Prisma client instance singleton
│   │   └── utils.ts         # Base styles merging utility
│   │
│   └── types/
│       └── index.ts         # Shared TypeScript models and prop types
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+ (`npm i -g pnpm`)

### Installation

1. Install package dependencies:
   ```bash
   pnpm install
   ```

2. Initialize the database and run seeds:
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

### Development

Start the local development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

---

## 🛠 Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                           |
| Database        | SQLite via Prisma ORM                             |
| QR Generation   | QRCode (Dynamic scannable canvas/image)          |
| Styling         | Tailwind CSS v4                                   |
| Package Manager | pnpm                                              |

---

## 📄 License

MIT © 2026 Midori Waste Bank
