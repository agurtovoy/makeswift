import { NextMiddleware, NextRequest, NextFetchEvent } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { parse as parseSetCookie } from 'set-cookie-parser'

import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

const draftModeMiddleware =
  (next: NextMiddleware) =>
  async (request: NextRequest, event: NextFetchEvent) => {
    const requestApiKey =
      request.nextUrl.searchParams.get('x-makeswift-draft-mode') ??
      request.headers.get('x-makeswift-draft-mode')

    if (!requestApiKey) {
      return next(request, event)
    }

    request.headers.delete('x-makeswift-draft-mode')
    request.nextUrl.searchParams.delete('x-makeswift-draft-mode')

    const response = await fetch(
      new URL(
        `${request.nextUrl.protocol}//${request.nextUrl.host}/api/makeswift/draft-mode`,
      ),
      {
        headers: {
          'x-makeswift-api-key': requestApiKey,
        },
      },
    )

    const cookies = parseSetCookie(response.headers.get('set-cookie') ?? '')
    const prerenderBypassValue = cookies?.find(
      (c) => c.name === '__prerender_bypass',
    )?.value

    if (!prerenderBypassValue) {
      return next(request, event)
    }

    // https://github.com/vercel/next.js/issues/52967#issuecomment-1644675602
    // if we don't pass request twice, headers are stripped
    const proxiedRequest = new NextRequest(request, request)

    proxiedRequest.cookies.set('__prerender_bypass', prerenderBypassValue)
    proxiedRequest.cookies.set(
      'x-makeswift-draft-data',
      JSON.stringify({ makeswift: true, siteVersion: 'Working' }),
    )

    return next(proxiedRequest, event)
  }

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return draftModeMiddleware(handleI18nRouting)(request, event)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
