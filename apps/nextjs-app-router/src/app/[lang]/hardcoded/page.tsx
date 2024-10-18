import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'

type ParsedUrlQuery = { lang: string; path?: string[] }

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  const snapshotA = await client.getPageSnapshot('/alpha', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  const snapshotB = await client.getPageSnapshot('/beta', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  if (snapshotA == null && snapshotB == null) return notFound()

  return (
    <div>
      {snapshotA ? (
        <>
          <h1>Alpha</h1>
          <MakeswiftPage snapshot={snapshotA} />
        </>
      ) : null}
      <hr />
      {snapshotB ? (
        <>
          <h1>Beta</h1>
          <MakeswiftPage snapshot={snapshotB} />
        </>
      ) : null}
    </div>
  )
}
