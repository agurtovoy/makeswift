import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en-US', 'fr-FR'],
  defaultLocale: 'en-US',
  // localePrefix: 'as-needed',
  domains: [
    {
      domain: 'pages.agurtovoy.work',
      defaultLocale: 'en-US',
    },
    {
      domain: 'pages-fr.agurtovoy.work',
      defaultLocale: 'fr-FR',
    },
  ],
  localePrefix: 'never',
})
