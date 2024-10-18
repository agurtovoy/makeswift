import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en-US', 'fr-FR'],
  defaultLocale: 'en-US',
  // localePrefix: 'as-needed',
  domains: [
    {
      domain: 'app.agurtovoy.work',
      defaultLocale: 'en-US',
      locales: ['en-US'],
    },
    {
      domain: 'app-fr.agurtovoy.work',
      defaultLocale: 'fr-FR',
      locales: ['fr-FR'],
    },
  ],
  localePrefix: 'never',
})
