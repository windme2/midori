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

    const transactions = await prisma.transactionLog.findMany({
      where: {
        pending: false,
        positive: true, // Only show deposits, redemptions are handled separately or combined. Staff logs historically show accepted user deposits.
      },
      include: {
        user: true,
      },
      orderBy: {
        date: 'desc',
      }
    })

    const logs = transactions.map((tx) => ({
      id: tx.id,
      memberId: tx.user.username.toUpperCase(),
      memberName: tx.user.name,
      wasteType: tx.wasteType || 'Other',
      weight: tx.weight || 0,
      pointsEarned: parseInt(tx.points.replace('+', '')) || 0,
      date: tx.date,
      station: tx.station || 'Bangna',
    }))

    return NextResponse.json({ success: true, logs })
  } catch (error) {
    console.error('API staff logs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
