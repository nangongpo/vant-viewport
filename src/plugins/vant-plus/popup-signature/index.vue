<template>
  <van-popup :value="value" v-on="$listeners" class="popup-signature">
    <div class="wrap1" v-show="!showFull">
      <canvas class="canvas1" id="canvas1" />
      <div class="actions">
        <van-button type="info" size="small"  @click="handleClear1">清空</van-button>
        <van-button type="info" size="small" @click="handleUndo1">撤销</van-button>
        <van-button type="info" size="small" @click="handleSave1">保存</van-button>
        <van-button type="info" size="small" @click="handleFull">横屏</van-button>
      </div>
    </div>
    <div class="wrap2" v-show="showFull">
      <div class="actions-wrapper">
        <div class="actions">
          <van-button type="info" size="small" @click="handleClear2">清空</van-button>
          <van-button type="info" size="small" @click="handleUndo2">撤销</van-button>
          <van-button type="info" size="small" @click="handleSave2">保存</van-button>
          <van-button type="info" size="small" @click="handleFull">竖屏</van-button>
        </div>
      </div>
      <canvas class="canvas" id="canvas2" />
    </div>
  </van-popup>
</template>

<script>
import SmoothSignature from 'smooth-signature'

export default {
  name: 'PopupSignature',
  props: {
    value: Boolean,
    type: {
      type: String,
      default: 'png' // jpg、png
    },
    isFullScreen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showFull: this.isFullScreen,
      previewSrc: ''
    }
  },
  watch: {
    value: {
      handler: 'onVisible',
      immediate: true
    }
  },
  methods: {
    onVisible(visible) {
      this.$nextTick(() => {
        if (visible) {
          this.initSignature1()
          this.initSignture2()
        }
      })
    },
    initSignature1() {
      const canvas = document.getElementById('canvas1')
      const options = {
        width: window.innerWidth - 42,
        height: 200,
        minWidth: 2,
        maxWidth: 6
        // color: "black", 画笔颜色
        // bgColor: '' 画布颜色，默认透明
      }
      this.signature1 = new SmoothSignature(canvas, options)
    },
    initSignture2() {
      const canvas = document.getElementById('canvas2')
      const options = {
        width: window.innerWidth - 100,
        height: window.innerHeight - 50,
        minWidth: 3,
        maxWidth: 10
        // color: "black", 画笔颜色
        // bgColor: '' 画布颜色，默认透明
      }
      this.signature2 = new SmoothSignature(canvas, options)
    },
    handleClear1() {
      this.signature1.clear()
    },
    handleClear2() {
      this.signature2.clear()
    },
    handleUndo1() {
      this.signature1.undo()
    },
    handleUndo2() {
      this.signature2.undo()
    },
    handleSave1() {
      const { signature1, type } = this
      const isEmpty = signature1.isEmpty()
      if (isEmpty) {
        this.$toast('清先签名')
        return
      }
      const result = type === 'jpg' ? signature1.getJPG() : signature1.getPNG()
      this.$emit('input', false)
      this.$emit('save', result)
    },
    handleSave2() {
      // 全屏时为横屏， 提示语需要改变方向
      const { signature2, type } = this
      const isEmpty = signature2.isEmpty()
      if (isEmpty) {
        this.$toast({ message: '清先签名', className: 'landscape' })
        return
      }
      const canvas = signature2.getRotateCanvas(-90)
      const result = type === 'jpg' ? canvas.toDataURL('image/jpeg') : canvas.toDataURL('image/png')
      this.$emit('input', false)
      this.$emit('save', result)
    },
    handleFull() {
      this.showFull = !this.showFull
    },
    handleColor1() {
      this.signature1.color = this.getRandomColor()
    },
    handleColor2() {
      this.signature2.color = this.getRandomColor()
    }
  }
}
</script>
<style lang="less" scoped>
.van-toast {
  &.landscape {
    transform: translate3d(-50%, -50%, 0) rotate(90deg);
  }
}
.popup-signature {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-size: 18px;
  &.van-popup--center {
    transform: none;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  canvas {
    border-radius: 10px;
    border: 2px dashed #ccc;
  }
  .wrap1 {
    width: 100%;
    text-align: center;
    background-color: #fff;
    padding: 16px;
    box-sizing: border-box;
  }
  .wrap2 {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 16px;
    display: flex;
    justify-content: center;
    background-color: #fff;
    .actions-wrapper {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .canvas {
      flex: 1;
    }
    .actions {
      margin-right: 10px;
      white-space: nowrap;
      transform: rotate(90deg);
    }
  }
}
</style>
