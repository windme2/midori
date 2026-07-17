'use client'

import { useEffect, useState } from 'react'
import { Check, X, Droplets, Package, CircuitBoard, ScanLine, Trash2, Share2, Download } from 'lucide-react'
import { WASTE_TYPES } from '@/data/waste-types'
import type { Role, WasteType } from '@/types'

interface DepositTabProps {
  role: Role
  onCommitBasket: (basket: BasketItem[], notes: string) => Promise<any>
  onOpenScan: () => void
  basket: BasketItem[]
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>
  onShowReceipt: (receipt: any) => void
}

const CHECKLIST_ITEMS = [
  { key: 'rinse'    as const, label: 'Rinse Containers', icon: Droplets     },
  { key: 'flatten'  as const, label: 'Flatten Cardboard', icon: Package     },
  { key: 'separate' as const, label: 'Separate E-waste',  icon: CircuitBoard },
]

export interface BasketItem {
  id: string
  type: WasteType
  weight: number
  points: number
}

/**
 * Deposit Tab redesigned to support a batch deposit basket builder.
 * Users can add multiple items of different waste types and quantities,
 * preview them in a list/table, and commit them in a single batch transaction.
 */
export function DepositTab({ role, onCommitBasket, onOpenScan, basket, setBasket, onShowReceipt }: DepositTabProps) {
  const [selectedType, setSelectedType] = useState<WasteType>('Plastic')
  const [weight, setWeight]             = useState('')
  const [notes, setNotes]               = useState('')
  const [checklist, setChecklist]       = useState({
    rinse: false, flatten: false, separate: false,
  })
  const [banner, setBanner]             = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)

  // Auto-dismiss banner after 3 s
  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(null), 3000)
    return () => clearTimeout(t)
  }, [banner])

  const handleAddToBasket = () => {
    const parsed = parseFloat(weight)

    if (!weight.trim() || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid weight greater than 0 kg.')
      return
    }

    setError(null)
    const typeData = WASTE_TYPES.find((t) => t.name === selectedType)
    const rate = typeData ? typeData.ptsPerKg : 10
    const points = Math.round(parsed * rate)

    const newItem: BasketItem = {
      id: Math.random().toString(36).slice(2, 9),
      type: selectedType,
      weight: parsed,
      points,
    }

    setBasket((prev) => [...prev, newItem])
    setWeight('')
  }

  const handleDeleteItem = (id: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== id))
  }


  const handleCommitBasket = async () => {
    if (basket.length === 0) {
      setError('Your deposit basket is empty. Add items first.')
      return
    }

    try {
      const receipt = await onCommitBasket(basket, notes)
      if (receipt) {
        onShowReceipt(receipt)
        setBasket([])
        setNotes('')
        setChecklist({ rinse: false, flatten: false, separate: false })
        setError(null)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to commit deposit. Please try again.')
    }
  }

  const basketTotalWeight = basket.reduce((acc, item) => acc + item.weight, 0)
  const basketTotalPoints = basket.reduce((acc, item) => acc + item.points, 0)

  return (
    <div className="flex flex-col gap-6 pb-8 relative min-h-[calc(100vh-140px)]">
      {/* Heading */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[#2B2E2C]">
          Deposit &amp; Schedule Pickup
        </h1>
        <p className="mt-1 text-sm text-[#2B2E2C]/50">
          {role === 'staff'
            ? 'Staff / Collector Portal'
            : 'Build a list and submit all at once.'}
        </p>
      </div>

      {/* QR scanner launch button */}
      <button
        type="button"
        onClick={onOpenScan}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#5F7A61]/25 hover:border-[#5F7A61] bg-white hover:bg-[#5F7A61]/5 px-4 py-4 text-xs font-bold text-[#5F7A61] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
      >
        <ScanLine className="h-4.5 w-4.5" /> Scan Member / Bin QR Code
      </button>

      {/* Success banner */}
      {banner && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#5F7A61]/30 bg-[#5F7A61]/10 p-4 text-left"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5F7A61]">
            <Check className="h-3 w-3 text-white" aria-hidden="true" />
          </span>
          <p className="flex-1 text-sm leading-relaxed text-[#2B2E2C]">{banner}</p>
          <button
            onClick={() => setBanner(null)}
            aria-label="Dismiss notification"
            className="text-[#2B2E2C]/40 hover:text-[#2B2E2C] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Waste type selector */}
      <section aria-label="Waste type" className="text-left">
        <h2 className="text-sm font-semibold text-[#2B2E2C]">1. Select Waste Type</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Select waste type">
          {WASTE_TYPES.map((type) => {
            const active = selectedType === type.name
            return (
              <button
                key={type.name}
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedType(type.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'border-[#5F7A61] bg-[#5F7A61] text-white shadow-sm'
                    : 'border-[#EAEAE6] bg-white text-[#2B2E2C]/70 hover:border-[#5F7A61]/40'
                }`}
              >
                <type.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {type.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Input fields */}
      <section aria-label="Deposit details" className="flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="weight" className="text-xs font-semibold text-[#2B2E2C]/70">
            2. Enter Weight (kg)
          </label>
          <div className="flex gap-2">
            <input
              id="weight"
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value)
                if (error) setError(null)
              }}
              placeholder="0.0"
              aria-describedby={error ? 'weight-error' : undefined}
              className={`flex-1 rounded-xl border px-4 py-3 font-mono text-base text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:outline-none bg-white transition-colors ${
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-[#EAEAE6] focus:border-[#5F7A61]'
              }`}
            />
            <button
              onClick={handleAddToBasket}
              className="rounded-xl bg-[#E2EADF] text-[#5F7A61] px-5 py-3 text-xs font-bold transition-all hover:bg-[#D5E0D1] active:scale-95 border border-[#CCDBC7]"
            >
              Add to List
            </button>
          </div>
          {error && (
            <p id="weight-error" role="alert" className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
      </section>

      {/* Basket Table Section */}
      <section aria-label="Deposit Basket List" className="rounded-2xl border border-[#EAEAE6] bg-white p-4 text-left">
        <div className="flex items-center justify-between border-b border-[#EAEAE6] pb-3 mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2B2E2C]/65">Deposit List ({basket.length})</h2>
          {basket.length > 0 && (
            <span className="font-mono text-xs font-bold text-[#5F7A61] bg-[#E2EADF] px-2.5 py-0.5 rounded-full">
              {basketTotalWeight.toFixed(1)} kg | +{basketTotalPoints} pts
            </span>
          )}
        </div>

        {basket.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-[#2B2E2C]/40 font-semibold">List is empty. Select waste type and weight above to build your deposit list.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {basket.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border border-[#F0F0EE] bg-[#FBFBFA] rounded-xl px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2B2E2C]">{item.type}</span>
                  <span className="font-mono font-medium text-[#2B2E2C]/50">{item.weight.toFixed(1)} kg</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#5F7A61]">+{item.points} pts</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Remove item"
                    className="text-[#2B2E2C]/30 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Deposit Notes */}
      <section aria-label="Deposit Notes" className="rounded-2xl border border-[#EAEAE6] bg-white p-4 text-left">
        <label htmlFor="deposit-notes" className="text-[10px] font-bold uppercase tracking-wider text-[#2B2E2C]/65 block mb-2">Deposit Notes</label>
        <textarea
          id="deposit-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any specific instructions, package conditions or messages..."
          className="w-full rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-3 text-xs text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:border-[#5F7A61] focus:outline-none focus:bg-white resize-none h-16 font-semibold"
        />
      </section>

      {/* Preparation checklist */}
      <section
        aria-label="Preparation checklist"
        className="rounded-2xl border border-[#EAEAE6] bg-white p-5 text-left"
      >
        <h2 className="text-sm font-semibold text-[#2B2E2C]">Preparation Checklist</h2>
        <div className="mt-4 flex flex-col gap-3">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-[#5F7A61]" aria-hidden="true" />
                <span className="text-xs font-semibold text-[#2B2E2C]/80">{item.label}</span>
              </span>
              <span className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(e) =>
                    setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="peer h-5 w-5 appearance-none rounded-md border border-[#EAEAE6] bg-[#FBFBFA] transition-colors checked:border-[#5F7A61] checked:bg-[#5F7A61]"
                />
                <Check
                  className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Submit CTA */}
      <button
        onClick={handleCommitBasket}
        disabled={basket.length === 0}
        className={`w-full rounded-xl py-4 text-sm font-bold text-white transition-opacity ${
          basket.length > 0
            ? 'bg-[#5F7A61] hover:opacity-95 active:scale-[0.99] cursor-pointer'
            : 'bg-[#EAEAE6] text-[#2B2E2C]/30 cursor-not-allowed'
        }`}
      >
        {basket.length > 0
          ? `Commit & Log Deposit (${basket.length} Items)`
          : 'List is empty'}
      </button>
    </div>
  )
}
