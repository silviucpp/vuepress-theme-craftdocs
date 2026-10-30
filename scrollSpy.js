// The heading that is "current" while the page scrolls: the last one whose top
// reached the position where the browser puts a heading when it is jumped to
// (its scroll-margin-top). Using the same position for jumps and for scrolling
// means that a heading that was just jumped to is also the current one.
// A heading the reader clicked in the table of contents stays current until the
// reader scrolls: near the end of the page the jump can not put it at the top,
// and the position it lands on would be read as another heading.
let locked = null
let listening = false

export function lockHeading (slug) {
  locked = slug
  if (!listening && typeof window !== 'undefined') {
    listening = true
    const release = () => { locked = null }
    ;['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(name => {
      window.addEventListener(name, release, { passive: true })
    })
  }
}

export function activeHeading (slugs) {
  if (locked && slugs.indexOf(locked) !== -1) {
    return locked
  }
  // The last headings of a page can never reach the top: the page stops
  // scrolling first. In the last screen of the page the reading line is moved
  // down gradually, so that they become current one after the other, and the
  // last one is current when the bottom is reached.
  const viewport = window.innerHeight
  const root = document.documentElement
  const remaining = root.scrollHeight - (window.pageYOffset + viewport)
  const progress = remaining < viewport ? 1 - Math.max(remaining, 0) / viewport : 0

  let current = null
  for (const slug of slugs) {
    const el = document.getElementById(slug)
    if (!el) continue
    const margin = (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) + 20
    const line = margin + (viewport - margin) * progress
    if (el.getBoundingClientRect().top <= line) {
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
