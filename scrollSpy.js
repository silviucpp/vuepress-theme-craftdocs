// The heading that is "current" while the page scrolls: the last one whose top
// reached the position where the browser puts a heading when it is jumped to
// (its scroll-margin-top). Using the same position for jumps and for scrolling
// means that a heading that was just jumped to is also the current one.
export function activeHeading (slugs) {
  let current = null
  for (const slug of slugs) {
    const el = document.getElementById(slug)
    if (!el) continue
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    if (el.getBoundingClientRect().top <= margin + 20) {
      current = slug
    } else {
      break
    }
  }
  return current
}

// Puts the heading in the URL without scrolling the page.
export function setHash (vm, slug) {
  const hash = '#' + slug
  if (decodeURIComponent(vm.$route.hash) === hash) {
    return
  }
  const done = () => vm.$vuepress.$set('disableScrollBehavior', false)
  vm.$vuepress.$set('disableScrollBehavior', true)
  vm.$router.replace(hash, () => vm.$nextTick(done), done)
}
