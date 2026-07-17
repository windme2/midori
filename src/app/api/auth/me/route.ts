export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    let points = user.points
    let recycledKg = user.recycledKg
    let co2SavedKg = user.co2SavedKg
    let breakdown = {
      Plastic: user.plasticKg,
      Paper: user.paperKg,
      Glass: user.glassKg,
      Organic: user.organicKg,
      'E-waste': user.ewasteKg,
      Other: user.otherKg,
    }

    // Dynamic Tier calculation for member users
    let computedTier = user.tier
    if (user.role !== 'staff' && user.role !== 'admin') {
      if (user.points >= 8000) computedTier = 'DIAMOND'
      else if (user.points >= 6000) computedTier = 'PLATINUM'
      else if (user.points >= 4000) computedTier = 'GOLD'
      else if (user.points >= 2000) computedTier = 'SILVER'
      else computedTier = 'BRONZE'
    }

    if (user.role === 'staff' || user.role === 'admin') {
      const aggregates = await prisma.user.aggregate({
        where: {
          role: 'member', // only sum member statistics
        },
        _sum: {
          points: true,
          recycledKg: true,
          co2SavedKg: true,
          plasticKg: true,
          paperKg: true,
          glassKg: true,
          organicKg: true,
          ewasteKg: true,
          otherKg: true,
        }
      })
      points = aggregates._sum.points || 0
      recycledKg = aggregates._sum.recycledKg || 0
      co2SavedKg = aggregates._sum.co2SavedKg || 0
      breakdown = {
        Plastic: aggregates._sum.plasticKg || 0,
        Paper: aggregates._sum.paperKg || 0,
        Glass: aggregates._sum.glassKg || 0,
        Organic: aggregates._sum.organicKg || 0,
        'E-waste': aggregates._sum.ewasteKg || 0,
        Other: aggregates._sum.otherKg || 0,
      }
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const lastWeekLogs = await prisma.transactionLog.findMany({
      where: {
        userId: user.id,
        positive: true,
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        }
      }
    })

    const lastWeekPoints = lastWeekLogs.reduce((sum, log) => {
      const val = parseInt(log.points) || 0
      return sum + val
    }, 0)
    const showLastWeekTag = now.getTime() - new Date(user.createdAt).getTime() >= 7 * 24 * 60 * 60 * 1000

    const targetRole = user.role === 'admin' ? 'staff' : user.role

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: targetRole,
        memberSince: user.memberSince,
        tier: computedTier,
        location: user.location,
        avatar: user.avatar,
        points,
        recycledKg,
        co2SavedKg,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        weeklyPointGoal: user.weeklyPointGoal,
        breakdown,
        lastWeekPoints,
        showLastWeekTag,
      }
    })
  } catch (error) {
    console.error('API me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
