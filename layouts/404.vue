<template>
  <div class="theme-container" :class="pageClasses">
    <Navbar v-if="shouldShowNavbar" />
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

export default {
  components: {Navbar},

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site

      if (themeConfig.navbar === false)
        return false

      return (this.$title || themeConfig.logo || themeConfig.repo || themeConfig.nav || this.$themeLocaleConfig.nav)
    },

    pageClasses () {
      return [
        {
          'no-navbar': !this.shouldShowNavbar
        }
      ]
    }
  },
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

