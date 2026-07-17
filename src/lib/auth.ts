import { cookies } from 'next/headers'
import crypto from 'crypto'
import { prisma } from './db'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return testHash === hash
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiration

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set('midori_session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
    path: '/',
  })

  return sessionId
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('midori_session_id')?.value
  if (!sessionId) return null

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session) return null

  // Check expiration
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: sessionId } })
    return null
  }

  return session.user
}

export async function destroySession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('midori_session_id')?.value
  if (sessionId) {
    try {
      await prisma.session.delete({ where: { id: sessionId } })
    } catch (e) {
      // Ignored if session already deleted
    }
  }
  cookieStore.delete('midori_session_id')
}
