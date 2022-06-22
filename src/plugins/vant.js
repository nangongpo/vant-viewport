import { Button, Cell, CellGroup, Image, Popup, Toast, Dialog } from 'vant'
import VantPlus from './vant-plus'
console.log(VantPlus)

const components = [
  Button,
  Cell,
  CellGroup,
  Image,
  Popup,
  Toast,
  Dialog,
  ...VantPlus
]

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, opts = {}) {
    components.map(item => {
      Vue.component(item.name, item)
    })
  }
}
