<template>
  <div class="home">
    <transition name="van-fade" appear :duration="1000">
      <div v-if="!!userInfo" class="text-center">
        <img alt="Vue logo" src="~@/assets/logo.png" />
        <div class="button-group">
          <van-button type="info" round block @click="toPage({ path: '/list' })">下一步</van-button>
          <van-button type="info" round block @click="toPage({ path: '/form' })">表单</van-button>
          <van-button type="info" round block @click="toPage({ path: '/signature' })">签名</van-button>
          <van-button type="info" round block @click="toPage({ path: '/click-delay' })">测试点击延迟</van-button>
          <van-button type="info" round block v-click="scanQRCode">扫一扫</van-button>
          <van-button type="info" round block v-click="getLocation">获取当前位置</van-button>
          <van-button type="info" round block v-click="openLocation">打开内置地图</van-button>
          <van-button type="info" round block v-click="closeWindow">关闭当前页面</van-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiReady } from '@/jssdk'
import { checkCode } from '@/jssdk/util'
import { param2Obj } from '@/utils'

export default {
  name: 'Home',
  data() {
    return {
      position: null
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.$nextTick(() => {
      this.initContent()
    })
  },
  methods: {
    async initContent() {
      try {
        if (this.userInfo) return
        const queryObj = param2Obj(window.location.href)
        const result = await checkCode(queryObj, this.userInfo)
        console.log(result)
        if (!result.valid) {
          this.$dialog.alert({
            title: '消息提示',
            message: result.message,
            confirmButtonText: '去登录'
          }).then(() => {
            if (result.code) {
              this.$router.go(-1)
              return
            }
            this.$router.replace({ name: 'Login' })
          })
          return
        }
        this.$store.dispatch('user/login', result).then(() => {
          console.log('登录成功', this.app)
        })
      } catch (err) {
        this.$dialog.alert({
          title: '消息提示',
          message: `登录失败：${err.message}`,
          confirmButtonText: '退出重试'
        }).then(() => {
          window.history.go(-2)
        })
      }
    },
    toPage(opts) {
      if (!opts) return
      if (typeof (opts) === 'string') {
        window.location.href = opts
      }
      this.$router.push(opts)
    },
    scanQRCode() {
      apiReady('scanQRCode').then(code => {
        alert(code)
      }).catch((err) => {
        console.log('scanQRCode', err)
      })
    },
    getLocation() {
      apiReady('getLocation').then(res => {
        this.position = res.openLocation
        this.$dialog.alert({ message: `${res.address}` })
      }).catch(err => {
        this.$dialog.alert({ message: err.message })
      })
    },
    openLocation() {
      const { position } = this
      if (!position) {
        this.$dialog.alert({ message: '请先获取获取当前位置' })
        return
      }
      apiReady('openLocation', position).then(() => {

      }).catch(err => {
        this.$dialog.alert({ message: err.message })
      })
    },
    closeWindow() {
      apiReady('closeWindow')
    }
  }
}
</script>

<style lang="less" scoped>
.button-group {
  .van-button {
    margin: 5px 0;
  }
}
</style>
