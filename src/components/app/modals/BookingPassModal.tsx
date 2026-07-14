'use client'

import { Leaf } from 'lucide-react'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { UserProfile } from '@/types'

interface BookingPassModalProps {
  bookingTicket: {
    id: number
    title: string
    date: string
  }
  profile: UserProfile
  onClose: () => void
}

export function BookingPassModal({ bookingTicket, profile, onClose }: BookingPassModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  
  // We can lock the simulated random ID or generate it once per render.
  const passId = `MDR-CAMP-${12345 + (bookingTicket.id * 7) % 76543}`

  useEffect(() => {
    QRCode.toDataURL(passId, { margin: 1, scale: 6 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err))
  }, [passId])

  return (
    <div 
      className="fixed inset-0 z-55 max-w-md mx-auto bg-[#2B2E2C]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xs bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in text-left flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header */}
        <div className="bg-[#5F7A61] px-5 py-4 text-white text-center flex flex-col items-center gap-1">
          <Leaf className="h-6 w-6 text-white fill-white animate-pulse" />
          <h3 className="text-sm font-extrabold tracking-wider uppercase">Midori Booking Pass</h3>
          <span className="text-[8px] font-extrabold tracking-widest uppercase bg-[#E5ECE3] text-[#3A5C3C] px-2 py-0.5 rounded-full mt-1 animate-pulse">
            2x Points Multiplier Active
          </span>
        </div>

        {/* Pass Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px]">
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Attendee</span>
              <span className="text-[#2B2E2C] font-extrabold text-xs">{profile.name}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Date &amp; Time</span>
              <span className="text-[#2B2E2C] font-semibold text-[10px] leading-tight block mt-0.5">{bookingTicket.date}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Campaign Reward</span>
              <span className="text-[#00D06C] font-extrabold text-xs font-mono">+150 pts</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider block text-[8px]">Campaign Title</span>
              <span className="text-[#2B2E2C] font-extrabold text-[11px] leading-tight block mt-0.5">{bookingTicket.title}</span>
            </div>
          </div>

          {/* Dotted Tear line */}
          <div className="border-t border-dashed border-[#EAEAE6] my-1" />

          {/* Real scannable QR Code */}
          <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE6]">
            <div className="h-32 w-32 bg-white border border-[#EAEAE6] rounded-xl flex items-center justify-center p-2 shadow-xs">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Campaign Booking QR Code" className="w-28 h-28 object-contain" />
              ) : (
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider animate-pulse">Generating...</span>
              )}
            </div>
            <span className="text-[8px] font-mono font-extrabold text-gray-400 uppercase tracking-widest mt-1">
              Pass ID: {passId}
            </span>
          </div>

          {/* Close/Done button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F4F6F3] hover:bg-[#E2EADF] text-[#5F7A61] font-bold text-xs rounded-xl shadow-xs transition-all text-center active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
