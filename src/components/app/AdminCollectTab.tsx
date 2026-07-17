'use client'

import { useState, useEffect } from 'react'
import { QrCode, ShieldCheck, Trash2, Leaf, AlertCircle, ArrowRight, UserCheck, Plus, Minus, Check } from 'lucide-react'
import type { WasteType } from '@/types'
import { WASTE_TYPES } from '@/data/waste-types'

// Mock members database for simulation
const MOCK_MEMBERS = [
  { id: 'MDR-2026-0714-AIKO', name: 'Aiko Tanaka', points: 1420, tier: 'Silver', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'MDR-2026-0812-JOHN', name: 'John Doe', points: 450, tier: 'Bronze', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  { id: 'MDR-2026-0925-SARA', name: 'Sarah Connor', points: 2800, tier: 'Gold', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
]

interface AdminCollectTabProps {
  members?: Array<{ id: string; name: string; points: number; tier: string; avatar: string }>
  prefilledDeposit?: {
    member: { id: string; name: string; points: number; tier: string; avatar: string }
    wasteType: WasteType
    weight: number
  } | null
  onClearPrefilled?: () => void
  onLogDepositSuccess: (payload: {
    memberId: string
    memberName: string
    wasteType: WasteType
    weight: number
    pointsEarned: number
    checklist: { rinsed: boolean; sorted: boolean; flattened: boolean }
  }) => void
}

export function AdminCollectTab({ 
  onLogDepositSuccess,
  prefilledDeposit,
  onClearPrefilled,
  members
}: AdminCollectTabProps) {
  const activeMembers = members && members.length > 0 ? members : MOCK_MEMBERS

  // ── States ────────────────────────────────────────────────────────────────
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; points: number; tier: string; avatar: string } | null>(null)
  const [scanning, setScanning] = useState(false)
  const [manualIdInput, setManualIdInput] = useState('')
  const [wasteType, setWasteType] = useState<WasteType>('Plastic')
  const [weight, setWeight] = useState(1.0)
  
  // Checklist
  const [rinsed, setRinsed] = useState(false)
  const [sorted, setSorted] = useState(false)
  const [flattened, setFlattened] = useState(false)
  
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (prefilledDeposit) {
      setSelectedMember(prefilledDeposit.member)
      setWasteType(prefilledDeposit.wasteType)
      setWeight(prefilledDeposit.weight)
      setRinsed(true)
      setSorted(true)
      setFlattened(true)
      if (onClearPrefilled) onClearPrefilled()
    }
  }, [prefilledDeposit, onClearPrefilled])

  // Find waste multiplier rate
  const activeWasteConfig = WASTE_TYPES.find((w) => w.name === wasteType)
  const pointsRate = activeWasteConfig ? activeWasteConfig.ptsPerKg : 10
  const calculatedPoints = Math.round(weight * pointsRate)

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleScanSimulate = () => {
    setScanning(true)
    setErrorMessage('')
    // Simulate camera scanning a member QR code
    setTimeout(() => {
      const randomMember = activeMembers[Math.floor(Math.random() * activeMembers.length)]
      setSelectedMember(randomMember)
      setScanning(false)
    }, 1200)
  }

  const handleManualSearch = () => {
    setErrorMessage('')
    const match = activeMembers.find(
      (m) => m.id.toLowerCase() === manualIdInput.trim().toLowerCase() ||
             m.name.toLowerCase().includes(manualIdInput.trim().toLowerCase())
    )
    if (match) {
      setSelectedMember(match)
      setManualIdInput('')
    } else {
      setErrorMessage('Member ID or Name not found. Please try again.')
    }
  }

  const handleWeightChange = (val: number) => {
    const nextWeight = parseFloat((weight + val).toFixed(1))
    if (nextWeight > 0) {
      setWeight(nextWeight)
    }
  }

  const handleSubmit = () => {
    if (!selectedMember) {
      setErrorMessage('Please select or scan a member first.')
      return
    }

    // Process deposit logging
    onLogDepositSuccess({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      wasteType,
      weight,
      pointsEarned: calculatedPoints,
      checklist: { rinsed, sorted, flattened }
    })

    // Reset Form
    setSelectedMember(null)
    setWeight(1.0)
    setRinsed(false)
    setSorted(false)
    setFlattened(false)
    setErrorMessage('')
  }

  return (
    <div className="animate-tab-fade flex flex-col gap-4 pb-24 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">Collect Deposits</h1>
        <p className="mt-1 text-xs text-[#2B2E2C]/50">Accept recyclables, weigh items, and credit points</p>
      </div>

      {/* ── Section 1: Member Scan / Selection ── */}
      <section aria-label="Member QR Selection" className="rounded-2xl border border-[#EAEAE6] bg-white p-4 shadow-sm flex flex-col gap-3">
        <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40">Step 1: Identify Member</h2>
        
        {!selectedMember ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleScanSimulate}
              disabled={scanning}
              className="w-full py-4 bg-[#5F7A61] hover:bg-[#4E6750] text-white rounded-xl shadow-xs font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <QrCode className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'Scanning Code...' : 'Simulate Scan Member QR'}
            </button>

            <div className="flex items-center gap-2">
              <div className="h-px bg-[#EAEAE6] flex-1" />
              <span className="text-[9px] font-bold text-[#2B2E2C]/30 uppercase">OR SEARCH</span>
              <div className="h-px bg-[#EAEAE6] flex-1" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Member ID (e.g. MDR-2026-0714-AIKO) or Name"
                value={manualIdInput}
                onChange={(e) => setManualIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#EAEAE6] text-xs font-medium bg-[#FBFBFA] focus:outline-none focus:border-[#5F7A61]/50 text-[#2B2E2C]"
              />
              <button
                onClick={handleManualSearch}
                className="px-4 bg-[#F4F6F3] hover:bg-[#E2EADF] text-[#5F7A61] font-extrabold text-xs rounded-xl border border-[#EAEAE6] active:scale-95 transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 bg-[#F4F6F3] rounded-xl border border-[#E2EADF] animate-scale-in">
            <div className="flex items-center gap-3">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="h-10 w-10 rounded-full border border-white object-cover shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-[#2B2E2C]">{selectedMember.name}</span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#5F7A61]/10 text-[#5F7A61] uppercase tracking-wider">{selectedMember.tier}</span>
                </div>
                <p className="font-mono text-[9px] text-[#2B2E2C]/50 mt-0.5">{selectedMember.id}</p>
                <p className="text-[9px] font-bold text-[#2B2E2C]/45 mt-0.5">Current Points: <span className="font-extrabold text-[#5F7A61]">{selectedMember.points}</span></p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-[9px] font-bold text-[#D9A05B] bg-white border border-[#EAEAE6] hover:bg-orange-50 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              Reset Member
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 bg-red-50/50 p-2 rounded-lg border border-red-100">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </section>

      {/* ── Section 2: Weight & Waste Form ── */}
      <section aria-label="Weighing Inputs" className="rounded-2xl border border-[#EAEAE6] bg-white p-4 shadow-sm flex flex-col gap-3.5">
        <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40">Step 2: Recyclables Input</h2>

        {/* Waste Category Segmented Tab Grid */}
        <div className="grid grid-cols-3 gap-2">
          {WASTE_TYPES.map((t) => {
            const Icon = t.icon
            const isSelected = wasteType === t.name
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setWasteType(t.name)}
                className={`py-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'border-[#5F7A61] bg-[#F4F6F3] text-[#5F7A61]'
                    : 'border-[#EAEAE6] bg-[#FBFBFA] text-[#2B2E2C]/55 hover:border-[#5F7A61]/30 hover:bg-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isSelected ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold">{t.name}</span>
                <span className="text-[8px] font-mono font-semibold text-gray-400">({t.ptsPerKg} pts/kg)</span>
              </button>
            )
          })}
        </div>

        {/* Weight Counter */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAE6]">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Measured Weight (KG)</span>
          <div className="flex items-center justify-between gap-4 mt-1">
            <button
              onClick={() => handleWeightChange(-1.0)}
              className="h-10 w-10 flex items-center justify-center bg-white border border-[#EAEAE6] text-[#2B2E2C] rounded-xl hover:bg-[#F4F6F3] active:scale-90 transition-all cursor-pointer font-bold"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-[#2B2E2C] font-mono">{weight.toFixed(1)}</span>
              <span className="text-xs font-extrabold text-[#2B2E2C]/50">kg</span>
            </div>
            <button
              onClick={() => handleWeightChange(1.0)}
              className="h-10 w-10 flex items-center justify-center bg-white border border-[#EAEAE6] text-[#2B2E2C] rounded-xl hover:bg-[#F4F6F3] active:scale-90 transition-all cursor-pointer font-bold"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Quick additions */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[0.1, 0.5, 2.0, 5.0].map((v) => (
              <button
                key={v}
                onClick={() => handleWeightChange(v)}
                className="py-1 bg-white border border-[#EAEAE6] rounded-md text-[9px] font-extrabold text-[#2B2E2C]/65 hover:bg-[#F4F6F3] active:scale-95 transition-all cursor-pointer"
              >
                +{v}kg
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Cleanliness Checklist & Points Calc ── */}
      <section aria-label="Deposit Validation" className="rounded-2xl border border-[#EAEAE6] bg-white p-4 shadow-sm flex flex-col gap-4">
        <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40">Step 3: Validation & Submit</h2>

        {/* Checkbox Checklist */}
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] cursor-pointer hover:border-[#5F7A61]/35 select-none transition-all">
            <input
              type="checkbox"
              checked={rinsed}
              onChange={(e) => setRinsed(e.target.checked)}
              className="h-4 w-4 rounded-sm border-gray-300 text-[#5F7A61] focus:ring-[#5F7A61]"
            />
            <div className="flex-1 text-left">
              <span className="text-xs font-bold text-[#2B2E2C] block">Rinsed and Cleaned?</span>
              <span className="text-[9px] text-[#2B2E2C]/40 block mt-0.5">Containers must be free of residual materials/fluids.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] cursor-pointer hover:border-[#5F7A61]/35 select-none transition-all">
            <input
              type="checkbox"
              checked={sorted}
              onChange={(e) => setSorted(e.target.checked)}
              className="h-4 w-4 rounded-sm border-gray-300 text-[#5F7A61] focus:ring-[#5F7A61]"
            />
            <div className="flex-1 text-left">
              <span className="text-xs font-bold text-[#2B2E2C] block">Sorted and Separated?</span>
              <span className="text-[9px] text-[#2B2E2C]/40 block mt-0.5">Materials must be pre-sorted and categorized.</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] cursor-pointer hover:border-[#5F7A61]/35 select-none transition-all">
            <input
              type="checkbox"
              checked={flattened}
              onChange={(e) => setFlattened(e.target.checked)}
              className="h-4 w-4 rounded-sm border-gray-300 text-[#5F7A61] focus:ring-[#5F7A61]"
            />
            <div className="flex-1 text-left">
              <span className="text-xs font-bold text-[#2B2E2C] block">Flattened and Compacted?</span>
              <span className="text-[9px] text-[#2B2E2C]/40 block mt-0.5">Paper boxes and plastic bottles must be pressed flat.</span>
            </div>
          </label>
        </div>

        {/* Points Calculator summary */}
        <div className="p-4 bg-[#F4F6F3] rounded-2xl border border-[#E2EADF] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2B2E2C]/50 block">Points to Credited</span>
            <span className="text-xl font-extrabold text-[#5F7A61] font-mono mt-0.5 block">+{calculatedPoints} pts</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2B2E2C]/50 block">Validation Bonus</span>
            <span className="text-[10px] font-bold text-[#2B2E2C]/65 block mt-0.5">
              {(rinsed && sorted && flattened) ? '2x Multiplier Active' : 'Standard Rate'}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#5F7A61] hover:bg-[#4E6750] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          Approve & Credit Points
        </button>
      </section>

    </div>
  )
}
