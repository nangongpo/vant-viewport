<template>
  <van-field
    readonly
    clickable
    name="area"
    :value="value"
    label="地区选择"
    placeholder="点击选择省市区"
    @click="showArea = true">
    <template #extra>
      <van-popup
        v-model="showArea"
        round
        position="bottom"
        get-container="body">
        <van-area
          :area-list="AreaList"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </template>
  </van-field>
</template>

<script>
import { Field, Popup, Area } from 'vant'
import AreaList from './utils/area'

export default {
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Area.name]: Area
  },
  data() {
    return {
      AreaList,
      value: '',
      showArea: false
    }
  },

  methods: {
    onConfirm(values) {
      this.value = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join('/')
      this.showArea = false
    },

    onCancel() {
      this.showArea = false
    }
  }
}
</script>
