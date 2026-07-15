import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const CO2_FACTOR = 0.72

export async function POST(request: Request) {
  try {
    const staff = await getSessionUser()
    if (!staff || (staff.role !== 'staff' && staff.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { memberId, wasteType, weight, pointsEarned, activePendingId } = await request.json()

    if (!memberId || !wasteType || typeof weight !== 'number' || typeof pointsEarned !== 'number' || !activePendingId || weight <= 0 || pointsEarned < 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const cleanUsername = memberId.trim().toLowerCase()
    const targetUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    // Prepare material breakdown dynamic increment
    const updateData: any = {
      points: { increment: pointsEarned },
      recycledKg: { increment: weight },
      co2SavedKg: { increment: parseFloat((weight * CO2_FACTOR).toFixed(2)) },
    }

    const matchedKey = wasteType.toLowerCase()
    if (matchedKey === 'plastic') updateData.plasticKg = { increment: weight }
    else if (matchedKey === 'paper') updateData.paperKg = { increment: weight }
    else if (matchedKey === 'glass') updateData.glassKg = { increment: weight }
    else if (matchedKey === 'organic') updateData.organicKg = { increment: weight }
    else if (matchedKey === 'e-waste' || matchedKey === 'ewaste') updateData.ewasteKg = { increment: weight }
    else updateData.otherKg = { increment: weight }

    // Run inside database transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update user stats
      await tx.user.update({
        where: { id: targetUser.id },
        data: updateData,
      })

      // 2. Update user's transaction log (unmark pending)
      await tx.transactionLog.update({
        where: { id: activePendingId },
        data: {
          title: `${wasteType} deposit — ${weight.toFixed(1)} kg`,
          points: `+${pointsEarned}`,
          pending: false,
          wasteType,
          weight,
          station: 'Bangna',
        }
      })

      // 3. Remove from pending verification queue
      await tx.depositRequest.delete({
        where: { id: activePendingId },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API staff approve error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
