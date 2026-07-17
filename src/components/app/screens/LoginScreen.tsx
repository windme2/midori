'use client'

import { useState } from 'react'
import { Leaf, User, AtSign, Lock, Eye, EyeOff, MapPin } from 'lucide-react'
import type { Role, UserProfile } from '@/types'

interface LoginScreenProps {
  onExit: () => void
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  onLoginSuccess: (role: Role) => void
}

export function LoginScreen({ onExit, profile, setProfile, onLoginSuccess }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleMockLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanUsername = profile.username.trim().toLowerCase()
    const cleanPassword = password.trim()

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login'
      const payload = isSignup 
        ? { name: profile.name, username: cleanUsername, password: cleanPassword, location: profile.location }
        : { username: cleanUsername, password: cleanPassword }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Incorrect username or password')
        return
      }

      setProfile(prev => ({
        ...prev,
        name: data.user.name,
        username: data.user.username,
      }))

      onLoginSuccess(data.role)
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again.')
    }
  }

  const isSignup = authMode === 'signup'

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-[#2B2E2C] flex flex-col relative w-full overflow-hidden">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-[#FBFBFA] border-x border-[#EAEAE6] shadow-xl p-6 justify-center items-center h-screen text-left">
        {/* Back to landing logo */}
        <button
          onClick={onExit}
          className="mb-6 flex items-center gap-2 text-sm text-[#2B2E2C]/65 transition-colors hover:text-[#5F7A61] bg-transparent border-none outline-none cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5F7A61]">
            <Leaf className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </span>
          <span className="font-bold text-[#2B2E2C]">midori</span>
        </button>

        {/* Login/Signup Card */}
        <div className="w-full rounded-[32px] border border-[#EAEAE6] bg-white p-7 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-[#2B2E2C]">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-xs text-[#2B2E2C]/50">
              {isSignup ? 'Start logging your recyclables today.' : 'Sign in to continue your recycling journey.'}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleMockLoginSubmit}>
            {/* Display Name Input (Only on Signup) */}
            {isSignup && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-[#2B2E2C]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#5F7A61]" /> Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Aiko"
                  className="rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] px-4 py-2.5 text-xs text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:border-[#5F7A61] focus:outline-none"
                />
              </div>
            )}

            {/* Username / Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#2B2E2C]/60 uppercase tracking-wider flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5 text-[#5F7A61]" /> Username / Email
              </label>
              <input
                type="text"
                required
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                placeholder="e.g. user, admin"
                className="rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] px-4 py-2.5 text-xs font-mono text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:border-[#5F7A61] focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#2B2E2C]/60 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#5F7A61]" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] pl-4 pr-10 py-2.5 text-xs font-mono text-[#2B2E2C] placeholder:text-[#2B2E2C]/25 focus:border-[#5F7A61] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Location Input (Only on Signup) */}
            {isSignup && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-[#2B2E2C]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#5F7A61]" /> Location
                </label>
                <select
                  value={profile.location || 'Bangna, Bangkok'}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="rounded-xl border border-[#EAEAE6] bg-[#FBFBFA] px-4 py-2.5 text-xs font-bold text-[#2B2E2C] focus:border-[#5F7A61] focus:outline-none"
                >
                  <option value="Bangna, Bangkok">Bangna, Bangkok</option>
                  <option value="Pathum Wan, Bangkok">Pathum Wan, Bangkok</option>
                  <option value="Sukhumvit, Bangkok">Sukhumvit, Bangkok</option>
                  <option value="Ari, Bangkok">Ari, Bangkok</option>
                  <option value="Chatuchak, Bangkok">Chatuchak, Bangkok</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#5F7A61] py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#4E6750] active:scale-95 mt-2 cursor-pointer"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Auth Switch Links */}
          <div className="mt-5 text-center text-xs">
            {isSignup ? (
              <p className="text-[#2B2E2C]/55">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin')
                    setPassword('')
                  }}
                  className="font-bold text-[#5F7A61] hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-[#2B2E2C]/55">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup')
                    setPassword('')
                  }}
                  className="font-bold text-[#5F7A61] hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
