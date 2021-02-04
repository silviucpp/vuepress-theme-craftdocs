<template>
  <div class="theme-container" :class="pageClasses">
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>

    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" slot="top"/>
      <slot name="sidebar-bottom" slot="bottom"/>
    </Sidebar>

    <div class="homepage">
      <div class="mainbox">
        <div class="err">404</div>
        <div class="msg">Maybe this page moved? Got deleted?  Never existed in the first place? <p>Let's go <a href="/">home</a> and try from there.</p></div>
      </div>
    </div>
  </div>
</template>

<script>

import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import { resolveSidebarItems } from '../util'

export default {
  components: {Sidebar, Navbar},

  data () {
    return {
      isSidebarOpen: false
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site

      if (themeConfig.navbar === false)
        return false

      return (this.$title || themeConfig.logo || themeConfig.repo || themeConfig.nav || this.$themeLocaleConfig.nav)
    },

     shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.layout &&
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$route,
        this.$site,
        this.$localePath
      )
    },

    pageClasses () {
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        }
      ]
    }
  },

methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },

  }

}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.homepage {
  position:absolute;
  top:0px;
  right:0px;
  bottom:0px;
  left:0px;
  background-color: $navbarBackgroundColor;
  min-height: 40rem;
}

.mainbox {
  color: #ffffff;
  height: 100%;
  width: 100%;
  position: relative;
}

.err {
  text-align: center;
  font-weight: 600;
  font-size: 11rem;
  color: $accentColor;
  position:absolute;
  top: 10rem;
  width: 100%;
}

.msg {
    text-align: center;
    font-size: 1.6rem;
    position:absolute;
    top: 30rem;
    left: 10%;
    width: 80%;
}
</style>
