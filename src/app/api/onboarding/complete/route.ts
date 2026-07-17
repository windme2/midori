export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { hasCompletedOnboarding: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API onboarding complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
