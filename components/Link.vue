<template>
    <router-link class="nav-link" :to="link" v-if="!isExternal(link)" :exact="exact" >
         {{ item.title }}
    </router-link>
    <a v-else :href="$withBase(link)" class="nav-link external" :target="shouldOpenSameTab(link) ? null : '_blank'" :rel="shouldOpenSameTab(link) ? null : 'noopener noreferrer'">
         {{ item.title }}
    </a>
</template>

<script>
    import { isExternal, isMailto, isTel, shouldOpenSameTab, ensureExt } from '../util'

    export default {
        props: {
            item: {
                required: true
            }
        },

    computed: {
        link () {
            return ensureExt(this.item.url)
        },

        exact () {
            if (this.$site.locales) {
                return Object.keys(this.$site.locales).some(rootLink => rootLink === this.link)
            }
            return this.link === '/'
        }
    },

    methods: {
        isExternal,
        isMailto,
        isTel,
        shouldOpenSameTab
    }
}
</script>
