<script>
export default {
  name: 'ServiceWorkerUpdatePopup',
  data() {
    return {
      refreshing: false,
      notificationText: '有新内容可用!',
      refreshButtonText: '刷新',
      registration: null
    }
  },
  created() {
    if (!navigator.serviceWorker) return
    // Listen for swUpdated event and display refresh notification as required.
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      window.location.reload()
    })
  },
  render(h) {
    return h() // avoid warning message
  },
  methods: {
    showRefreshUI(e) {
      const { notificationText, refreshButtonText, refreshApp } = this
      // Display a notification inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail
      this.$dialog.alert({
        type: 'primary',
        title: '应用更新',
        message: notificationText,
        confirmButtonText: refreshButtonText,
        duration: 0
      }).then(refreshApp)
    },
    refreshApp() {
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) return
      this.registration.waiting.postMessage('skipWaiting')
    }
  }
}
</script>
