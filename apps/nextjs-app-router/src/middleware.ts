import { NextMiddleware, NextRequest, NextFetchEvent } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

const MAKESWIFT_DRAFT_MODE_QUERY_PARAM = 'x-makeswift-draft-mode'
const MAKESWIFT_DRAFT_MODE_HEADER = 'x-makeswift-draft-mode'

const handleI18nRouting = createMiddleware(routing)

const draftModeMiddleware =
  (next: NextMiddleware) =>
  async (request: NextRequest, event: NextFetchEvent) => {
    const requestApiKey =
      request.nextUrl.searchParams.get(MAKESWIFT_DRAFT_MODE_QUERY_PARAM) ??
      request.headers.get(MAKESWIFT_DRAFT_MODE_HEADER)

    console.log('+++ draftModeMiddleware', {
      url: request.nextUrl.href,
      requestApiKey,
    })

    if (!requestApiKey) {
      return next(request, event)
    }

    const { nextUrl } = request
    nextUrl.searchParams.delete(MAKESWIFT_DRAFT_MODE_QUERY_PARAM)
    const to = new URL(nextUrl.pathname + nextUrl.search, nextUrl.origin)

    const proxyUrl = new URL('/api/makeswift/draft-mode/proxy', nextUrl.origin)
    proxyUrl.searchParams.set('to', to.href)
    proxyUrl.searchParams.set('keep-draft-mode-cookie', 'true')

    const proxyHeaders = new Headers(request.headers)
    proxyHeaders.set('x-makeswift-api-key', requestApiKey)
    proxyHeaders.delete('connection')
    proxyHeaders.delete(MAKESWIFT_DRAFT_MODE_HEADER)

    // return next(proxiedRequest, event)

    return fetch(proxyUrl, { headers: proxyHeaders })
  }

export function middleware(request: NextRequest, event: NextFetchEvent) {
  console.log('+++ Middleware', { url: request.nextUrl.href })
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
