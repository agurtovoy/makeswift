import createWithMakeswift from '@makeswift/runtime/next/plugin'

const withMakeswift = createWithMakeswift({
  appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
  previewMode: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withMakeswift(nextConfig)
