import type { Instrumentation } from 'next'

/**
 * Server-side error/perf monitoring (Sentry), DORMANT until a DSN is provided.
 *
 * We read the DSN at runtime and only dynamically import @sentry/nextjs when it
 * is present, so a keyless build/deploy carries no Sentry initialisation. The
 * moment SENTRY_DSN (or NEXT_PUBLIC_SENTRY_DSN) is set, server + edge errors and
 * traces start flowing — no code change required.
 *
 * To fully activate (source-map upload, tunnelling, release tracking), also run
 * the Sentry wizard / wrap next.config with withSentryConfig once the client
 * provides SENTRY_AUTH_TOKEN / SENTRY_ORG / SENTRY_PROJECT (see BACKEND_SETUP.md).
 */
const DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

export async function register(): Promise<void> {
  if (!DSN) return

  const Sentry = await import('@sentry/nextjs')
  Sentry.init({
    dsn: DSN,
    // Conservative defaults; tune once real traffic/quota are known.
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  })
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  if (!DSN) return
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(err, request, context)
}
