<template>
  <van-field
    readonly
    clickable
    name="picker"
    :value="value"
    label="选择器"
    placeholder="点击选择城市"
    @click="showPicker = true">
    <template #extra>
      <van-popup
        v-model="showPicker"
        round
        position="bottom"
        get-container="body">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </template>
  </van-field>
</template>

<script>
import { Field, Popup, Picker } from 'vant'

export default {
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  data() {
    return {
      columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
      value: '',
      showPicker: false
    }
  },

  methods: {
    onConfirm(value) {
      this.value = value
      this.showPicker = false
    },

    onCancel() {
      this.showPicker = false
    }
  }
}
</script>
