
// 引入i18n国际化插件
// eslint-disable-next-line standard/object-curly-even-spacing
import { getToken} from '@/utils/auth'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocale from './en'
import zhLocale from './zh'
import jpLocale from './jp'
Vue.use(VueI18n)

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = new VueI18n({
  locale: getToken('lang') || 'zh',
  messages: {
    zh: {
      ...zhLocale
    },
    en: {
      ...enLocale
    },
    jp: {
      ...jpLocale
    }
  }
})

export default i18n
