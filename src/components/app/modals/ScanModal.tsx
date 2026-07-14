'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ImageIcon, Zap, ZapOff, Check, Droplets, Package, CircuitBoard, Leaf, Recycle } from 'lucide-react'
import type { WasteType } from '@/types'

interface ScanModalProps {
  onClose: () => void
  onScanItem: (type: WasteType, weight: number) => void
}

type ScanPhase = 'camera' | 'scanning' | 'result'

const SCAN_ITEMS = [
  { type: 'Plastic' as WasteType, weight: 1.2, label: 'Plastic Bottle',   sub: 'PET / HDPE',  pts: 36, icon: Droplets,     color: 'text-blue-400'   },
  { type: 'Paper'   as WasteType, weight: 3.5, label: 'Cardboard Box',    sub: 'Corrugated',  pts: 52, icon: Package,      color: 'text-amber-500'  },
  { type: 'E-waste' as WasteType, weight: 0.8, label: 'Electronic Board', sub: 'PCB / Chip',  pts: 96, icon: CircuitBoard, color: 'text-purple-400' },
  { type: 'Organic' as WasteType, weight: 2.0, label: 'Food Waste',       sub: 'Compostable', pts: 20, icon: Leaf,         color: 'text-emerald-400'},
  { type: 'Glass'   as WasteType, weight: 2.5, label: 'Glass Bottle',     sub: 'Clear Glass', pts: 45, icon: Recycle,      color: 'text-sky-400'    },
]

export function ScanModal({ onClose, onScanItem }: ScanModalProps) {
  const [phase, setPhase] = useState<ScanPhase>('camera')
  const [flashOn, setFlashOn] = useState(false)
  const [scannedItem, setScannedItem] = useState<typeof SCAN_ITEMS[0] | null>(null)
  const [scanLinePos, setScanLinePos] = useState(20)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    let activeStream: MediaStream | null = null
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        activeStream = stream
        setCameraStream(stream)
      } catch (err) {
        console.warn("Camera access not available, falling back to simulated screen:", err)
      }
    }
    startCamera()
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleSimulateScan = (item: typeof SCAN_ITEMS[0]) => {
    setPhase('scanning')
    let pos = 10
    const interval = setInterval(() => {
      pos = pos >= 90 ? 10 : pos + 5
      setScanLinePos(pos)
    }, 40)
    setTimeout(() => {
      clearInterval(interval)
      setScannedItem(item)
      setPhase('result')
    }, 1400)
  }

  const handleHandover = () => {
    if (!scannedItem) return
    onScanItem(scannedItem.type, scannedItem.weight)
  }

  // ── Result Screen ──────────────────────────────────────────────────────────
  if (phase === 'result' && scannedItem) {
    const Icon = scannedItem.icon
    return (
      <div className="fixed inset-0 z-50 bg-white max-w-md mx-auto flex flex-col animate-fade-in overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-[#EAEAE6]">
          <button
            onClick={() => setPhase('camera')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F3] text-[#2B2E2C] hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-base font-bold text-[#2B2E2C]">Result Waste Scan</h1>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 flex-1">
          {/* Waste photo area */}
          <div>
            <p className="text-[10px] font-bold text-[#2B2E2C]/50 uppercase tracking-wider mb-2">Trash Photo</p>
            <div className="relative w-full h-52 rounded-3xl overflow-hidden bg-gradient-to-br from-[#E5ECE3] to-[#BAC9B6] flex items-center justify-center shadow-inner">
              <Icon className={`h-24 w-24 ${scannedItem.color} opacity-30`} />
              <Icon className={`absolute h-12 w-12 ${scannedItem.color}`} />
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#00D06C] text-[#1A1D1B] text-[8px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                <Check className="h-3 w-3 stroke-[3]" />
                Detected
              </div>
            </div>
          </div>

          {/* Detected card */}
          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3.5 text-center">
            <h2 className="text-sm font-extrabold text-[#2B2E2C]">Trash Detected</h2>
            <p className="text-[9px] text-[#2B2E2C]/50 mt-0.5">The price listed is the price per gram unit.</p>
          </div>

          {/* Details table */}
          <div>
            <p className="text-[10px] font-bold text-[#2B2E2C]/50 uppercase tracking-wider mb-2">Details</p>
            <div className="rounded-2xl border border-[#EAEAE6] bg-[#FAFAFA] overflow-hidden divide-y divide-[#EAEAE6]">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-[#2B2E2C]">{scannedItem.label}</span>
                <span className="text-xs font-bold text-[#5F7A61] font-mono">+{scannedItem.pts} pts</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-[#2B2E2C]">Material Type</span>
                <span className="text-xs font-semibold text-[#2B2E2C]/55">{scannedItem.sub}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-[#2B2E2C]">Est. Weight</span>
                <span className="text-xs font-bold text-[#2B2E2C]/55 font-mono">{scannedItem.weight.toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          {/* Hand over CTA */}
          <button
            onClick={handleHandover}
            className="w-full py-4 bg-[#00D06C] text-[#1A1D1B] font-extrabold text-sm rounded-2xl shadow-[0_4px_16px_rgba(0,208,108,0.25)] hover:bg-[#00b85f] active:scale-98 transition-all cursor-pointer"
          >
            Hand over the Trash
          </button>
        </div>
      </div>
    )
  }

  // ── Camera / Scanning Screen ───────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-[#121514] max-w-md mx-auto flex flex-col animate-fade-in overflow-hidden">

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center pt-14 px-5 text-white text-center pointer-events-none">
        <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-md">Waste Scan</h1>
        <p className="text-xs text-white/55 mt-1">To get information on the type of waste</p>
      </div>

      {/* Back button */}
      <button
        onClick={onClose}
        className="absolute top-12 left-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </button>

      {/* Camera background simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e2420] via-[#283228] to-[#1a1d1b]" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #5F7A61 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Viewfinder frame — centered vertically between header and controls */}
      <div className="absolute inset-x-8 top-36 bottom-52 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        {cameraStream ? (
          <video
            ref={(el) => {
              if (el && el.srcObject !== cameraStream) {
                el.srcObject = cameraStream
                el.play().catch(e => console.warn(e))
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
        ) : (
          <>
            {/* Simulated camera texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 via-slate-600/30 to-slate-800/50" />
            <div className="absolute inset-0 opacity-15"
              style={{ backgroundImage: 'linear-gradient(rgba(95,122,97,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(95,122,97,0.5) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
            />
          </>
        )}

        {/* Corner brackets — top left */}
        <div className="absolute left-4 top-4 h-7 w-7 pointer-events-none" style={{ borderTop: '3px solid #00D06C', borderLeft: '3px solid #00D06C', borderRadius: '10px 0 0 0' }} />
        {/* top right */}
        <div className="absolute right-4 top-4 h-7 w-7 pointer-events-none" style={{ borderTop: '3px solid #00D06C', borderRight: '3px solid #00D06C', borderRadius: '0 10px 0 0' }} />
        {/* bottom left */}
        <div className="absolute left-4 bottom-4 h-7 w-7 pointer-events-none" style={{ borderBottom: '3px solid #00D06C', borderLeft: '3px solid #00D06C', borderRadius: '0 0 0 10px' }} />
        {/* bottom right */}
        <div className="absolute right-4 bottom-4 h-7 w-7 pointer-events-none" style={{ borderBottom: '3px solid #00D06C', borderRight: '3px solid #00D06C', borderRadius: '0 0 10px 0' }} />

        {/* Scan laser line */}
        {phase === 'scanning' && (
          <div
            className="absolute inset-x-0 h-0.5 pointer-events-none"
            style={{
              top: `${scanLinePos}%`,
              background: 'linear-gradient(90deg, transparent, #00D06C, transparent)',
              boxShadow: '0 0 12px 4px rgba(0,208,108,0.5)',
            }}
          />
        )}

        {/* Ready reticle */}
        {phase === 'camera' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center animate-pulse">
              <div className="h-2.5 w-2.5 rounded-full bg-white/50" />
            </div>
          </div>
        )}

        {/* Scanning overlay text */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 bg-[#00D06C]/5 flex items-center justify-center">
            <p className="text-[10px] font-bold text-[#00D06C] uppercase tracking-widest animate-pulse">Detecting waste type…</p>
          </div>
        )}
      </div>

      {/* Item chips — above controls bar */}
      <div className="absolute bottom-36 left-0 right-0 px-5">
        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest text-center mb-2">
          {phase === 'scanning' ? 'Analyzing...' : 'Tap to simulate scan'}
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 justify-center">
          {SCAN_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.type}
                onClick={() => phase === 'camera' && handleSimulateScan(item)}
                disabled={phase === 'scanning'}
                className="flex flex-col items-center gap-1.5 shrink-0 bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 hover:bg-white/18 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              >
                <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                <span className="text-[8px] font-bold text-white/70 whitespace-nowrap">{item.type}</span>
                <span className="text-[7px] text-[#00D06C] font-mono font-bold">+{item.pts}pt</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Camera controls bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-12 py-5 pb-8 bg-black/30 backdrop-blur-sm">
        {/* Gallery */}
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/10 cursor-pointer hover:bg-white/18 active:scale-95 transition-all">
          <ImageIcon className="h-5 w-5" />
        </button>

        {/* Shutter */}
        <button
          onClick={() => {
            if (phase === 'camera') {
              const item = SCAN_ITEMS[Math.floor(Math.random() * SCAN_ITEMS.length)]
              handleSimulateScan(item)
            }
          }}
          disabled={phase === 'scanning'}
          className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-white bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-xl"
          style={{ height: '4.5rem', width: '4.5rem' }}
        >
          <div className="h-12 w-12 rounded-full bg-white/90 shadow-inner" />
        </button>

        {/* Flash */}
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-white cursor-pointer active:scale-95 transition-all ${
            flashOn ? 'bg-[#00D06C]/20 border-[#00D06C]/50' : 'bg-white/10 border-white/10 hover:bg-white/18'
          }`}
        >
          {flashOn
            ? <Zap className="h-5 w-5 text-[#00D06C]" />
            : <ZapOff className="h-5 w-5" />
          }
        </button>
      </div>
    </div>
  )
}
