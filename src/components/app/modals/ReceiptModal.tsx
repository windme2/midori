'use client'

import { X, Check } from 'lucide-react'

interface ReceiptItem {
  type: string
  weight: number
  points: number
}

interface ReceiptData {
  id: string
  date: string
  items: ReceiptItem[]
  totalWeight: number
  totalPoints: number
}

interface ReceiptModalProps {
  receipt: ReceiptData
  onClose: () => void
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 max-w-md mx-auto flex items-center justify-center bg-[#2B2E2C]/65 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[270px] rounded-3xl bg-white p-5 shadow-2xl relative border border-[#EAEAE6] text-center animate-scale-in text-[#2B2E2C]" 
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00D06C] text-white mx-auto mb-3">
          <Check className="h-6 w-6 stroke-[3]" />
        </span>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5F7A61]">Deposit Successful</h3>
        <p className="text-[10px] text-[#2B2E2C]/40 font-mono mt-1">{receipt.id}</p>
        <p className="text-[9px] text-[#2B2E2C]/40 font-mono mt-0.5">{receipt.date}</p>

        <div className="border-t border-dashed border-[#EAEAE6] my-4" />

        <div className="flex flex-col gap-2.5 text-left text-xs font-semibold">
          {receipt.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-[#F0F0EE]/60 pb-1.5 last:border-0 last:pb-0">
              <div>
                <p className="text-[#2B2E2C]">{item.type}</p>
                <p className="text-[9px] text-[#2B2E2C]/40 mt-0.5">{item.weight.toFixed(1)} kg</p>
              </div>
              <span className="font-mono text-[#5F7A61] font-bold">+{item.points} pts</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[#EAEAE6] my-4" />

        <div className="flex justify-between text-xs font-bold text-[#2B2E2C]">
          <span>Total Weight</span>
          <span className="font-mono">{receipt.totalWeight.toFixed(1)} kg</span>
        </div>
        <div className="flex justify-between text-xs font-extrabold text-[#5F7A61] mt-2">
          <span>Points Earned</span>
          <span className="font-mono text-sm">+{receipt.totalPoints} pts</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#5F7A61] py-3 text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95 shadow-sm cursor-pointer"
        >
          Close Receipt
        </button>
      </div>
    </div>
  )
}
