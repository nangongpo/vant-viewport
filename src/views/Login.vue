<template>
  <div class="login-wrapper"></div>
</template>

<script>
import { getCode } from '@/jssdk/util'

export default {
  name: 'Login',
  created() {
    // 初始化设备信息，并挂载到window上， 不可删除
    this.$store.dispatch('app/getDevice').then(() => {
      setTimeout(getCode, 1000)
    })
  }
}
</script>
<style lang="less" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/banner.jpeg');
  background-size: 100% 100%;
}
</style>
