'use client'

import { useState } from 'react'
import { Leaf, QrCode, Gift } from 'lucide-react'

interface OnboardingScreenProps {
  onFinish: () => void
  weeklyPointGoal: number
  setWeeklyPointGoal: (g: number) => void
}

export function OnboardingScreen({ onFinish, weeklyPointGoal, setWeeklyPointGoal }: OnboardingScreenProps) {
  const [onboardingStep, setOnboardingStep] = useState(1)

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-[#2B2E2C] flex flex-col relative w-full overflow-hidden">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F4F6F3] border-x border-[#EAEAE6] shadow-xl p-6 justify-between h-screen text-left">
        {/* Top Row: Logo/Indicator + Skip Button */}
        <div className="flex justify-between items-center w-full mt-2">
          <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#5F7A61] uppercase tracking-wider">
            <Leaf className="h-4 w-4 text-[#5F7A61] fill-[#5F7A61]" /> midori
          </span>
          <button
            onClick={onFinish}
            className="px-4 py-1.5 rounded-full border border-[#EAEAE6] bg-white text-xs font-bold text-[#2B2E2C]/70 shadow-sm transition-all hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* 3-segment progress indicator line */}
        <div className="flex gap-2 w-full mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                onboardingStep >= s ? 'bg-[#00D06C]' : 'bg-[#EAEAE6]'
              }`}
            />
          ))}
        </div>

        {/* Onboarding step content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6 gap-6">
          {/* Onboarding Step 1 */}
          {onboardingStep === 1 && (
            <div className="animate-fade-in flex flex-col items-center gap-4">
              <div className="h-36 w-36 rounded-full bg-[#E5ECE3] flex items-center justify-center relative overflow-hidden shadow-inner">
                <Leaf className="h-16 w-16 text-[#5F7A61]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#2B2E2C] tracking-tight">Welcome to midori</h2>
                <p className="text-xs text-[#2B2E2C]/65 leading-relaxed mt-2.5 max-w-[280px] mx-auto">
                  Together we create a cleaner and greener environment by managing waste efficiently and earning points.
                </p>
              </div>
            </div>
          )}

          {/* Onboarding Step 2 */}
          {onboardingStep === 2 && (
            <div className="animate-fade-in flex flex-col items-center gap-4 w-full">
              <div className="h-36 w-36 rounded-full bg-[#00D06C]/10 flex items-center justify-center relative overflow-hidden shadow-inner text-[#00D06C]">
                <QrCode className="h-16 w-16" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-extrabold text-[#2B2E2C] tracking-tight">Set Weekly Eco Goal</h2>
                <p className="text-xs text-[#2B2E2C]/65 leading-relaxed mt-2.5 max-w-[280px] mx-auto">
                  Define your target points goal for this week. Hit your milestones to earn bonus eco-badges!
                </p>
                
                <div className="mt-5 max-w-xs mx-auto px-4">
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-[#2B2E2C]/40 uppercase mb-2">
                    <span>Target Goal</span>
                    <span className="font-mono text-[#5F7A61] bg-[#E2EADF] px-2.5 py-0.5 rounded-full">{weeklyPointGoal.toLocaleString()} pts</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={weeklyPointGoal}
                    onChange={(e) => setWeeklyPointGoal(Number(e.target.value))}
                    className="w-full h-1 bg-[#EAEAE6] rounded-lg appearance-none cursor-pointer accent-[#5F7A61] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Step 3 */}
          {onboardingStep === 3 && (
            <div className="animate-fade-in flex flex-col items-center gap-4">
              <div className="h-36 w-36 rounded-full bg-[#D9A05B]/10 flex items-center justify-center relative overflow-hidden shadow-inner text-[#D9A05B]">
                <Gift className="h-16 w-16" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#2B2E2C] tracking-tight">Redeem Rewards</h2>
                <p className="text-xs text-[#2B2E2C]/65 leading-relaxed mt-2.5 max-w-[280px] mx-auto">
                  Exchange accumulated points for real-life brand vouchers, local planting campaigns, or zero-waste merchandise.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Next Action CTA Button */}
        <button
          onClick={() => {
            if (onboardingStep < 3) {
              setOnboardingStep(prev => prev + 1)
            } else {
              onFinish()
            }
          }}
          className="w-full py-4 bg-[#00D06C] text-[#1A1D1B] font-extrabold text-sm rounded-2xl shadow-[0_4px_16px_rgba(0,208,108,0.2)] hover:bg-[#00b85f] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          {onboardingStep === 3 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  )
}
