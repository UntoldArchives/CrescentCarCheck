/**
 * Client-side error/perf monitoring (Sentry), DORMANT until a DSN is provided.
 *
 * NEXT_PUBLIC_SENTRY_DSN is inlined at build time. While it's empty, the guard
 * below is statically falsy and the @sentry/nextjs chunk is never loaded — so
 * the keyless build ships none of the Sentry browser SDK to visitors. Set the
 * DSN and the browser SDK initialises automatically on the next deploy.
 */
const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (DSN) {
  import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.init({
        dsn: DSN,
        tracesSampleRate: 0.1,
        // Session Replay is off by default — opt in later if desired.
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        environment: process.env.NODE_ENV,
      })
    })
    .catch(() => {
      // Monitoring must never break the app — swallow load/init failures.
    })
}
