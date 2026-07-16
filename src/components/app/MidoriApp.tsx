'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/landing/LandingPage'
import { MobileApp }   from '@/components/app/MobileApp'
import type { Role, Tab, View } from '@/types'

/**
 * Root orchestrator component.
 * Manages the top-level view state (landing → app) and the selected role,
 * then delegates rendering. The login, splash, and onboarding flows
 * are handled internally inside the MobileApp PWA container to prevent flashing.
 */
export function MidoriApp() {
  const [view, setView] = useState<View>('landing')
  const [role, setRole] = useState<Role>('member')
  const [tab,  setTab]  = useState<Tab>('home')

  const handleLaunchApp = () => {
    setRole('member')
    setTab('home')
    setView('app')
  }

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunchApp} />
  }

  return (
    <MobileApp
      role={role}
      onRoleChange={setRole}
      tab={tab}
      onTabChange={setTab}
      onExit={() => setView('landing')}
    />
  )
}
