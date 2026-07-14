'use client'

import { Check } from 'lucide-react'

interface AdminSuccessModalProps {
  receipt: {
    txId: string
    memberName: string
    memberId: string
    wasteType: string
    weight: number
    pointsEarned: number
  }
  onClose: () => void
}

export function AdminSuccessModal({ receipt, onClose }: AdminSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto bg-[#2B2E2C]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="relative w-full max-w-xs bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in text-left flex flex-col">
        {/* Header */}
        <div className="bg-[#5F7A61] px-5 py-4 text-white text-center flex flex-col items-center gap-1">
          <Check className="h-6 w-6 text-white bg-white/20 p-1 rounded-full" />
          <h3 className="text-sm font-extrabold tracking-wider uppercase">Deposit Approved</h3>
          <span className="text-[8px] font-extrabold tracking-widest uppercase bg-[#E5ECE3] text-[#3A5C3C] px-2 py-0.5 rounded-full mt-1">
            Credits Sent Successfully
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-[#F4F6F3] p-3 rounded-xl border border-[#E2EADF]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5F7A61]/10 text-[#5F7A61] font-mono text-xs font-extrabold">
              {receipt.wasteType[0]}
            </span>
            <div>
              <p className="text-xs font-extrabold text-[#2B2E2C]">{receipt.memberName}</p>
              <p className="font-mono text-[8px] text-[#2B2E2C]/55">{receipt.memberId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] border-t border-[#F0F0EE] pt-3">
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Transaction ID</span>
              <span className="text-[#2B2E2C] font-extrabold text-xs font-mono">{receipt.txId}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Waste Category</span>
              <span className="text-[#2B2E2C] font-extrabold text-xs">{receipt.wasteType}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Measured Weight</span>
              <span className="text-[#2B2E2C] font-extrabold text-xs font-mono">{receipt.weight} kg</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Points Credited</span>
              <span className="text-[#5F7A61] font-extrabold text-xs font-mono">+{receipt.pointsEarned} pts</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F4F6F3] hover:bg-[#E2EADF] text-[#5F7A61] font-bold text-xs rounded-xl shadow-xs transition-all text-center active:scale-95 cursor-pointer mt-2"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
