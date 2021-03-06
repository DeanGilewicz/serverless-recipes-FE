require('dotenv').config() /* for axios */
export default {
  mode: 'spa',
  /* hosting on Netlfiy */
  generate: {
    fallback: true
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    bodyAttrs: {
      class: 'bg-gray-100'
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/input-validation.js',
    '~/plugins/auth.js',
    '~/plugins/sanitize.js'
  ],
  /*
   ** Custom linting rules
   */
  rules: {
    // 'semi': [2, 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    // 'prefer-includes': 'off'
    // 'vue/max-attributes-per-line': 'off',
    // 'prettier/prettier': ['error', { 'semi': false }]
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      '@nuxtjs/dotenv'
      // {
      //   // path: '/frontend',
      //   filename: '.env.prod'
      // }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  // axios: {
  //   browserBaseURL: ''
  //   //     process.env.BASE_URL ||
  //   //     '',
  //   //   https: true
  // },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
  // env: {
  //   apiUrl:
  //     process.env.API_URL ||
  //     ''
  // }
}
