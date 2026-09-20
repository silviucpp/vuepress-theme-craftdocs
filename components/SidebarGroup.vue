<template>
  <div
    class="sidebar-group"
    :class="{ first, collapsable }"
  >
    <p
      v-if="item.title"
      class="sidebar-heading"
      :class="{ open }"
      @click="$emit('toggle')"
    >
      <span>{{ item.title }}</span>
      <span
        class="arrow"
        v-if="collapsable"
        :class="open ? 'down' : 'right'">
      </span>
    </p>

    <DropdownTransition>
      <ul
        ref="items"
        class="sidebar-group-items"
        v-if="open || !collapsable"
      >
        <li v-for="child in item.children">
          <SidebarLink :item="child"/>
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'
import DropdownTransition from './DropdownTransition.vue'

export default {
  name: 'SidebarGroup',
  props: ['item', 'first', 'open', 'collapsable'],
  components: { SidebarLink, DropdownTransition }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.sidebar-group
  &:not(.first)
    margin-top 1.4em
  .sidebar-group
    padding-left 0.5em
  &:not(.collapsable)
    .sidebar-heading
      cursor auto
      color inherit

.sidebar-heading
  color $mutedTextColor
  transition color .15s ease
  cursor pointer
  font-size 0.78em
  font-weight 700
  text-transform uppercase
  letter-spacing 0.06em
  padding 0 1.5rem
  margin-top 0
  margin-bottom 0.6rem
  &.open, &:hover
    color $textColor
  .arrow
    position relative
    top -0.12em
    left 0.5em
  &:.open .arrow
    top -0.18em

.sidebar-group-items
  transition height .1s ease-out
  overflow hidden
</style>
