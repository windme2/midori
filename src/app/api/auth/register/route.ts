export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, username, password, location } = await request.json()

    if (!name || !username || !password) {
      return NextResponse.json({ error: 'Display Name, Username, and Password are required' }, { status: 400 })
    }

    const cleanUsername = username.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 })
    }

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        passwordHash: hashPassword(password),
        name: name.trim(),
        role: 'member',
        memberSince: 'July 2026',
        location: location || 'Bangna, Bangkok',
      }
    })

    // Establish session
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      role: 'member',
      user: {
        name: user.name,
        username: user.username,
        role: 'member',
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
