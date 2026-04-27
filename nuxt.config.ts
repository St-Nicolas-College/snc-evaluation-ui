// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: "SNC Evaluation System", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-32x32.ico'}
      ]
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@nuxt/ui'],
  css: [`~/assets/css/main.css`],
  // colorMode: {
  //   preference: 'dark',
  //   fallback: 'dark',
  //   classSuffix: ''
  // },
  runtimeConfig: {
    public: {
      //@ts-ignore
      strapiUrl: process.env.BASE_URL,
    },
  },
})
