'use client'

import { ArrowLeft, Share2, Leaf, Calendar, ShieldCheck } from 'lucide-react'

interface CampaignDetailModalProps {
  activeNews: {
    id: number
    title: string
    desc: string
    date: string
    category: string
    color: string
  }
  onClose: () => void
  onJoin: (news: any) => void
  setNewsModalRef?: (node: HTMLDivElement | null) => void
}

export function CampaignDetailModal({ activeNews, onClose, onJoin, setNewsModalRef }: CampaignDetailModalProps) {
  return (
    <div 
      ref={setNewsModalRef}
      className="fixed inset-0 z-50 max-w-md mx-auto bg-[#F4F6F3] overflow-y-auto animate-scale-in flex flex-col text-left"
    >
      {/* Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#EAEAE6] px-5 py-4 z-10 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-bold text-[#2B2E2C] hover:text-[#5F7A61] transition-colors active:scale-95 bg-transparent border-none outline-none cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B2E2C]/40">Campaign Detail</span>
        <button
          onClick={() => alert('Campaign link copied to clipboard!')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C] shadow-sm active:scale-95 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col bg-white">
        {/* Hero Image Section */}
        <div className="relative h-48 w-full bg-[#BAC9B6]/40 flex items-center justify-center overflow-hidden border-b border-[#EAEAE6]">
          <div 
            className="absolute inset-0 bg-[#A8BEA5]/20"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, #E5ECE3 0%, #C8D9C4 100%)',
            }}
          />
          <Leaf className="h-16 w-16 text-[#5F7A61] animate-pulse" />
          <div className="absolute bottom-4 left-5 bg-white/90 backdrop-blur-xs text-[#2B2E2C] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border border-[#BAC9B6]">
            {activeNews.category}
          </div>
        </div>

        {/* Campaign details */}
        <div className="p-6 flex flex-col gap-4 text-left bg-white flex-1">
          <div>
            <span className="text-[9px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Calendar className="h-3.5 w-3.5" /> {activeNews.date}
            </span>
            <h2 className="text-base font-extrabold text-[#2B2E2C] tracking-tight leading-snug">{activeNews.title}</h2>
          </div>

          <div className="border-y border-[#F0F0EE] py-4 text-xs text-[#2B2E2C]/65 leading-relaxed flex flex-col gap-3">
            <p className="font-bold text-[#2B2E2C] text-xs leading-normal">{activeNews.desc}</p>
            <p>
              Join the Midori Eco Team for our weekly sustainability outreach programs! By registering and participating, members can bring their sorted plastic and glass deposits directly to the campaign spot to receive a **2x points booster token**.
            </p>
            <p>
              All collected recyclable materials are weighed transparently on-site and processed through our verified eco-partners. Together, we mitigate municipal landfills and secure green vouchers.
            </p>
          </div>

          {/* CTA Action button placed inline directly below content */}
          <div className="pt-4 pb-6">
            <button
              onClick={() => onJoin(activeNews)}
              className="w-full py-4 bg-[#5F7A61] text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-[#4E6750] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              Join Campaign &amp; Get 150 Points
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
