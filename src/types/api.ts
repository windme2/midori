/**
 * API Contract Types for Midori Waste Bank Platform.
 * Declares request and response payloads matching the Database Schema and API design.
 */

import type { UserProfile, AppStats, HistoryEntry, Reward } from './index'

// ── AUTH ENDPOINTS ──────────────────────────────────────────────────────────

export interface RegisterRequest {
  username: string
  email: string
  passwordHash: string
  displayName?: string
  location?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
  }
}

export interface LoginRequest {
  usernameOrEmail: string
  passwordHash: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: UserProfile
}

export interface MeResponse {
  user: UserProfile
  stats: AppStats
}

// ── USER & PROFILE ENDPOINTS ────────────────────────────────────────────────

export interface UpdateProfileRequest {
  displayName?: string
  avatarUrl?: string
  location?: string
}

export interface UpdateProfileResponse {
  success: boolean
  profile: UserProfile
}

export interface UpdateGoalRequest {
  weeklyGoal: number
}

export interface UpdateGoalResponse {
  success: boolean
  weeklyGoal: number
}

// ── TRANSACTION ENDPOINTS ───────────────────────────────────────────────────

export interface DepositItemPayload {
  wasteType: string
  weightKg: number
  pointsDelta: number
}

export interface LogDepositRequest {
  items: DepositItemPayload[]
  locationId?: number
  note?: string
}

export interface LogDepositResponse {
  success: boolean
  transactionId: string
  pointsEarned: number
  newStats: AppStats
  receipt: {
    id: string
    date: string
    items: Array<{ type: string; weight: number; points: number }>
    totalWeight: number
    totalPoints: number
  }
}

export interface GetHistoryResponse {
  history: HistoryEntry[]
  totalCount: number
  page: number
}

export interface GetChartStatsResponse {
  period: 'day' | 'week' | 'month' | 'year'
  chartData: Array<{
    x: number
    y: number
    label: string
    val: number
  }>
}

// ── REWARDS & REDEMPTION ENDPOINTS ──────────────────────────────────────────

export interface RedeemRewardRequest {
  rewardId: number
}

export interface RedeemRewardResponse {
  success: boolean
  redemptionId: string
  code: string
  pointsDeducted: number
  remainingPoints: number
  reward: Reward
}

export interface GetMyRedemptionsResponse {
  redemptions: Array<{
    id: string
    rewardId: number
    name: string
    cost: number
    status: 'pending' | 'confirmed' | 'delivered'
    redeemedAt: string
    code: string
  }>
}

// ── BADGES ENDPOINTS ────────────────────────────────────────────────────────

export interface GetBadgesResponse {
  badges: Array<{
    id: string
    name: string
    desc: string
    unlocked: boolean
    unlockedAt?: string
  }>
}

export interface CheckBadgesResponse {
  unlockedNew: boolean
  newBadges: string[]
}
