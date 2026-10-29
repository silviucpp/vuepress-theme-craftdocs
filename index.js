module.exports = (options, ctx) => {
  return {
    // Sidebar groups declared inline in the page: a `::: group Title` line
    // (see markup.js) applies to the first "## heading" that follows it.
    // These are merged into the same slug -> title map that util.js
    // resolveHeaders reads from the `sidebarGroups` frontmatter, which keeps
    // working and wins on conflict.
    extendPageData ($page) {
      const src = $page._strippedContent || $page._content || ''
      if (src.indexOf('::: group') === -1) {
        return
      }
      const clean = t => t.replace(/[`*_]/g, '').trim()
      const byTitle = {}
      ;($page.headers || []).forEach(h => {
        if (h.level === 2) byTitle[clean(h.title)] = h.slug
      })

      const groups = {}
      let firstTitle = null
      let pending = null
      let inFence = false
      src.split(/\r?\n/).forEach(line => {
        if (/^\s*(```|~~~)/.test(line)) {
          inFence = !inFence
          return
        }
        if (inFence) return
        let m = /^:::[ \t]+group[ \t]+(.+?)[ \t]*$/.exec(line)
        if (m) {
          pending = m[1]
          if (firstTitle === null) firstTitle = m[1]
          return
        }
        m = /^##[ \t]+(.+?)[ \t#]*$/.exec(line)
        if (m && pending !== null) {
          const slug = byTitle[clean(m[1])]
          if (slug) groups[slug] = pending
          pending = null
        }
      })

      $page.frontmatter = Object.assign({}, $page.frontmatter, {
        sidebarGroups: Object.assign({}, groups, $page.frontmatter.sidebarGroups || {}),
        sidebarGroupTitle: firstTitle
      })
    }
  }
}
