'use client'

import { useState } from 'react'
import { History, Search, Filter, ArrowUpRight, ShieldCheck, Leaf, Calendar, X, CheckCircle2 } from 'lucide-react'
import type { WasteType } from '@/types'

export interface AdminLogEntry {
  id: string
  memberId: string
  memberName: string
  wasteType: WasteType
  weight: number
  pointsEarned: number
  date: string
  station: string
}

// Initial mock log for staff
export const INITIAL_STAFF_LOGS: AdminLogEntry[] = [
  { id: 'TX-9034', memberId: 'MDR-2026-0714-AIKO', memberName: 'Aiko Tanaka', wasteType: 'Plastic', weight: 2.4, pointsEarned: 72, date: 'Today, 10:15 AM', station: 'Bangna' },
  { id: 'TX-9021', memberId: 'MDR-2026-0812-JOHN', memberName: 'John Doe', wasteType: 'Paper', weight: 5.0, pointsEarned: 75, date: 'Yesterday, 3:45 PM', station: 'Bangna' },
  { id: 'TX-8998', memberId: 'MDR-2026-0925-SARA', memberName: 'Sarah Connor', wasteType: 'Glass', weight: 1.8, pointsEarned: 25, date: '2 days ago, 11:20 AM', station: 'Bangna' },
  { id: 'TX-8954', memberId: 'MDR-2026-0714-AIKO', memberName: 'Aiko Tanaka', wasteType: 'E-waste', weight: 1.2, pointsEarned: 144, date: '5 days ago, 2:10 PM', station: 'Bangna' },
]

interface AdminLogTabProps {
  logs: AdminLogEntry[]
  onOpenLogDetail: (entry: AdminLogEntry) => void
}

export function AdminLogTab({ logs, onOpenLogDetail }: AdminLogTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('All')

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesType = filterType === 'All' || log.wasteType === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="animate-tab-fade flex flex-col gap-4 pb-24 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">Activity Log</h1>
        <p className="mt-1 text-xs text-[#2B2E2C]/50">Monitor and search your approved user deposits</p>
      </div>

      {/* Search & Filter controls */}
      <div className="flex flex-col gap-2">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#2B2E2C]/30" />
          <input
            type="text"
            placeholder="Search Member, ID, or Transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAEAE6] text-xs font-semibold bg-white focus:outline-none focus:border-[#5F7A61]/50 text-[#2B2E2C]"
          />
        </div>

        {/* Filter categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-1 scrollbar-none">
          {['All', 'Plastic', 'Paper', 'Glass', 'Organic', 'E-waste', 'Other'].map((category) => {
            const isSelected = filterType === category
            return (
              <button
                key={category}
                onClick={() => setFilterType(category)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#5F7A61] bg-[#5F7A61]/10 text-[#5F7A61]'
                    : 'border-[#EAEAE6] bg-[#FBFBFA] text-[#2B2E2C]/50 hover:bg-white hover:text-[#2B2E2C]'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {/* History Feed List */}
      <section aria-label="Approved Transaction Logs" className="rounded-3xl border border-[#EAEAE6] bg-white overflow-hidden shadow-sm flex flex-col">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <History className="h-8 w-8 text-[#2B2E2C]/20" />
            <p className="text-xs font-bold text-[#2B2E2C]/40">No matching logs found</p>
            <p className="text-[10px] text-[#2B2E2C]/30 leading-normal">Try adjusting search term or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredLogs.map((entry, idx) => (
              <button
                key={entry.id}
                onClick={() => onOpenLogDetail(entry)}
                className={`flex flex-col gap-2 p-4 text-left w-full hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer border-none outline-none ${
                  idx !== 0 ? 'border-t border-[#EAEAE6]' : ''
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5F7A61]/10 text-[#5F7A61]">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-extrabold text-[#2B2E2C]">{entry.memberName}</p>
                        <span className="text-[7.5px] font-extrabold px-1 rounded-sm bg-gray-100 text-gray-400 font-mono tracking-wider">{entry.id}</span>
                      </div>
                      <p className="text-[9px] font-bold text-[#2B2E2C]/45">{entry.memberId}</p>
                    </div>
                  </div>
                  <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold bg-[#5F7A61]/15 text-[#5F7A61]">
                    +{entry.pointsEarned} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px] font-bold text-[#2B2E2C]/50 mt-1 pl-9 w-full">
                  <div className="flex gap-2">
                    <span>Type: <span className="text-[#2B2E2C] font-extrabold">{entry.wasteType}</span></span>
                    <span className="text-gray-300">|</span>
                    <span>Weight: <span className="text-[#2B2E2C] font-extrabold">{entry.weight} kg</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-[#2B2E2C]/40">
                    <Calendar className="h-3 w-3" />
                    <span>{entry.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
