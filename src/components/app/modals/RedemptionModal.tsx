'use client'

import { X, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { Reward } from '@/types'

interface RedemptionModalProps {
  reward: Reward
  onClose: () => void
}

/**
 * Displays a redemption confirmation with a unique barcode after a successful
 * reward claim. The generated code is deterministic for the session.
 */
export function RedemptionModal({ reward, onClose }: RedemptionModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  
  const sessionCode = `MDR-RWD-${String(reward.id).padStart(3, '0')}-${Date.now()
    .toString(36)
    .toUpperCase()
    .slice(-6)}`

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const expiresStr = expiresAt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  useEffect(() => {
    QRCode.toDataURL(sessionCode, { margin: 1, scale: 6 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err))
  }, [sessionCode])

  return (
    <div
      className="fixed inset-0 z-50 max-w-md mx-auto flex items-center justify-center bg-[#2B2E2C]/50 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Redemption successful"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Redemption</h2>
          <button
            onClick={onClose}
            aria-label="Close redemption dialog"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAE6] bg-white text-[#2B2E2C]/60 transition-all hover:bg-gray-50 hover:text-[#2B2E2C] shadow-xs active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Success indicator */}
        <div className="mb-5 flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5F7A61]">
            <Check className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <h3 className="mt-3 text-lg font-bold text-[#5F7A61]">Redemption Successful!</h3>
          <p className="mt-1 text-xs text-[#2B2E2C]/50">{reward.name}</p>
        </div>

        {/* Real scannable QR Code */}
        <div className="mx-auto w-fit rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-4 flex items-center justify-center min-h-[140px] min-w-[140px] shadow-inner">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Voucher QR Code" className="w-32 h-32 object-contain" />
          ) : (
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider animate-pulse">Generating...</span>
          )}
        </div>

        <p className="mt-3 font-mono text-xs font-semibold text-[#2B2E2C]">
          {sessionCode}
        </p>

        {/* Merchant instructions */}
        <div className="mt-4 rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-3 text-left">
          <p className="text-xs leading-relaxed text-[#2B2E2C]/70">
            Show this code to the merchant to claim your item.
          </p>
          <p className="mt-2 font-mono text-xs text-[#2B2E2C]/50">
            Expires:{' '}
            <span className="text-[#D9A05B]">{expiresStr}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-[#5F7A61] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  )
}
