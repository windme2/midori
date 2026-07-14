'use client'

import { useState } from 'react'
import {
  Home,
  Plus,
  User,
  Recycle,
  Leaf,
  QrCode,
  ScanLine,
  ClipboardList,
  X,
  ArrowRight,
  Zap,
  Gift,
  Check,
  TrendingUp,
  Coffee,
  ShoppingBag,
  Utensils,
  Smartphone,
  RefreshCcw,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Package,
  CircuitBoard,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type View = 'landing' | 'auth' | 'app'
type Role = 'member' | 'staff'
type Tab = 'home' | 'deposit' | 'profile'
type WasteType = 'Plastic' | 'Paper' | 'Glass' | 'Organic' | 'E-waste'

interface Activity {
  id: number
  title: string
  location: string
  time: string
  points: number
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 1, title: 'Bottle deposit', location: 'Kelvin Market', time: 'Today', points: 30 },
  { id: 2, title: 'Paper bundle', location: 'Midori Hub - East', time: 'Yesterday', points: 45 },
  { id: 3, title: 'Glass jars x6', location: 'Kelvin Market', time: '2 days ago', points: 24 },
  { id: 4, title: 'E-waste drop-off', location: 'Central Station', time: 'Last week', points: 120 },
]

const HISTORY_LOG = [
  { id: 1, title: 'Plastic deposit — 2.4 kg', date: 'Jul 12, 2026', points: '+72', positive: true },
  { id: 2, title: 'Redeemed: Coffee Voucher', date: 'Jul 10, 2026', points: '-450', positive: false },
  { id: 3, title: 'Paper deposit — 3.1 kg', date: 'Jul 08, 2026', points: '+46', positive: true },
  { id: 4, title: 'Glass deposit — 1.8 kg', date: 'Jul 05, 2026', points: '+27', positive: true },
  { id: 5, title: 'Redeemed: Eco Tote Bag', date: 'Jul 01, 2026', points: '-600', positive: false },
  { id: 6, title: 'E-waste deposit — 0.9 kg', date: 'Jun 28, 2026', points: '+120', positive: true },
]

const REWARDS = [
  { id: 1, name: 'Bamboo Utensil Kit', cost: '1,200 pts', icon: Utensils },
  { id: 2, name: 'Coffee Shop Voucher', cost: '450 pts', icon: Coffee },
  { id: 3, name: 'Eco Tote Bag', cost: '600 pts', icon: ShoppingBag },
]

const WASTE_TYPES: { name: WasteType; icon: typeof Recycle }[] = [
  { name: 'Plastic', icon: Recycle },
  { name: 'Paper', icon: Package },
  { name: 'Glass', icon: Droplets },
  { name: 'Organic', icon: Leaf },
  { name: 'E-waste', icon: CircuitBoard },
]

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function MidoriApp() {
  const [view, setView] = useState<View>('landing')
  const [role, setRole] = useState<Role>('member')
  const [tab, setTab] = useState<Tab>('home')

  const launchApp = (selectedRole: Role) => {
    setRole(selectedRole)
    setTab(selectedRole === 'staff' ? 'deposit' : 'home')
    setView('app')
  }

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('auth')} />
  }

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} onLogin={launchApp} />
  }

  return (
    <MobileApp
      role={role}
      onRoleChange={(r) => {
        setRole(r)
        setTab(r === 'staff' ? 'deposit' : 'home')
      }}
      tab={tab}
      onTabChange={setTab}
      onExit={() => setView('landing')}
    />
  )
}

// ---------------------------------------------------------------------------
// SCREEN 1 — Landing Page
// ---------------------------------------------------------------------------

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#2B2E2C]">
      {/* Navigation */}
      <header className="border-b border-[#EAEAE6]">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5F7A61]">
              <Leaf className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">midori.</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-[#2B2E2C]/70 md:flex">
            <a href="#features" className="transition-colors hover:text-[#5F7A61]">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-[#5F7A61]">
              How it works
            </a>
            <a href="#rewards" className="transition-colors hover:text-[#5F7A61]">
              Rewards
            </a>
          </div>
          <button
            onClick={onLaunch}
            className="rounded-xl bg-[#2B2E2C] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Launch App
          </button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EAEAE6] bg-white px-4 py-1.5 text-xs font-medium text-[#5F7A61]">
            <Recycle className="h-3.5 w-3.5" aria-hidden="true" />
            Waste Bank Platform
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
            เปลี่ยนขยะรีไซเคิลของคุณให้เป็น{' '}
            <span className="text-[#5F7A61]">รางวัลดิจิทัล</span> อย่างง่ายดาย
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-[#2B2E2C]/60">
            Deposit recyclables at any Midori point, earn digital points in real-time, and redeem
            them for eco-friendly rewards. Clean planet, clean interface.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5F7A61] px-8 py-4 font-medium text-white transition-opacity hover:opacity-95"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE6] bg-white px-8 py-4 font-medium text-[#2B2E2C] transition-colors hover:border-[#5F7A61]/40"
            >
              Explore Features
            </a>
          </div>
          {/* Hero metric strip */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#EAEAE6] bg-[#EAEAE6]">
            {[
              { value: '48.2t', label: 'Waste recycled' },
              { value: '12,940', label: 'Active members' },
              { value: '31.5t', label: 'CO2 saved' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-4 py-6">
                <p className="font-mono text-xl font-semibold text-[#2B2E2C] md:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#2B2E2C]/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="border-t border-[#EAEAE6] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="text-sm font-medium text-[#5F7A61]">Features</p>
            <h2 className="mt-2 max-w-md text-balance text-3xl font-bold tracking-tight">
              A serene system for a cleaner cycle
            </h2>
            <div id="how" className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Smartphone,
                  title: 'PWA Experience',
                  desc: 'Install Midori straight to your home screen. Fast, offline-ready, and native-feeling on every device.',
                },
                {
                  icon: Zap,
                  title: 'Real-time Points',
                  desc: 'Every deposit is weighed and converted into points instantly, with a transparent per-kilogram rate.',
                },
                {
                  icon: Gift,
                  title: 'Eco Rewards',
                  desc: 'Redeem points for sustainable goods, local vouchers, and community perks in the marketplace.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#EAEAE6] bg-[#FBFBFA] p-8 transition-colors hover:border-[#5F7A61]/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5F7A61]/10">
                    <feature.icon className="h-5 w-5 text-[#5F7A61]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2B2E2C]/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section id="rewards" className="border-t border-[#EAEAE6]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
            <h2 className="max-w-lg text-balance text-3xl font-bold tracking-tight">
              Ready to turn waste into worth?
            </h2>
            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2B2E2C] px-8 py-4 font-medium text-white transition-opacity hover:opacity-90"
            >
              Launch App
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#EAEAE6]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-[#2B2E2C]/50">
          <span className="font-semibold text-[#2B2E2C]">midori.</span>
          <span>© 2026 Midori Waste Bank</span>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SCREEN 2 — Authentication Page
// ---------------------------------------------------------------------------

function AuthPage({ onBack, onLogin }: { onBack: () => void; onLogin: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>('member')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBFBFA] px-6 py-12 text-[#2B2E2C]">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm text-[#2B2E2C]/60 transition-colors hover:text-[#5F7A61]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5F7A61]">
          <Leaf className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        </span>
        <span className="font-bold text-[#2B2E2C]">midori.</span>
      </button>

      <div className="w-full max-w-sm rounded-2xl border border-[#EAEAE6] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm leading-relaxed text-[#2B2E2C]/50">
          Sign in to continue your recycling journey.
        </p>

        {/* Role selector */}
        <div
          className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-1.5"
          role="radiogroup"
          aria-label="Preview role"
        >
          <button
            role="radio"
            aria-checked={selectedRole === 'member'}
            onClick={() => setSelectedRole('member')}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              selectedRole === 'member'
                ? 'bg-[#5F7A61] text-white'
                : 'text-[#2B2E2C]/60 hover:text-[#2B2E2C]'
            }`}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Resident
          </button>
          <button
            role="radio"
            aria-checked={selectedRole === 'staff'}
            onClick={() => setSelectedRole('staff')}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              selectedRole === 'staff'
                ? 'bg-[#5F7A61] text-white'
                : 'text-[#2B2E2C]/60 hover:text-[#2B2E2C]'
            }`}
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Staff
          </button>
        </div>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onLogin(selectedRole)
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#2B2E2C]/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aiko@example.com"
              className="rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] px-4 py-3 font-mono text-sm text-[#2B2E2C] placeholder:text-[#2B2E2C]/30 focus:border-[#5F7A61] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[#2B2E2C]/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] px-4 py-3 font-mono text-sm text-[#2B2E2C] placeholder:text-[#2B2E2C]/30 focus:border-[#5F7A61] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#5F7A61] py-3.5 font-medium text-white transition-opacity hover:opacity-95"
          >
            {selectedRole === 'member' ? 'Continue as Resident Member' : 'Continue as Staff / Collector'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#2B2E2C]/40">
          {"Don't have an account? "}
          <button
            onClick={() => onLogin(selectedRole)}
            className="font-medium text-[#5F7A61] hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile App shell — SCREENS 3–5
// ---------------------------------------------------------------------------

function MobileApp({
  role,
  onRoleChange,
  tab,
  onTabChange,
  onExit,
}: {
  role: Role
  onRoleChange: (role: Role) => void
  tab: Tab
  onTabChange: (tab: Tab) => void
  onExit: () => void
}) {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES)
  const [showQr, setShowQr] = useState(false)
  const [depositBanner, setDepositBanner] = useState<string | null>(null)

  const logDeposit = (wasteType: WasteType, weight: string) => {
    setDepositBanner(`Deposit Logged: Your ${wasteType} deposit has been recorded`)
    setActivities((prev) => [
      {
        id: Date.now(),
        title: `${wasteType} deposit`,
        location: 'Midori Hub - East',
        time: 'Just now',
        points: Math.max(10, Math.round(Number.parseFloat(weight || '1') * 15)),
      },
      ...prev,
    ])
  }

  return (
    <div className="min-h-screen bg-[#EAEAE6]/40">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-[#EAEAE6] bg-[#FBFBFA] shadow-2xl">
        {/* Floating role switcher */}
        <div className="sticky top-0 z-30 border-b border-[#EAEAE6] bg-[#FBFBFA]/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 text-sm font-bold text-[#2B2E2C]"
              aria-label="Exit to landing page"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5F7A61]">
                <Leaf className="h-3 w-3 text-white" aria-hidden="true" />
              </span>
              midori.
            </button>
            <div
              className="flex items-center gap-1 rounded-full border border-[#EAEAE6] bg-white p-1"
              role="radiogroup"
              aria-label="Switch preview role"
            >
              <button
                role="radio"
                aria-checked={role === 'member'}
                onClick={() => onRoleChange('member')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  role === 'member' ? 'bg-[#5F7A61] text-white' : 'text-[#2B2E2C]/50'
                }`}
              >
                Member Mode
              </button>
              <button
                role="radio"
                aria-checked={role === 'staff'}
                onClick={() => onRoleChange('staff')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  role === 'staff' ? 'bg-[#2B2E2C] text-white' : 'text-[#2B2E2C]/50'
                }`}
              >
                Staff Mode
              </button>
            </div>
          </div>
        </div>

        {/* Screen content */}
        <main className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
          {tab === 'home' && (
            <HomeTab
              activities={activities}
              onOpenQr={() => setShowQr(true)}
              onGoDeposit={() => onTabChange('deposit')}
            />
          )}
          {tab === 'deposit' && (
            <DepositTab role={role} banner={depositBanner} onLogDeposit={logDeposit} />
          )}
          {tab === 'profile' && <ProfileTab />}
        </main>

        {/* Bottom navigation */}
        <nav
          className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-x border-[#EAEAE6] bg-white"
          aria-label="App navigation"
        >
          <div className="grid grid-cols-3">
            {(
              [
                { key: 'home', label: 'Home', icon: Home },
                { key: 'deposit', label: 'Deposit', icon: Plus },
                { key: 'profile', label: 'Profile', icon: User },
              ] as const
            ).map((item) => {
              const active = tab === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                    active ? 'text-[#5F7A61]' : 'text-[#2B2E2C]/40 hover:text-[#2B2E2C]/70'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                      active ? 'bg-[#5F7A61]/10' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* QR modal */}
        {showQr && <QrModal onClose={() => setShowQr(false)} />}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SCREEN 3 — Home Tab (Resident Member Dashboard)
// ---------------------------------------------------------------------------

function HomeTab({
  activities,
  onOpenQr,
  onGoDeposit,
}: {
  activities: Activity[]
  onOpenQr: () => void
  onGoDeposit: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <p className="text-sm text-[#2B2E2C]/50">Welcome back,</p>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">Aiko</h1>
      </div>

      {/* Grand Point Card */}
      <section
        aria-label="Point balance"
        className="rounded-2xl bg-[#2B2E2C] p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-white/50">
            Total Balance
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#5F7A61] px-2.5 py-1 text-xs font-medium text-white">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            +120 this week
          </span>
        </div>
        <p className="mt-4 font-mono text-5xl font-semibold tracking-tight">
          1,420
          <span className="ml-2 text-lg font-normal text-white/50">pts</span>
        </p>
        <div className="mt-5 h-px bg-white/10" />
        <p className="mt-4 text-xs text-white/40">
          Next reward tier at <span className="font-mono text-[#D9A05B]">2,000 pts</span>
        </p>
      </section>

      {/* Eco-Metrics Grid */}
      <section aria-label="Eco metrics" className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#EAEAE6] bg-white p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5F7A61]/10">
            <Recycle className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
          </span>
          <p className="mt-3 font-mono text-2xl font-semibold text-[#2B2E2C]">12.4 kg</p>
          <p className="mt-0.5 text-xs text-[#2B2E2C]/50">Recycled</p>
        </div>
        <div className="rounded-2xl border border-[#EAEAE6] bg-white p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5F7A61]/10">
            <Leaf className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
          </span>
          <p className="mt-3 font-mono text-2xl font-semibold text-[#2B2E2C]">8.9 kg</p>
          <p className="mt-0.5 text-xs text-[#2B2E2C]/50">CO2 saved</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAEAE6] bg-white py-5 text-xs font-medium text-[#2B2E2C] transition-colors hover:border-[#5F7A61]/40">
            <ScanLine className="h-5 w-5 text-[#5F7A61]" aria-hidden="true" />
            Scan Item
          </button>
          <button
            onClick={onGoDeposit}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAEAE6] bg-white py-5 text-xs font-medium text-[#2B2E2C] transition-colors hover:border-[#5F7A61]/40"
          >
            <Plus className="h-5 w-5 text-[#5F7A61]" aria-hidden="true" />
            Log Deposit
          </button>
          <button
            onClick={onOpenQr}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAEAE6] bg-white py-5 text-xs font-medium text-[#2B2E2C] transition-colors hover:border-[#5F7A61]/40"
          >
            <QrCode className="h-5 w-5 text-[#5F7A61]" aria-hidden="true" />
            My QR
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section aria-label="Recent activity">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">Recent Activity</h2>
        <div className="mt-3 rounded-2xl border border-[#EAEAE6] bg-white">
          {activities.map((activity, i) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between gap-3 px-5 py-4 ${
                i !== 0 ? 'border-t border-[#EAEAE6]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBFBFA]">
                  <RefreshCcw className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#2B2E2C]">{activity.title}</p>
                  <p className="text-xs text-[#2B2E2C]/45">
                    {activity.location} · {activity.time}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-semibold text-[#5F7A61]">
                +{activity.points}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SCREEN 4 — Deposit Tab (Staff / Collector Portal)
// ---------------------------------------------------------------------------

function DepositTab({
  role,
  banner,
  onLogDeposit,
}: {
  role: Role
  banner: string | null
  onLogDeposit: (wasteType: WasteType, weight: string) => void
}) {
  const [selectedType, setSelectedType] = useState<WasteType>('Plastic')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [checklist, setChecklist] = useState({
    rinse: false,
    flatten: false,
    separate: false,
  })

  const checklistItems = [
    { key: 'rinse' as const, label: 'Rinse Containers', icon: Droplets },
    { key: 'flatten' as const, label: 'Flatten Cardboard', icon: Package },
    { key: 'separate' as const, label: 'Separate E-waste', icon: CircuitBoard },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">
          Deposit &amp; Schedule Pickup
        </h1>
        <p className="mt-1 text-sm text-[#2B2E2C]/50">
          {role === 'staff' ? 'Staff / Collector Portal' : 'Log your recyclables in seconds.'}
        </p>
      </div>

      {/* Active transaction banner */}
      {banner && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#5F7A61]/30 bg-[#5F7A61]/10 p-4"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5F7A61]">
            <Check className="h-3 w-3 text-white" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-[#2B2E2C]">{banner}</p>
        </div>
      )}

      {/* Waste Type Selector */}
      <section aria-label="Waste type">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">Waste Type</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Select waste type">
          {WASTE_TYPES.map((type) => {
            const active = selectedType === type.name
            return (
              <button
                key={type.name}
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedType(type.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-[#5F7A61] bg-[#5F7A61] text-white'
                    : 'border-[#EAEAE6] bg-white text-[#2B2E2C]/70 hover:border-[#5F7A61]/40'
                }`}
              >
                <type.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {type.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Input Form */}
      <section aria-label="Deposit details" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="weight" className="text-xs font-medium text-[#2B2E2C]/70">
            Weight / Quantity (kg)
          </label>
          <input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="rounded-xl border border-[#EAEAE6] bg-white px-4 py-3.5 font-mono text-lg text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:border-[#5F7A61] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs font-medium text-[#2B2E2C]/70">
            Notes <span className="text-[#2B2E2C]/40">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Mixed PET bottles, labels removed"
            className="resize-none rounded-xl border border-[#EAEAE6] bg-white px-4 py-3 text-sm leading-relaxed text-[#2B2E2C] placeholder:text-[#2B2E2C]/30 focus:border-[#5F7A61] focus:outline-none"
          />
        </div>
      </section>

      {/* Operational Checklist */}
      <section aria-label="Operational checklist" className="rounded-2xl border border-[#EAEAE6] bg-white p-5">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">Preparation Checklist</h2>
        <div className="mt-4 flex flex-col gap-3">
          {checklistItems.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
                <span className="text-sm text-[#2B2E2C]/80">{item.label}</span>
              </span>
              <span className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(e) =>
                    setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="peer h-5 w-5 appearance-none rounded-md border border-[#EAEAE6] bg-[#FBFBFA] transition-colors checked:border-[#5F7A61] checked:bg-[#5F7A61]"
                />
                <Check
                  className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Primary CTA */}
      <button
        onClick={() => onLogDeposit(selectedType, weight)}
        className="w-full rounded-xl bg-[#5F7A61] py-4 font-medium text-white transition-opacity hover:bg-opacity-95"
      >
        Schedule Pickup / Log Deposit
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SCREEN 5 — Profile & Rewards Tab (Eco Marketplace)
// ---------------------------------------------------------------------------

function ProfileTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Identity card */}
      <section
        aria-label="Profile"
        className="flex items-center gap-4 rounded-2xl border border-[#EAEAE6] bg-white p-5"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5F7A61] font-mono text-lg font-semibold text-white">
          AK
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-[#2B2E2C]">Aiko Kurokawa</h1>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#5F7A61]/10 px-2.5 py-1 text-xs font-medium text-[#5F7A61]">
            <Award className="h-3 w-3" aria-hidden="true" />
            Emerald Member
          </span>
          <p className="mt-1.5 text-xs text-[#2B2E2C]/45">Member since July 2026</p>
        </div>
      </section>

      {/* Rewards marketplace */}
      <section aria-label="Rewards">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Rewards</h2>
          <span className="font-mono text-xs text-[#2B2E2C]/50">
            Balance: <span className="font-semibold text-[#5F7A61]">1,420 pts</span>
          </span>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {REWARDS.map((reward) => (
            <div
              key={reward.id}
              className="w-40 shrink-0 rounded-2xl border border-[#EAEAE6] bg-white p-4"
            >
              <div className="flex h-20 items-center justify-center rounded-xl bg-[#FBFBFA]">
                <reward.icon className="h-8 w-8 text-[#5F7A61]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-medium leading-snug text-[#2B2E2C]">{reward.name}</p>
              <p className="mt-1 font-mono text-xs text-[#D9A05B]">{reward.cost}</p>
              <button className="mt-3 w-full rounded-lg border border-[#EAEAE6] py-2 text-xs font-medium text-[#2B2E2C] transition-colors hover:border-[#5F7A61] hover:text-[#5F7A61]">
                Redeem
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* History log */}
      <section aria-label="Transaction history">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">History</h2>
        <div className="mt-3 rounded-2xl border border-[#EAEAE6] bg-white">
          {HISTORY_LOG.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between gap-3 px-5 py-4 ${
                i !== 0 ? 'border-t border-[#EAEAE6]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    entry.positive ? 'bg-[#5F7A61]/10' : 'bg-[#D9A05B]/10'
                  }`}
                >
                  {entry.positive ? (
                    <ArrowUpRight className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-[#D9A05B]" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#2B2E2C]">{entry.title}</p>
                  <p className="text-xs text-[#2B2E2C]/45">{entry.date}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${
                  entry.positive
                    ? 'bg-[#5F7A61]/10 text-[#5F7A61]'
                    : 'bg-[#D9A05B]/15 text-[#D9A05B]'
                }`}
              >
                {entry.points}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QR Modal
// ---------------------------------------------------------------------------

function QrModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[#2B2E2C]/50 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Member QR code"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Member QR</h2>
          <button
            onClick={onClose}
            aria-label="Close QR modal"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#2B2E2C]/50 transition-colors hover:bg-[#FBFBFA] hover:text-[#2B2E2C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mock QR grid */}
        <div className="mx-auto mt-5 w-fit rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-4">
          <div
            className="grid grid-cols-11 gap-0.5"
            aria-hidden="true"
          >
            {Array.from({ length: 121 }).map((_, i) => {
              // Deterministic pseudo-random pattern for a QR look
              const filled =
                (i * 7 + 3) % 5 < 2 ||
                i < 3 ||
                i % 11 < 2 ||
                (i > 100 && i % 3 === 0)
              return (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-[2px] ${
                    filled ? 'bg-[#2B2E2C]' : 'bg-transparent'
                  }`}
                />
              )
            })}
          </div>
        </div>

        <p className="mt-4 font-mono text-sm font-semibold text-[#2B2E2C]">MDR-2026-0714-AIKO</p>
        <p className="mt-1 text-xs leading-relaxed text-[#2B2E2C]/50">
          Show this code at any Midori collection point to link deposits to your account.
        </p>
      </div>
    </div>
  )
}
