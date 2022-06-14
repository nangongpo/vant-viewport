<template>
  <div id="app">
    <vue-native-navigation>
      <router-view v-show="network" />
    </vue-native-navigation>
    <disconnected-warning :network="network" />
    <service-worker-update-popup />
  </div>
</template>

<script>
import DisconnectedWarning from '@/pwa/components/DisconnectedWarning'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'

export default {
  name: 'App',
  components: { DisconnectedWarning, ServiceWorkerUpdatePopup },
  data() {
    return {
      network: true
    }
  },
  mounted() {
    window.addEventListener('offline', () => {
      this.network = false
      console.log('已断网')
    })
    window.addEventListener('online', () => {
      this.network = true
      console.log('网络已连接')
    })
  }
}
</script>
