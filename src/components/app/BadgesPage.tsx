'use client'

import { X, Zap, ShieldCheck, Heart, Star, Trophy, Flame, Leaf, Medal, Lock } from 'lucide-react'

interface BadgesPageProps {
  totalPoints: number
  recycledKg: number
  onClose: () => void
}

type BadgeCategory = 'achievement' | 'bonus' | 'discount'

interface BadgeDef {
  id: string
  name: string
  desc: string
  longDesc: string
  icon: React.ElementType
  color: string
  bg: string
  category: BadgeCategory
  reward: string
  rewardBg: string
  rewardText: string
  threshold: number
  thresholdUnit: 'points' | 'kg'
  alwaysUnlocked?: boolean
}

const BADGES: BadgeDef[] = [
  {
    id: 'eco-pioneer',
    name: 'Eco Pioneer',
    desc: 'First recyclable batch logged',
    longDesc: 'Logged your very first waste deposit batch through Midori. This unlocks for any first-time deposit ever made.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    category: 'achievement',
    reward: 'Unlocked',
    rewardBg: 'bg-amber-50',
    rewardText: 'text-amber-600',
    threshold: 1,
    thresholdUnit: 'kg',
  },
  {
    id: 'carbon-crusher',
    name: 'Carbon Crusher',
    desc: 'Saved 10+ kg CO₂ emissions',
    longDesc: 'Your recycling effort has offset over 10 kg of CO₂ emissions — equivalent to planting a tree.',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    category: 'achievement',
    reward: 'Unlocked',
    rewardBg: 'bg-emerald-50',
    rewardText: 'text-emerald-600',
    threshold: 10.0,
    thresholdUnit: 'kg',
  },
  {
    id: 'green-guardian',
    name: 'Green Guardian',
    desc: 'Reach 2,000 points milestone',
    longDesc: 'A steadfast guardian of the green. Accumulated a total of 2,000 recycling points to earn this prestigious badge.',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-100',
    category: 'achievement',
    reward: 'Achievement',
    rewardBg: 'bg-red-50',
    rewardText: 'text-red-500',
    threshold: 2000,
    thresholdUnit: 'points',
  },
  {
    id: 'waste-warrior',
    name: 'Waste Warrior',
    desc: 'Recycle over 50 kg total',
    longDesc: 'Committed to zero-waste living. You have recycled more than 50 kg of material through the Midori system.',
    icon: Trophy,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    category: 'achievement',
    reward: 'Achievement',
    rewardBg: 'bg-purple-50',
    rewardText: 'text-purple-600',
    threshold: 50,
    thresholdUnit: 'kg',
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    desc: 'Active milestones for top recyclers',
    longDesc: 'Consistency is key! Achieve the 5,000 point milestone demonstrating ongoing commitment to the Midori mission.',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
    category: 'achievement',
    reward: 'Achievement',
    rewardBg: 'bg-orange-50',
    rewardText: 'text-orange-500',
    threshold: 5000,
    thresholdUnit: 'points',
  },
  {
    id: 'super-sorter',
    name: 'Super Sorter',
    desc: 'Diversify across 3+ waste categories',
    longDesc: 'Demonstrates eco-expertise across material categories. Reached 3,000 points — showing diversity in waste sorting across multiple categories.',
    icon: Star,
    color: 'text-sky-600',
    bg: 'bg-sky-100',
    category: 'bonus',
    reward: '+200 pts bonus',
    rewardBg: 'bg-sky-50',
    rewardText: 'text-sky-600',
    threshold: 3000,
    thresholdUnit: 'points',
  },
  {
    id: 'eco-legend',
    name: 'Eco Legend',
    desc: 'Accumulate 10,000 lifetime points',
    longDesc: 'Legendary status in the Midori community. Reach a cumulative 10,000 recycling points across all sessions to claim +500 bonus points.',
    icon: Medal,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    category: 'bonus',
    reward: '+500 pts bonus',
    rewardBg: 'bg-yellow-50',
    rewardText: 'text-yellow-600',
    threshold: 10000,
    thresholdUnit: 'points',
  },
  {
    id: 'midori-partner',
    name: 'Midori Partner',
    desc: 'Reach 5,000+ total points',
    longDesc: 'Earns you partner status with a 5% discount at all participating Midori eco-partner stores when you show your badge QR code.',
    icon: Leaf,
    color: 'text-teal-600',
    bg: 'bg-teal-100',
    category: 'discount',
    reward: '5% discount',
    rewardBg: 'bg-teal-50',
    rewardText: 'text-teal-600',
    threshold: 5000,
    thresholdUnit: 'points',
  },
]

const CATEGORY_META: Record<BadgeCategory, { label: string; sub: string }> = {
  achievement: { label: 'Achievements', sub: 'Complete milestones to unlock' },
  bonus:       { label: 'Bonus Points',  sub: 'Earn extra points on unlock' },
  discount:    { label: 'Partner Discounts', sub: 'Unlock real-world deals' },
}

function getProgress(badge: BadgeDef, totalPoints: number, recycledKg: number) {
  if (badge.id === 'eco-pioneer') {
    const isUnlocked = recycledKg > 0
    return { current: isUnlocked ? 1 : 0, max: 1, unlocked: isUnlocked }
  }
  if (badge.id === 'carbon-crusher') {
    const co2 = recycledKg * 0.72
    return { current: co2, max: 10.0, unlocked: co2 >= 10.0 }
  }
  const current = badge.thresholdUnit === 'points' ? totalPoints : recycledKg
  return {
    current,
    max: badge.threshold,
    unlocked: current >= badge.threshold,
  }
}

export function BadgesPage({ totalPoints, recycledKg, onClose }: BadgesPageProps) {
  const categories: BadgeCategory[] = ['achievement', 'bonus', 'discount']
  const unlockedCount = BADGES.filter(b => getProgress(b, totalPoints, recycledKg).unlocked).length

  return (
    <div className="flex flex-col gap-0 pb-8 text-left">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#F4F6F3]/95 backdrop-blur-sm px-5 py-4 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#2B2E2C]">Badges &amp; Achievements</h1>
          <p className="text-[10px] text-[#2B2E2C]/45 mt-0.5">Earn badges by recycling — unlock bonuses &amp; discounts</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C]/60 shadow-xs hover:bg-gray-50 active:scale-95 cursor-pointer transition-all"
          aria-label="Close badges"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Summary pill */}
      <div className="mx-5 mt-5 mb-1 flex items-center gap-3 bg-white rounded-2xl border border-[#EAEAE6] px-4 py-3 shadow-xs">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5ECE3]">
          <Trophy className="h-5 w-5 text-[#5F7A61]" />
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#2B2E2C]/50 uppercase tracking-wider">Badges Unlocked</p>
          <p className="text-lg font-extrabold text-[#2B2E2C] leading-tight">
            {unlockedCount}
            <span className="text-xs text-[#2B2E2C]/35 font-bold"> / {BADGES.length}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-[#2B2E2C]/50 uppercase tracking-wider">Your Points</p>
          <p className="text-sm font-extrabold text-[#5F7A61] font-mono">{totalPoints.toLocaleString()} pts</p>
        </div>
      </div>

      {/* Category sections */}
      <div className="px-5 flex flex-col gap-6 mt-5">
        {categories.map((cat) => {
          const categoryBadges = BADGES.filter(b => b.category === cat)
          const meta = CATEGORY_META[cat]
          return (
            <section key={cat}>
              <div className="mb-3">
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#2B2E2C]/55">{meta.label}</h2>
                <p className="text-[9px] text-[#2B2E2C]/35 mt-0.5">{meta.sub}</p>
              </div>
              <div className="flex flex-col gap-3">
                {categoryBadges.map((badge) => {
                  const { current, max, unlocked } = getProgress(badge, totalPoints, recycledKg)
                  const pct = Math.min(100, (current / max) * 100)
                  const Icon = badge.icon
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border bg-white p-4 shadow-xs transition-all ${
                        unlocked ? 'border-[#EAEAE6]' : 'border-[#EAEAE6] opacity-65'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${unlocked ? badge.bg : 'bg-gray-100'}`}>
                          {unlocked
                            ? <Icon className={`h-5 w-5 ${badge.color}`} />
                            : <Lock className="h-5 w-5 text-gray-400" />
                          }
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h3 className="text-xs font-extrabold text-[#2B2E2C] truncate">{badge.name}</h3>
                            <span className={`shrink-0 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.rewardBg} ${badge.rewardText} border-current/10`}>
                              {badge.reward}
                            </span>
                          </div>
                          <p className="text-[9px] text-[#2B2E2C]/50 leading-relaxed">{badge.longDesc}</p>

                          {/* Progress */}
                          <div className="mt-2.5 flex flex-col gap-1">
                            <div className="flex justify-between text-[9px] font-bold text-[#2B2E2C]/45">
                              <span>
                                {badge.thresholdUnit === 'points'
                                  ? `${Math.min(current, max).toLocaleString()} / ${max.toLocaleString()} pts`
                                  : `${Math.min(current, max).toFixed(1)} / ${max.toFixed(1)} kg`
                                }
                              </span>
                              <span className={unlocked ? `${badge.rewardText} font-extrabold` : 'text-[#2B2E2C]/35'}>
                                {unlocked ? '✓ Unlocked' : `${Math.round(pct)}%`}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${unlocked ? 'bg-[#5F7A61]' : 'bg-gray-300'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            {!unlocked && (
                              <p className="text-[8px] text-[#2B2E2C]/35 font-semibold mt-0.5">
                                {badge.thresholdUnit === 'points'
                                  ? `${(max - Math.min(current, max)).toLocaleString()} more points needed`
                                  : `${(max - Math.min(current, max)).toFixed(1)} more kg needed`
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
