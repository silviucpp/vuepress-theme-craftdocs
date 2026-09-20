<template>

  <div class="homepage">

    <section class="hero" :class="{ 'hero--wrap': data.wrapTitle }">
      <div class="hero-inner">
        <div class="eyebrow" v-if="data.hero && data.hero.eyebrow">
          <span class="pulse-dot"></span>{{data.hero.eyebrow}}
        </div>

        <h1 class="description" v-if="data.h1">
          {{(data.hero && data.hero.headline) || data.h1}}
          <span class="grad" v-if="data.hero && data.hero.headlineHighlight"> {{data.hero.headlineHighlight}}</span>
        </h1>

        <p class="hero-subtitle" v-if="data.hero && data.hero.subtitle">{{data.hero.subtitle}}</p>

        <p class="action" v-if="data.actionText && data.actionLink">
            <NavLink class="action-button btn-primary" :item="actionLink"/>
            <NavLink v-if="data.hero && data.hero.secondaryActionText && data.hero.secondaryActionLink"
                     class="action-button btn-ghost" :item="secondaryActionLink"/>
        </p>

        <div class="hero-features" v-if="data.hero && data.hero.features && data.hero.features.length">
          <div class="hero-feature" v-for="(item, index) in data.hero.features" :key="index">
            <div class="icon-badge" v-html="heroIcons[item.icon]"></div>
            <div class="ftitle">{{item.title}}</div>
            <div class="fdesc">{{item.details}}</div>
          </div>
        </div>
      </div>
    </section>

    <div class="trust-strip" v-if="data.hero && data.hero.trust && data.hero.trust.length">
      <div class="trust-row">
        <div class="trust-item" v-for="(item, index) in data.hero.trust" :key="index">
          <span class="trust-icon" v-html="heroIcons[item.icon]"></span>{{item.text}}
        </div>
      </div>
    </div>

    <div class="antifraud-strip" v-if="data.antifraud">
      <div class="antifraud-bg" aria-hidden="true"></div>
      <div class="content antifraud-inner">
        <div class="antifraud-copy">
          <div class="eyebrow" v-if="data.antifraud.eyebrow">
            <span class="eyebrow-icon" v-if="data.antifraud.eyebrowIcon" v-html="heroIcons[data.antifraud.eyebrowIcon]"></span>{{data.antifraud.eyebrow}}
          </div>

          <h2 v-if="data.antifraud.title">
            {{data.antifraud.title}}
            <span class="antifraud-subtitle" v-if="data.antifraud.subtitle">{{data.antifraud.subtitle}}</span>
          </h2>

          <p class="antifraud-description" v-if="data.antifraud.description">{{data.antifraud.description}}</p>

          <div class="antifraud-stats" v-if="data.antifraud.stats && data.antifraud.stats.length">
            <div class="antifraud-stat" v-for="(stat, index) in data.antifraud.stats" :key="index">
              <div class="stat-value">{{stat.value}}</div>
              <div class="stat-label">{{stat.label}}</div>
            </div>
          </div>

          <p class="action" v-if="data.antifraud.actionText && data.antifraud.actionLink">
            <NavLink class="action-button btn-primary" :item="antifraudActionLink"/>
          </p>
        </div>

        <div class="antifraud-pillars" v-if="data.antifraud.pillars && data.antifraud.pillars.length">
          <div class="antifraud-pillar" v-for="(pillar, index) in data.antifraud.pillars" :key="index">
            <div class="icon-badge" v-html="heroIcons[pillar.icon]"></div>
            <h3>{{pillar.title}}</h3>
            <ul>
              <li v-for="(pitem, i2) in pillar.items" :key="i2">
                <span class="check-icon" v-html="heroIcons['check']"></span><span>{{pitem}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="logos-strip" v-if="data.logos && data.logos.items && data.logos.items.length">
      <div class="content">
        <div class="logos-heading">
          <h2 v-if="data.logos.title">{{data.logos.title}}</h2>
          <p v-if="data.logos.subtitle">{{data.logos.subtitle}}</p>
        </div>
        <div class="logos-row">
          <div class="logos-cell" v-for="(item, index) in data.logos.items" :key="index">
            <img :src="$withBase(item.file)" :alt="item.name" loading="lazy"/>
          </div>
        </div>
        <p class="logos-closing" v-if="data.logos.closingText">{{data.logos.closingText}}</p>
      </div>
    </div>

    <!-- blog listing -->

    <div class="content blog-listing" v-if="data.articles && data.articles.length">
      <div class="tag-filters" v-if="allTags.length > 1">
        <button
          class="tag-chip"
          :class="{ active: activeTag === 'all' }"
          @click="activeTag = 'all'"
        >All <span class="count">({{ data.articles.length }})</span></button>
        <button
          class="tag-chip"
          v-for="tag in allTags"
          :key="tag"
          :class="{ active: activeTag === tag }"
          @click="activeTag = tag"
        >{{ tagLabel(tag) }} <span class="count">({{ tagCounts[tag] }})</span></button>
      </div>

      <div class="featured-article" v-if="featuredArticle && activeTag === 'all'">
        <router-link class="featured-media" :to="ensureExt(featuredArticle.url)" :class="'g' + 1">
          <span class="media-icon" v-html="cardIcon(featuredArticle)"></span>
        </router-link>
        <div class="featured-body">
          <span class="featured-badge">Latest</span>
          <p class="tags" v-if="(featuredArticle.tags && featuredArticle.tags.length) || featuredArticle.date">
            <span class="tag" v-for="tag in featuredArticle.tags" :key="tag">{{tag}}</span>
            <span class="tag date" v-if="featuredArticle.date" v-html="featuredArticle.date"></span>
          </p>
          <h2><Link :item="featuredArticle"/></h2>
          <p v-html="featuredArticle.details"></p>
        </div>
      </div>

      <div class="articles" v-if="gridArticles.length">
        <ArticleCard v-for="(item, index) in gridArticles" :key="item.url" :item="item" :variant="index"/>
      </div>
    </div>

    <div class="content post-shell" v-if="data.has_content">
      <div class="post-breadcrumb"><router-link to="/blog/">← Back to blog</router-link></div>

      <div class="post-meta" v-if="(data.tags && data.tags.length) || data.date || data.readingTime">
        <span class="tag" v-for="tag in data.tags" :key="tag">{{tag}}</span>
        <span class="meta-sep" v-if="data.tags && data.tags.length && (data.date || data.readingTime)">·</span>
        <span class="meta-plain" v-if="data.date">{{data.date}}</span>
        <span class="meta-sep" v-if="data.date && data.readingTime">·</span>
        <span class="meta-plain" v-if="data.readingTime">{{data.readingTime}}</span>
      </div>

      <div class="post-layout">
        <div class="post-main"><Content custom/></div>
        <aside class="post-toc" v-if="tocHeaders.length">
          <div class="post-toc-inner">
            <div class="toc-title">On this page</div>
            <a v-for="h in tocHeaders" :key="h.slug" :href="'#' + h.slug">{{h.title}}</a>
          </div>
        </aside>
      </div>

      <div class="related-posts" v-if="relatedArticles.length">
        <h3>Related guides</h3>
        <div class="articles">
          <ArticleCard v-for="(item, index) in relatedArticles" :key="item.url" :item="item" :variant="index"/>
        </div>
      </div>
    </div>

    <div class="content sdk-listing" v-if="data.sdkGroups && data.sdkGroups.length">
      <div class="platform-grid">
        <div class="platform-card" v-for="(group, gi) in data.sdkGroups" :key="gi">
          <div class="logo-band">
            <img :src="$withBase(group.logo)" :alt="group.name">
          </div>
          <div class="links">
            <div class="link-row" v-for="(link, li) in group.links" :key="li" :class="{ deprecated: link.badge === 'deprecated' }">
              <a :href="link.url" target="_blank" rel="noopener">{{ link.text }}</a>
              <span class="badge" :class="link.badge">{{ badgeLabel(link.badge) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rest-banner" v-if="data.restBanner">
        <div class="icon-tile">{{ data.restBanner.tag }}</div>
        <div class="copy">
          <h3>{{ data.restBanner.title }}</h3>
          <p>{{ data.restBanner.description }}</p>
        </div>
        <NavLink class="cta" :item="{ link: data.restBanner.actionLink, text: data.restBanner.actionText }"/>
      </div>

      <div class="disclaimer" v-if="data.disclaimer">
        <span class="i">i</span>
        <div><b>Disclaimer.</b> {{ data.disclaimer }}</div>
      </div>
    </div>

    <div class="footer-strip" v-if="data.footer">
      <div class="content footer-columns">
        <div class="footer-col" v-for="(col, idx) in footerColumns" :key="idx">
          <div class="footer-col-title">{{ col.title }}</div>
          <a v-for="(link, i2) in col.links" :key="i2" :href="link.url">{{ link.text }}</a>
        </div>
      </div>

      <div class="content footer-row">
        <div class="footer-tagline">{{ data.footer }}</div>
        <div class="footer-social" v-if="data.social && data.social.length">
          <span class="footer-social-label">You can find us on:</span>
          <a v-for="(item, index) in data.social" :key="index" :href="item.url" target="_blank" rel="noopener" :title="item.title" v-html="heroIcons[item.icon]"></a>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import NavLink from './NavLink.vue'
import ImageLink from './ImageLink.vue'
import Link from './Link.vue'
import ArticleCard, { iconForTags } from './ArticleCard.vue'
import { ensureExt } from '../util'
import { icons as heroIcons } from '../icons'

export default {
  components: { NavLink, ImageLink, Link, ArticleCard },

  data () {
    return { heroIcons, activeTag: 'all' }
  },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    },

    secondaryActionLink () {
      const hero = this.data.hero || {}
      return {
        link: hero.secondaryActionLink,
        text: hero.secondaryActionText
      }
    },

    antifraudActionLink () {
      const af = this.data.antifraud || {}
      return {
        link: af.actionLink,
        text: af.actionText
      }
    },

    // Footer nav columns are site content (which pages, what they're
    // called), so they live in the site's own src/.vuepress/config.js
    // (themeConfig.footerColumns) rather than in this shared theme.
    footerColumns () {
      return (this.$site.themeConfig && this.$site.themeConfig.footerColumns) || []
    },

    // --- Blog listing ---------------------------------------------------

    featuredArticle () {
      const arts = this.data.articles
      return arts && arts.length ? arts[0] : null
    },

    allTags () {
      const set = new Set()
      ;(this.data.articles || []).forEach(a => (a.tags || []).forEach(t => set.add(this.normTag(t))))
      return Array.from(set).sort()
    },

    tagCounts () {
      const counts = {}
      ;(this.data.articles || []).forEach(a => (a.tags || []).forEach(t => {
        const norm = this.normTag(t)
        counts[norm] = (counts[norm] || 0) + 1
      }))
      return counts
    },

    gridArticles () {
      const arts = this.data.articles || []
      if (this.activeTag === 'all') {
        return arts.slice(1)
      }
      return arts.filter(a => (a.tags || []).some(t => this.normTag(t) === this.activeTag))
    },

    // --- Blog post --------------------------------------------------------

    tocHeaders () {
      if (!this.data.has_content) return []
      return (this.$page.headers || []).filter(h => h.level === 2)
    },

    relatedArticles () {
      if (!this.data.has_content) return []
      const current = this.$page.path
      const myTags = (this.data.tags || []).map(t => this.normTag(t))
      const posts = (this.$site.pages || []).filter(p =>
        p.path !== current &&
        p.frontmatter &&
        p.frontmatter.has_content &&
        p.path && p.path.indexOf('/blog/') === 0
      )
      const scored = posts.map(p => {
        const tags = (p.frontmatter.tags || []).map(t => this.normTag(t))
        const shared = myTags.length ? tags.filter(t => myTags.includes(t)).length : 0
        return { p, shared }
      })
      scored.sort((a, b) => b.shared - a.shared)
      return scored.slice(0, 3).map(s => ({
        title: s.p.frontmatter.title || s.p.title,
        details: s.p.frontmatter.description || '',
        url: s.p.path,
        tags: s.p.frontmatter.tags || [],
        date: s.p.frontmatter.date
      }))
    }
  },

  methods: {
    ensureExt,

    normTag (tag) {
      return String(tag).trim().toLowerCase().replace(/\s+/g, '-')
    },

    tagLabel (norm) {
      const labels = (this.$site.themeConfig && this.$site.themeConfig.tagLabels) || {}
      if (labels[norm]) return labels[norm]
      return norm.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    },

    cardIcon (item) {
      return iconForTags(item && item.tags, this.$site.themeConfig)
    },

    badgeLabel (badge) {
      const labels = (this.$site.themeConfig && this.$site.themeConfig.badgeLabels) || {}
      return labels[badge] || badge
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.homepage
  .content > h1
    font-size 1.85rem
    margin 0 0 2.5rem
    border-bottom none
    padding-bottom 0

  .action-button
    display inline-block
    font-size 1.05rem
    font-weight 600
    padding 0.9rem 1.9rem
    border-radius 999px
    transition background-color .15s ease, transform .15s ease, box-shadow .15s ease, border-color .15s ease
    box-sizing border-box

    &.btn-primary
      color #fff
      background-color $accentColor
      box-shadow 0 12px 28px rgba(75, 175, 18, 0.35)
      &:hover
        background-color lighten($accentColor, 8%)
        transform translateY(-1px)

    &.btn-ghost
      color #fff
      background rgba(255, 255, 255, 0.06)
      border 1.5px solid rgba(255, 255, 255, 0.28)
      &:hover
        background rgba(255, 255, 255, 0.12)
        transform translateY(-1px)

  .hero
    position relative
    padding ($navbarHeight + 4.5rem) 1.5rem 4.5rem
    background #010029
    text-align center
    overflow hidden

    .hero-inner
      position relative
      z-index 1
      max-width 62rem
      margin 0 auto

    .eyebrow
      display inline-flex
      align-items center
      gap 0.55rem
      background rgba(255, 255, 255, 0.08)
      border 1px solid rgba(255, 255, 255, 0.14)
      color #c9d3ff
      font-size 0.8rem
      font-weight 600
      padding 0.4rem 0.95rem
      border-radius 999px
      margin 0 auto 1.4rem

      .pulse-dot
        width 7px
        height 7px
        border-radius 999px
        background #6fe04b
        animation hero-pulse 2s ease-in-out infinite

    .description, .action
      margin 1.8rem auto

    .description
      max-width 60rem
      font-size clamp(1.7rem, 2.9vw, 2.5rem)
      font-weight 700
      letter-spacing -0.02em
      line-height 1.2
      color #fff

      .grad
        background linear-gradient(90deg, #7be04a, #4fb1ff)
        -webkit-background-clip text
        background-clip text
        color transparent

    &:not(.hero--wrap) .description
      white-space nowrap

    &.hero--wrap .description
      // Long, sentence-length blog-post titles: wrap instead of clipping,
      // and don't stretch them as large as the short marketing headline.
      font-size clamp(1.5rem, 2.4vw, 2.1rem)

    .hero-subtitle
      max-width 44rem
      margin 0 auto
      color #c3c9e0
      font-size 1.1rem
      line-height 1.65

    .action
      display flex
      align-items center
      justify-content center
      flex-wrap wrap
      gap 1rem

    .hero-features
      display grid
      grid-template-columns repeat(4, 1fr)
      gap 1.25rem
      margin 2.5rem auto 0
      max-width 52rem

    .hero-feature
      display flex
      flex-direction column
      align-items center
      gap 0.7rem
      text-align center
      padding 1.3rem 0.7rem
      border-radius $radiusLg
      transition background-color .2s ease

      &:hover
        background rgba(255, 255, 255, 0.05)

      .icon-badge
        width 3.4rem
        height 3.4rem
        border-radius $radius
        background rgba(255, 255, 255, 0.1)
        display flex
        align-items center
        justify-content center
        color #93e07a

        svg
          width 1.7rem
          height 1.7rem

      .ftitle
        color #fff
        font-weight 700
        font-size 1rem

      .fdesc
        color #9aa3c4
        font-size 0.82rem
        line-height 1.45

  .trust-strip
    background $headerBackgroundColor
    padding 0 1.5rem 3rem

    .trust-row
      max-width 1200px
      margin 0 auto
      display flex
      flex-wrap wrap
      justify-content center
      gap 2.25rem

    .trust-item
      display flex
      align-items center
      gap 0.55rem
      color #dbe1ff
      font-size 0.92rem
      font-weight 600

      .trust-icon
        display inline-flex
        color #7be04a
        svg
          width 1.1rem
          height 1.1rem

  .antifraud-strip
    position relative
    overflow hidden
    padding 5.5rem 1.5rem
    background linear-gradient(135deg, #0a1220 0%, #12233f 45%, #0e3a42 100%)

    .antifraud-bg
      position absolute
      inset 0
      pointer-events none
      background-image radial-gradient(ellipse 700px 550px at 88% 10%, rgba(56, 189, 248, 0.16), transparent 62%), radial-gradient(ellipse 650px 550px at 8% 95%, rgba(75, 175, 18, 0.14), transparent 62%)

    .antifraud-inner
      position relative
      z-index 1
      max-width 1200px

    .antifraud-copy
      max-width 46rem
      margin 0 auto
      text-align center

      .eyebrow
        display inline-flex
        align-items center
        gap 0.5rem
        background rgba(255, 255, 255, 0.08)
        border 1px solid rgba(94, 234, 212, 0.28)
        color #7dd8c9
        font-size 0.8rem
        font-weight 600
        padding 0.4rem 0.95rem
        border-radius 999px
        margin 0 0 1.4rem

        .eyebrow-icon
          display inline-flex
          svg
            width 1rem
            height 1rem

      h2
        color #fff
        font-size 2.25rem
        font-weight 800
        letter-spacing -0.01em
        line-height 1.25
        border-bottom none
        padding-bottom 0
        margin 0 0 1rem

        .antifraud-subtitle
          display block
          font-size 1.1rem
          font-weight 600
          color #6ee0c9
          margin-top 0.5rem

      .antifraud-description
        max-width 42rem
        margin 0 auto 2.25rem
        color #c3d3e6
        font-size 1.05rem
        line-height 1.7

      .antifraud-stats
        display flex
        flex-wrap wrap
        justify-content center
        gap 2.5rem
        margin 0 0 2.25rem

      .antifraud-stat
        .stat-value
          color #fff
          font-size 1.2rem
          font-weight 800
        .stat-label
          color #93a9c2
          font-size 0.72rem
          font-weight 600
          text-transform uppercase
          letter-spacing 0.03em
          margin-top 0.2rem

      .action
        display flex
        justify-content center
        margin 0

    .antifraud-pillars
      display grid
      grid-template-columns repeat(3, 1fr)
      gap 1.5rem
      margin 3.5rem auto 0
      max-width 1200px

    .antifraud-pillar
      background rgba(255, 255, 255, 0.06)
      border 1px solid rgba(255, 255, 255, 0.12)
      border-radius $radiusLg
      padding 2rem 1.75rem
      text-align left
      transition background-color .2s ease, transform .2s ease

      &:hover
        background rgba(255, 255, 255, 0.09)
        transform translateY(-3px)

      .icon-badge
        width 3rem
        height 3rem
        border-radius $radius
        background linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(75, 175, 18, 0.35))
        display flex
        align-items center
        justify-content center
        color #fff
        margin 0 0 1.25rem

        svg
          width 1.4rem
          height 1.4rem

      h3
        color #fff
        font-size 1.1rem
        font-weight 700
        border-bottom none
        padding-bottom 0
        margin 0 0 1rem

      ul
        list-style none
        padding 0
        margin 0
        display flex
        flex-direction column
        gap 0.65rem

      li
        display flex
        align-items flex-start
        gap 0.55rem
        color #c3d3e6
        font-size 0.88rem
        line-height 1.55

        .check-icon
          flex-shrink 0
          margin-top 0.15rem
          color #6ee0c9
          display inline-flex
          svg
            width 1rem
            height 1rem

  .logos-strip
    background $headerBackgroundColor
    padding 6rem 1.5rem 6rem
    text-align center

    .logos-heading
      max-width 46rem
      margin 0 auto 4rem

      h2
        color #fff
        font-size 2.25rem
        font-weight 800
        letter-spacing -0.01em
        border-bottom none
        padding-bottom 0
        margin 0 0 1rem

      p
        color #c3c9e0
        font-size 1.05rem
        line-height 1.65
        margin 0

    .logos-row
      display flex
      flex-wrap nowrap
      align-items center
      justify-content center
      gap 1.5rem
      max-width 1200px
      margin 0 auto

    .logos-cell
      display flex
      align-items center
      justify-content center
      transition transform .25s ease

      &:hover
        transform scale(1.08)

      img
        display block
        height 95px
        width auto
        flex-shrink 0
        object-fit contain
        opacity 0.85
        transition opacity .2s ease

      &:hover img
        opacity 1

    .logos-closing
      max-width 42rem
      margin 4rem auto 0
      color #c3c9e0
      font-size 1.05rem
      line-height 1.65

  .footer-strip
    background $headerBackgroundColor
    border-top 1px solid rgba(255, 255, 255, 0.08)
    padding 4rem 1.5rem 2rem

    .footer-columns
      display grid
      grid-template-columns repeat(5, 1fr)
      gap 2rem
      padding-bottom 2.5rem
      margin-bottom 2rem
      border-bottom 1px solid rgba(255, 255, 255, 0.08)

    .footer-col
      display flex
      flex-direction column
      gap 0.7rem

      .footer-col-title
        color #fff
        font-size 0.72rem
        font-weight 700
        text-transform uppercase
        letter-spacing 0.05em
        margin-bottom 0.3rem

      a
        color #8b95c9
        font-size 0.88rem
        transition color .15s ease
        &:hover
          color #fff

    .footer-row
      display flex
      align-items center
      justify-content space-between
      flex-wrap wrap
      gap 1rem

    .footer-tagline
      color #8b95c9
      font-size 0.9rem
      letter-spacing 0.02em

    .footer-social
      display flex
      align-items center
      gap 1rem

      .footer-social-label
        color #8b95c9
        font-size 0.9rem

      a
        color #8b95c9
        display inline-flex
        transition color .15s ease
        &:hover
          color #fff

        svg
          width 1.1rem
          height 1.1rem

  .content
      max-width 1200px
      margin 0rem auto
      padding 0 1.5rem
      box-sizing border-box

      .articles
        margin 0 auto
        display grid
        grid-template-columns repeat(3, 1fr)
        gap 1.5rem
        align-items stretch

      .article
        background #fff
        border 1px solid $borderColor
        border-radius $radiusLg
        overflow hidden
        box-shadow $shadowSm
        transition box-shadow .18s ease, transform .18s ease
        display flex
        flex-direction column
        &:hover
          box-shadow $shadowMd
          transform translateY(-3px)

        .article-header
          display flex
          align-items center
          gap 0.85rem
          padding 1.5rem 1.5rem 0

        .article-icon
          flex none
          display flex
          align-items center
          justify-content center
          width 2.4rem
          height 2.4rem
          border-radius $radius
          background rgba(75, 175, 18, 0.12)
          color #3a8f0f

          svg
            width 1.2rem
            height 1.2rem

          &.g2
            background rgba(47, 111, 237, 0.12)
            color #2f6fed
          &.g3
            background rgba(217, 119, 6, 0.14)
            color #c2650c

        .article-body
          padding 0.85rem 1.5rem 1.5rem
          text-align left
          flex 1
          display flex
          flex-direction column

        .tags
          margin 0 0 0.75rem
          display flex
          flex-wrap wrap
          gap 0.4rem

          .tag
            background-color $blockColor
            color $mutedTextColor
            padding 0.25rem 0.6rem
            border-radius 999px
            font-size 0.72rem
            font-weight 600
            letter-spacing 0.02em

          .date
            background-color transparent
            color $mutedTextColor
            font-weight 500
            padding 0.25rem 0

        h2
          text-align left
          font-size 1.05rem
          font-weight 700
          line-height 1.35
          border-bottom none
          padding-bottom 0
          margin 0
          min-width 0
          color $textColor
          a
            color inherit
        p
          font-size 0.9rem
          text-align left
          color $mutedTextColor
          margin 0

  .blog-listing
    padding-top 3.5rem
    padding-bottom 4rem

  .tag-filters
    display flex
    flex-wrap wrap
    gap 0.6rem
    margin 0 0 2.25rem

    .tag-chip
      font inherit
      cursor pointer
      background #fff
      border 1px solid $borderColor
      color $mutedTextColor
      padding 0.45rem 1rem
      border-radius 999px
      font-size 0.85rem
      font-weight 600
      transition background-color .15s ease, color .15s ease, border-color .15s ease

      &:hover
        border-color $accentColor
        color $textColor

      &.active
        background $accentColor
        border-color $accentColor
        color #fff

        .count
          color rgba(255, 255, 255, 0.85)

      .count
        color $mutedTextColor
        opacity 0.7
        font-weight 500
        font-size 0.78rem
        margin-left 0.1rem

  .featured-article
    display grid
    grid-template-columns 1.1fr 1fr
    gap 0
    background #fff
    border 1px solid $borderColor
    border-radius $radiusLg
    overflow hidden
    box-shadow $shadowSm
    margin 0 0 2.5rem

    .featured-media
      display flex
      align-items center
      justify-content center
      min-height 16rem
      background $blockColor

      .media-icon
        display flex
        align-items center
        justify-content center
        width 4.5rem
        height 4.5rem
        border-radius $radiusLg
        background rgba(75, 175, 18, 0.12)
        color #3a8f0f

        svg
          width 2.2rem
          height 2.2rem

    .featured-body
      padding 2.5rem
      display flex
      flex-direction column
      justify-content center

      .featured-badge
        display inline-block
        align-self flex-start
        background rgba(75, 175, 18, 0.12)
        color darken($accentColor, 6%)
        font-size 0.72rem
        font-weight 700
        text-transform uppercase
        letter-spacing 0.04em
        padding 0.3rem 0.7rem
        border-radius 999px
        margin 0 0 1rem

      .tags
        margin 0 0 0.9rem
        display flex
        flex-wrap wrap
        gap 0.4rem

        .tag
          background-color $blockColor
          color $mutedTextColor
          padding 0.25rem 0.6rem
          border-radius 999px
          font-size 0.72rem
          font-weight 600

        .date
          background-color transparent
          color $mutedTextColor
          font-weight 500
          padding 0.25rem 0

      h2
        font-size 1.5rem
        font-weight 800
        border-bottom none
        padding-bottom 0
        margin 0 0 0.75rem
        color $textColor
        a
          color inherit

      p
        font-size 0.98rem
        color $mutedTextColor
        line-height 1.6
        margin 0

  .post-shell
    padding-top 3.5rem
    padding-bottom 4rem

    .post-breadcrumb
      margin 0 0 1.5rem

      a
        color $mutedTextColor
        font-size 0.9rem
        font-weight 600
        &:hover
          color $accentColor

    .post-meta
      display flex
      flex-wrap wrap
      align-items center
      gap 0.5rem
      margin 0 0 2rem
      color $mutedTextColor
      font-size 0.85rem

      .tag
        background-color $blockColor
        color $mutedTextColor
        padding 0.25rem 0.6rem
        border-radius 999px
        font-size 0.72rem
        font-weight 600

      .meta-sep
        color $borderColor

      .meta-plain
        font-weight 500

    .post-layout
      display grid
      grid-template-columns minmax(0, 1fr) 15rem
      gap 3.5rem
      align-items start

    .post-main
      min-width 0

      img
        border-radius $radius
        box-shadow $shadowMd

    .post-toc
      position sticky
      top ($navbarHeight + 2rem)

      .toc-title
        font-size 0.75rem
        font-weight 700
        text-transform uppercase
        letter-spacing 0.05em
        color $mutedTextColor
        margin 0 0 0.9rem

      a
        display block
        color $mutedTextColor
        font-size 0.88rem
        line-height 1.6
        padding 0.3rem 0 0.3rem 0.9rem
        border-left 2px solid $borderColor
        margin-bottom 0.1rem
        transition color .15s ease, border-color .15s ease

        &:hover
          color $textColor
          border-left-color $accentColor

  .related-posts
    margin 4rem 0 0

    h3
      font-size 1.3rem
      font-weight 800
      border-bottom none
      padding-bottom 0
      margin 0 0 1.5rem

  .sdk-listing
    padding-top 3.5rem
    padding-bottom 4rem

    .platform-grid
      display grid
      grid-template-columns repeat(3, 1fr)
      gap 1.25rem

    .platform-card
      background #fff
      border 1px solid $borderColor
      border-radius $radiusLg
      box-shadow $shadowSm
      overflow hidden
      display flex
      flex-direction column
      transition box-shadow .18s ease, transform .18s ease
      &:hover
        box-shadow $shadowMd
        transform translateY(-3px)

      .logo-band
        background $blockColor
        padding 1.7rem 1.5rem
        display flex
        align-items center
        justify-content center
        border-bottom 1px solid $borderColor

        img
          height 34px
          width auto
          display block

      .links
        padding 1.1rem 1.4rem 1.3rem
        display flex
        flex-direction column
        gap 0.7rem
        flex 1

      .link-row
        display flex
        align-items center
        justify-content space-between
        gap 0.6rem

        a
          color $textColor
          font-weight 600
          font-size 0.88rem
          &:hover
            color $accentColor

        &.deprecated a
          color $mutedTextColor
          font-weight 500

      .badge
        flex none
        font-size 0.66rem
        font-weight 700
        padding 0.18rem 0.55rem
        border-radius 999px
        letter-spacing 0.02em
        white-space nowrap

        &.recommended, &.official
          background rgba(75, 175, 18, 0.14)
          color darken($accentColor, 10%)

        &.deprecated
          background $blockColor
          color $mutedTextColor

        &.community
          background rgba(47, 111, 237, 0.12)
          color #2f6fed

    .rest-banner
      margin 1.75rem 0 0
      background linear-gradient(135deg, #eafaf0, #eef4ff)
      border 1px solid #d6ead9
      border-radius $radiusLg
      padding 1.5rem 1.75rem
      display flex
      align-items center
      gap 1.1rem
      flex-wrap wrap

      .icon-tile
        flex none
        width 2.9rem
        height 2.9rem
        border-radius $radius
        background #fff
        display flex
        align-items center
        justify-content center
        box-shadow $shadowSm
        color $accentColor
        font-weight 800
        font-size 0.78rem

      .copy
        flex 1
        min-width 12rem

        h3
          margin 0 0 0.25rem
          font-size 1rem
          border-bottom none
          padding-bottom 0
          color $textColor

        p
          margin 0
          font-size 0.86rem
          color $mutedTextColor

      .cta
        margin-left auto
        flex none
        background $navbarBackgroundColor
        color #fff
        font-size 0.82rem
        font-weight 700
        padding 0.55rem 1.1rem
        border-radius 999px
        text-decoration none
        white-space nowrap
        &:hover
          text-decoration none
          opacity 0.9

    .disclaimer
      margin 1.5rem 0 0
      background $blockColor
      border-radius $radius
      padding 1rem 1.25rem
      display flex
      gap 0.8rem
      font-size 0.84rem
      color $mutedTextColor
      line-height 1.55

      .i
        flex none
        width 1.3rem
        height 1.3rem
        border-radius 999px
        background darken($blockColor, 8%)
        color $mutedTextColor
        display flex
        align-items center
        justify-content center
        font-size 0.72rem
        font-weight 700
        margin-top 0.1rem

      b
        color $textColor

@media (max-width: $MQNarrow)
  .homepage
    .antifraud-strip
      .antifraud-pillars
        grid-template-columns repeat(2, 1fr)
    .logos-strip
      .logos-row
        flex-wrap wrap
        gap 2.5rem 3rem
      .logos-cell img
        height 120px
    .content
      .articles
        grid-template-columns repeat(2, 1fr)
    .featured-article
      grid-template-columns 1fr
      .featured-media
        min-height 12rem
    .post-shell
      .post-layout
        grid-template-columns 1fr
      .post-toc
        display none
    .footer-strip
      .footer-columns
        grid-template-columns repeat(3, 1fr)
        gap 2rem 1.5rem
    .sdk-listing
      .platform-grid
        grid-template-columns repeat(2, 1fr)

@media (max-width: $MQMobile)
  .homepage
    .hero
      padding ($navbarHeight + 3rem) 1.25rem 3rem
      .description
        white-space normal
      .hero-features
        grid-template-columns repeat(2, 1fr)
    .trust-strip
      .trust-row
        gap 1.25rem 2rem
    .antifraud-strip
      padding 3.5rem 1.25rem
      .antifraud-copy h2
        font-size 1.7rem
      .antifraud-stats
        gap 1.5rem
      .antifraud-pillars
        grid-template-columns 1fr
        margin-top 2.5rem
    .logos-strip
      padding 3.5rem 1.25rem 3.5rem
      .logos-heading h2
        font-size 1.7rem
      .logos-row
        flex-wrap wrap
        gap 1.75rem 2rem
      .logos-cell img
        height 82px
    .footer-strip
      padding-top 3rem
      .footer-columns
        grid-template-columns repeat(2, 1fr)
        gap 2rem 1.25rem
      .footer-row
        flex-direction column
        text-align center
    .content
      .articles
        grid-template-columns 1fr
    .sdk-listing
      .platform-grid
        grid-template-columns 1fr
      .rest-banner
        .cta
          margin-left 0

@media (max-width: $MQMobileNarrow)
  .homepage
    .action-button
      font-size 1rem
      padding 0.7rem 1.4rem
    .hero
      .description, .action
        margin 1.2rem auto
      .description
        font-size 1.6rem
      .hero-features
        grid-template-columns 1fr 1fr
        gap 0.75rem

@keyframes hero-pulse
  0%, 100%
    opacity 0.45
    transform scale(1)
  50%
    opacity 1
    transform scale(1.8)

@media (prefers-reduced-motion: reduce)
  .homepage
    .eyebrow .pulse-dot
      animation none
</style>
