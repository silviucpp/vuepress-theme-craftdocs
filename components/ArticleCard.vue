<template>
  <div class="article">
    <div class="article-header">
      <span class="article-icon" :class="'g' + gradientIndex" v-html="iconSvg"></span>
      <h2><Link :item="item"/></h2>
    </div>

    <div class="article-body">
      <p class="tags" v-if="(item.tags && item.tags.length) || item.date">
        <span class="tag" v-for="tag in item.tags" :key="tag">{{ tagLabel(tag) }}</span>
        <span class="tag date" v-if="item.date" v-html="item.date"></span>
      </p>
      <p v-html="item.details"></p>
    </div>
  </div>
</template>

<script>
import Link from './Link.vue'
import { icons as defaultIcons } from '../icons'

const DEFAULT_ICON_NAME = 'globe'

// Which icon a tag gets, and the icon shapes themselves, are both supplied
// by the consuming site (src/.vuepress/config.js: themeConfig.tagIcons /
// themeConfig.tagDefaultIcon / themeConfig.icons) — this component ships no
// site-specific tag taxonomy of its own, only a generic fallback.
//
// Shared with Home.vue's featured-post card so it gets the same tag-based
// icon as the grid cards below it.
export function iconForTags (tags, themeConfig) {
  const cfg = themeConfig || {}
  const iconLib = cfg.icons || defaultIcons
  const tagIcons = cfg.tagIcons || {}
  const defaultIconName = cfg.tagDefaultIcon || DEFAULT_ICON_NAME
  const norm = (tags || []).map(t => String(t).toLowerCase())
  const matchedTag = norm.find(t => tagIcons[t])
  const iconName = matchedTag ? tagIcons[matchedTag] : defaultIconName
  return iconLib[iconName] || defaultIcons[defaultIconName] || defaultIcons[DEFAULT_ICON_NAME]
}

// Normalizes a raw frontmatter tag (which may have any casing/spacing) to
// the lowercase, hyphenated key themeConfig.tagLabels/tagIcons are keyed by.
export function normTag (tag) {
  return String(tag).trim().toLowerCase().replace(/\s+/g, '-')
}

// The display label for a tag everywhere it's shown (filter chips, card
// badges, post meta): themeConfig.tagLabels wins when the site has set one
// (e.g. "HLR"), otherwise each hyphen-separated word gets its first letter
// capitalized as a reasonable default. One function so every tag badge on
// the site agrees on casing instead of some showing the raw frontmatter
// string -- see Home.vue's own tagLabel/normTag methods, which delegate here.
export function tagLabel (tag, themeConfig) {
  const labels = (themeConfig && themeConfig.tagLabels) || {}
  const norm = normTag(tag)
  if (labels[norm]) return labels[norm]
  return norm.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default {
  components: { Link },

  props: {
    item: { type: Object, required: true },
    // Cycles the gradient tile through 3 variants so cards read as a set
    // rather than all-identical; independent of the tag-based icon choice.
    variant: { type: Number, default: 0 }
  },

  computed: {
    gradientIndex () {
      return (this.variant % 3) + 1
    },

    iconSvg () {
      return iconForTags(this.item.tags, this.$site.themeConfig)
    }
  },

  methods: {
    tagLabel (tag) {
      return tagLabel(tag, this.$site.themeConfig)
    }
  }
}
</script>
