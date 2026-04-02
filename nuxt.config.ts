// Subpath deploy: NUXT_APP_BASE_URL=/cointoss/ (trailing slash)
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Münzwurf',
    },
  },
  nitro: { preset: 'static' },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
})
