// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
