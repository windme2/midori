import type { LucideIcon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Navigation / view types
// ---------------------------------------------------------------------------

export type View = 'landing' | 'auth' | 'app'
export type Role = 'member' | 'staff' | 'admin'
export type Tab = 'home' | 'deposit' | 'history' | 'profile'
export type WasteType = 'Plastic' | 'Paper' | 'Glass' | 'Organic' | 'E-waste' | 'Other'

// ---------------------------------------------------------------------------
// Data model interfaces
// ---------------------------------------------------------------------------

export interface Activity {
  id: number
  title: string
  location: string
  time: string
  points: number
}

export interface HistoryEntry {
  id: number | string
  title: string
  date: string
  points: string   // formatted string e.g. "+72" or "-450"
  positive: boolean
  pending?: boolean
  weight?: number
  createdAt?: string | Date
}

export interface Reward {
  id: number
  name: string
  cost: number
  description: string   // shown in reward cards
  icon: LucideIcon
  accentColor: string   // used for card gradient/decoration
  category: string
}

// ---------------------------------------------------------------------------
// Shared app state passed from MobileApp to children
// ---------------------------------------------------------------------------

export interface AppStats {
  totalPoints: number
  recycledKg: number
  co2SavedKg: number
  breakdown?: Record<string, number>
  lastWeekPoints?: number
  showLastWeekTag?: boolean
}

export interface UserProfile {
  name: string
  username: string
  memberSince: string
  tier: string
  location?: string
  avatar?: string
}

