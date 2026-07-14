'use client'

import { X, CheckCircle2 } from 'lucide-react'
import type { AdminLogEntry } from '@/components/app/AdminLogTab'

interface AdminLogDetailModalProps {
  log: AdminLogEntry
  onClose: () => void
}

export function AdminLogDetailModal({ log, onClose }: AdminLogDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in max-w-md mx-auto">
      <div className="w-full max-w-xs rounded-[32px] border border-[#EAEAE6] bg-white p-6 shadow-xl animate-scale-in text-left">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-sm font-extrabold text-[#2B2E2C]">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#F4F6F3] flex items-center justify-center text-[#5F7A61] hover:bg-gray-100 active:scale-90 transition-all cursor-pointer border-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 py-5 text-center">
          <div className="h-12 w-12 rounded-full bg-[#00D06C]/10 text-[#00D06C] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs font-mono font-extrabold text-[#00D06C] uppercase tracking-wider mt-1">Verified & Approved</p>
          <h3 className="text-2xl font-mono font-extrabold text-[#2B2E2C] tracking-tight">{log.id}</h3>
        </div>

        <div className="flex flex-col gap-3 text-xs bg-[#FBFBFA] border border-[#EAEAE6] rounded-2xl p-4">
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Member</span>
            <span className="text-[#2B2E2C] font-extrabold">{log.memberName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Member ID</span>
            <span className="text-[#2B2E2C] font-mono font-bold text-[10px]">{log.memberId}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Waste Type</span>
            <span className="font-extrabold text-[#5F7A61]">{log.wasteType}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Verified Weight</span>
            <span className="text-[#2B2E2C] font-extrabold">{log.weight.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Points Credited</span>
            <span className="text-[#00D06C] font-extrabold">+{log.pointsEarned} pts</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100/50 pb-2">
            <span className="text-[#2B2E2C]/50 font-bold">Station</span>
            <span className="text-[#2B2E2C] font-semibold">{log.station}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#2B2E2C]/50 font-bold">Date Verified</span>
            <span className="text-[#2B2E2C]/75 font-semibold text-[10px]">{log.date}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/30 mb-1">Checks Done</div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-[#2B2E2C]/70">
            <span className="px-2 py-1 rounded-lg bg-[#5F7A61]/10 text-[#5F7A61] border border-[#5F7A61]/10">Rinsed</span>
            <span className="px-2 py-1 rounded-lg bg-[#5F7A61]/10 text-[#5F7A61] border border-[#5F7A61]/10">Sorted</span>
            <span className="px-2 py-1 rounded-lg bg-[#5F7A61]/10 text-[#5F7A61] border border-[#5F7A61]/10">Flattened</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#5F7A61] hover:bg-[#4E6750] text-white rounded-xl shadow-xs font-bold text-xs active:scale-95 transition-all cursor-pointer text-center"
        >
          Close Details
        </button>
      </div>
    </div>
  )
}
