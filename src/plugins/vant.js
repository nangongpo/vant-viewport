import { Button, Cell, CellGroup, Image, Popup, Toast, Dialog } from 'vant'
import { DemoBlock, VScrollbar } from './vant-plus'

const components = [
  Button,
  Cell,
  CellGroup,
  Image,
  Popup,
  Toast,
  Dialog,
  DemoBlock,
  VScrollbar
]

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, opts = {}) {
    components.map(item => {
      Vue.component(item.name, item)
    })
  }
}
