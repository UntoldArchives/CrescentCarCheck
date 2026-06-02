import { NextResponse } from 'next/server'

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  topic?: string
  message?: string
}

/**
 * Stub contact form handler. Mirrors the eventual live shape:
 *  1. Validate input
 *  2. (later) Forward to internal Slack / email via Resend
 *
 * Currently logs and returns success. Swap the body when the client provisions
 * Resend (or another transactional sender).
 */
export async function POST(req: Request) {
  let body: ContactPayload
  try {
    body = (await req.json()) as ContactPayload
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (!name) return NextResponse.json({ ok: false, error: 'Name is required' }, { status: 422 })
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Valid email is required' }, { status: 422 })
  }
  if (message.length < 10) {
    return NextResponse.json({ ok: false, error: 'Please write a longer message' }, { status: 422 })
  }

  console.log('[contact:stub] received message', {
    name,
    email,
    topic: body.topic ?? 'unspecified',
    messageLength: message.length,
  })

  return NextResponse.json({ ok: true })
}
