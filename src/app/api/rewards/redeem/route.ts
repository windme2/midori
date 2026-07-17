export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rewardName, cost } = await request.json()

    if (!rewardName || typeof cost !== 'number' || cost < 0) {
      return NextResponse.json({ error: 'Invalid reward payload' }, { status: 400 })
    }

    if (user.points < cost) {
      return NextResponse.json({ error: 'Insufficient points balance' }, { status: 400 })
    }

    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    const uniqueId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Run in transaction to deduct points and log redemption
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Deduct points
      const updated = await tx.user.update({
        where: { id: user.id },
        data: {
          points: {
            decrement: cost,
          }
        }
      })

      // 2. Add to transaction log
      await tx.transactionLog.create({
        data: {
          id: uniqueId,
          userId: user.id,
          title: `Redeemed ${rewardName}`,
          date: todayDate,
          points: `-${cost}`,
          positive: false,
        }
      })

      return updated
    })

    return NextResponse.json({
      success: true,
      points: updatedUser.points,
    })
  } catch (error) {
    console.error('API redeem reward error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
