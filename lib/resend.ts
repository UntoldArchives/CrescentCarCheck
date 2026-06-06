import { Resend } from 'resend'

/**
 * Lazy Resend client.
 *
 * Same contract as lib/stripe.ts: importing this module never throws. The error
 * is deferred to getResend(), and isResendConfigured() lets callers no-op
 * cleanly while the client has not yet provisioned a Resend account.
 */
let client: Resend | null = null

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set — cannot create a Resend client.')
  }
  if (!client) {
    client = new Resend(key)
  }
  return client
}
