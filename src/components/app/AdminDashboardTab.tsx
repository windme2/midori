'use client'

import { useState } from 'react'
import { Home, BarChart3, TrendingUp, AlertTriangle, Users, Layers, Activity, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import type { WasteType, AppStats } from '@/types'

export interface PendingDeposit {
  id: string
  memberId: string
  memberName: string
  avatar: string
  tier: string
  points: number
  wasteType: WasteType
  weight: number
  estPoints: number
  date: string
}

interface AdminDashboardTabProps {
  pendingDeposits: PendingDeposit[]
  onProcessPendingDeposit: (pending: PendingDeposit) => void
  stats: AppStats
}

export function AdminDashboardTab({ pendingDeposits, onProcessPendingDeposit, stats }: AdminDashboardTabProps) {
  // Compute stats dynamically from the database via stats prop
  const plastic = stats.breakdown?.Plastic || 0
  const paper = stats.breakdown?.Paper || 0
  const glass = stats.breakdown?.Glass || 0
  const organic = stats.breakdown?.Organic || 0
  const ewaste = stats.breakdown?.['E-waste'] || 0
  const other = stats.breakdown?.Other || 0
  const total = plastic + paper + glass + organic + ewaste + other || 0.001 // avoid division by 0

  // Dynamic alerts computed from database stats
  const alerts = []
  if (plastic > 0) {
    const plasticCapacity = Math.min(100, Math.round((plastic / 100) * 100))
    alerts.push({
      id: 1,
      type: plasticCapacity >= 80 ? 'warning' : 'info',
      text: `Plastic storage bin is at ${plasticCapacity}% capacity`,
      time: 'Just now'
    })
  }
  if (stats.recycledKg > 0) {
    const dailyPct = Math.min(100, Math.round((stats.recycledKg / 500) * 100))
    alerts.push({
      id: 2,
      type: dailyPct >= 65 ? 'success' : 'info',
      text: `Daily collection target (500kg) reached ${dailyPct}%`,
      time: 'Just now'
    })
  }
  if (alerts.length === 0) {
    alerts.push({
      id: 1,
      type: 'success',
      text: 'All systems operational. No active warnings.',
      time: 'Online'
    })
  }

  const breakdown = [
    { type: 'Plastic', weight: plastic, pct: Math.round(plastic / total * 100), color: 'bg-blue-500' },
    { type: 'Paper', weight: paper, pct: Math.round(paper / total * 100), color: 'bg-amber-500' },
    { type: 'Glass', weight: glass, pct: Math.round(glass / total * 100), color: 'bg-sky-500' },
    { type: 'Organic', weight: organic, pct: Math.round(organic / total * 100), color: 'bg-emerald-500' },
    { type: 'E-waste', weight: ewaste, pct: Math.round(ewaste / total * 100), color: 'bg-purple-500' },
  ]

  // Calculate target hit based on 1000kg limit
  const limit = 1000.0
  const capacityPct = Math.min(100, (stats.recycledKg / limit) * 100)

  return (
    <div className="animate-tab-fade flex flex-col gap-5 pb-8 text-left">
      {/* Welcome Banner */}
      <div>
        <span className="text-[8px] font-extrabold tracking-widest uppercase bg-[#00D06C]/10 text-[#00D06C] border border-[#00D06C]/25 px-2.5 py-1 rounded-md">
          Admin
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C] mt-2.5">Hi, WIND !</h1>
        <p className="text-xs text-[#2B2E2C]/50 mt-0.5">Real-time administrative stats</p>
      </div>

      {/* Grid of 3 quick metrics */}
      <section aria-label="Console Metrics" className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-[#EAEAE6] rounded-2xl p-3 shadow-xs">
          <Activity className="h-4 w-4 text-[#5F7A61]" />
          <span className="text-[8px] font-bold text-gray-400 uppercase block mt-1.5 leading-none">Weight Recv</span>
          <span className="text-sm font-extrabold text-[#2B2E2C] font-mono mt-1 block">
            {stats.recycledKg.toFixed(1)} <span className="text-[9px] font-bold text-gray-400 font-sans">kg</span>
          </span>
        </div>
        <div className="bg-white border border-[#EAEAE6] rounded-2xl p-3 shadow-xs">
          <Users className="h-4 w-4 text-[#5F7A61]" />
          <span className="text-[8px] font-bold text-gray-400 uppercase block mt-1.5 leading-none">Members</span>
          <span className="text-sm font-extrabold text-[#2B2E2C] font-mono mt-1 block">4 <span className="text-[9px] font-bold text-gray-400 font-sans">users</span></span>
        </div>
        <div className="bg-white border border-[#EAEAE6] rounded-2xl p-3 shadow-xs">
          <TrendingUp className="h-4 w-4 text-[#00D06C]" />
          <span className="text-[8px] font-bold text-gray-400 uppercase block mt-1.5 leading-none">Target Hit</span>
          <span className="text-sm font-extrabold text-[#5F7A61] font-mono mt-1 block">{capacityPct.toFixed(1)}<span className="text-[9px] font-bold text-gray-400 font-sans">%</span></span>
        </div>
      </section>

      {/* ── SECTION: Pending User Deposits (Verification Queue) ── */}
      <section className="bg-white border border-[#EAEAE6] rounded-3xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#5F7A61]" /> Verification Queue ({pendingDeposits.length})
          </h2>
          <span className="text-[8px] font-bold text-[#5F7A61] bg-[#5F7A61]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Incoming Requests
          </span>
        </div>

        {pendingDeposits.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#EAEAE6] bg-[#FBFBFA] rounded-2xl flex flex-col items-center justify-center gap-1.5">
            <CheckCircle className="h-6 w-6 text-[#00D06C]" />
            <p className="text-[10px] font-bold text-[#2B2E2C]">All requests verified</p>
            <p className="text-[9px] text-[#2B2E2C]/40">No pending user deposits in the queue right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingDeposits.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-2xl border border-[#EAEAE6] bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] transition-all"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.avatar} 
                    alt={item.memberName} 
                    className="h-10 w-10 rounded-full border border-white object-cover shadow-xs shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#2B2E2C]">{item.memberName}</span>
                      <span className="text-[7.5px] font-extrabold px-1.5 py-0.2 bg-[#5F7A61]/10 text-[#5F7A61] rounded-sm">
                        {item.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#2B2E2C]/50 mt-0.5">
                      <span className="text-gray-700 font-extrabold">{item.wasteType}</span>
                      <span>•</span>
                      <span>Est. <strong className="text-[#2B2E2C] font-extrabold">{item.weight} kg</strong></span>
                      <span>•</span>
                      <span className="text-[#5F7A61] font-extrabold">+{item.estPoints} pts</span>
                    </div>
                    <p className="text-[8px] font-mono text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                </div>

                <button 
                  onClick={() => onProcessPendingDeposit(item)}
                  className="px-3 py-2 bg-[#5F7A61] hover:bg-[#4E6750] text-white rounded-xl shadow-xs font-extrabold text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Approve & Credit</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Storage Capacity */}
      <section className="bg-white border border-[#EAEAE6] rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#2B2E2C] mb-2">
          <span>STORAGE CAPACITY</span>
          <span className="font-mono text-[#5F7A61]">{stats.recycledKg.toFixed(1)} / {limit.toFixed(1)} kg</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-500" style={{ width: `${capacityPct}%` }} />
        </div>
      </section>

      {/* Breakdown by waste category */}
      {(() => {
        let currentPct = 0
        const gradientParts = breakdown.map((item) => {
          const start = currentPct
          currentPct += item.pct || 0
          const end = Math.min(100, currentPct)
          let hex = '#64748b'
          if (item.type === 'Plastic') hex = '#3b82f6'
          if (item.type === 'Paper') hex = '#f59e0b'
          if (item.type === 'Glass') hex = '#0ea5e9'
          if (item.type === 'Organic') hex = '#10b981'
          if (item.type === 'E-waste') hex = '#a855f7'
          return `${hex} ${start}% ${end}%`
        }).join(', ')
        const conicGradient = stats.recycledKg > 0.05 ? `conic-gradient(${gradientParts})` : 'conic-gradient(#e2e8f0 0% 100%)'

        return (
          <section className="bg-white border border-[#EAEAE6] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#5F7A61]" /> Waste Allocation
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              {/* Conic Donut/Pie Chart */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div 
                  className="h-28 w-28 rounded-full border border-gray-100 shadow-inner relative flex items-center justify-center transition-all duration-500"
                  style={{ background: conicGradient }}
                >
                  <div className="h-18 w-18 rounded-full bg-white flex items-center justify-center shadow-xs">
                    <span className="text-[8px] font-extrabold text-[#2B2E2C]/40 text-center uppercase tracking-widest leading-normal">
                      Waste<br/>Dist.
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Allocation List */}
              <div className="flex-1 w-full flex flex-col gap-2.5">
                {breakdown.map((item) => (
                  <div key={item.type} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#2B2E2C]/75">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        {item.type}
                      </span>
                      <span className="font-mono text-gray-400">{item.weight.toFixed(1)} kg ({item.pct || 0}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct || 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Alerts feed */}
      <section className="bg-white border border-[#EAEAE6] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
        <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Active Warnings
        </h2>
        <div className="flex flex-col gap-2.5">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-2.5 text-[10px] border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${
                alert.type === 'warning' ? 'bg-amber-500' : alert.type === 'success' ? 'bg-[#00D06C]' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="font-semibold text-[#2B2E2C] leading-snug">{alert.text}</p>
                <span className="text-[8px] font-mono text-gray-400 font-extrabold uppercase tracking-wider block mt-0.5">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
