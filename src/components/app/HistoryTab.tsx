'use client'

import { useState } from 'react'
import { Recycle, Gift, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { HistoryEntry } from '@/types'

interface HistoryTabProps {
  historyLog: HistoryEntry[]
}

type FilterType = 'all' | 'garbage' | 'points'

export function HistoryTab({ historyLog }: HistoryTabProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredLogs = historyLog.filter((entry) => {
    const title = entry.title.toLowerCase()
    const isRedeem = !entry.positive
    if (filter === 'garbage') {
      return !isRedeem && (title.includes('deposit') || title.includes('handover') || title.includes('recycled'))
    }
    if (filter === 'points') {
      return isRedeem || title.includes('bonus') || title.includes('reward')
    }
    return true
  })

  // Group entries by date
  const groupLogsByDate = () => {
    const groups: { [key: string]: HistoryEntry[] } = {}
    filteredLogs.forEach((entry) => {
      const dateStr = entry.date
      if (!groups[dateStr]) {
        groups[dateStr] = []
      }
      groups[dateStr].push(entry)
    })
    return groups
  }

  const grouped = groupLogsByDate()

  return (
    <div className="animate-tab-fade flex flex-col gap-4 pb-8 text-left">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">History</h1>
        <p className="mt-1 text-xs text-[#2B2E2C]/50">Track your waste handovers and point redemptions</p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 bg-[#F4F6F3] p-1 rounded-xl border border-[#EAEAE6] w-full">
        {(['all', 'garbage', 'points'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
              filter === f
                ? 'bg-white text-[#5F7A61] shadow-xs'
                : 'text-[#2B2E2C]/40 hover:text-[#2B2E2C]'
            }`}
          >
            {f === 'all' ? 'All' : f === 'garbage' ? 'Garbage' : 'Points'}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="flex flex-col gap-5 mt-2">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-xs text-[#2B2E2C]/40 font-semibold">
            No transaction records found.
          </div>
        ) : (
          Object.keys(grouped).map((date) => (
            <div key={date} className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40 px-1">
                {date}
              </span>
              
              <div className="flex flex-col gap-2">
                {grouped[date].map((entry) => {
                  const isRedemption = !entry.positive
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between bg-white border rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all ${
                        entry.pending 
                          ? 'border-dashed border-gray-300 bg-gray-50/50 opacity-80' 
                          : 'border-[#EAEAE6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          entry.pending
                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                            : isRedemption 
                            ? 'bg-amber-50 text-amber-500 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {isRedemption ? (
                            <Gift className="h-4.5 w-4.5" />
                          ) : (
                            <Recycle className="h-4.5 w-4.5" />
                          )}
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${entry.pending ? 'text-[#2B2E2C]/60' : 'text-[#2B2E2C]'}`}>{entry.title}</p>
                          <p className="text-[9px] font-mono text-[#2B2E2C]/40 font-bold mt-0.5">
                            {entry.pending ? 'Waiting for admin ⏳' : '10:14 AM'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs font-bold shrink-0">
                        {entry.pending ? (
                          <span className="text-gray-400 font-medium">Est. {entry.points} pts</span>
                        ) : isRedemption ? (
                          <span className="text-[#D9A05B]">{entry.points} pts</span>
                        ) : (
                          <span className="text-[#5F7A61]">{entry.points} pts</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
