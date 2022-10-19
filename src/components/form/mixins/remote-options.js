import Storage from '../utils/storage'

export default function remoteOptions(compName) {
  const storage = new Storage(compName)
  return {
    props: {
      isCacheOptions: {
        type: Boolean,
        default: true
      },
      getOptions: Function // 远程获取选项 return promise
    },
    methods: {
      _getRemoteOptions() {
        return new Promise((resolve, reject) => {
          const { name, options, isCacheOptions, getOptions } = this
          try {
            this.popupLoading = true
            // 加载缓存
            if (isCacheOptions) {
              const popupOptions = storage.get(name)
              if (popupOptions) {
                resolve(popupOptions || options)
                this.popupLoading = false
                return
              }
            }
            storage.remove(name)
            // 远程获取
            if (getOptions) {
              getOptions().then(popupOptions => {
                if (isCacheOptions) {
                  storage.set(name, popupOptions)
                }
                resolve(popupOptions || options)
                this.popupLoading = false
              }).catch((err) => {
                this.popupLoading = false
                console.warn(name, err.message)
                reject(err)
              })
              return
            }

            resolve(options)
            this.popupLoading = false
          } catch (err) {
            console.warn(name, err.message)
            this.popupLoading = false
            reject(err)
          }
        })
        // try {
        //   const { options, isCacheOptions, getOptions } = this
        //   // 加载缓存
        //   if (isCacheOptions) {
        //     const popupOptions = storage.get(compName) || options
        //     if (popupOptions.length) {
        //       this.popupOptions = popupOptions
        //       this.showPopup = true
        //       return
        //     }
        //   } else {
        //     this.popupOptions = options
        //   }

        //   this.showPopup = true
        //   // 远程获取
        //   if (getOptions) {
        //     this.popupLoading = true
        //     this.popupOptions = await getOptions()

        //     if (isCacheOptions) {
        //       storage.set(compName, this.popupOptions)
        //     }
        //     this.popupLoading = false
        //   }
        // } catch (err) {
        //   this.popupLoading = false
        // }
      }
    }
  }
}
