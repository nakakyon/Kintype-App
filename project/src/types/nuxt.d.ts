// import VueRouter from 'vue-router'
import moment from 'moment'

declare module 'vue/types/vue' {
  interface Vue {
    // $router: VueRouter
    $moment: typeof moment
    $copyText: any
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // layout?: string
    // middleware?: string | String[]
  }
}
