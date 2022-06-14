<template>
  <div class="wrapper">详情页 {{ id }}</div>
</template>

<script>
export default {
  name: 'Detail',
  components: {},
  props: {
    id: String
  },
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log('detail page')
  },
  mounted() { },
  methods: {}
}
</script>
<style lang="less" scoped>
.wrapper { display: block; }
</style>
