importScripts("/vant-viewport/precache-manifest.391beb958c816da1394f94185a3b653a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
self.addEventListener('message', (e) => {
  if (e.data) {
    if (e.data === 'skipWaiting') {
      self.skipWaiting()
    }
  }
})

/* eslint-disable no-undef */
workbox.core.clientsClaim()
workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

