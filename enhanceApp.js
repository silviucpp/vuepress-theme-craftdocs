import Vuex from 'vuex'
import CodeToggle from './components/CodeToggle'
import CodeLanguageSwitcher from './components/CodeLanguageSwitcher'
import { setStorage } from './Storage'

function flashCopyButton (btn, text) {
    const original = btn.textContent
    btn.textContent = text
    btn.classList.add('copied')
    clearTimeout(btn._copyResetTimer)
    btn._copyResetTimer = setTimeout(() => {
        btn.textContent = original
        btn.classList.remove('copied')
    }, 1500)
}

function copyText (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text)
    }
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand('copy')
            resolve()
        } catch (err) {
            reject(err)
        } finally {
            document.body.removeChild(textarea)
        }
    })
}

function addCodeCopyButtons () {
    if (typeof document === 'undefined') return
    const blocks = document.querySelectorAll('.content__default div[class*="language-"]')
    blocks.forEach((block) => {
        if (block.querySelector('.code-copy')) return
        const pre = block.querySelector('pre')
        if (!pre) return

        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'code-copy'
        button.setAttribute('aria-label', 'Copy code to clipboard')
        button.textContent = 'Copy'
        button.addEventListener('click', () => {
            copyText(pre.innerText)
                .then(() => flashCopyButton(button, 'Copied!'))
                .catch(() => flashCopyButton(button, 'Failed'))
        })
        block.appendChild(button)
    })
}

function debounce (fn, wait) {
    let timer = null
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), wait)
    }
}

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

    if (typeof window !== 'undefined') {
        const scan = debounce(addCodeCopyButtons, 100)
        router.onReady(() => {
            scan()
            new MutationObserver(scan).observe(document.body, { childList: true, subtree: true })
        })
    }
}
