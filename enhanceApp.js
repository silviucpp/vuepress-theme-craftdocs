import Vuex from 'vuex'
import CodeToggle from './components/CodeToggle'
import CodeLanguageSwitcher from './components/CodeLanguageSwitcher'
import { setStorage } from './Storage'

export default ({ Vue, options, router, siteData }) => {

    const withBase = Vue.prototype.$withBase
    Vue.prototype.$withBase = function (url) {
        if (url && url.startsWith('!'))
             return url.slice(1);

        return withBase.call(this, url)
    }

    Vue.component('code-toggle', CodeToggle)
    Vue.component('code-language-switcher', CodeLanguageSwitcher)

    Vue.use(Vuex)

    Vue.mixin({
        computed: {
            $title() {
                const page = this.$page
                const siteTitle = this.$siteTitle
                const selfTitle = (page.frontmatter.title || // explicit title
                    (page.title ? page.title.replace(/[_`]/g, '') : '') // inferred title
                )
                return siteTitle
                    ? selfTitle
                        ? (selfTitle + ' | ' + siteTitle)
                        : siteTitle
                    : selfTitle || ''
            }
        }
    })

    Object.assign(options, {
        data: {
            codeLanguage: null,
        },

        store: new Vuex.Store({
            state: {
                codeLanguage: null
            },
            mutations: {
                changeCodeLanguage(state, language) {
                    state.codeLanguage = language;
                    setStorage('codeLanguage', language);
                }
            }
        })
    })
}
