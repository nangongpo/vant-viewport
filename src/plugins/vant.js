import { Button, Cell, CellGroup, Image, Popup, Toast, Notify, Dialog } from 'vant'

const components = {
  Button,
  Cell,
  CellGroup,
  Image,
  Popup,
  Toast,
  Notify,
  Dialog
}

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, opts = {}) {
    components.map(item => {
      Vue.component(item.name, item)
    })
  }
}