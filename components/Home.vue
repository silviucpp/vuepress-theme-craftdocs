<template>

<div class="homepage">

  <div class="header">

      <h1 class="description">{{$description || '' }}</h1>

      <p class="action" v-if="data.actionText && data.actionLink">
          <NavLink class="action-button" :item="actionLink"/>
      </p>
  </div>

  <div class="content">

    <div class="features" v-if="data.features && data.features.length">

      <div class="feature" v-for="(feature, index) in data.features" :key="index">
        <img v-if="feature.icon" :src="$withBase(feature.icon)" :alt="feature.title">
        <h2> <a :href="feature.url"> {{ feature.title }} </a></h2>
        <p v-html="feature.details"></p>
      </div>
    </div>

    <Content custom/>

    <div class="footer" v-if="data.footer" > {{ data.footer }} </div>
  </div>
</div>

</template>

<script>
import NavLink from './NavLink.vue'

export default {
  components: { NavLink },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.homepage
  .header
    padding $navbarHeight 1rem 1rem
    background-color #010029
    text-align center
    .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.8rem
      font-weight 600
      line-height 1.3
      color white
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)

.homepage
  .content
    max-width 960px
    margin 0rem auto
  
    .features
      border-bottom 1px solid $borderColor
      padding 1.2rem 0
      margin-top 1.5rem
      display flex
      flex-wrap wrap
      align-content stretch
      justify-content space-between
    .feature
      flex-grow 1
      flex-basis 30%
      max-width 30%
      img 
        display block
        margin-left auto
        margin-right auto
        width 30%
      h2
        text-align center
        font-size 1.4rem
        font-weight 500
        border-bottom none
        padding-bottom 0
        color lighten($textColor, 10%)
      p
        text-align center
        color lighten($textColor, 25%)
    .footer
      padding 1.5rem
      border-top 1px solid $borderColor
      text-align center
      color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .homepage
    .content
      .features
        flex-direction column
      .feature
        max-width 100%
        padding 0 1.5rem

@media (max-width: $MQMobileNarrow)
  .homepage
    .header
      .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
  .content
    padding-left 1.5rem
    padding-right 1.5rem
    .feature
      h2
        font-size 1.25rem
</style>
