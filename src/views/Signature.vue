<template>
  <div class="signature-wrapper h5">
    <div class="h4 text-center">{{ title }}</div>
    <div v-for="(item, index) in content" :key="index">
      {{index + 1}}. {{ item }}
    </div>
    <div class="signature-block">
      承诺人:
      <span v-show="!previewSrc" class="signature-content text-primary" @click="showSignature = true">点我签名</span>
      <van-image
        v-show="!!previewSrc"
        fit="scale-down"
        :src="previewSrc"
        class="signature-content"
        @click="showSignature = true" />
    </div>
    <div class="signature-date text-right">{{ createAt }}</div>
    <popup-signature v-model="showSignature" @save="createSignature"/>
  </div>
</template>

<script>
import PopupSignature from '@/plugins/vant-plus/popup-signature'
import { dateFormat } from '@/utils/date'

export default {
  name: 'Signature',
  components: { PopupSignature },
  data() {
    return {
      title: '承诺书',
      content: [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates vel voluptatem labore et iste sapiente inventore quis autem incidunt quaerat, vitae corrupti! Quos nihil sequi ea fugiat deleniti animi aliquid.',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates vel voluptatem labore et iste sapiente inventore quis autem incidunt quaerat, vitae corrupti! Quos nihil sequi ea fugiat deleniti animi aliquid.'
      ],
      showSignature: false,
      createAt: '',
      previewSrc: ''
    }
  },
  mounted() {

  },
  methods: {
    createSignature(src) {
      this.previewSrc = src
      this.createAt = dateFormat(new Date(), 'YYYY年MM月DD日')
    }
  }
}
</script>

<style lang="less">
.signature-wrapper {
  padding: 16px;
  line-height: 1.6;
}
.signature-block {
  min-width: 120px;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.signature-content {
  min-width: 100px;
  text-align: left;
  &.van-image {
    width: 100px;
    height: 32px;
  }
}
</style>
