import { cookies, draftMode } from 'next/headers'
import { NextRequest } from 'next/server'

// see https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
const DRAFT_MODE_COOKIE_NAME = '__prerender_bypass'
const MAKESWIFT_DRAFT_DATA_COOKIE_NAME = 'x-makeswift-draft-data'

function getDraftModeCookie({ keep }: { keep: boolean }): string | undefined {
  draftMode().enable()
  const cookie = cookies().get(DRAFT_MODE_COOKIE_NAME)?.value
  if (!keep) draftMode().disable()
  return cookie
}

function preventDoubleDecoding(response: Response): Response {
  const responseHeaders = new Headers(response.headers)
  console.log('+++ Draft mode proxy response:', {
    status: response.status,
    responseHeaders,
  })

  // `fetch` automatically decompresses the response, but the response headers will keep the
  // `content-encoding` and `content-length` headers. This will cause decoding issues if the client
  // attempts to decompress the response again. To prevent this, we remove these headers.
  //
  // See https://github.com/nodejs/undici/issues/2514.
  if (responseHeaders.has('content-encoding')) {
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('content-length')
  }

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status,
  })
}

function draftModeRequest({
  url,
  init,
  draftModeCookie,
}: {
  url: string
  init?: NextRequest
  draftModeCookie: string
}): NextRequest {
  const request = new NextRequest(url, init)
  request.cookies.set(DRAFT_MODE_COOKIE_NAME, draftModeCookie)
  request.cookies.set(
    MAKESWIFT_DRAFT_DATA_COOKIE_NAME,
    JSON.stringify({ makeswift: true, siteVersion: 'Working' }),
  )

  return request
}

export async function GET(request: NextRequest): Promise<Response> {
  const to = request.nextUrl.searchParams.get('to')
  if (to == null) throw new Error('Missing "to" query parameter')

  const keepDraftModeCookie =
    request.nextUrl.searchParams.get('keep-draft-mode-cookie') === 'true'
  const draftModeCookie = getDraftModeCookie({ keep: keepDraftModeCookie })
  if (draftModeCookie == null)
    throw new Error("Couldn't read draft mode cookie")

  const proxyRequest = draftModeRequest({
    url: to,
    init: request,
    draftModeCookie,
  })

  const decodedTo = decodeURIComponent(to)
  console.log('+++ Draft mode proxy:', { draftModeCookie, to, decodedTo })

  return preventDoubleDecoding(await fetch(proxyRequest, proxyRequest))
}
