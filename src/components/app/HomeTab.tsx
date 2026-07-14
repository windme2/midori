'use client'

import { useState } from 'react'
import {
  ScanLine, Plus, Recycle, ChevronRight, Leaf, Eye, EyeOff, Bell, Droplets, Package, CircuitBoard,
  CloudRain, RefreshCcw, Calendar, Gift
} from 'lucide-react'
import { useRef, useEffect } from 'react'
import type { Activity, AppStats, UserProfile, HistoryEntry } from '@/types'
import { getTodaysChallenge } from '@/data/daily-challenges'

interface HomeTabProps {
  role: string
  profile: UserProfile
  activities: Activity[]
  stats: AppStats
  weeklyPointGoal: number
  historyLog: HistoryEntry[]
  onOpenQr: () => void
  onGoDeposit: () => void
  onOpenScan: () => void
  onGoRedeem: () => void
  onGoHistory: () => void
  onOpenGuide: () => void
  challengeCompleted: boolean
  challengeClaimed: boolean
  onClaimChallengePoints: () => void
  onSimulateCompleteChallenge: () => void
  onOpenNotifications: () => void
  onOpenNews: (news: any) => void
  bookingTicket: any | null
  onCloseBookingTicket: () => void
  hasUnreadNotifications?: boolean
}

type Period = 'day' | 'week' | 'month'

const getActivityStyle = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes('plastic') || t.includes('pet')) {
    return {
      bg: 'bg-blue-50 text-blue-500 border-blue-100',
      icon: Droplets
    }
  }
  if (t.includes('paper') || t.includes('cardboard')) {
    return {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      icon: Package
    }
  }
  if (t.includes('glass')) {
    return {
      bg: 'bg-sky-50 text-sky-500 border-sky-100',
      icon: Droplets
    }
  }
  if (t.includes('organic')) {
    return {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: Leaf
    }
  }
  if (t.includes('e-waste') || t.includes('battery')) {
    return {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      icon: CircuitBoard
    }
  }
  return {
    bg: 'bg-slate-50 text-slate-600 border-slate-100',
    icon: Recycle
  }
}

export function HomeTab({
  role,
  profile,
  activities,
  stats,
  weeklyPointGoal,
  onOpenQr,
  onGoDeposit,
  onOpenScan,
  onGoRedeem,
  onGoHistory,
  onOpenGuide,
  challengeCompleted,
  challengeClaimed,
  onClaimChallengePoints,
  onSimulateCompleteChallenge,
  onOpenNotifications,
  onOpenNews,
  bookingTicket,
  onCloseBookingTicket,
  hasUnreadNotifications,
  historyLog
}: HomeTabProps) {
  const { totalPoints, recycledKg, co2SavedKg } = stats
  const [period, setPeriod] = useState<Period>('week')
  const [showPoints, setShowPoints] = useState(true)
  const [activeChartPointIdx, setActiveChartPointIdx] = useState<number | null>(null)


  const percentage = Math.min(100, Math.round((totalPoints / weeklyPointGoal) * 100))

  // SVG Chart points calculation based on selected period and history log data
  const getChartData = (): { x: number; y: number; label: string; val: number }[] => {
    switch (period) {
      case 'day': {
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return d
        })
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dayVals = last7Days.map((date) => {
          const dateStr = date.toDateString()
          return (historyLog || [])
            .filter((log) => {
              if (!log.positive || !log.weight) return false
              const logDate = log.createdAt ? new Date(log.createdAt) : null
              return logDate ? logDate.toDateString() === dateStr : false
            })
            .reduce((acc, log) => acc + (log.weight || 0), 0)
        })
        const maxVal = Math.max(...dayVals, 1.0)
        return dayVals.map((val, idx) => ({
          x: 35 + idx * 38,
          y: Math.max(35, 100 - (val / maxVal) * 60),
          label: days[last7Days[idx].getDay()],
          val
        }))
      }
      case 'week': {
        const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
          const now = new Date()
          const end = new Date(now.getTime() - (3 - i) * 7 * 24 * 60 * 60 * 1000)
          const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
          return { start, end }
        })
        const wkVals = last4Weeks.map((wk) => {
          return (historyLog || [])
            .filter((log) => {
              if (!log.positive || !log.weight) return false
              const logDate = log.createdAt ? new Date(log.createdAt) : null
              if (!logDate) return false
              const logTime = logDate.getTime()
              return logTime >= wk.start.getTime() && logTime < wk.end.getTime()
            })
            .reduce((acc, log) => acc + (log.weight || 0), 0)
        })
        const maxVal = Math.max(...wkVals, 1.0)
        return wkVals.map((val, idx) => ({
          x: 45 + idx * 70,
          y: Math.max(35, 100 - (val / maxVal) * 60),
          label: `W${idx + 1}`,
          val
        }))
      }
      case 'month':
      default: {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date()
          d.setMonth(d.getMonth() - (5 - i))
          return { month: d.getMonth(), year: d.getFullYear(), label: monthNames[d.getMonth()] }
        })
        const moVals = last6Months.map((mo) => {
          return (historyLog || [])
            .filter((log) => {
              if (!log.positive || !log.weight) return false
              const logDate = log.createdAt ? new Date(log.createdAt) : null
              return logDate ? logDate.getMonth() === mo.month && logDate.getFullYear() === mo.year : false
            })
            .reduce((acc, log) => acc + (log.weight || 0), 0)
        })
        const maxVal = Math.max(...moVals, 1.0)
        return moVals.map((val, idx) => ({
          x: 35 + idx * 46,
          y: Math.max(35, 100 - (val / maxVal) * 60),
          label: last6Months[idx].label,
          val
        }))
      }
    }
  }

  const chartPoints = getChartData()
  const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = chartPoints.length > 0 
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} 100 L ${chartPoints[0].x} 100 Z`
    : ''

  const baseBreakdown = stats.breakdown || {
    Plastic: 6.2,
    Paper: 3.5,
    Glass: 2.7,
    Organic: 0.0,
    'E-waste': 0.0,
    Other: 0.0,
  }

  const scale = period === 'day' ? 0.15 : period === 'week' ? 1.0 : period === 'month' ? 4.0 : 48.0
  const breakdown = {
    Plastic: baseBreakdown.Plastic * scale,
    Paper: baseBreakdown.Paper * scale,
    Glass: baseBreakdown.Glass * scale,
    Organic: (baseBreakdown.Organic || 0) * scale,
    'E-waste': (baseBreakdown['E-waste'] || 0) * scale,
    Other: (baseBreakdown.Other || 0) * scale,
  }

  return (
    <div className="animate-tab-fade flex flex-col gap-5">

      {/* ── 1. Welcome header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between text-left">
        <div>
          <span className="inline-block bg-[#5F7A61]/10 text-[#3A5C3C] text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md mb-1 border border-[#5F7A61]/15">
            {profile.tier || 'Member'}
          </span>
          <h1 className="text-xl font-extrabold text-[#2B2E2C] tracking-tight">
            Hi, {profile.name}!
          </h1>
          <p className="mt-0.5 text-xs text-[#2B2E2C]/50 font-bold uppercase tracking-wider">
            {profile.location || 'Bangna, Bangkok'}
          </p>
        </div>

        {/* Bell Notify Button */}
        <button
          onClick={onOpenNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#EAEAE6] text-[#5F7A61] shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* ── 2. Obsidian Points balance card (EcoBank Style Dark Glassmorphic with curves) ── */}
      <section
        aria-label="Points balance"
        className="animate-fade-slide-up delay-50 rounded-3xl bg-[#1A1D1B] border border-[#2B2E2C]/90 p-5 relative overflow-hidden shadow-lg text-left text-white"
      >
        {/* Elegant organic wave paths */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]" aria-hidden="true">
          <svg className="w-full h-full stroke-white" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-20,80 C10,40 40,60 70,20 C90,0 110,30 140,-10" strokeWidth="1.2" />
            <path d="M-20,100 C10,60 40,80 70,40 C90,20 110,50 140,10" strokeWidth="1.2" />
            <path d="M-20,120 C10,80 40,100 70,60 C90,40 110,70 140,30" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="tabular font-mono text-3xl font-extrabold leading-none text-white tracking-tight">
                {showPoints ? totalPoints.toLocaleString() : '••••••'}{' '}
                <span className="text-xs font-bold text-white/50 font-sans">pts</span>
              </p>
              <p className="mt-2 text-[10px] text-white/50 uppercase tracking-widest font-bold">Your points balance</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => setShowPoints(!showPoints)}
                aria-label={showPoints ? 'Hide points' : 'Show points'}
                className="text-white/55 hover:text-white transition-colors cursor-pointer"
              >
                {showPoints ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
              </button>
              {stats.showLastWeekTag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00D06C]/10 border border-[#00D06C]/25 px-2.5 py-0.5 text-[8px] font-bold text-[#00D06C]">
                  +{stats.lastWeekPoints || 0} this week
                </span>
              )}
            </div>
          </div>

          {/* Eco metrics list inside card */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/5 px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 shrink-0 text-[#00D06C]">
                <Recycle className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-xs text-white">
                  {recycledKg.toFixed(1)} kg
                </p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Recycled</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/5 px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 shrink-0 text-[#00D06C]">
                <CloudRain className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-xs text-white">
                  {co2SavedKg.toFixed(1)} kg
                </p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-0.5">CO₂ saved</p>
              </div>
            </div>
          </div>

          {/* Inline Buttons inside points card */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={onGoRedeem}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#00D06C] text-[#1A1D1B] py-2.5 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
            >
              <Gift className="h-4 w-4" />
              Redeem Points
            </button>
            <button
              onClick={onGoHistory}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/15 text-white py-2.5 text-xs font-bold transition-all hover:bg-white/15 active:scale-[0.98] cursor-pointer"
            >
              <RefreshCcw className="h-4 w-4" />
              History Log
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Weekly Progress & Breakdown Widget ── */}
      <section aria-label="Weekly Goal Progress" className="animate-fade-slide-up delay-75">
        <div className="rounded-3xl bg-white border border-[#EAEAE6] p-5 flex flex-col gap-4 shadow-sm text-left relative overflow-hidden">
          
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#2B2E2C]/40 uppercase tracking-wider">Weekly Progress</span>
            <span className={`font-mono font-bold px-2.5 py-0.5 rounded-lg ${
              percentage >= 100 
                ? 'text-[#00D06C] bg-[#00D06C]/10' 
                : 'text-[#5F7A61] bg-[#5F7A61]/10'
            }`}>
              {percentage >= 100 ? 'Completed' : `${percentage}% In progress`}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-[#2B2E2C] mb-1.5">
              <span>Goal Target Tracker</span>
              <span className="font-mono">{totalPoints.toLocaleString()} pts / {weeklyPointGoal.toLocaleString()} pts</span>
            </div>
            <div className="h-2 w-full bg-[#F4F6F3] rounded-full overflow-hidden">
              <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-[#2B2E2C]/50 font-medium">
            {totalPoints >= weeklyPointGoal
              ? "Fantastic! You've crushed your weekly points goal. Keep recycling to earn more points!"
              : `You are just ${(weeklyPointGoal - totalPoints).toLocaleString()} pts away from unlocking your weekly eco-badge and earning +50 bonus points.`}
          </p>

          {/* Breakdown Dashboard with Period Switcher */}
          <div className="pt-3 border-t border-[#EAEAE6] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#2B2E2C]/40 uppercase tracking-wider">Recycle Breakdown</span>
              
              {/* Day, Week, Month Switcher */}
              <div className="flex bg-[#F4F6F3] rounded-lg p-0.5 gap-0.5 border border-[#EAEAE6]">
                {(['day', 'week', 'month'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-md transition-colors ${
                      period === p
                        ? 'bg-white text-[#5F7A61] shadow-xs'
                        : 'text-[#2B2E2C]/40 hover:text-[#2B2E2C]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic SVG Line Chart (Expanded & Highly Visible) */}
            <div className="bg-[#FBFBFA] border border-[#EAEAE6] rounded-2xl p-4 shadow-xs">
              <svg viewBox="0 0 300 130" className="w-full h-36 overflow-hidden">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5F7A61" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5F7A61" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="15" y1="20" x2="285" y2="20" stroke="#F0F0EE" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="15" y1="60" x2="285" y2="60" stroke="#F0F0EE" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="15" y1="100" x2="285" y2="100" stroke="#EAEAE6" strokeWidth="1" />

                {/* Fill area */}
                {areaD && <path d={areaD} fill="url(#chart-grad)" />}

                {/* Line path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#5F7A61"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Dots, Labels, & Interactive Tooltips */}
                {chartPoints.map((p, idx) => (
                  <g key={idx}>
                    {/* Invisible larger hover zone for easier touch target click */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="12"
                      className="fill-transparent cursor-pointer"
                      onClick={() => setActiveChartPointIdx(activeChartPointIdx === idx ? null : idx)}
                    />
                    
                    {/* Visible data point dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      onClick={() => setActiveChartPointIdx(activeChartPointIdx === idx ? null : idx)}
                      className={`cursor-pointer stroke-white stroke-2 transition-all ${
                        activeChartPointIdx === idx ? 'fill-[#00D06C]' : 'fill-[#5F7A61]'
                      }`}
                    />

                    {/* Numeric Value Label above the dot */}
                    <text
                      x={p.x}
                      y={p.y - 9}
                      textAnchor="middle"
                      className="font-mono font-extrabold text-[8px] fill-[#2B2E2C]/70 pointer-events-none"
                    >
                      {p.val.toFixed(1)}
                    </text>

                    {/* Axis Date Label below the chart base */}
                    <text
                      x={p.x}
                      y="118"
                      textAnchor="middle"
                      className="font-mono font-extrabold text-[8.5px] fill-[#2B2E2C]/50 pointer-events-none"
                    >
                      {p.label}
                    </text>

                    {/* Real-time interactive glassmorphism tooltip popup */}
                    {activeChartPointIdx === idx && (
                      <g className="animate-fade-in pointer-events-none">
                        <rect
                          x={p.x - 28}
                          y={p.y - 28}
                          width="56"
                          height="15"
                          rx="4"
                          className="fill-[#2B2E2C] opacity-95 shadow-md"
                        />
                        <text
                          x={p.x}
                          y={p.y - 18}
                          textAnchor="middle"
                          className="fill-white font-mono font-extrabold text-[7px]"
                        >
                          {p.val.toFixed(1)} kg
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-[#2B2E2C]/70">
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#5F7A61]" /> Plastic</span>
                <span className="font-mono font-bold">{breakdown.Plastic.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#D9A05B]" /> Paper</span>
                <span className="font-mono font-bold">{breakdown.Paper.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> Glass</span>
                <span className="font-mono font-bold">{breakdown.Glass.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Organic</span>
                <span className="font-mono font-bold">{breakdown.Organic.toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-400" /> E-waste</span>
                <span className="font-mono font-bold">{breakdown['E-waste'].toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between bg-[#F5F6F4] px-2.5 py-1.5 rounded-xl border border-[#EAEAE6]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#8A9A86]" /> Other</span>
                <span className="font-mono font-bold">{breakdown.Other.toFixed(1)} kg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Quick actions ──────────────────────────────────────────────── */}
      <section aria-label="Quick actions">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Quick actions</h2>
          <span className="text-xs text-[#2B2E2C]/40 font-semibold">Tap to start</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Log Deposit',  icon: Plus,     action: onGoDeposit,   delay: 'delay-100' },
            { label: 'Eco Guide',    icon: Leaf,     action: onOpenGuide,   delay: 'delay-150' },
          ].map(({ label, icon: Icon, action, delay }) => (
            <button
              key={label}
              onClick={action}
              className={`animate-fade-slide-up ${delay} flex items-center justify-center font-bold text-xs text-[#2B2E2C] rounded-2xl bg-white border border-[#EAEAE6] px-4 h-16 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 gap-3`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5ECE3] text-[#5F7A61]">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-left font-extrabold">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 5. Daily Challenge Card ────────────────────────────────── */}
      {(() => {
        const challenge = getTodaysChallenge()
        const diffColor = challenge.difficulty === 'easy'
          ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
          : challenge.difficulty === 'medium'
          ? 'text-amber-600 bg-amber-50 border-amber-100'
          : 'text-red-500 bg-red-50 border-red-100'
        return (
          <section aria-label="Daily Challenge" className="animate-fade-slide-up delay-100">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#2B2E2C]">Daily Challenge</h2>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2B2E2C]/35">Resets in 24h</span>
            </div>
            <div className="rounded-2xl bg-white border border-[#EAEAE6] p-4 shadow-sm flex flex-col gap-3">
              <div className="flex gap-4 items-start">
                <span className="text-3xl shrink-0 leading-none mt-0.5">{challenge.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-extrabold text-[#2B2E2C] truncate">{challenge.title}</h3>
                    <span className={`shrink-0 text-[7px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${diffColor}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#2B2E2C]/55 leading-relaxed">{challenge.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#2B2E2C]/45">
                      🎯 Target: {challenge.target}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#00D06C] bg-[#00D06C]/10 px-2 py-0.5 rounded-full font-mono">
                      +{challenge.bonusPts} bonus pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & CTA block */}
              <div className="border-t border-[#EAEAE6] pt-2.5 flex items-center justify-between gap-4">
                {challengeClaimed ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px]">✓</span>
                    <span>Reward Claimed! (+{challenge.bonusPts} pts added)</span>
                  </div>
                ) : challengeCompleted ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-extrabold">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>Challenge Completed!</span>
                    </div>
                    <button
                      onClick={onClaimChallengePoints}
                      className="py-1.5 px-3 bg-[#00D06C] text-[#1A1D1B] hover:bg-[#00b85f] active:scale-95 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Claim Reward
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <span>Status: In Progress</span>
                    </div>
                    <button
                      onClick={onSimulateCompleteChallenge}
                      className="text-[9px] text-[#5F7A61]/80 hover:text-[#5F7A61] font-extrabold uppercase tracking-wider hover:underline bg-transparent border-none outline-none cursor-pointer"
                    >
                      Simulate Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ── 5. Recent activity ────────────────────────────────────────────── */}
      <section aria-label="Recent activity">
        <div className="mb-3 flex items-center justify-between text-left">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Recent activity</h2>
          <span className="text-[10px] text-[#2B2E2C]/40 font-bold uppercase tracking-wider">Latest logs</span>
        </div>
        <div className="flex flex-col gap-2 text-left">
          {activities.slice(0, 6).map((activity, i) => {
            const style = getActivityStyle(activity.title)
            const Icon = style.icon
            return (
              <div
                key={activity.id}
                className={`animate-fade-slide-up delay-${100 + i * 50} flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm border border-[#EAEAE6]`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${style.bg}`}>
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#2B2E2C]">
                      {activity.title} — {activity.location}
                    </p>
                    <p className="text-[9px] text-[#2B2E2C]/45 font-bold mt-0.5">
                      {activity.time === 'Just now' ? 'Today • Just now' : `${activity.time} • 10:14 AM`}
                    </p>
                  </div>
                </div>
                <span className="tabular shrink-0 font-mono text-xs font-bold text-[#5F7A61]">
                  +{activity.points}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 6. News & Campaigns (Info Section restored to Home Tab) ───────── */}
      <section aria-label="News & Campaigns" className="pb-4 text-left">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">News &amp; Campaigns</h2>
          <span className="text-[10px] text-[#2B2E2C]/40 font-bold uppercase tracking-wider">Latest updates</span>
        </div>
        <div className="flex flex-col gap-3">
          {[
            {
              id: 1,
              title: 'EcoBank Green Campaign: Planting a Thousand Trees',
              desc: 'Join our local reforestation drive. Drop off recyclables to receive bonus points and plant a tree.',
              date: '20 June 2026',
              category: 'Campaign',
              color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            },
            {
              id: 2,
              title: 'Plastic Recycling Innovation by EcoBank',
              desc: 'New sorting rules for plastics are live. Clean PET bottles are worth 2x points this week.',
              date: '18 June 2026',
              category: 'News',
              color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            },
            {
              id: 3,
              title: 'E-Waste Stewardship: Drop off batteries safely',
              desc: 'Safely recycle chemical cells, keyboards, and routers at our certified Bangna collector.',
              date: '14 June 2026',
              category: 'Innovation',
              color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenNews(item)}
              className="rounded-2xl border border-[#EAEAE6] bg-white p-4 shadow-sm flex flex-col gap-2.5 relative overflow-hidden transition-all hover:border-[#5F7A61]/35 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <span className={`text-[8px] font-extrabold uppercase tracking-wider border rounded-full px-2 py-0.5 ${item.color}`}>
                  {item.category}
                </span>
                <span className="text-[8px] text-[#2B2E2C]/40 font-bold flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {item.date}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2B2E2C] tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-[#2B2E2C]/55 leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  )
}
