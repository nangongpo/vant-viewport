<script>
import { Empty } from 'vant'

export default {
  functional: true,
  props: {
    network: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { data, props } = context
    const { network } = props
    const style = { display: network ? 'none' : 'block' }

    return <div {...data} class='disconnected-warning' style={style}>
      <Empty image='network' description='未连接到互联网'>
        请联网后重试
      </Empty>
    </div>
  }
}

</script>
<style lang="less" scoped>
.disconnected-warning {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #ffffff;
  overflow: hidden;
}
</style>
