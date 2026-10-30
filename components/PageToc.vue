<template>
  <nav class="page-toc" v-if="items.length">
    <p class="page-toc-title">On this page</p>
    <ul>
      <li v-for="item in items" :key="item.slug" :class="['level-' + item.level, { active: active === item.slug }]">
        <a :href="'#' + item.slug" @click.prevent="go(item.slug)">{{ item.title }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { activeHeading, setHash } from '../scrollSpy'

export default {
  data () {
    return { active: null }
  },

  computed: {
    // h2 and h3 of the page, in order
    items () {
      return (this.$page.headers || []).filter(h => h.level === 2 || h.level === 3)
    }
  },

  watch: {
    '$route.path' () {
      this.$nextTick(this.onScroll)
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.$nextTick(this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    go (slug) {
      const el = document.getElementById(slug)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setHash(this, slug)
      this.active = slug
    },

    onScroll () {
      this.active = activeHeading(this.items.map(i => i.slug)) || (this.items.length ? this.items[0].slug : null)
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl';

.page-toc {
  display: none;
}

@media (min-width: $MQNarrow + 1) {
  $splitCodeFrac = 0.42

  .theme-container.split.has-toc {
    // light panel instead of the dark code panel
    .page:after {
      background: $sidebarColor;
      border-left: 1px solid $borderColor;
    }

    .page-toc {
      display: block;
      position: fixed;
      z-index: 1;
      top: ($navbarHeight + 1.5rem);
      right: 0;
      bottom: 0;
      width: 'calc(42% - %s)' % ($sidebarWidth * $splitCodeFrac);
      padding: 0 1.5rem 2rem 3.5rem;
      overflow-y: auto;
      box-sizing: border-box;

      .page-toc-title {
        margin: 0 0 0.75rem;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: $mutedTextColor;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        border-left: 1px solid $borderColor;
      }

      li {
        margin: 0;
        padding: 0;
        line-height: 1.4;

        a {
          display: block;
          margin-left: -1px;
          padding: 0.3rem 0.9rem;
          border-left: 2px solid transparent;
          font-size: 0.9rem;
          color: $mutedTextColor;

          &:hover {
            color: $textColor;
          }
        }

        &.level-3 a {
          padding-left: 1.8rem;
          font-size: 0.85rem;
        }

        &.active > a {
          border-left-color: $accentColor;
          color: $textColor;
          font-weight: 500;
        }
      }
    }

    &.has-product-nav .page-toc {
      top: ($navbarHeight + $productNavHeight + 1.5rem);
    }
  }
}
</style>
