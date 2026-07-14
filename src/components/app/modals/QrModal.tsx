'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QrModalProps {
  username?: string
  onClose: () => void
}

/**
 * Full-screen overlay displaying the member's personal QR code.
 * Clicking the backdrop or the X button closes the modal.
 */
export function QrModal({ username, onClose }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const codeText = username || 'MDR-2026-0714-AIKO'

  useEffect(() => {
    QRCode.toDataURL(codeText, { margin: 1, scale: 6 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err))
  }, [codeText])

  return (
    <div
      className="fixed inset-0 z-50 max-w-md mx-auto flex items-center justify-center bg-[#2B2E2C]/50 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Member QR code"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2B2E2C]">Member QR</h2>
          <button
            onClick={onClose}
            aria-label="Close QR modal"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAE6] bg-white text-[#2B2E2C]/60 transition-all hover:bg-gray-50 hover:text-[#2B2E2C] shadow-xs active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Real scannable QR Code */}
        <div className="mx-auto mt-5 w-fit rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] p-4 flex items-center justify-center min-h-[140px] min-w-[140px] shadow-inner">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Member QR Code" className="w-32 h-32 object-contain" />
          ) : (
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider animate-pulse">Generating...</span>
          )}
        </div>

        <p className="mt-4 font-mono text-sm font-semibold text-[#2B2E2C]">
          {codeText}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#2B2E2C]/50">
          Show this code at any Midori collection point to link deposits to your account.
        </p>
      </div>
    </div>
  )
}
