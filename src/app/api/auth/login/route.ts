export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const cleanUsername = username.trim().toLowerCase()
    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
    })

    if (!user) {
      return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 })
    }

    const isMatch = verifyPassword(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 })
    }

    await createSession(user.id)

    const targetRole = user.role === 'admin' ? 'staff' : user.role

    return NextResponse.json({
      success: true,
      role: targetRole,
      user: {
        name: user.name,
        username: user.username,
        role: targetRole,
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
