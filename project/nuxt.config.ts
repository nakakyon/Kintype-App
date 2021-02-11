import colors from 'vuetify/es5/util/colors'

export default {
  srcDir: 'src',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    // titleTemplate: '%s - Kintype',
    // title: '勤怠の連絡サービス',
    title: 'Kintype',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Kintypeは電話やメールで連絡していた勤怠を手軽に共有できるサービスです',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'Kintype,キンタイプ,勤怠連絡,勤怠共有,勤怠',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'robots', name: 'robots', content: 'noindex' },
    ],
    link: [
      { rel: 'shortcut icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/android-chrome-512x512.png',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/utils', ssr: true}
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  moment: {
    locales: ['ja'],
  },
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/dotenv', 'nuxt-clipboard2'],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    hardSource: true,
    publicPath: '/assets/',
    extend(config: any, ctx: any) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|ts|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
  router: {
    extendRoutes(routes: any, resolve: any) {
      routes.push(
        {
          name: 'group_id-attendances-selected_date',
          path: '/:group_id/attendances/:selected_date',
          component: resolve(__dirname, 'src/pages/_group_id/index.vue'),
        },
        {
          name: 'group_id-members-new-init',
          path: '/:group_id/members/new/:init',
          component: resolve(__dirname, 'src/pages/_group_id/members/new.vue'),
        },
        {
          name: 'not_found',
          path: '*',
          component: resolve('src/pages/index.vue'),
        }
      )
    },
  },
}
