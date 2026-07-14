'use client'

import { X } from 'lucide-react'

interface NotificationItem {
  id: number
  title: string
  desc: string
  time: string
  unread: boolean
}

interface NotificationsModalProps {
  notifications: NotificationItem[]
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>
  onClose: () => void
}

export function NotificationsModal({ notifications, setNotifications, onClose }: NotificationsModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 max-w-md mx-auto bg-[#2B2E2C]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[350px] bg-white rounded-3xl p-5 shadow-2xl animate-scale-in flex flex-col text-left max-h-[485px] overflow-hidden border border-[#EAEAE6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header block */}
        <div className="flex items-center justify-between border-b border-[#EAEAE6] pb-3 shrink-0">
          <div>
            <h2 className="text-xs font-extrabold text-[#2B2E2C] uppercase tracking-wider">Notifications</h2>
            <p className="text-[9px] text-[#2B2E2C]/40 mt-0.5">Stay updated with your eco goals</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#EAEAE6] text-[#2B2E2C]/60 shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List items block */}
        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto py-3.5 scrollbar-none my-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item))
              }}
              className={`p-3 rounded-2xl border flex flex-col gap-1 transition-all cursor-pointer ${
                n.unread ? 'bg-[#5F7A61]/04 border-[#5F7A61]/25 hover:bg-[#5F7A61]/08' : 'bg-white border-[#EAEAE6] hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#2B2E2C]">{n.title}</span>
                {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />}
              </div>
              <p className="text-[9px] text-[#2B2E2C]/55 leading-relaxed font-semibold">{n.desc}</p>
              <span className="text-[8px] font-mono text-gray-400 font-extrabold uppercase tracking-wide mt-1 block">{n.time}</span>
            </div>
          ))}
        </div>

        {/* Button CTA */}
        <button
          onClick={() => {
            setNotifications(prev => prev.map(item => ({ ...item, unread: false })))
          }}
          className="w-full py-3 bg-[#5F7A61] hover:bg-[#4E6750] text-white font-extrabold text-[10px] rounded-xl shadow-xs transition-all text-center active:scale-95 cursor-pointer shrink-0 uppercase tracking-widest"
        >
          Mark all as read
        </button>
      </div>
    </div>
  )
}
