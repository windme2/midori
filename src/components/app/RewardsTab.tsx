'use client'

import { useState } from 'react'
import { Gift, Award, Check, Search, Filter } from 'lucide-react'
import { REWARDS } from '@/data/rewards'
import type { Reward } from '@/types'

interface RewardsTabProps {
  totalPoints: number
  onRedeem: (reward: Reward) => void
  onClose?: () => void
}

export function RewardsTab({ totalPoints, onRedeem, onClose }: RewardsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [insufficientId, setInsufficientId] = useState<number | null>(null)

  const handleRedeem = (reward: Reward) => {
    if (totalPoints < reward.cost) {
      setInsufficientId(reward.id)
      setTimeout(() => setInsufficientId(null), 2000)
      return
    }
    onRedeem(reward)
  }

  // Filter rewards by category
  const filteredRewards = selectedCategory === 'All'
    ? REWARDS
    : REWARDS.filter(r => r.category === selectedCategory)

  return (
    <div className="animate-tab-fade flex flex-col gap-5 pb-24 text-left">
      
      {/* Heading */}
      <div className="flex justify-between items-start w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">Eco Rewards</h1>
          <p className="mt-1 text-xs text-[#2B2E2C]/50">Redeem points for sustainable goods &amp; green vouchers</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C] shadow-sm hover:bg-gray-50 active:scale-95 transition-all shrink-0 mt-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Points Balance HUD */}
      <div className="flex justify-between items-center bg-[#1A1D1B] border border-[#2B2E2C]/90 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00D06C]/5 pointer-events-none" />
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Your points balance</p>
          <p className="font-mono text-2xl font-extrabold mt-1 text-white">{totalPoints.toLocaleString()} <span className="text-xs font-bold font-sans text-white/50">pts</span></p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00D06C]/10 border border-[#00D06C]/25 text-[#00D06C] shrink-0">
          <Gift className="h-5 w-5" />
        </span>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest">Filter by Category</span>
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {['All', 'Merchandise', 'Vouchers', 'Donations'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#5F7A61] text-white border-[#5F7A61] shadow-sm'
                  : 'bg-white text-[#2B2E2C]/70 border-[#EAEAE6] hover:border-[#5F7A61]/35'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Catalog Listing */}
      <div className="flex flex-col gap-4">
        {filteredRewards.length === 0 ? (
          <div className="py-12 text-center rounded-3xl border border-dashed border-[#EAEAE6] bg-white">
            <p className="text-xs text-[#2B2E2C]/40 font-bold uppercase tracking-wider">No rewards found</p>
          </div>
        ) : (
          filteredRewards.map((reward) => {
            const canAfford = totalPoints >= reward.cost
            const showError = insufficientId === reward.id
            const Icon = reward.icon || Gift

            return (
              <div
                key={reward.id}
                className="rounded-3xl border border-[#EAEAE6] bg-white p-5 shadow-sm hover:border-[#5F7A61]/30 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Frame with category color style */}
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5F7A61]/10 text-[#5F7A61] shadow-inner`}>
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] font-extrabold text-[#5F7A61] uppercase tracking-wider bg-[#E5ECE3] px-2 py-0.5 rounded-full">
                      {reward.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#2B2E2C] mt-2 tracking-tight truncate">{reward.name}</h3>
                    <p className="text-xs text-[#2B2E2C]/55 leading-relaxed mt-1">{reward.description}</p>
                  </div>
                </div>

                <div className="border-t border-[#F0F0EE] pt-4 flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-[#5F7A61]">{reward.cost.toLocaleString()} pts</span>
                  <button
                    onClick={() => handleRedeem(reward)}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition-all ${
                      showError
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : canAfford
                        ? 'bg-[#5F7A61] text-white hover:bg-[#4E6750] active:scale-95'
                        : 'bg-[#F5F6F4] text-[#2B2E2C]/40 border border-[#EAEAE6] cursor-not-allowed'
                    }`}
                  >
                    {showError ? 'Need more pts' : 'Redeem Code'}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
