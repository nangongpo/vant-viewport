<template>
  <van-field
    readonly
    clickable
    name="datetimePicker"
    :value="value"
    label="时间选择"
    placeholder="点击选择时间"
    @click="showPicker = true"
  >
    <template #extra>
      <van-popup
        v-model="showPicker"
        round
        position="bottom"
        get-container="body"
      >
        <van-datetime-picker
          type="time"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </template>
  </van-field>
</template>

<script>
import { Field, Popup, DatetimePicker } from 'vant'
export default {
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker
  },
  data() {
    return {
      value: '',
      showPicker: false
    }
  },

  methods: {
    onConfirm(time) {
      console.log('time', time)
      this.value = time
      this.showPicker = false
    },
    onCancel() {
      this.showPicker = false
    }
  }
}
</script>
