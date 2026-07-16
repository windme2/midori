'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Plus, User, ScanLine, Loader2, History } from 'lucide-react'
import { HomeTab }           from '@/components/app/HomeTab'
import { HistoryTab }        from '@/components/app/HistoryTab'
import { DepositTab, type BasketItem } from '@/components/app/DepositTab'
import { ProfileTab }         from '@/components/app/ProfileTab'
import { BadgesPage }         from '@/components/app/BadgesPage'
import { RecyclingGuidePage } from '@/components/app/RecyclingGuidePage'
import { RewardsTab }         from '@/components/app/RewardsTab'

// Extracted screens & modals
import { SplashScreen }       from '@/components/app/screens/SplashScreen'
import { LoginScreen }        from '@/components/app/screens/LoginScreen'
import { OnboardingScreen }   from '@/components/app/screens/OnboardingScreen'
import { NotificationsModal } from '@/components/app/modals/NotificationsModal'
import { ReceiptModal }       from '@/components/app/modals/ReceiptModal'
import { CampaignDetailModal } from '@/components/app/modals/CampaignDetailModal'
import { BookingPassModal }   from '@/components/app/modals/BookingPassModal'
import { AdminSuccessModal }  from '@/components/app/modals/AdminSuccessModal'
import { AdminLogDetailModal } from '@/components/app/modals/AdminLogDetailModal'

import { QrModal }            from '@/components/app/modals/QrModal'
import { ScanModal }          from '@/components/app/modals/ScanModal'
import { RedemptionModal }    from '@/components/app/modals/RedemptionModal'
import { AdminCollectTab }    from '@/components/app/AdminCollectTab'
import { AdminDashboardTab, type PendingDeposit }  from '@/components/app/AdminDashboardTab'
import { AdminLogTab, type AdminLogEntry } from '@/components/app/AdminLogTab'
import { WASTE_TYPES }        from '@/data/waste-types'
import { getTodaysChallenge } from '@/data/daily-challenges'
import type { Activity, HistoryEntry, Reward, Role, Tab, WasteType, AppStats, UserProfile } from '@/types'

interface MobileAppProps {
  role: Role
  onRoleChange?: (r: Role) => void
  tab: Tab
  onTabChange: (t: Tab) => void
  onExit: () => void
}

export function MobileApp({ role, onRoleChange, tab, onTabChange, onExit }: MobileAppProps) {
  const [stats, setStats]           = useState<AppStats>({
    totalPoints: 0,
    recycledKg:  0.0,
    co2SavedKg:  0.0,
    breakdown: {
      Plastic: 0.0,
      Paper: 0.0,
      Glass: 0.0,
      Organic: 0.0,
      'E-waste': 0.0,
      Other: 0.0,
    }
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [historyLog, setHistoryLog] = useState<HistoryEntry[]>([])
  const [basket, setBasket]         = useState<BasketItem[]>([])

  // PWA Startup states
  const [showSplash, setShowSplash] = useState(true)
  const [showLogin, setShowLogin]   = useState(false)
  const [loggingIn, setLoggingIn]   = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [weeklyPointGoal, setWeeklyPointGoal] = useState(2000)

  // Modals state
  const [showQr, setShowQr]                     = useState(false)
  const [showScan, setShowScan]                 = useState(false)
  const [showGuide, setShowGuide]               = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [showBadgesModal, setShowBadgesModal]   = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeReceipt, setActiveReceipt]       = useState<any | null>(null)
  const [activeNews, setActiveNews]             = useState<any | null>(null)
  const [bookingTicket, setBookingTicket]       = useState<any | null>(null)
  const [activeRedemption, setActiveRedemption] = useState<Reward | null>(null)
  const [showGoalModal, setShowGoalModal]       = useState(false)
  const [tempGoal, setTempGoal]                 = useState(2000)

  // Daily Challenge State
  const [challengeClaimed, setChallengeClaimed] = useState(false)
  const [challengeSimulatedComplete, setChallengeSimulatedComplete] = useState(false)

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    username: '',
    memberSince: 'July 2026',
    tier: 'Member',
    location: 'Bangna, Bangkok',
    avatar: '',
  })

  // Staff State
  const [staffLogs, setStaffLogs] = useState<AdminLogEntry[]>([])
  const [staffSuccessReceipt, setStaffSuccessReceipt] = useState<any | null>(null)
  const [activePrefilledDeposit, setActivePrefilledDeposit] = useState<any | null>(null)
  const [activePendingId, setActivePendingId] = useState<string | null>(null)
  const [activeStaffLogDetail, setActiveStaffLogDetail] = useState<AdminLogEntry | null>(null)
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([])

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'Welcome to midori! 🌟', desc: 'Start logging your recyclables today to earn points.', time: 'Just now', unread: true },
  ])

  // Fetch me API to determine logged-in user profile, stats and role
  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          setStats({
            totalPoints: data.user.points,
            recycledKg: data.user.recycledKg,
            co2SavedKg: data.user.co2SavedKg,
            breakdown: data.user.breakdown,
            lastWeekPoints: data.user.lastWeekPoints,
            showLastWeekTag: data.user.showLastWeekTag,
          })
          setProfile({
            name: data.user.name,
            username: data.user.username,
            memberSince: data.user.memberSince,
            tier: data.user.tier,
            location: data.user.location,
            avatar: data.user.avatar,
          })
          setWeeklyPointGoal(data.user.weeklyPointGoal)
          setShowSplash(false)
          setShowLogin(false)

          if (onRoleChange) {
            onRoleChange(data.user.role)
          }

          if (!data.user.hasCompletedOnboarding && data.user.role !== 'staff') {
            setShowOnboarding(true)
          } else {
            setShowOnboarding(false)
          }

          // Fetch queue or logs based on role
          if (data.user.role === 'staff') {
            fetchStaffData()
          } else {
            fetchMemberData()
          }
        }
      } else {
        setShowSplash(false)
        setShowLogin(true)
      }
    } catch (err) {
      console.error('fetchMe error:', err)
      setShowSplash(false)
      setShowLogin(true)
    }
  }

  const fetchMemberData = async () => {
    try {
      const res = await fetch('/api/deposit')
      if (res.ok) {
        const data = await res.json()
        setHistoryLog(data.logs)
      }
    } catch (err) {
      console.error('fetchMemberData error:', err)
    }
  }

  const fetchStaffData = async () => {
    try {
      const resQueue = await fetch('/api/staff/queue')
      if (resQueue.ok) {
        const dataQueue = await resQueue.json()
        setPendingDeposits(dataQueue.pendingDeposits)
      }

      const resLogs = await fetch('/api/staff/logs')
      if (resLogs.ok) {
        const dataLogs = await resLogs.json()
        setStaffLogs(dataLogs.logs)
      }
    } catch (err) {
      console.error('fetchStaffData error:', err)
    }
  }

  const triggerNotification = (title: string, desc: string) => {
    setNotifications(prev => {
      if (prev.some(n => n.title === title)) return prev
      return [
        {
          id: Date.now(),
          title,
          desc,
          time: 'Just now',
          unread: true
        },
        ...prev
      ]
    })
  }

  useEffect(() => {
    // Show splash screen for at least 1.5 seconds for premium loading transition
    const timer = setTimeout(() => {
      fetchMe()
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (stats.totalPoints >= weeklyPointGoal && weeklyPointGoal > 0) {
      triggerNotification(
        'Weekly Goal Reached! 🏆',
        `Congratulations! You have reached your goal of ${weeklyPointGoal} points this week.`
      )
    }
  }, [stats.totalPoints, weeklyPointGoal])

  useEffect(() => {
    const isEcoPioneer = stats.recycledKg > 0
    const isCarbonCrusher = stats.recycledKg * 0.72 >= 10.0
    const isZeroHero = historyLog.filter(l => l.positive).length >= 5

    if (isEcoPioneer) {
      triggerNotification(
        'Achievement Unlocked: Eco Pioneer! 🍾',
        'You have completed your first deposit and started your recycling journey!'
      )
    }
    if (isCarbonCrusher) {
      triggerNotification(
        'Achievement Unlocked: Carbon Crusher! 🍃',
        'You have offset over 10 kg of CO2 equivalents through your recycling!'
      )
    }
    if (isZeroHero) {
      triggerNotification(
        'Achievement Unlocked: Zero Hero! 🛡️',
        'You have successfully completed 5 or more deposits at Midori!'
      )
    }
  }, [stats.recycledKg, historyLog])

  // Scroll to top refs
  const slideRefs = [
    useRef<HTMLDivElement>(null), // home
    useRef<HTMLDivElement>(null), // deposit
    useRef<HTMLDivElement>(null), // history
    useRef<HTMLDivElement>(null), // profile
  ]
  const tabToIndex: Record<string, number> = { home: 0, deposit: 1, history: 2, profile: 3 }

  useEffect(() => {
    const idx = tabToIndex[tab] ?? 0
    slideRefs[idx]?.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab]) // eslint-disable-line

  const handleLoginSuccess = (targetRole: Role) => {
    if (onRoleChange) {
      onRoleChange(targetRole)
    }
    setLoggingIn(true)
    setTimeout(async () => {
      setLoggingIn(false)
      setShowLogin(false)
      await fetchMe()
    }, 1200)
  }

  const handleFinishOnboarding = async () => {
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' })
    } catch (err) {
      console.error(err)
    }
    setShowOnboarding(false)
  }

  const updateWeeklyGoalOnBackend = async (goal: number) => {
    setWeeklyPointGoal(goal)
    try {
      await fetch('/api/user/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyPointGoal: goal }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleCommitBasket = async (basketItems: BasketItem[], notes: string) => {
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ basket: basketItems, notes }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to commit deposit')
    }
    await fetchMe()
    return data.receipt
  }

  const redeemReward = async (reward: Reward) => {
    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rewardName: reward.name,
        cost: reward.cost,
      })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Failed to redeem reward')
      return
    }

    await fetchMe()
    setActiveRedemption(reward)
  }

  const handleStaffLogDeposit = async (payload: {
    memberId: string
    memberName: string
    wasteType: WasteType
    weight: number
    pointsEarned: number
  }) => {
    if (activePendingId) {
      const res = await fetch('/api/staff/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: payload.memberId,
          wasteType: payload.wasteType,
          weight: payload.weight,
          pointsEarned: payload.pointsEarned,
          activePendingId,
        })
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to approve request')
        return
      }

      setStaffSuccessReceipt({
        txId: activePendingId,
        memberName: payload.memberName,
        memberId: payload.memberId,
        wasteType: payload.wasteType,
        weight: payload.weight,
        pointsEarned: payload.pointsEarned,
      })

      setActivePendingId(null)
      setActivePrefilledDeposit(null)
    } else {
      const res = await fetch('/api/staff/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: payload.memberId,
          wasteType: payload.wasteType,
          weight: payload.weight,
          pointsEarned: payload.pointsEarned,
        })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to log deposit')
        return
      }

      setStaffSuccessReceipt({
        txId: data.txId,
        memberName: payload.memberName,
        memberId: payload.memberId,
        wasteType: payload.wasteType,
        weight: payload.weight,
        pointsEarned: payload.pointsEarned,
      })
    }

    await fetchStaffData()
    await fetchMe()
  }

  const handleProcessPendingDeposit = (pending: PendingDeposit) => {
    setActivePrefilledDeposit({
      member: {
        id: pending.memberId,
        name: pending.memberName,
        points: pending.points,
        tier: pending.tier,
        avatar: pending.avatar,
      },
      wasteType: pending.wasteType,
      weight: pending.weight,
    })
    setActivePendingId(pending.id)
    onTabChange('deposit')
  }

  const handleCampaignPoints = async (pts: number) => {
    // Campaign bonus simulates user joining campaign and gaining bonus credits
    // In database implementation, we update user points
    try {
      const todayDate = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
      const txId = `TX-CAMP-${Date.now()}`

      // Create a temporary endpoint or handle via user profile updates, or directly inside local context.
      // Let's directly credit it for mock presentation but update points in backend if desired.
      // We can use a direct collect endpoint or mock it. Let's just log it to stats for consistency.
      setStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + pts
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const checkActualChallengeCompletion = (): boolean => {
    const challenge = getTodaysChallenge()
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    const todayLogs = historyLog.filter(log => log.date === todayStr && log.positive)

    if (challenge.type === 'any') {
      if (challenge.id === 'zero-day-wednesday') {
        const types = new Set(todayLogs.map(log => {
          const parts = log.title.split(' ')
          return parts[0]
        }))
        return types.size >= 2
      }
      if (challenge.id === 'mega-sunday') {
        return todayLogs.some(log => {
          const match = log.title.match(/([\d.]+)\s*kg/)
          if (match) {
            const weight = parseFloat(match[1])
            return weight >= 3.0
          }
          return false
        })
      }
    } else {
      const matchingLogs = todayLogs.filter(log => log.title.toLowerCase().includes(challenge.type))
      let totalWeight = 0
      matchingLogs.forEach(log => {
        const match = log.title.match(/([\d.]+)\s*kg/)
        if (match) {
          totalWeight += parseFloat(match[1])
        }
      })

      if (challenge.type === 'ewaste') {
        return matchingLogs.length > 0
      }

      if (challenge.type === 'plastic') return totalWeight >= 1.0
      if (challenge.type === 'paper') return totalWeight >= 3.5
      if (challenge.type === 'glass') return totalWeight >= 1.5
      if (challenge.type === 'organic') return totalWeight >= 2.0
    }

    return false
  }

  const isChallengeCompleted = challengeSimulatedComplete || checkActualChallengeCompletion()

  const handleClaimChallengePoints = () => {
    if (!isChallengeCompleted || challengeClaimed) return
    const challenge = getTodaysChallenge()
    // Claim points
    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + (challenge.bonusPts || 50)
    }))
    setChallengeClaimed(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error(err)
    }
    onExit()
  }

  const getTabIndex = (t: Tab) => {
    switch (t) {
      case 'home': return 0
      case 'deposit': return 1
      case 'history': return 2
      case 'profile': return 3
      default: return 0
    }
  }

  const activeIndex = getTabIndex(tab)

  // 1. ISOLATED OVERLAY RENDERS
  if (showSplash) {
    return <SplashScreen />
  }

  if (loggingIn) {
    return (
      <div className="min-h-screen bg-[#F4F6F3] text-[#2B2E2C] flex flex-col relative w-full overflow-hidden">
        <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F4F6F3] border-x border-[#EAEAE6] shadow-xl justify-center items-center h-screen">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5F7A61] shadow-md">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </span>
          <h2 className="text-sm font-bold tracking-tight text-[#2B2E2C] mt-6 animate-pulse">Connecting midori...</h2>
        </div>
      </div>
    )
  }

  if (showLogin) {
    return (
      <LoginScreen
        onExit={onExit}
        profile={profile}
        setProfile={setProfile}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onFinish={handleFinishOnboarding}
        weeklyPointGoal={weeklyPointGoal}
        setWeeklyPointGoal={updateWeeklyGoalOnBackend}
      />
    )
  }

  // 2. MAIN APPLICATION VIEW RENDERING
  return (
    <div className="min-h-screen bg-[#F4F6F3] text-[#2B2E2C] flex flex-col relative w-full overflow-hidden">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F4F6F3] border-x border-[#EAEAE6] shadow-xl pb-20 min-h-screen">
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-white opacity-70 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-24 w-80 h-80 rounded-full bg-[#E5ECE3] opacity-60 blur-3xl pointer-events-none" />

        {/* Sliding pane layout container */}
        <div className="flex-1 w-full overflow-hidden flex flex-col relative">
          <div 
            className="flex w-[400%] flex-1 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 25}%)` }}
          >
            {/* Slide 0: Home Tab */}
            <div ref={slideRefs[0]} className={`w-1/4 shrink-0 px-5 pt-7 overflow-y-auto h-[calc(100vh-80px)] ${role === 'staff' ? 'pb-8' : 'pb-24'}`}>
              {role === 'staff' ? (
                <AdminDashboardTab 
                  pendingDeposits={pendingDeposits}
                  onProcessPendingDeposit={handleProcessPendingDeposit}
                  stats={stats}
                />
              ) : (
                <HomeTab
                  role={role}
                  profile={profile}
                  activities={activities}
                  stats={stats}
                  weeklyPointGoal={weeklyPointGoal}
                  historyLog={historyLog}
                  onOpenQr={() => setShowQr(true)}
                  onGoDeposit={() => onTabChange('deposit')}
                  onOpenScan={() => setShowScan(true)}
                  onGoRedeem={() => setShowRewardsModal(true)}
                  onGoHistory={() => onTabChange('history')}
                  onOpenGuide={() => setShowGuide(true)}
                  challengeCompleted={isChallengeCompleted}
                  challengeClaimed={challengeClaimed}
                  onClaimChallengePoints={handleClaimChallengePoints}
                  onSimulateCompleteChallenge={() => setChallengeSimulatedComplete(true)}
                  onOpenNotifications={() => setShowNotifications(true)}
                  onOpenNews={setActiveNews}
                  bookingTicket={bookingTicket}
                  onCloseBookingTicket={() => setBookingTicket(null)}
                  hasUnreadNotifications={notifications.some(n => n.unread)}
                />
              )}
            </div>

            {/* Slide 1: Deposit Tab */}
            <div ref={slideRefs[1]} className="w-1/4 shrink-0 px-5 pt-7 pb-8 overflow-y-auto h-[calc(100vh-80px)]">
              {role === 'staff' ? (
                <AdminCollectTab 
                  onLogDepositSuccess={handleStaffLogDeposit} 
                  prefilledDeposit={activePrefilledDeposit}
                  onClearPrefilled={() => setActivePrefilledDeposit(null)}
                />
              ) : (
                <DepositTab
                  role={role}
                  onCommitBasket={handleCommitBasket}
                  onOpenScan={() => setShowScan(true)}
                  basket={basket}
                  setBasket={setBasket}
                  onShowReceipt={setActiveReceipt}
                />
              )}
            </div>

            {/* Slide 2: History Tab */}
            <div ref={slideRefs[2]} className="w-1/4 shrink-0 px-5 pt-7 pb-8 overflow-y-auto h-[calc(100vh-80px)]">
              {role === 'staff' ? (
                <AdminLogTab logs={staffLogs} onOpenLogDetail={setActiveStaffLogDetail} />
              ) : (
                <HistoryTab
                  historyLog={historyLog}
                />
              )}
            </div>

            {/* Slide 3: Profile Tab */}
            <div ref={slideRefs[3]} className="w-1/4 shrink-0 px-5 pt-7 pb-8 overflow-y-auto h-[calc(100vh-80px)]">
              <ProfileTab
                role={role}
                profile={profile}
                onUpdateProfile={setProfile}
                totalPoints={stats.totalPoints}
                recycledKg={stats.recycledKg}
                historyLog={role === 'staff' ? (staffLogs as any) : historyLog}
                onRedeem={redeemReward}
                onLogout={handleLogout}
                onOpenQr={() => setShowQr(true)}
                onOpenRewards={() => setShowRewardsModal(true)}
                onOpenBadges={() => setShowBadgesModal(true)}
                weeklyPointGoal={weeklyPointGoal}
                onUpdateWeeklyGoal={updateWeeklyGoalOnBackend}
                onOpenGoalModal={() => {
                  setTempGoal(weeklyPointGoal)
                  setShowGoalModal(true)
                }}
              />
            </div>
          </div>
        </div>

        {/* Docked Navigation Bar */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 border-t border-[#EAEAE6] bg-white/95 backdrop-blur-md py-3 pb-safe animate-fade-in"
          aria-label="App navigation"
        >
          {role === 'staff' ? (
            <div className="grid grid-cols-4 items-center justify-center text-center">
              <button
                onClick={() => onTabChange('home')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'home' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => onTabChange('deposit')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'deposit' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Collect</span>
              </button>

              <button
                onClick={() => onTabChange('history')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'history' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <History className="h-5 w-5" />
                <span>Activity Log</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'profile' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 items-center justify-center text-center">
              <button
                onClick={() => onTabChange('home')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'home' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => onTabChange('deposit')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'deposit' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Deposit</span>
              </button>

              {/* Center scan trigger */}
              <div className="relative flex justify-center -mt-9">
                <button
                  onClick={() => setShowScan(true)}
                  aria-label="Scan barcode"
                  className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#00D06C] text-[#1A1D1B] shadow-[0_4px_20px_rgba(0,208,108,0.35)] transition-all hover:scale-105 hover:bg-[#00b85f] active:scale-95 cursor-pointer z-40 border-4 border-white"
                >
                  <ScanLine className="h-8 w-8 stroke-[2.5]" />
                </button>
              </div>

              <button
                onClick={() => onTabChange('history')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'history' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <History className="h-5 w-5" />
                <span>History</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${
                  tab === 'profile' ? 'text-[#5F7A61] scale-105' : 'text-[#2B2E2C]/35 hover:text-[#2B2E2C]/60'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
            </div>
          )}
        </nav>

        {/* Modals & Overlays */}
        {showQr && <QrModal username={profile.username || 'user01'} onClose={() => setShowQr(false)} />}
        
        {showScan && (
          <ScanModal
            onClose={() => setShowScan(false)}
            onScanItem={(type, weight) => {
              const matchedType = (WASTE_TYPES.find((t) => t.name.toLowerCase() === type.toLowerCase())?.name || 'Other') as WasteType
              const typeInfo = WASTE_TYPES.find((t) => t.name === matchedType)!
              const pts = Math.max(10, Math.round(weight * typeInfo.ptsPerKg))

              setBasket((prev) => {
                const existing = prev.find((b) => b.type === matchedType)
                if (existing) {
                  return prev.map((b) => (b.type === matchedType ? { 
                    ...b, 
                    weight: b.weight + weight,
                    points: b.points + pts
                  } : b))
                }
                return [...prev, { id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, type: matchedType, weight, points: pts }]
              })
              setShowScan(false)
              onTabChange('deposit')
            }}
          />
        )}

        {showRewardsModal && (
          <div className="fixed inset-0 z-40 bg-[#F4F6F3] overflow-y-auto max-w-md mx-auto animate-scale-in p-5">
            <RewardsTab
              totalPoints={stats.totalPoints}
              onRedeem={redeemReward}
              onClose={() => setShowRewardsModal(false)}
            />
          </div>
        )}

        {showBadgesModal && (
          <div className="fixed inset-0 z-40 bg-[#F4F6F3] overflow-y-auto max-w-md mx-auto animate-scale-in">
            <BadgesPage
              totalPoints={stats.totalPoints}
              recycledKg={stats.recycledKg}
              onClose={() => setShowBadgesModal(false)}
            />
          </div>
        )}

        {showGuide && (
          <div className="fixed inset-0 z-40 bg-[#F4F6F3] overflow-y-auto max-w-md mx-auto animate-scale-in">
            <RecyclingGuidePage onClose={() => setShowGuide(false)} />
          </div>
        )}

        {showNotifications && (
          <NotificationsModal
            notifications={notifications}
            setNotifications={setNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}

        {activeReceipt && (
          <ReceiptModal
            receipt={activeReceipt}
            onClose={() => setActiveReceipt(null)}
          />
        )}

        {activeNews && (
          <CampaignDetailModal
            activeNews={activeNews}
            onClose={() => setActiveNews(null)}
            onJoin={(news) => {
              setBookingTicket(news)
              setActiveNews(null)
            }}
          />
        )}

        {bookingTicket && (
          <BookingPassModal
            bookingTicket={bookingTicket}
            profile={profile}
            onClose={() => {
              setBookingTicket(null)
              handleCampaignPoints(150)
            }}
          />
        )}

        {activeRedemption && (
          <RedemptionModal
            reward={activeRedemption}
            onClose={() => setActiveRedemption(null)}
          />
        )}

        {staffSuccessReceipt && (
          <AdminSuccessModal
            receipt={staffSuccessReceipt}
            onClose={() => setStaffSuccessReceipt(null)}
          />
        )}

        {activeStaffLogDetail && (
          <AdminLogDetailModal
            log={activeStaffLogDetail}
            onClose={() => setActiveStaffLogDetail(null)}
          />
        )}

        {showGoalModal && (
          <div className="fixed inset-0 z-50 bg-[#2B2E2C]/65 backdrop-blur-sm flex items-center justify-center p-5 max-w-md mx-auto">
            <div className="w-full max-w-[280px] bg-white rounded-3xl p-5 shadow-2xl animate-scale-in text-left flex flex-col gap-4 text-[#2B2E2C]">
              <div>
                <h3 className="text-sm font-bold text-[#2B2E2C]">Set Weekly Goal</h3>
                <p className="text-[10px] text-[#2B2E2C]/40 mt-0.5">Adjust your weekly point milestone</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#2B2E2C]/60">Milestone</span>
                  <span className="font-mono text-sm text-[#5F7A61] font-extrabold">{tempGoal.toLocaleString()} pts</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="w-full accent-[#5F7A61] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-extrabold font-mono">
                  <span>500 PTS</span>
                  <span>10,000 PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="py-2.5 rounded-xl border border-[#EAEAE6] text-xs font-bold text-[#2B2E2C] text-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateWeeklyGoalOnBackend(tempGoal)
                    setShowGoalModal(false)
                  }}
                  className="py-2.5 rounded-xl bg-[#5F7A61] hover:bg-[#4E6750] text-white text-xs font-bold text-center active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
