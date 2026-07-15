import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { weeklyPointGoal } = await request.json()

    if (typeof weeklyPointGoal !== 'number' || weeklyPointGoal <= 0) {
      return NextResponse.json({ error: 'Invalid goal' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { weeklyPointGoal },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API update goal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
