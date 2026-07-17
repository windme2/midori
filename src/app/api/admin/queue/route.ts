export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.depositRequest.findMany({
      include: {
        user: true,
      },
      orderBy: {
        date: 'desc',
      }
    })

    const pendingDeposits = requests.map((req) => {
      let computedTier = req.user.tier
      if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        if (req.user.points >= 8000) computedTier = 'DIAMOND'
        else if (req.user.points >= 6000) computedTier = 'PLATINUM'
        else if (req.user.points >= 4000) computedTier = 'GOLD'
        else if (req.user.points >= 2000) computedTier = 'SILVER'
        else computedTier = 'BRONZE'
      }

      return {
        id: req.id,
        memberId: req.user.username.toUpperCase(),
        memberName: req.user.name,
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        tier: computedTier,
        points: req.user.points,
        wasteType: req.wasteType,
        weight: req.weight,
        estPoints: req.estPoints,
        date: req.date,
        notes: req.notes,
      }
    })

    return NextResponse.json({ success: true, pendingDeposits })
  } catch (error) {
    console.error('API staff queue error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
