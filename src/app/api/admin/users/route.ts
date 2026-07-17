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

    const members = await prisma.user.findMany({
      where: {
        role: 'member',
      },
      select: {
        id: true,
        username: true,
        name: true,
        points: true,
        tier: true,
        avatar: true,
      },
      orderBy: {
        username: 'asc',
      }
    })

    // Format to match UI structure
    const formattedMembers = members.map((m) => {
      let computedTier = m.tier
      if (m.points >= 8000) computedTier = 'Diamond'
      else if (m.points >= 6000) computedTier = 'Platinum'
      else if (m.points >= 4000) computedTier = 'Gold'
      else if (m.points >= 2000) computedTier = 'Silver'
      else computedTier = 'Bronze'

      return {
        id: m.username.toUpperCase(),
        name: m.name,
        points: m.points,
        tier: computedTier,
        avatar: m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      }
    })

    return NextResponse.json({ success: true, members: formattedMembers })
  } catch (error) {
    console.error('API get members error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
