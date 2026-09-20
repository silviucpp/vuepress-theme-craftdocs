<template>
  <nav
    class="product-tabs"
    v-if="items && items.length"
  >
    <router-link
      v-for="item in items"
      :key="item.link"
      :to="item.link"
      class="product-tab"
      :class="{ active: isActive(item.link) }"
    >{{ item.text }}</router-link>
  </nav>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    isActive (link) {
      // $route.path is relative to the site's `base` (VuePress strips it),
      // while the href on the <a> needs $withBase() — so compare against
      // the raw (un-based) link here, not the $withBase()'d one.
      // The Overview tab's link is a prefix of every other tab's link, so
      // it needs an exact match; the rest can match their whole sub-section.
      if (link === '/api-reference/') {
        return this.$route.path === link
      }
      return this.$route.path.indexOf(link) === 0
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.product-tabs
  position fixed
  z-index 19
  top $navbarHeight
  left $sidebarWidth
  right 0
  height $productNavHeight
  box-sizing border-box
  display flex
  align-items center
  gap 0.4rem
  padding 0 1.5rem
  background #fff
  border-bottom 1px solid $borderColor
  overflow-x auto
  overflow-y hidden
  white-space nowrap
  -webkit-overflow-scrolling touch

  .product-tab
    display inline-flex
    align-items center
    flex none
    height 1.9rem
    padding 0 0.9rem
    border-radius 100px
    font-size 0.85rem
    font-weight 500
    color $mutedTextColor
    transition background-color .12s ease, color .12s ease

    &:hover
      text-decoration none !important
      color $textColor
      background rgba(15, 23, 42, 0.05)

    &.active
      color #fff
      background $navbarBackgroundColor
      font-weight 600

      &:hover
        background $navbarBackgroundColor

@media (max-width: $MQNarrow)
  .product-tabs
    left ($sidebarWidth * 0.82)

@media (max-width: $MQMobile)
  .product-tabs
    left 0
    padding 0 1rem
</style>
