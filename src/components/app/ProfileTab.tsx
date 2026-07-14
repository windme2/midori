'use client'

import { useState, useRef } from 'react'
import { Award, ShieldCheck, Zap, Heart, Camera, Pencil, Share2, LogOut, Package, Droplets, CircuitBoard, Recycle, Gift, X, MapPin } from 'lucide-react'
import { REWARDS } from '@/data/rewards'
import type { HistoryEntry, Reward, UserProfile, Role } from '@/types'

interface ProfileTabProps {
  role?: Role
  profile: UserProfile
  onUpdateProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  totalPoints: number
  recycledKg: number
  historyLog: HistoryEntry[]
  onRedeem: (reward: Reward) => void
  onLogout: () => void
  onOpenQr: () => void
  onOpenRewards: () => void
  onOpenBadges: () => void
  weeklyPointGoal: number
  onUpdateWeeklyGoal: (goal: number) => void
  onOpenGoalModal: () => void
}

const BANGKOK_LOCATIONS = [
  'Bangna, Bangkok',
  'Pathum Wan, Bangkok',
  'Sukhumvit, Bangkok',
  'Ari, Bangkok',
  'Chatuchak, Bangkok'
]

// Gamification Badges List (Unlocked criteria are now computed dynamically)
const BADGES = [
  {
    id: 'eco-pioneer',
    name: 'Eco Pioneer',
    desc: 'Logged first recyclable batch.',
    icon: Zap,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  {
    id: 'carbon-crusher',
    name: 'Carbon Crusher',
    desc: 'Saved over 10.0 kg of CO₂ emissions.',
    icon: ShieldCheck,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    id: 'green-guardian',
    name: 'Green Guardian',
    desc: 'Reached 2,000 points milestone.',
    icon: Heart,
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  {
    id: 'waste-warrior',
    name: 'Waste Warrior',
    desc: 'Recycled over 50.0 kg of waste.',
    icon: Recycle,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    id: 'zero-hero',
    name: 'Zero Hero',
    desc: 'Streak of 5 deposit weeks.',
    icon: Award,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  }
]

export function ProfileTab({
  role,
  profile,
  onUpdateProfile,
  totalPoints,
  recycledKg,
  historyLog,
  onRedeem,
  onLogout,
  onOpenQr,
  onOpenRewards,
  onOpenBadges,
  weeklyPointGoal,
  onUpdateWeeklyGoal,
  onOpenGoalModal
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editLocation, setEditLocation] = useState(profile.location || 'Bangna, Bangkok')
  const [insufficientId, setInsufficientId] = useState<number | null>(null)
  const [pushActive, setPushActive] = useState(true)
  const [receiptActive, setReceiptActive] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarHoverClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateProfile(prev => ({
          ...prev,
          avatar: event.target!.result as string
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    onUpdateProfile(prev => ({
      ...prev,
      name: editName,
      location: editLocation
    }))
    setIsEditing(false)
  }

  const handleRedeem = (reward: Reward) => {
    if (totalPoints < reward.cost) {
      setInsufficientId(reward.id)
      setTimeout(() => setInsufficientId(null), 2000)
      return
    }
    onRedeem(reward)
  }

  const getRankLevel = (pts: number) => {
    if (pts >= 8000) return 'Rank Level 5 Eco-Deity'
    if (pts >= 6000) return 'Rank Level 4 Eco-Legend'
    if (pts >= 4000) return 'Rank Level 3 Eco-Champion'
    if (pts >= 2000) return 'Rank Level 2 Eco-Advocate'
    return 'Rank Level 1 Eco-Novice'
  }

  const getTierProgress = (pts: number) => {
    let nextTarget = 2000
    if (pts >= 8000) nextTarget = 10000
    else if (pts >= 6000) nextTarget = 8000
    else if (pts >= 4000) nextTarget = 6000
    else if (pts >= 2000) nextTarget = 4000
    
    const pct = Math.min(100, Math.round((pts / nextTarget) * 100))
    return { nextTarget, pct }
  }

  if (role === 'staff') {
    return (
      <div className="animate-tab-fade flex flex-col gap-5 pb-8 text-left">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">Profile</h1>
          <p className="mt-1 text-xs text-[#2B2E2C]/50">Manage settings and active collection</p>
        </div>

        {/* Profile Card (Redesigned as Premium Dark Admin Badge) */}
        <section
          aria-label="Profile"
          className="animate-fade-slide-up relative overflow-hidden rounded-[32px] p-6 shadow-xl border border-[#3A3F3B] transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #121413 0%, #1E2321 50%, #0E100F 100%)',
          }}
        >
          {/* Subtle overlay blur blobs for dark glassmorphism */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#00D06C]/10 blur-xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full bg-[#5F7A61]/10 blur-xl" />

          {/* Top row: name + administrator credentials details */}
          <div className="relative flex flex-col items-start gap-1 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[8px] font-extrabold uppercase tracking-wider text-white border border-white/10">
              <ShieldCheck className="h-3 w-3 text-[#00D06C]" aria-hidden="true" />
              ADMIN
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2.5">{profile.name}</h1>
            <p className="text-[10px] text-[#00D06C] font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Bangna, Bangkok</span>
            </p>
          </div>

          {/* Dynamic Stats grid derived from actual SQLite records */}
          <div className="relative mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-[24px] bg-white/5 border border-white/10 px-4 py-3.5">
              <p className="text-[9px] text-white/40 font-extrabold uppercase tracking-wider">Total Processed</p>
              <p className="tabular mt-1 font-mono text-2xl font-bold text-white">
                {recycledKg.toFixed(1)} <span className="text-xs font-sans font-extrabold text-[#00D06C]">kg</span>
              </p>
            </div>
            <div className="rounded-[24px] bg-white/5 border border-white/10 px-4 py-3.5">
              <p className="text-[9px] text-white/40 font-extrabold uppercase tracking-wider">Transactions</p>
              <p className="tabular mt-1 font-mono text-2xl font-bold text-white/90">
                {historyLog.length} <span className="text-xs font-sans font-extrabold text-[#00D06C]/80">txs</span>
              </p>
            </div>
          </div>

          {/* Detailed Administrative Metadata */}
          <div className="relative mt-6 flex flex-col gap-2.5 text-left border-t border-white/10 pt-5 text-[10px] text-white/60">
            <div className="flex justify-between items-center">
              <span className="text-white/40">Collector ID Code:</span>
              <span className="font-mono font-extrabold text-white tracking-wider">MDR-STAFF-9021</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Assigned Shift:</span>
              <span className="font-semibold text-white">Morning Shift (08:00 AM - 05:00 PM)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Terminal ID:</span>
              <span className="font-mono font-semibold text-white">TERM-BANGNA-B02</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Permissions Level:</span>
              <span className="font-extrabold text-[#00D06C] tracking-wide">Full Privilege Level A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">System Role:</span>
              <span className="font-semibold text-white">Points Authorization & Collection</span>
            </div>
          </div>
        </section>

        {/* Station statistics/details (Cleaned up redundant Collector ID & Shift duplicates) */}
        <section aria-label="Station Stats" className="rounded-[32px] border border-[#EAEAE6] bg-white p-5 shadow-xs flex flex-col gap-4">
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40">Active Status</h2>

          <div className="text-[10px] text-[#2B2E2C]/50 flex flex-col gap-2 pt-1">
            <div className="flex justify-between items-center border-b border-[#F0F0EE] pb-2">
              <span>Station Name:</span>
              <span className="font-bold text-[#2B2E2C]">Bangna Collector Station, BKK</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F0F0EE] pb-2">
              <span>Database Sync:</span>
              <span className="font-mono font-bold text-[#5F7A61] bg-[#E2EADF] px-2 py-0.5 rounded-full text-[8px]">Connected (SQLite)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Verification Status:</span>
              <span className="font-extrabold text-[#00D06C]">Active & Verified</span>
            </div>
          </div>
        </section>

        {/* ── Logout button ── */}
        <button
          onClick={onLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 py-3.5 text-xs font-bold text-red-600 transition-colors active:scale-98 cursor-pointer"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log Out
        </button>
      </div>
    )
  }

  return (
    <div className="animate-tab-fade flex flex-col gap-5 pb-8 text-left">
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">My Profile</h1>
        <p className="mt-1 text-xs text-[#2B2E2C]/50">Manage settings, badges achievements, and transactions</p>
      </div>

      {/* ── 1. Profile card (Redesigned matching mockup perfectly) ────────── */}
      <section
        aria-label="Profile"
        className={`animate-fade-slide-up relative overflow-hidden rounded-[32px] p-6 shadow-sm border transition-all duration-300 ${
          isEditing ? 'border-[#5F7A61] ring-2 ring-[#5F7A61]/25' : 'border-transparent'
        }`}
        style={{
          background: 'linear-gradient(135deg, #C8D9C4 0%, #BAC9B6 100%)',
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#5F7A61]/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full bg-[#5F7A61]/08" />

        {/* Top row: name + avatar */}
        <div className="relative flex items-center justify-between">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <div className="flex flex-col gap-2 animate-fade-in">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl bg-white/90 border border-[#BAC9B6] px-3 py-1.5 text-sm font-bold text-[#2B2E2C] focus:outline-none focus:bg-white shadow-inner"
                  placeholder="Display Name"
                />
                <select
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-xl bg-white/90 border border-[#BAC9B6] px-3 py-1.5 text-xs font-bold text-[#2B2E2C] focus:outline-none focus:bg-white shadow-inner"
                >
                  {BANGKOK_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-extrabold text-[#2B2E2C] tracking-tight">{profile.name}</h1>
                <p className="text-[9px] text-[#2B2E2C]/60 font-bold uppercase tracking-wider mt-1">{profile.location || 'Bangna, Bangkok'}</p>
              </>
            )}
            
            <div className="mt-3.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5ECE3] px-3.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#5F7A61] border border-[#BAC9B6]/40">
                <Award className="h-3 w-3 text-[#5F7A61]" aria-hidden="true" />
                {profile.tier.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Avatar with Edit-Only Upload trigger */}
          <button
            onClick={isEditing ? handleAvatarHoverClick : undefined}
            aria-label="Upload profile image"
            className={`group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#A8BEA5] shadow-inner overflow-hidden border-2 border-white/50 transition-all ${
              isEditing ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
            }`}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-mono text-xl font-bold text-white">
                {(isEditing ? editName : profile.name).slice(0, 2).toUpperCase()}
              </span>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-[#2B2E2C]/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4.5 w-4.5 text-white" />
                <span className="text-[7px] text-white/90 font-extrabold uppercase tracking-wide mt-0.5">Edit</span>
              </div>
            )}
          </button>
        </div>

        {/* Stats grid */}
        <div className={`relative mt-5 grid grid-cols-2 gap-3 text-left transition-opacity duration-300 ${isEditing ? 'opacity-40' : 'opacity-100'}`}>
          <div className="rounded-[24px] bg-white/50 border border-white/20 px-4 py-3.5">
            <p className="text-[9px] text-[#2B2E2C]/50 font-extrabold uppercase tracking-wider">Points</p>
            <p className="tabular mt-1.5 font-mono text-2xl font-bold text-[#2B2E2C]">
              {totalPoints.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[24px] bg-white/50 border border-white/20 px-4 py-3.5">
            <p className="text-[9px] text-[#2B2E2C]/50 font-extrabold uppercase tracking-wider">Total Recycled</p>
            <p className="tabular mt-1.5 font-mono text-2xl font-bold text-[#5F7A61]">
              {recycledKg.toFixed(1)} kg
            </p>
          </div>
        </div>

        {/* Level Progress HUD */}
        {(() => {
          const { nextTarget, pct } = getTierProgress(totalPoints)
          return (
            <div className={`relative mt-4 flex flex-col gap-1.5 text-left transition-opacity duration-300 ${isEditing ? 'opacity-40' : 'opacity-100'}`}>
              <div className="flex justify-between items-center text-[9px] font-extrabold text-[#2B2E2C]/50 uppercase tracking-wider">
                <span>{getRankLevel(totalPoints)}</span>
                <span className="font-mono">{totalPoints.toLocaleString()} / {nextTarget.toLocaleString()} pts</span>
              </div>
              <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })()}

        {/* Action buttons (Toggles based on edit state) */}
        <div className="relative mt-4 grid grid-cols-2 gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditName(profile.name)
                  setEditLocation(profile.location || 'Bangna, Bangkok')
                  setIsEditing(false)
                }}
                className="flex items-center justify-center gap-1.5 rounded-full bg-white/40 border border-[#BAC9B6]/40 py-3 text-xs font-bold text-[#2B2E2C] hover:bg-white/60 active:scale-98"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center justify-center gap-1.5 rounded-full bg-[#5F7A61] text-white py-3 text-xs font-bold shadow-sm hover:bg-[#4E6750] active:scale-98"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-white/70 hover:bg-white border border-white/20 py-3.5 text-[#2B2E2C] text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                <Pencil className="h-3.5 w-3.5 text-[#2B2E2C]" aria-hidden="true" />
                Edit Profile
              </button>
              <button
                onClick={onOpenQr}
                className="flex items-center justify-center gap-1.5 rounded-full bg-white/70 hover:bg-white border border-white/20 py-3.5 text-[#2B2E2C] text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                <Share2 className="h-3.5 w-3.5 text-[#2B2E2C]" aria-hidden="true" />
                Share
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── 2. Achievements & Badges ────────────────── */}
      <section aria-label="Eco Badges Achievements">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Achievements Badges</h2>
          <button
            onClick={onOpenBadges}
            className="text-[10px] text-[#2B2E2C]/40 hover:text-[#2B2E2C]/60 font-extrabold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer"
          >
            See all &gt;
          </button>
        </div>
        <div className="flex overflow-x-auto scrollbar-none gap-2.5 pb-1">
          {BADGES.map((b) => {
            let isUnlocked = false
            if (b.id === 'eco-pioneer') {
              isUnlocked = recycledKg > 0
            } else if (b.id === 'carbon-crusher') {
              isUnlocked = (recycledKg * 0.72) >= 10.0
            } else if (b.id === 'green-guardian') {
              isUnlocked = totalPoints >= 2000
            } else if (b.id === 'waste-warrior') {
              isUnlocked = recycledKg >= 50
            } else if (b.id === 'zero-hero') {
              isUnlocked = historyLog.filter(log => log.positive).length >= 5
            }
            return { ...b, unlocked: isUnlocked }
          })
          .sort((a, b) => {
            if (a.unlocked && !b.unlocked) return -1
            if (!a.unlocked && b.unlocked) return 1
            return 0
          })
          .map((badge) => {
            const Icon = badge.icon
            const isUnlocked = badge.unlocked
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`w-[102px] shrink-0 rounded-2xl border p-3 flex flex-col items-center justify-between text-center min-h-[110px] transition-all cursor-pointer bg-white ${
                  isUnlocked
                    ? 'border-[#EAEAE6] shadow-sm hover:border-[#5F7A61]/35 active:scale-95'
                    : 'border-[#EAEAE6] opacity-65 hover:opacity-100 active:scale-95'
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isUnlocked ? badge.color : 'bg-gray-100 text-gray-400'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-[10px] font-bold text-[#2B2E2C] mt-1.5">{badge.name}</h3>
                  <p className="text-[8px] text-[#2B2E2C]/50 mt-0.5 leading-tight">{badge.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── 3. Rewards Quick Marketplace Slider ── */}
      <section aria-label="Rewards Quick Swap Marketplace">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Quick Exchange Rewards</h2>
          <button
            onClick={onOpenRewards}
            className="text-[10px] text-[#2B2E2C]/40 hover:text-[#2B2E2C]/60 font-extrabold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer"
          >
            See all &gt;
          </button>
        </div>

        {/* Horizontal scroll track */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
          {REWARDS.map((reward) => {
            const canAfford = totalPoints >= reward.cost
            const showError = insufficientId === reward.id
            const Icon = reward.icon

            return (
              <div
                key={reward.id}
                className="snap-start flex w-[200px] shrink-0 flex-col justify-between rounded-3xl border border-[#EAEAE6] bg-white overflow-hidden shadow-sm text-left relative"
              >
                {/* Simulated product photo area */}
                <div className="relative h-28 w-full bg-[#E5ECE3] flex items-center justify-center overflow-hidden border-b border-[#EAEAE6] rounded-t-3xl rounded-b-none">
                  <Icon className="h-10 w-10 text-[#5F7A61]" />
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#2B2E2C] font-mono text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    {reward.cost.toLocaleString()} pts
                  </span>
                </div>

                {/* Content & button padded container */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#2B2E2C] truncate">{reward.name}</h3>
                    <p className="text-[9px] text-[#2B2E2C]/55 line-clamp-2 mt-1 leading-normal">{reward.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    className={`mt-4 w-full rounded-xl py-2.5 text-[10px] font-bold shadow-sm transition-all text-center ${
                      showError
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : canAfford
                        ? 'bg-[#5F7A61] text-white hover:bg-[#4E6750] active:scale-95'
                        : 'bg-[#F5F6F4] text-[#2B2E2C]/40 border border-[#EAEAE6] cursor-not-allowed'
                    }`}
                  >
                    {showError ? 'Need points' : 'Redeem'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. Eco Preferences & Settings ── */}
      <section aria-label="Eco Settings & Preferences" className="text-left bg-white border border-[#EAEAE6] rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Eco Settings</h2>
          <p className="text-[10px] text-[#2B2E2C]/40">Manage your local device preference triggers</p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Toggle 1: Push notifications */}
          <div className="flex items-center justify-between text-xs font-bold text-[#2B2E2C]">
            <span>Push Notifications</span>
            <button
              onClick={() => setPushActive(!pushActive)}
              className={`h-5 w-10 rounded-full relative p-0.5 transition-colors cursor-pointer ${pushActive ? 'bg-[#5F7A61]' : 'bg-gray-200'}`}
            >
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${pushActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Toggle 2: E-Receipts only */}
          <div className="flex items-center justify-between text-xs font-bold text-[#2B2E2C] border-t border-[#F0F0EE] pt-3">
            <span>E-Receipts Only (Paperless)</span>
            <button
              onClick={() => setReceiptActive(!receiptActive)}
              className={`h-5 w-10 rounded-full relative p-0.5 transition-colors cursor-pointer ${receiptActive ? 'bg-[#5F7A61]' : 'bg-gray-200'}`}
            >
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${receiptActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Target Weekly Goal Adjustment Row */}
          <div className="flex items-center justify-between text-xs font-bold text-[#2B2E2C] border-t border-[#F0F0EE] pt-3">
            <span>Weekly Target Goal</span>
            <button
              onClick={onOpenGoalModal}
              className="text-[#5F7A61] hover:text-[#4E6750] transition-colors font-mono text-xs font-bold flex items-center gap-1 bg-transparent border-none outline-none cursor-pointer p-0"
            >
              {weeklyPointGoal.toLocaleString()} pts &gt;
            </button>
          </div>

          {/* Static info */}
          <div className="flex justify-between items-center text-[10px] text-[#2B2E2C]/50 border-t border-[#F0F0EE] pt-3 font-semibold">
            <span>Device Offline Cache</span>
            <span className="font-mono text-[#5F7A61] bg-[#E2EADF] px-2 py-0.5 rounded-full text-[8px]">Active</span>
          </div>
        </div>
      </section>

      {/* ── 5. Logout button ── */}
      <button
        onClick={onLogout}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 py-3.5 text-xs font-bold text-red-600 transition-colors active:scale-98"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log Out
      </button>


      {/* Badge Details Modal (Interactive Gamification details) */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-55 max-w-md mx-auto bg-[#2B2E2C]/65 backdrop-blur-xs flex items-center justify-center p-5 animate-fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="w-full max-w-[285px] bg-white rounded-3xl p-5 shadow-2xl animate-scale-in text-left flex flex-col gap-4 text-[#2B2E2C]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5ECE3] text-[#5F7A61]`}>
                {(() => {
                  const Icon = selectedBadge.icon
                  return <Icon className="h-5 w-5" />
                })()}
              </span>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B2E2C]">{selectedBadge.name}</h3>
                <span className={`inline-block text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md mt-0.5 ${
                  selectedBadge.unlocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400'
                }`}>
                  {selectedBadge.unlocked ? 'Unlocked ✓' : 'Locked 🔒'}
                </span>
              </div>
            </div>

            {/* Explanatory text */}
            <div className="border-t border-[#F0F0EE] pt-3 text-xs leading-relaxed font-semibold text-[#2B2E2C]/70">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Requirement</p>
              <p className="text-[#2B2E2C] mt-0.5">{selectedBadge.desc}</p>
            </div>

            {/* Dynamic Progress block */}
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Progress Details</p>
              
              {selectedBadge.id === 'eco-pioneer' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>First batch recyclable log</span>
                    <span className="text-emerald-600 font-mono">{recycledKg > 0 ? '1 / 1' : '0 / 1'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${recycledKg > 0 ? 'w-full' : 'w-0'}`} />
                  </div>
                  <p className={`text-[9px] font-bold mt-0.5 ${recycledKg > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {recycledKg > 0 ? 'Status: Milestone achieved! +50 pts bonus claimed.' : 'Status: Log your first recyclable batch to unlock.'}
                  </p>
                </div>
              )}

              {selectedBadge.id === 'carbon-crusher' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>CO₂ saved milestone</span>
                    <span className="text-[#5F7A61] font-mono">{(recycledKg * 0.72).toFixed(1)} / 10.0 kg</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (((recycledKg * 0.72) / 10) * 100))}%` }} />
                  </div>
                  <p className="text-[9px] text-[#5F7A61] font-bold mt-0.5">
                    {(recycledKg * 0.72) >= 10.0 ? 'Status: Unlocked! Keep crushing emissions.' : `Status: ${(10 - (recycledKg * 0.72)).toFixed(1)} kg CO₂ emissions left.`}
                  </p>
                </div>
              )}

              {selectedBadge.id === 'green-guardian' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>Point milestone progress</span>
                    <span className="text-[#5F7A61] font-mono">{totalPoints.toLocaleString()} / 2,000 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (totalPoints / 2000) * 100)}%` }} />
                  </div>
                  <p className="text-[9px] text-[#5F7A61] font-bold mt-0.5">
                    {totalPoints >= 2000 ? 'Status: Unlocked! You are a certified Green Guardian.' : `Status: ${(2000 - totalPoints).toLocaleString()} points left to unlock.`}
                  </p>
                </div>
              )}

              {selectedBadge.id === 'waste-warrior' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>Recycled weight progress</span>
                    <span className="text-[#5F7A61] font-mono">{recycledKg.toFixed(1)} / 50.0 kg</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (recycledKg / 50) * 100)}%` }} />
                  </div>
                  <p className="text-[9px] text-[#5F7A61] font-bold mt-0.5">
                    {recycledKg >= 50.0 ? 'Status: Unlocked! You are an official Waste Warrior.' : `Status: ${(50 - recycledKg).toFixed(1)} kg left to unlock.`}
                  </p>
                </div>
              )}

              {selectedBadge.id === 'zero-hero' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>Deposits count</span>
                    <span className="text-[#5F7A61] font-mono">{historyLog.filter(l => l.positive).length} / 5 deposits</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5F7A61] rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (historyLog.filter(l => l.positive).length / 5) * 100)}%` }} />
                  </div>
                  <p className="text-[9px] text-[#5F7A61] font-bold mt-0.5">
                    {historyLog.filter(l => l.positive).length >= 5 ? 'Status: Unlocked! You have accomplished the Zero Hero streak.' : `Status: ${(5 - historyLog.filter(l => l.positive).length)} more deposits needed.`}
                  </p>
                </div>
              )}
            </div>

            {/* Done CTA */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-2 w-full py-2.5 bg-[#5F7A61] hover:bg-[#4E6750] text-white font-bold text-xs rounded-xl shadow-xs transition-all text-center active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
