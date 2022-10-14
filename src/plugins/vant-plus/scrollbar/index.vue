<template>
  <div :style="{ maxHeight: maxHeight }" :class="classname" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Scrollbar',
  data() {
    return {
      classname: 'scrollbar',
      maxHeight: '100vh'
    }
  },
  mounted() {
    this.setMaxHeight()
    window.addEventListener('resize', this.setMaxHeight)
    this.$once('hook:beforeDestory', () => {
      window.removeEventListener('resize', this.setMaxHeight)
    })
  },
  methods: {
    setMaxHeight() {
      const domRect = this.$el.getBoundingClientRect()
      this.maxHeight = domRect.top > 0 ? `${Math.ceil(window.innerHeight - domRect.top)}px` : '100vh'
    }
  }
}
</script>

<style scoped>
.scrollbar {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
