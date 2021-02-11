import { Context, Plugin } from '@nuxt/types'

let _contex: Context
const timeYMD = (date?: Date | string) => {
  date = date === undefined ? new Date() : date
  return _contex.app.$moment(date).format('YYYYMMDD') + ''
}
const timeYMDLabel = (date?: Date | string) => {
  date = date === undefined ? new Date() : date
  return _contex.app.$moment(date).format('YYYY/MM/DD(ddd)') + ''
}

const utilsPlugin: Plugin = (context, inject) => {
  _contex = context
  inject('timeYMD', timeYMD)
  inject('timeYMDLabel', timeYMDLabel)
}

export default utilsPlugin
