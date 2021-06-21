import VueRouter from 'vue-router'
import moment from 'moment'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $moment: typeof moment
    $copyText: any
    $timeYMD(date?: Date | string): string
    $timeYMDLabel(date?: Date | string): string
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $timeYMD(date?: Date | string): string
    $timeYMDLabel(date?: Date | string): string
  }
  interface Context {
    $timeYMD(date?: Date | string): string
    $timeYMDLabel(date?: Date | string): string
  }
}
