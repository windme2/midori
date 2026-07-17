'use client'

import { useState } from 'react'
import { X, Droplets, Package, Zap, Leaf, CircuitBoard, Recycle, ChevronRight, Info } from 'lucide-react'

interface RecyclingGuidePageProps {
  onClose: () => void
}

const GUIDES = [
  {
    id: 'plastic',
    name: 'Plastic',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    ptsPerKg: 30,
    dos: [
      'Rinse bottles and containers before depositing',
      'Crush PET bottles to save space',
      'Include caps & lids (they are recyclable too)',
      'Look for ♻ symbols 1, 2, 4, 5 on the bottom',
    ],
    donts: [
      'Include plastic bags or cling wrap',
      'Mix with food-contaminated packaging',
      'Include styrofoam (EPS)',
      'Include PVC piping (#3)',
    ],
    types: ['PET Bottles (#1)', 'HDPE Containers (#2)', 'Plastic Caps', 'Food-grade containers'],
    tip: 'Plastic bottles earn the most points per kg among common plastics. Clean them well for maximum value.',
  },
  {
    id: 'paper',
    name: 'Paper',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    ptsPerKg: 15,
    dos: [
      'Flatten cardboard boxes before depositing',
      'Bundle newspapers and magazines together',
      'Remove tape and metal staples if possible',
      'Keep paper dry — wet paper is not recyclable',
    ],
    donts: [
      'Include wax-coated paper (pizza boxes with grease)',
      'Include receipts (thermal paper)',
      'Mix with tissue or paper towels',
      'Include laminated paper',
    ],
    types: ['Cardboard & Corrugated', 'Office Paper', 'Newspapers', 'Magazines'],
    tip: 'Flattening cardboard doubles the amount you can deposit per trip — more kg = more points!',
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: Recycle,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    ptsPerKg: 18,
    dos: [
      'Rinse bottles and jars thoroughly',
      'Sort by color if possible (clear, brown, green)',
      'Remove metal caps and lids',
      'Handle carefully — protect yourself from breakage',
    ],
    donts: [
      'Include broken glass without wrapping safely',
      'Include light bulbs or fluorescent tubes',
      'Include ceramics, Pyrex, or mirrors',
      'Include crystal glassware',
    ],
    types: ['Glass Bottles (clear/brown/green)', 'Glass Jars', 'Wine & Beer Bottles'],
    tip: 'Glass is 100% infinitely recyclable with no quality loss — every bottle you deposit saves significant energy.',
  },
  {
    id: 'organic',
    name: 'Organic',
    icon: Leaf,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    ptsPerKg: 10,
    dos: [
      'Separate food scraps from packaging',
      'Include fruit and vegetable peels',
      'Coffee grounds and tea bags are welcome',
      'Deposit regularly to avoid odor',
    ],
    donts: [
      'Include meat, fish, or dairy products',
      'Include cooking oil',
      'Mix with non-organic waste',
      'Include diseased plant material',
    ],
    types: ['Fruit & Vegetable Peels', 'Food Scraps', 'Coffee Grounds', 'Dried Leaves'],
    tip: 'Organic waste becomes high-quality compost that returns to local community gardens.',
  },
  {
    id: 'ewaste',
    name: 'E-Waste',
    icon: CircuitBoard,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    ptsPerKg: 120,
    dos: [
      'Remove batteries from devices before depositing',
      'Bring chargers, cables, and accessories',
      'Include old phones, tablets, computers',
      'Handle screens carefully to avoid breakage',
    ],
    donts: [
      'Include items with leaking batteries',
      'Disassemble equipment unnecessarily',
      'Include CRT monitors without wrapping',
      'Mix with general waste',
    ],
    types: ['Mobile Phones', 'Laptops & Tablets', 'PCBs & Circuit Boards', 'Cables & Chargers'],
    tip: 'E-waste earns the highest points per kg — a single circuit board can earn up to +120 pts per kg!',
  },
]

export function RecyclingGuidePage({ onClose }: RecyclingGuidePageProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const selectedGuide = GUIDES.find(g => g.id === selected)

  if (selectedGuide) {
    const Icon = selectedGuide.icon
    return (
      <div className="flex flex-col pb-8 text-left animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#F4F6F3]/95 backdrop-blur-sm px-5 py-4 border-b border-[#EAEAE6]">
          <button
            onClick={() => setSelected(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C]/60 shadow-xs hover:bg-gray-50 active:scale-95 cursor-pointer transition-all"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${selectedGuide.bg}`}>
              <Icon className={`h-4.5 w-4.5 ${selectedGuide.color}`} />
            </span>
            <h1 className="text-base font-bold text-[#2B2E2C]">{selectedGuide.name} Guide</h1>
          </div>
          <span className={`ml-auto text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${selectedGuide.bg} ${selectedGuide.color}`}>
            +{selectedGuide.ptsPerKg} pts/kg
          </span>
        </div>

        <div className="px-5 flex flex-col gap-5 mt-5">
          {/* Accepted types */}
          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#2B2E2C]/50 mb-3">Accepted Types</h2>
            <div className="grid grid-cols-2 gap-2">
              {selectedGuide.types.map((t) => (
                <div key={t} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${selectedGuide.border} ${selectedGuide.bg}`}>
                  <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${selectedGuide.color.replace('text-', 'bg-')}`} />
                  <span className={`text-[10px] font-bold ${selectedGuide.color}`}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Do's */}
          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-3">✓ Do</h2>
            <div className="flex flex-col gap-2">
              {selectedGuide.dos.map((d) => (
                <div key={d} className="flex items-start gap-2.5 bg-white rounded-xl border border-[#EAEAE6] px-3.5 py-3">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[8px] font-extrabold shrink-0 mt-0.5">✓</span>
                  <span className="text-[11px] font-semibold text-[#2B2E2C] leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div>
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 mb-3">✕ Don't</h2>
            <div className="flex flex-col gap-2">
              {selectedGuide.donts.map((d) => (
                <div key={d} className="flex items-start gap-2.5 bg-white rounded-xl border border-[#EAEAE6] px-3.5 py-3">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-50 text-red-500 text-[8px] font-extrabold shrink-0 mt-0.5">✕</span>
                  <span className="text-[11px] font-semibold text-[#2B2E2C] leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eco Tip */}
          <div className={`rounded-2xl border ${selectedGuide.border} ${selectedGuide.bg} p-4 flex gap-3`}>
            <Info className={`h-4 w-4 ${selectedGuide.color} shrink-0 mt-0.5`} />
            <p className={`text-[11px] font-semibold leading-relaxed ${selectedGuide.color}`}>{selectedGuide.tip}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0 pb-8 text-left">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#F4F6F3]/95 backdrop-blur-sm px-5 py-4 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#2B2E2C]">Recycling Guide</h1>
          <p className="text-[10px] text-[#2B2E2C]/45 mt-0.5">How to sort &amp; what earns the most points</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C]/60 shadow-xs hover:bg-gray-50 active:scale-95 cursor-pointer transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Intro */}
      <div className="mx-5 mt-5 bg-[#E5ECE3] rounded-2xl p-4 border border-[#BAC9B6]/40">
        <p className="text-[11px] font-semibold text-[#3A5C3C] leading-relaxed">
          Proper sorting increases the quality of recycled material and earns you more points. 
          Select a category below to learn what&apos;s accepted and how to prepare it.
        </p>
      </div>

      {/* Category cards */}
      <div className="px-5 flex flex-col gap-3 mt-5">
        {GUIDES.map((guide) => {
          const Icon = guide.icon
          return (
            <button
              key={guide.id}
              onClick={() => setSelected(guide.id)}
              className="flex items-center gap-4 bg-white rounded-2xl border border-[#EAEAE6] px-4 py-4 shadow-xs hover:border-[#5F7A61]/30 active:scale-98 transition-all cursor-pointer text-left"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${guide.bg} shrink-0`}>
                <Icon className={`h-6 w-6 ${guide.color}`} />
              </span>
              <div className="flex-1">
                <h3 className="text-xs font-extrabold text-[#2B2E2C]">{guide.name}</h3>
                <p className="text-[10px] text-[#2B2E2C]/50 mt-0.5">{guide.types.length} accepted types · {guide.dos.length} sorting tips</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-full ${guide.bg} ${guide.color}`}>
                  +{guide.ptsPerKg} pts/kg
                </span>
                <ChevronRight className="h-4 w-4 text-[#2B2E2C]/30" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
