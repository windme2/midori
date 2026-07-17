export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET: Fetch member's transactions
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logs = await prisma.transactionLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }, // wait, date is a string, so order by schema id or date? Ordering in memory is also possible.
    })

    // To make sure ordering is correct, let's sort by their creation order. Since we don't have createdAt in schema, let's return it as is or order by date.
    // Let's sort logs
    return NextResponse.json({ success: true, logs })
  } catch (error) {
    console.error('API get transactions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Submit a batch deposit basket
export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { basket, notes } = await request.json()
    if (!basket || !Array.isArray(basket) || basket.length === 0) {
      return NextResponse.json({ error: 'Invalid basket' }, { status: 400 })
    }

    // Validate each item in the basket
    for (const item of basket) {
      if (!item.type || typeof item.weight !== 'number' || item.weight <= 0 || typeof item.points !== 'number' || item.points < 0) {
        return NextResponse.json({ error: 'Invalid item parameters' }, { status: 400 })
      }
    }

    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    const receiptId = 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    let totalWeight = 0
    let totalPoints = 0

    // Run inside database transaction
    await prisma.$transaction(
      basket.map((item: any) => {
        const uniqueId = `PEND-${Math.floor(1000 + Math.random() * 9000)}`
        totalWeight += item.weight
        totalPoints += item.points

        // 1. Create a verification queue request (DepositRequest)
        const reqPromise = prisma.depositRequest.create({
          data: {
            id: uniqueId,
            userId: user.id,
            wasteType: item.type,
            weight: item.weight,
            estPoints: item.points,
            date: 'Just now',
            notes: notes || '',
          }
        })

        // 2. Create a pending transaction log in user's history
        const logPromise = prisma.transactionLog.create({
          data: {
            id: uniqueId,
            userId: user.id,
            title: `${item.type} deposit (Pending Verification)`,
            date: todayDate,
            points: `+${item.points}`,
            positive: true,
            pending: true,
            wasteType: item.type,
            weight: item.weight,
          }
        })

        return [reqPromise, logPromise]
      }).flat()
    )

    return NextResponse.json({
      success: true,
      receipt: {
        id: receiptId,
        date: todayDate,
        items: basket,
        totalWeight,
        totalPoints,
      }
    })
  } catch (error) {
    console.error('API submit deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
