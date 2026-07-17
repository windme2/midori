'use client'

import { Leaf } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-[#F4F6F3] text-[#2B2E2C] flex flex-col relative w-full overflow-hidden">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F4F6F3] border-x border-[#EAEAE6] shadow-xl justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center animate-fade-in">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5F7A61] shadow-md">
            <Leaf className="h-8 w-8 text-white" />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[#2B2E2C] mt-6 animate-pulse">midori.</h2>
          <p className="text-[10px] text-[#2B2E2C]/40 uppercase tracking-widest font-extrabold mt-1">Waste Bank Platform</p>
        </div>
      </div>
    </div>
  )
}
