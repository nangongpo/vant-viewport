<template>
  <div id="app">
    <div v-show="$route.path === '/'" ref="debug" class="debug" :class="{ 'active': showDebug }">关</div>
    <transition name="fade">
      <router-view v-show="network" />
    </transition>
    <disconnected-warning :network="network" />
    <service-worker-update-popup />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DisconnectedWarning from '@/pwa/components/DisconnectedWarning.vue'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'
import { getLocalFile } from '@/api/file'
import { ContinuousClick } from '@/utils'

const loadScript = require('load-script')
const vConsolePath = getLocalFile('plugins/vconsole.min.js')

export default {
  name: 'App',
  components: { DisconnectedWarning, ServiceWorkerUpdatePopup },
  data() {
    return {
      network: true,
      vConsole: null
    }
  },
  computed: {
    ...mapGetters(['showDebug'])
  },
  beforeDestroy() {
    this.vConsole && this.vConsole.destroy()
  },
  created() {
    if (this.showDebug) {
      this.loadVConsole().then(VConsole => {
        this.vConsole = new VConsole()
      })
    }
  },
  mounted() {
    // 连续点击5次 控制vconsole
    const debugClick = new ContinuousClick(this.$refs.debug)
    debugClick.on(() => {
      this.loadVConsole().then(() => {
        let flag = false
        if (!this.vConsole) {
          flag = true
        } else {
          this.vConsole.destroy()
          this.vConsole = null
          flag = false
        }
        this.$store.commit('app/SET_DEBUG', flag)
        flag && window.location.reload()
      }).catch((err) => {
        this.$dialog.alert({ title: '调试', message: `调试模式开启失败, 请重新尝试${err.message}` })
      })
    })
    // fix: 在ios微信中, window.history.go(-1) 、 window.history.back(-1) 、this.$router.go(-1) 不会重新加载页面
    window.addEventListener('pageshow', (e) => {
      // 页面是从缓存中读取
      if (e.persisted && this.$route.name === 'Login') {
        window.location.reload()
      }
    })
    // fix: 部分机型软键盘弹起挡住原来的视图
    window.addEventListener('resize', function() {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        window.setTimeout(function() {
          if ('scrollIntoView' in document.activeElement) {
            document.activeElement.scrollIntoView(false)
          } else {
            document.activeElement.scrollIntoViewIfNeeded(false)
          }
        }, 0)
      }
    })
    window.addEventListener('offline', () => {
      this.network = false
      console.log('已断网')
    })
    window.addEventListener('online', () => {
      this.network = true
      console.log('网络已连接')
    })
  },
  methods: {
    loadVConsole() {
      return new Promise((resolve, reject) => {
        if (window.VConsole) {
          resolve(window.VConsole)
          return
        }
        loadScript(vConsolePath, (err, script) => {
          if (err) {
            reject(err)
            return
          }
          resolve(window.VConsole)
        })
      })
    }
  }
}
</script>
