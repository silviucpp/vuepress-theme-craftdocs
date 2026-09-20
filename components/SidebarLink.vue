<script>
import { isActive, hashRE, groupHeaders } from '../util'

export default {
  functional: true,

  props: ['item'],

  render (h, { parent: { $page, $site, $route }, props: { item }}) {
    // use custom active class matching logic
    // due to edge case of paths ending with / + hash
    const selfActive = isActive($route, item.path)
    // for sidebar: auto pages, a hash link should be active if one of its child
    // matches
    const active = item.type === 'auto'
      ? selfActive || item.children.some(c => isActive($route, item.basePath + '#' + c.slug))
      : selfActive
    const link = renderLink(h, item.path, item.title || item.path, active)
    const configDepth = $page.frontmatter.sidebarDepth != null
      ? $page.frontmatter.sidebarDepth
      : $site.themeConfig.sidebarDepth
    const maxDepth = configDepth == null ? 1 : configDepth
    const displayAllHeaders = !!$site.themeConfig.displayAllHeaders
    if (item.type === 'auto') {
      return [link, renderChildren(h, item.children, item.basePath, $route, maxDepth)]
    } else if ((active || displayAllHeaders) && item.headers && !hashRE.test(item.path)) {
      const children = groupHeaders(item.headers)
      return [link, renderChildren(h, children, item.path, $route, maxDepth)]
    } else {
      return link
    }
  }
}

function renderLink (h, to, text, active) {
  text = text.replace(/[_`]/g, '')
  return h('router-link', {
    props: {
      to,
      activeClass: '',
      exactActiveClass: ''
    },
    class: {
      active,
      'sidebar-link': true
    }
  }, text)
}

function renderChildren (h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null
  return h('ul', { class: 'sidebar-sub-headers' }, children.map(c => {
    const active = isActive(route, path + '#' + c.slug)
    return h('li', { class: 'sidebar-sub-header' }, [
      renderLink(h, path + '#' + c.slug, c.title, active),
      renderChildren(h, c.children, path, route, maxDepth, depth + 1)
    ])
  }))
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.sidebar .sidebar-sub-headers
  padding-left 0.9rem
  font-size 0.93em

a.sidebar-link
  font-weight 400
  display inline-block
  color $mutedTextColor
  padding 0.4rem 1rem 0.4rem 1.5rem
  margin 0.05rem 0.75rem 0.05rem 0
  line-height 1.4
  width: calc(100% - 0.75rem)
  box-sizing: border-box
  border-radius 0 $radiusSm $radiusSm 0
  transition background-color .12s ease, color .12s ease
  &:hover
    color $textColor
    background-color rgba(15, 23, 42, 0.035)
  &.active
    font-weight 600
    color $accentColor
    background-color rgba($accentColor, 0.09)
  .sidebar-group &
    padding-left 2rem
  .sidebar-sub-headers &
    padding-top 0.3rem
    padding-bottom 0.3rem
    &.active
      font-weight 500
</style>
