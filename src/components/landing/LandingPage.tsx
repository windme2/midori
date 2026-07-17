'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  Leaf, Recycle, ArrowRight, Zap, Gift, Smartphone,
  Trash2, Truck, Scale, Sparkles, CloudRain, ShieldCheck,
  Mail, Phone, MapPin, ChevronDown, ChevronUp
} from 'lucide-react'

interface LandingPageProps {
  onLaunch: () => void
}

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    icon: Trash2,
    title: 'Separate',
    titleTh: 'แยกขยะ',
    desc: 'Sort recyclables at home — plastics, paper, glass, and e-waste.',
    descTh: 'แยกขยะประเภทต่างๆ จากที่บ้านตามหมวดหมู่',
  },
  {
    step: '02',
    icon: Truck,
    title: 'Drop-off or Pickup',
    titleTh: 'ส่งหรือนัดรับ',
    desc: 'Visit a Midori drop-off point or schedule a doorstep collection.',
    descTh: 'นำมาส่งที่จุดรับ Midori หรือกดนัดหมายเจ้าหน้าที่เข้ารับ',
  },
  {
    step: '03',
    icon: Scale,
    title: 'Weigh & Log',
    titleTh: 'ชั่งและบันทึก',
    desc: 'Staff weighs your deposit and logs it to the system in real-time.',
    descTh: 'เจ้าหน้าที่ชั่งน้ำหนักและบันทึกข้อมูลเข้าระบบแบบเรียลไทม์',
  },
  {
    step: '04',
    icon: Sparkles,
    title: 'Earn Rewards',
    titleTh: 'รับแต้ม',
    desc: 'Points and digital cash land in your Midori wallet instantly.',
    descTh: 'รับแต้มและเงินดิจิทัลเข้าบัญชีทันทีเพื่อนำไปแลกรางวัล',
  },
]

const FEATURES = [
  {
    icon: Smartphone,
    title: 'PWA Experience',
    desc: 'Install Midori straight to your home screen. Fast, offline-ready, and native-feeling on every device.',
  },
  {
    icon: Zap,
    title: 'Real-time Points',
    desc: 'Every deposit is weighed and converted into points instantly, with a transparent per-kilogram rate.',
  },
  {
    icon: Gift,
    title: 'Eco Rewards',
    desc: 'Redeem points for sustainable goods, local vouchers, and community perks in the marketplace.',
  },
]

const RECYCLING_RATES = [
  { type: 'Plastic (ขวดน้ำ/บรรจุภัณฑ์)', ptsPerKg: 30, cashPerKg: '฿0.50' },
  { type: 'Paper (กระดาษ/ลังกระดาษ)', ptsPerKg: 15, cashPerKg: '฿0.25' },
  { type: 'Glass (ขวดแก้ว/เศษแก้ว)', ptsPerKg: 14, cashPerKg: '฿0.20' },
  { type: 'Organic (เศษอาหารหมักปุ๋ย)', ptsPerKg: 10, cashPerKg: '฿0.15' },
  { type: 'E-Waste (อุปกรณ์ไฟฟ้าเสีย)', ptsPerKg: 120, cashPerKg: '฿2.50' },
  { type: 'Other (ขยะรีไซเคิลอื่นๆ)', ptsPerKg: 10, cashPerKg: '฿0.10' },
]

// Calculator waste type values matching RECYCLING_RATES
const CALCULATOR_TYPES = [
  { key: 'PET',   label: 'Plastic Bottle', rate: 30,  co2: 0.72, cashRate: 0.50 },
  { key: 'CANS',  label: 'Aluminium Can',  rate: 50,  co2: 1.20, cashRate: 1.00 },
  { key: 'GLASS', label: 'Glass Bottle',   rate: 14,  co2: 0.40, cashRate: 0.20 },
  { key: 'PAPER', label: 'Cardboard',      rate: 15,  co2: 0.55, cashRate: 0.25 },
  { key: 'E_WASTE',label: 'E-Waste',       rate: 120, co2: 2.50, cashRate: 2.50 },
]

interface FaqItem {
  q: string
  qTh: string
  a: string
  aTh: string
}

const FAQS: FaqItem[] = [
  {
    q: 'How do I start depositing recyclables with Midori?',
    qTh: 'จะเริ่มต้นฝากขยะรีไซเคิลกับ Midori ได้อย่างไร?',
    a: 'Simply register an account on our app, separate your trash into categories (Plastic, Paper, Glass, E-waste), and either drop them off at any local Midori or schedule a doorstep pickup directly through the app tab.',
    aTh: 'เพียงสมัครบัญชีผ่านแอป แยกขยะออกเป็นหมวดหมู่ (พลาสติก, กระดาษ, แก้ว, ขยะอิเล็กทรอนิกส์) จากนั้นสามารถนำมาส่งที่จุดรับ Midori หรือกดนัดหมายเจ้าหน้าที่ให้ไปรับถึงหน้าบ้านได้ทันทีครับ',
  },
  {
    q: 'What types of waste can I exchange for points?',
    qTh: 'ขยะประเภทใดบ้างที่สามารถนำมาแลกแต้มได้?',
    a: 'We accept certified PET plastic bottles, cardboard packaging, paper bags, glass jars/bottles, organic waste for compost, and selected electrical e-waste (like cables, mice, and keyboards). Each type has a guaranteed real-time point rate per kilogram.',
    aTh: 'เรารับขวดน้ำพลาสติก PET, กล่องกระดาษ/ถุงกระดาษ, ขวดแก้ว/โหลแก้ว, เศษอาหารเพื่อนำไปหมักปุ๋ยอินทรีย์, และอุปกรณ์อิเล็กทรอนิกส์เสียบางประเภท (เช่น สายไฟ เม้าส์ คีย์บอร์ด) โดยขยะแต่ละหมวดหมู่จะมีอัตราแต้มต่อกิโลกรัมชี้แจงชัดเจนครับ',
  },
  {
    q: 'How can I redeem my points for eco rewards?',
    qTh: 'ฉันจะสามารถนำแต้มสะสมไปแลกของรางวัลได้อย่างไร?',
    a: 'Navigate to your Profile tab in the app, browse the Marketplace catalog, and select items like bamboo utensil kits, coffee vouchers, tree donations, or market gift cards. Click "Redeem" to generate a merchant barcode QR code instantly.',
    aTh: 'เข้าไปที่แท็บ Profile ภายในตัวแอปจำลอง เพื่อเลือกชมแค็ตตาล็อกของรางวัลใน Marketplace จากนั้นคลิกเลือกของรางวัลที่ต้องการ (เช่น ชุดช้อนส้อมไม้ไผ่, คูปองร้านกาแฟ, ร่วมปลูกป่า) แล้วกดแลกคะแนนเพื่อรับรหัสคิวอาร์โค้ดไปแสดงต่อหน้าร้านเพื่อรับสิทธิ์ได้ทันทีครับ',
  },
  {
    q: 'Can I schedule a doorstep pickup for heavy recyclables?',
    qTh: 'ถ้าขยะมีน้ำหนักมากหรือปริมาณเยอะ สามารถให้ไปรับที่บ้านได้ไหม?',
    a: 'Yes, if you have a batch of more than 5.0 kg or a bulk deposit, you can use the "Schedule Pickup" feature. A local Midori collector will contact you to confirm the time, weigh the waste on-site, and log it to your account immediately.',
    aTh: 'ได้ครับ หากมีขยะรีไซเคิลรวมกันตั้งแต่ 5.0 กก. ขึ้นไป สามารถกดนัดหมายเวลาจัดส่งผ่านปุ่ม "Schedule Pickup" ในแท็บฝากขยะ เพื่อให้คนรถสะสมขยะของ Midori เข้าไปให้บริการชั่งน้ำหนักและอัปโหลดแต้มให้ถึงที่หน้าบ้านครับ',
  },
  {
    q: 'How is my household carbon savings (CO₂ Offset) calculated?',
    qTh: 'การลดปริมาณการปล่อยคาร์บอน (CO₂ Saved) คำนวณอย่างไร?',
    a: 'Carbon offsets are calculated based on EPA and IPCC global standards. For example, recycling 1 kg of PET plastic saves approximately 0.72 kg of CO₂ equivalent emissions. These figures update reactively in your personal and community dashboards.',
    aTh: 'คำนวณตามสัมประสิทธิ์การลดคาร์บอนไดออกไซด์ของสหภาพสิ่งแวดล้อมโลก (เช่น รีไซเคิลพลาสติก PET 1 กก. จะช่วยลดการปล่อยคาร์บอนไดออกไซด์ได้ 0.72 กก.) ตัวเลขสถิตินี้จะเพิ่มขึ้นตามน้ำหนักจริงของขยะที่คุณฝากทันทีครับ',
  },
]

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [selectedCalc, setSelectedCalc] = useState(CALCULATOR_TYPES[0])
  const [calcWeight, setCalcWeight]     = useState('10') // default 10kg

  // Animated Stats State
  const [recycledCount, setRecycledCount] = useState(0)
  const [membersCount, setMembersCount]   = useState(0)
  const [co2Count, setCo2Count]           = useState(0)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = progress * (2 - progress)

      setRecycledCount(easeProgress * 48.2)
      setMembersCount(Math.floor(easeProgress * 12940))
      setCo2Count(easeProgress * 31.5)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  // QR codes for PWA and APK downloads
  const [qrIosUrl, setQrIosUrl] = useState<string | null>(null)
  const [qrAndroidUrl, setQrAndroidUrl] = useState<string | null>(null)

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://midori-waste-bank.vercel.app'
    
    QRCode.toDataURL(origin, { margin: 1, scale: 6 })
      .then((url) => setQrIosUrl(url))
      .catch((err) => console.error('PWA QR code generation error:', err))

    QRCode.toDataURL(`${origin}/app-release.apk`, { margin: 1, scale: 6 })
      .then((url) => setQrAndroidUrl(url))
      .catch((err) => console.error('APK QR code generation error:', err))
  }, [])

  // Calculations
  const weightNum = parseFloat(calcWeight) || 0
  const pointsEarned = Math.round(weightNum * selectedCalc.rate)
  const cashEarned = weightNum * selectedCalc.cashRate
  const co2Saved = weightNum * selectedCalc.co2

  return (
    <div 
      className="min-h-screen bg-[#FBFBFA] text-[#2B2E2C] selection:bg-[#5F7A61]/10 selection:text-[#5F7A61] overflow-x-hidden relative"
      style={{
        backgroundImage: 'radial-gradient(rgba(43,46,44,0.03) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px'
      }}
    >
      
      {/* Premium Floating Ambient Parallax mesh blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] max-w-[600px] rounded-full bg-[#E5ECE3]/45 blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[35%] right-[-15%] w-[65vw] h-[65vw] max-w-[700px] rounded-full bg-[#BAC9B6]/30 blur-[130px] animate-pulse duration-[15000ms] delay-1000" />
        <div className="absolute top-[70%] left-[-10%] w-[55vw] h-[55vw] max-w-[600px] rounded-full bg-[#A8BEA5]/25 blur-[120px] animate-pulse duration-[12000ms] delay-2000" />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#EAEAE6] sticky top-0 bg-[#FBFBFA]/90 backdrop-blur-md z-40">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5F7A61]">
              <Leaf className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">midori</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-bold text-[#2B2E2C]/70 md:flex">
            {[['#features','Features'],['#calculator','Calculator'],['#how','How it works'],['#rates','Rates'],['#faq','FAQ']].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="relative py-1 transition-colors hover:text-[#5F7A61] after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#5F7A61] after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {label}
              </a>
            ))}
          </div>
          <button
            onClick={onLaunch}
            className="rounded-xl bg-[#2B2E2C] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#5F7A61] hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch App
          </button>
        </nav>
      </header>

      <main>
        {/* ── Hero Split Layout ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8EDE5] bg-white px-4 py-1.5 text-xs font-bold text-[#5F7A61] shadow-sm">
              <Recycle className="h-3.5 w-3.5 animate-spin-slow" aria-hidden="true" />
              Waste Bank Platform
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl md:leading-[1.08] text-[#2B2E2C]">
              เปลี่ยนขยะรีไซเคิลของคุณให้เป็น{' '}
              <span className="text-[#5F7A61] relative inline-block">
                รางวัลดิจิทัล
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#5F7A61]/10 rounded-full" />
              </span>{' '}
              อย่างง่ายดาย
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-[#2B2E2C]/65">
              Deposit recyclables at any Midori point, earn digital points in real-time, and redeem
              them for eco-friendly rewards. Minimalist Japandi aesthetics for a clean earth.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onLaunch}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5F7A61] px-8 py-4 font-bold text-white shadow-md transition-all hover:bg-[#4E6750] hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
              >
                Get Started
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
              
              {/* Premium Mobile App Download QR Code badge */}
              <div className="relative group/qr flex items-center gap-2.5 bg-white border border-[#EAEAE6] rounded-xl p-2 px-3 shadow-xs hover:border-[#5F7A61]/30 transition-all cursor-pointer select-none">
                <div className="h-10 w-10 bg-white border border-gray-100 rounded-lg p-0.5 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full text-[#2B2E2C]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="10" y="10" width="30" height="30" stroke="currentColor" strokeWidth="6" fill="none"/>
                    <rect x="20" y="20" width="10" height="10" fill="currentColor"/>
                    <rect x="60" y="10" width="30" height="30" stroke="currentColor" strokeWidth="6" fill="none"/>
                    <rect x="70" y="20" width="10" height="10" fill="currentColor"/>
                    <rect x="10" y="60" width="30" height="30" stroke="currentColor" strokeWidth="6" fill="none"/>
                    <rect x="20" y="70" width="10" height="10" fill="currentColor"/>
                    <rect x="60" y="60" width="15" height="15" fill="currentColor"/>
                    <rect x="75" y="75" width="15" height="15" fill="currentColor"/>
                    <rect x="60" y="80" width="10" height="10" fill="currentColor"/>
                    <rect x="80" y="60" width="10" height="10" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-[#5F7A61] uppercase tracking-wider block leading-none">Mobile App</span>
                  <span className="text-[10px] font-bold text-[#2B2E2C] mt-1 block">Scan to install / launch</span>
                </div>
                
                {/* Large high-res dual popover on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white border border-[#EAEAE6] rounded-2xl p-4 shadow-xl opacity-0 scale-95 pointer-events-none group-hover/qr:opacity-100 group-hover/qr:scale-100 transition-all duration-300 z-50 w-80 flex flex-col items-center gap-3">
                  <span className="text-[11px] font-extrabold text-[#2B2E2C] uppercase tracking-wider block border-b border-gray-100 pb-1.5 w-full text-center">iOS &amp; Android Apps</span>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Left: iOS PWA */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-24 bg-white border border-gray-100 rounded-xl p-1.5 flex items-center justify-center shadow-inner min-h-[96px] min-w-[96px]">
                        {qrIosUrl ? (
                          <img src={qrIosUrl} alt="iOS App Link" className="w-20 h-20 object-contain" />
                        ) : (
                          <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider animate-pulse">Generating...</span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-[#2B2E2C] text-center leading-none">iOS (Safari PWA)</span>
                      <span className="text-[7px] text-[#2B2E2C]/50 text-center">Add to Home Screen</span>
                    </div>

                    {/* Right: Android APK */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-24 bg-white border border-gray-100 rounded-xl p-1.5 flex items-center justify-center shadow-inner min-h-[96px] min-w-[96px]">
                        {qrAndroidUrl ? (
                          <img src={qrAndroidUrl} alt="Android APK Link" className="w-20 h-20 object-contain" />
                        ) : (
                          <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider animate-pulse">Generating...</span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-[#2B2E2C] text-center leading-none">Android (APK)</span>
                      <span className="text-[7px] text-[#2B2E2C]/50 text-center">Direct Installation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro stats strip */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-[#EAEAE6] pt-8 w-full">
              {[
                { value: `${recycledCount.toFixed(1)}t`,  label: 'Waste Recycled' },
                { value: membersCount.toLocaleString(),    label: 'Active Members' },
                { value: `${co2Count.toFixed(1)}t`,       label: 'CO₂ Offset' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-2xl font-bold text-[#2B2E2C] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#2B2E2C]/50 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mini Simulated Mobile App Preview inside a realistic frame */}
          <div className="lg:col-span-5 flex justify-center w-full relative group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[#5F7A61]/5 rounded-[48px] blur-2xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Phone Mockup Frame */}
            <div className="relative w-full max-w-[320px] aspect-[9/18.5] rounded-[42px] border-[8px] border-[#2B2E2C] shadow-2xl bg-[#F4F6F3] overflow-hidden flex flex-col">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#2B2E2C] rounded-b-xl z-20" />

              {/* App View Header */}
              <div className="px-4 pt-6 pb-3 border-b border-[#EAEAE6] bg-white flex justify-between items-center text-xs font-bold text-[#2B2E2C]">
                <span className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-[#5F7A61]" /> midori</span>
                <span className="text-[9px] bg-[#5F7A61]/10 text-[#5F7A61] px-2 py-0.5 rounded-full">Aiko</span>
              </div>

              {/* App Content Preview */}
              <div className="flex-1 p-3 overflow-hidden flex flex-col gap-3">
                {/* Simulated Points Card */}
                <div className="rounded-2xl bg-[#F5F6F4] border border-[#E8EDE5] p-3 text-left">
                  <p className="font-mono text-2xl font-bold text-[#2B2E2C]">1,420</p>
                  <p className="text-[9px] text-[#2B2E2C]/50 font-semibold mt-0.5">Points balance</p>
                  
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <div className="bg-white rounded-lg p-2 border border-[#EAEAE6] text-center shadow-sm">
                      <p className="text-[10px] font-bold text-[#5F7A61]">12.4 kg</p>
                      <p className="text-[8px] text-[#2B2E2C]/40">Recycled</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-[#EAEAE6] text-center shadow-sm">
                      <p className="text-[10px] font-bold text-[#5F7A61]">8.9 kg</p>
                      <p className="text-[8px] text-[#2B2E2C]/40">CO₂ saved</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Actions buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  {['Scan Item', 'Log Deposit', 'Drop-off'].map((txt) => (
                    <div key={txt} className="bg-white border border-[#EAEAE6] rounded-xl py-3 text-center text-[8px] font-extrabold text-[#2B2E2C] shadow-sm">
                      {txt}
                    </div>
                  ))}
                </div>

                {/* Simulated Activity list */}
                <div className="flex-1 bg-white border border-[#EAEAE6] rounded-xl p-2.5 text-left flex flex-col gap-2.5 overflow-hidden">
                  <p className="text-[9px] font-bold text-[#2B2E2C]">Recent activity</p>
                  {[
                    { title: 'Bottle deposit', desc: 'Today • 10:14 AM', pts: '+30' },
                    { title: 'Paper bundle', desc: 'Yesterday • 10:14 AM', pts: '+45' },
                    { title: 'Glass jars x6', desc: '2 days ago • 10:14 AM', pts: '+24' },
                    { title: 'Aluminum cans', desc: '3 days ago • 10:14 AM', pts: '+60' },
                    { title: 'Cardboard box', desc: '4 days ago • 10:14 AM', pts: '+60' },
                    { title: 'E-waste mouse', desc: '5 days ago • 10:14 AM', pts: '+120' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[8px] border-b border-[#F0F0EE]/70 pb-1.5 last:border-b-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-bold text-[#2B2E2C] truncate">{item.title}</p>
                        <p className="text-[7px] text-[#2B2E2C]/40 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="font-mono font-bold text-[#5F7A61] shrink-0">{item.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* ── Midori's Design & Identity Concept (About / Style Concept / Typography / Colors) ── */}
      <section id="concept" className="border-t border-[#EAEAE6] bg-[#FBFBFA] py-24 text-left">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Left Column: Image Illustration & Title */}
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              {/* Premium Abstract Brand Image Frame (Organic Spilled Water / Liquid shape wrapper) */}
              <div 
                className="w-full aspect-[4/3] bg-[#E5ECE3] border border-[#BAC9B6]/40 overflow-hidden relative group mb-6 shadow-md transition-transform duration-500 hover:scale-[1.01]" 
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                aria-hidden="true"
              >
                <img 
                  src="/images/concept-brand.avif" 
                  alt="The Midori Brand Identity Concept" 
                  className="w-full h-full object-cover opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.classList.add('hidden');
                  }}
                />
                
                {/* Fallback organic liquid shape graphic in case image fails to load */}
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#E5ECE3] via-[#E2EADF] to-[#BAC9B6]/40 pointer-events-none -z-10">
                  <svg className="w-2/3 h-2/3 text-[#5F7A61]/70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="liquidGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5F7A61" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#5F7A61" stopOpacity="0.35" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M50 8C72 4 92 18 95 44C98 70 82 92 58 95C34 98 8 85 5 62C2 39 28 12 50 8Z" 
                      fill="url(#liquidGradLarge)" 
                    />
                  </svg>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A61] bg-[#E5ECE3] px-3.5 py-1 rounded-full">DESIGN &amp; IDENTITY</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B2E2C] sm:text-4xl">
                  The Midori Identity
                </h2>
                <p className="mt-3 text-sm text-[#2B2E2C]/50 leading-relaxed">
                  Midori (緑 - green) balances Japanese minimalist design with Scandinavian functionality (Japandi aesthetic), creating a clean digital space for sustainability.
                </p>
              </div>
            </div>

            {/* Right Column: 2x2 Grid of 4 Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Card 1: About & Core Philosophy */}
              <div className="bg-white border border-[#EAEAE6] rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F7A61]/10 text-[#5F7A61] self-start">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#2B2E2C]">About &amp; Core Philosophy</h3>
                  <p className="text-xs text-[#2B2E2C]/60 leading-relaxed mt-2">
                    Named after the Japanese word for green, Midori stands for organic growth, circular economy, and community-driven actions. The platform represents simplicity, transparent measurements, and immediate positive feedback loops.
                  </p>
                </div>
              </div>

              {/* Card 2: Color Palette */}
              <div className="bg-white border border-[#EAEAE6] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BAC9B6]/10 text-[#5F7A61] self-start">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B2E2C]">Organic Color Palette</h3>
                    <p className="text-xs text-[#2B2E2C]/60 leading-relaxed mt-2">
                      Midori utilizes nature-inspired tones to create a calming, professional, and reliable atmosphere:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1.5 bg-[#F4F6F3] p-1 pr-2 rounded-full border border-[#BAC9B6]/40">
                    <span className="h-5 w-5 rounded-full bg-[#2B2E2C] border border-white/20" />
                    <span className="text-[9px] font-mono font-bold text-[#2B2E2C]">#2B2E2C</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F4F6F3] p-1 pr-2 rounded-full border border-[#BAC9B6]/40">
                    <span className="h-5 w-5 rounded-full bg-[#5F7A61]" />
                    <span className="text-[9px] font-mono font-bold text-[#2B2E2C]">#5F7A61</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F4F6F3] p-1 pr-2 rounded-full border border-[#BAC9B6]/40">
                    <span className="h-5 w-5 rounded-full bg-[#E5ECE3] border border-[#BAC9B6]/20" />
                    <span className="text-[9px] font-mono font-bold text-[#2B2E2C]">#E5ECE3</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F4F6F3] p-1 pr-2 rounded-full border border-[#BAC9B6]/40">
                    <span className="h-5 w-5 rounded-full bg-[#00D06C]" />
                    <span className="text-[9px] font-mono font-bold text-[#2B2E2C]">#00D06C</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Typographic Scale */}
              <div className="bg-white border border-[#EAEAE6] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F7A61]/10 text-[#5F7A61] self-start">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B2E2C]">Clean Typography</h3>
                    <p className="text-xs text-[#2B2E2C]/60 leading-relaxed mt-2">
                      Clean font pairings ensure content layout hierarchy and seamless scannability:
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="border-b border-gray-50 pb-1.5">
                    <span className="text-[8px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest block">Sans-Serif (Outfit / Inter)</span>
                    <span className="text-xs font-bold text-[#2B2E2C]">Headline ➔ Body copy &amp; titles</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest block">Monospace (Space Mono)</span>
                    <span className="text-xs font-mono font-bold text-[#5F7A61]">TX-9034 ➔ System IDs &amp; Metrics</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Japandi Aesthetic */}
              <div className="bg-white border border-[#EAEAE6] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BAC9B6]/15 text-[#5F7A61] self-start">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B2E2C]">Japandi Aesthetic</h3>
                    <p className="text-xs text-[#2B2E2C]/60 leading-relaxed mt-2">
                      Midori combines Zen minimalism with Scandinavian functionality. This fusion values clean open spaces, simple structures, warm tones, and natural craft materials.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="border-b border-gray-50 pb-1.5">
                    <span className="text-[8px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest block">Japanese Zen Style</span>
                    <span className="text-xs font-bold text-[#2B2E2C]">Simplicity, natural light, raw textures</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-extrabold text-[#2B2E2C]/40 uppercase tracking-widest block">Scandi Functionality</span>
                    <span className="text-xs font-bold text-[#5F7A61]">Practical layouts, warm tones, cozy spaces</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Features Section (System Capabilities Left-Aligned Text, Right-Aligned Cards) ───────────────────────────────────────────── */}
        <section id="features" className="border-t border-[#EAEAE6] bg-white relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
            
            {/* Left Column: Title and Description (Top-aligned, 4-5 lines subdescription context) */}
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A61] bg-[#E5ECE3] px-3.5 py-1 rounded-full">SYSTEM CAPABILITIES</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#2B2E2C] sm:text-4xl">
                Minimalist design, maximum impact.
              </h2>
              <p className="text-sm text-[#2B2E2C]/50 leading-relaxed">
                Midori integrates seamlessly with your routine. Clean, aesthetic layouts guide every deposit, verification, and redemption step. The dashboard is designed to provide you with instant progress metrics and zero-waste indicators. Experience a smooth digital banking workflow tailored specifically for environmental sustainability and local community engagement.
              </p>
              <p className="text-sm text-[#2B2E2C]/50 leading-relaxed mt-2">
                Additionally, our offline-first capability ensures you can view your digital passes, logs, and account balances even without network connectivity. Start participating in eco-challenges, track your green tier upgrades, and contribute to local recycling programs securely.
              </p>
            </div>

            {/* Right Column: 3 Horizontal Cards stacked vertically */}
            <div className="md:col-span-7 flex flex-col gap-6 w-full">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-[#EAEAE6] bg-[#FBFBFA] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#5F7A61]/30 hover:-translate-y-0.5 flex items-start gap-5 text-left"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5F7A61]/10 text-[#5F7A61]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#2B2E2C]">{feature.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#2B2E2C]/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Interactive Waste Calculator Section ────────────────────────── */}
        <section id="calculator" className="bg-[#FBFBFA] border-t border-[#EAEAE6] py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center max-w-lg mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A05B] bg-[#F9F1E6] px-3.5 py-1 rounded-full">ESTIMATION TOOL</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B2E2C] sm:text-4xl">
                What is your waste worth?
              </h2>
            </div>

            {/* Premium Rounded Card */}
            <div className="rounded-3xl border border-[#EAEAE6] bg-white p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
              {/* Inputs */}
              <div className="md:col-span-7 flex flex-col justify-between gap-8 text-left">
                <div>
                  <h3 className="text-xs font-bold text-[#2B2E2C]/40 uppercase tracking-widest mb-3">1. Select recyclable type</h3>
                  <div className="flex flex-wrap gap-2">
                    {CALCULATOR_TYPES.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setSelectedCalc(type)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedCalc.key === type.key
                            ? 'bg-[#5F7A61] text-white border-[#5F7A61] shadow-sm'
                            : 'bg-[#FBFBFA] text-[#2B2E2C]/75 border-[#EAEAE6] hover:border-[#5F7A61]/35'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-[#2B2E2C]/40 uppercase tracking-widest">2. Adjust batch weight</h3>
                    <span className="font-mono text-sm font-bold text-[#5F7A61] bg-[#E5ECE3] px-3 py-1 rounded-lg">
                      {calcWeight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full h-2 bg-[#EAEAE6] rounded-lg appearance-none cursor-pointer accent-[#5F7A61] focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-[#2B2E2C]/40 font-semibold mt-2">
                    <span>1 kg</span>
                    <span>50 kg</span>
                    <span>100 kg</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-5 bg-[#F4F6F3] border border-[#E8EDE5] rounded-2xl p-6 flex flex-col justify-between text-left">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-[#2B2E2C]/40 uppercase tracking-widest block">ESTIMATED YIELD</span>
                  
                  <div>
                    <span className="text-[9px] font-bold text-[#2B2E2C]/50 block">POINTS EARNED</span>
                    <span className="font-mono text-3xl font-extrabold text-[#5F7A61]">+{pointsEarned.toLocaleString()} <span className="text-xs font-bold font-sans">pts</span></span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-[#2B2E2C]/50 block">DIGITAL PAYOUT</span>
                    <span className="font-mono text-2xl font-bold text-[#D9A05B]">฿{cashEarned.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#CCDBC7] flex items-center gap-2 text-xs font-bold text-[#5F7A61]">
                  <CloudRain className="h-4 w-4" />
                  <span>Saves {co2Saved.toFixed(1)} kg CO₂</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works Timeline Section ───────────────────────────────── */}
        <section id="how" className="border-t border-[#EAEAE6] bg-white py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A61] bg-[#E5ECE3] px-3.5 py-1 rounded-full">THE PROCESS</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B2E2C] sm:text-4xl">
              Simple, transparent steps
            </h2>
            <p className="mt-4 text-sm text-[#2B2E2C]/50 max-w-lg mx-auto">
              From sorting waste at home to redeeming rewards, we keep your recycling loops clear and effortless.
            </p>

            <div className="mt-16 relative">
              {/* Connecting line behind cards (visible on desktop md/lg screens) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#EAEAE6] via-[#5F7A61]/30 to-[#EAEAE6] hidden lg:block z-0" />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
                {HOW_IT_WORKS_STEPS.map((s) => (
                  <div key={s.step} className="rounded-3xl border border-[#EAEAE6] bg-[#FBFBFA] p-6 text-left hover:border-[#5F7A61]/30 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F7A61]/10 text-[#5F7A61] relative z-10 bg-[#FBFBFA]">
                          <s.icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-2xl font-bold text-[#EAEAE6]">{s.step}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#2B2E2C]">{s.title}</h3>
                      <p className="text-[10px] font-semibold text-[#5F7A61] mt-0.5">{s.titleTh}</p>
                      <p className="mt-3 text-xs leading-relaxed text-[#2B2E2C]/65">{s.desc}</p>
                    </div>
                    <p className="mt-2 text-[10px] leading-relaxed text-[#2B2E2C]/40 border-t border-[#EAEAE6]/70 pt-2">{s.descTh}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* ── Live Recycling Rates (Exchange Rate Style with Custom Spans) ── */}
        <section id="rates" className="border-t border-[#EAEAE6] bg-[#FBFBFA] py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A61] bg-[#E5ECE3] px-3.5 py-1 rounded-full">RATE SHEET</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B2E2C]">
                  Exchange Rates Index
                </h2>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-[#E5ECE3] px-3.5 py-1.5 rounded-full border border-[#D1E0CC]/55 w-fit">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5F7A61] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5F7A61]" />
                </span>
                <span className="text-[10px] text-[#5F7A61] font-bold uppercase tracking-wider">
                  Live Exchange Updates
                </span>
              </div>
            </div>

            {/* Premium Table Card with customized wider spans */}
            <div className="overflow-hidden rounded-3xl border border-[#EAEAE6] bg-white shadow-sm">
              <div className="grid border-b border-[#EAEAE6] bg-[#FBFBFA] px-6 py-4 text-left" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                <span className="col-span-8 text-[10px] font-bold uppercase tracking-widest text-[#2B2E2C]/45">
                  Recyclable Type
                </span>
                <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-[#2B2E2C]/45">
                  Points per kg
                </span>
                <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-[#2B2E2C]/45">
                  Cash equivalent
                </span>
              </div>
              
              {RECYCLING_RATES.map((row, i) => (
                <div
                  key={row.type}
                  className={`grid items-center px-6 py-4.5 transition-colors hover:bg-[#FBFBFA] text-left ${
                    i !== 0 ? 'border-t border-[#EAEAE6]' : ''
                  }`}
                  style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                >
                  <span className="col-span-8 text-xs font-bold text-[#2B2E2C]">{row.type}</span>
                  <span className="col-span-4 font-mono text-sm font-bold text-[#5F7A61]">
                    {row.ptsPerKg} pts
                  </span>
                  <span className="col-span-4 font-mono text-sm font-semibold text-[#D9A05B]">{row.cashPerKg}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-[#2B2E2C]/40 font-semibold text-left">
              <p>* Rates fluctuate according to global sustainability indexes and local market conditions.</p>
              <span className="flex items-center gap-1.5 text-[#5F7A61] shrink-0 font-bold uppercase tracking-wider"><ShieldCheck className="h-4 w-4" /> GUARANTEED EXCHANGE VALUE</span>
            </div>
          </div>
        </section>

        {/* ── FAQ Section (Accordion List) ─────────────────────────────────── */}
        <section id="faq" className="border-t border-[#EAEAE6] bg-white py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center max-w-lg mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5F7A61] bg-[#E5ECE3] px-3.5 py-1 rounded-full">HELP CENTER</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2B2E2C] sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-sm text-[#2B2E2C]/50">
                Got questions about points, deposits, or rewards? Find quick answers below.
              </p>
            </div>

            {/* Accordion List */}
            <div className="flex flex-col gap-4 text-left">
              {FAQS.map((faq, index) => {
                const isOpen = activeFaqIndex === index
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#EAEAE6] bg-[#FBFBFA] overflow-hidden transition-all shadow-sm"
                  >
                    {/* Accordion Header Trigger */}
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 p-5 p-5 text-left font-bold text-sm text-[#2B2E2C] hover:bg-[#F4F6F3]/50 transition-colors"
                    >
                      <div>
                        <span>{faq.q}</span>
                        <span className="block text-[10px] text-[#5F7A61] font-semibold mt-0.5">{faq.qTh}</span>
                      </div>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[#EAEAE6]">
                        {isOpen ? (
                          <ChevronUp className="h-3.5 w-3.5 text-[#5F7A61]" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-[#2B2E2C]/40" />
                        )}
                      </span>
                    </button>

                    {/* Accordion Content Box */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-60 border-t border-[#EAEAE6]/50 bg-white' : 'max-h-0'
                      } overflow-hidden`}
                    >
                      <div className="p-5 text-xs leading-relaxed text-[#2B2E2C]/70">
                        <p className="font-semibold text-[#2B2E2C]">{faq.a}</p>
                        <p className="mt-2 text-[#2B2E2C]/50 italic">{faq.aTh}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Band ───────────────────────────────────────────────────── */}
        <section className="border-t border-[#EAEAE6] relative overflow-hidden bg-[#2B2E2C] py-20 text-white">
          <div className="absolute inset-0 bg-radial-gradient from-[#5F7A61]/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Ready to turn waste into worth?
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Join thousands of community members logging deposits, reducing carbon footprint, and reclaiming eco rewards.
            </p>
            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5F7A61] px-8 py-4 font-bold text-white shadow-md transition-all hover:bg-[#4E6750] hover:scale-[1.02] active:scale-[0.98]"
            >
              Launch App
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer (Premium Dark Earth Warm Theme) ─────────────────────── */}
      <footer className="bg-[#2D2A26] text-white pt-16 pb-8 border-t border-white/5">
         <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
           
           {/* Column 1: Brand Info */}
           <div className="md:col-span-5 flex flex-col items-start gap-4">
             <div className="flex items-center gap-2">
               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5F7A61]">
                 <Leaf className="h-4 w-4 text-white" aria-hidden="true" />
               </span>
               <span className="text-lg font-bold tracking-tight text-white">midori</span>
             </div>
             <p className="text-xs leading-relaxed text-white/60 max-w-sm text-left">
               Empowering communities to recycle with ease, transforming household waste into sustainable value for a cleaner tomorrow.
             </p>
             {/* Social Links */}
             <div className="flex gap-3 mt-2">
               <a
                 href="https://instagram.com"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Instagram"
                 className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/35 transition-colors"
               >
                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                   <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                   <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
               </a>
               <a
                 href="https://facebook.com"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Facebook"
                 className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/35 transition-colors"
               >
                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                 </svg>
               </a>
             </div>
           </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 flex flex-col items-start gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 text-xs text-white/65 font-medium text-left">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Earnings Calculator</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">Our Process</a></li>
              <li><a href="#rates" className="hover:text-white transition-colors">Recycling Rates</a></li>
            </ul>
          </div>

          {/* Column 3: Get In Touch */}
          <div className="md:col-span-4 flex flex-col items-start gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">Get In Touch</h3>
            <ul className="flex flex-col gap-3.5 text-xs text-white/65 font-medium text-left">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-[#5F7A61] shrink-0" />
                <a href="mailto:hello@midori.eco" className="hover:text-white transition-colors">hello@midori.eco</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-[#5F7A61] shrink-0" />
                <span>+66 2-xxx-xxxx</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#5F7A61] shrink-0" />
                <span>Bangkok, Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright statement */}
        <div className="mx-auto max-w-6xl px-6 mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-semibold">
          <span>© 2026 midori | All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
