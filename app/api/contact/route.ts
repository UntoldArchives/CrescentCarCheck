import { NextResponse } from 'next/server'
import { notifyContactMessage } from '@/lib/email'

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  topic?: string
  carMake?: string
  carModel?: string
  carYear?: string
  message?: string
}

/**
 * Contact form handler.
 *  1. Validate input
 *  2. Forward to the owner inbox via Resend (best-effort, env-gated)
 *
 * Returns success once the message is accepted. While Resend isn't configured,
 * notifyContactMessage() logs and no-ops, so the form works in every environment.
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

  await notifyContactMessage({
    name,
    email,
    phone: body.phone?.trim(),
    topic: body.topic?.trim(),
    carMake: body.carMake?.trim() || undefined,
    carModel: body.carModel?.trim() || undefined,
    carYear: body.carYear?.trim() || undefined,
    message,
  })

  return NextResponse.json({ ok: true })
}
