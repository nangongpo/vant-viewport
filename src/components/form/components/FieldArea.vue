<template>
  <div class="van-cell van-field2 field-area" :class="classname">
    <van-field
      :label="label"
      :value="getSelectedLabel(value)"
      :disabled="disabled"
      :readonly="true"
      :clickable="!disabled"
      v-bind="$attrs"
      v-on="$listeners"
      @click="openPopup">
    </van-field>
    <van-popup v-model="showPopup" v-bind="popupAttrs">
      <van-area
        :area-list="popupOptions"
        :title="title || label"
        :value="value"
        :confirm-button-text="confirmButtonText"
        :cancel-button-text="cancelButtonText"
        :loading="popupLoading"
        :readonly="readonly"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :swipe-duration="swipeDuration"
        :columns-placeholder="columnsPlaceholder"
        :columns-num="columnsNum"
        :is-oversea-code="isOverseaCode"
        @confirm="onConfirm"
        @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Area } from 'vant'
import popupAttrs from '../utils/popup-attrs'
import remoteOptionMixin from '../mixins/remote-options'

const compName = 'FieldArea'

export default {
  name: compName,
  inheritAttrs: false,
  mixins: [remoteOptionMixin(compName)],
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Area.name]: Area
  },
  props: {
    classname: String,
    name: {
      type: String,
      required: true
    },
    label: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    title: String, // 弹窗标题
    options: { // 可选项 import { areaList } from '@vant/area-data'
      type: Object,
      default() {
        return {
          // province_list: { 110000: '北京市' },
          // city_list: { 110100: '北京市' },
          // county_list: { 110101: '东城区' }
        }
      }
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    loading: Boolean,
    readonly: Boolean,
    itemHeight: { // 选项高度，支持 px vw vh rem 单位，默认 px
      type: [Number, String],
      default: 44
    },
    visibleItemCount: { // 可见的选项个数
      type: [Number, String],
      default: 6
    },
    swipeDuration: { // 快速滑动时惯性滚动的时长，单位 ms
      type: [Number, String],
      default: 1000
    },
    columnsPlaceholder: Array, // 列占位提示文字
    columnsNum: { // 显示列数，3-省市区，2-省市，1-省
      type: [Number, String],
      default: 3
    },
    isOverseaCode: Function // 根据code校验海外地址，海外地址会划分至单独的分类, () => boolean
  },
  data() {
    this.popupAttrs = popupAttrs
    return {
      showPopup: false,
      popupLoading: this.loading,
      popupOptions: {}
    }
  },
  methods: {
    async openPopup() {
      this.showPopup = true
      this.popupOptions = await this._getRemoteOptions()
    },
    // item array
    onConfirm(item) {
      let newValue = item
      if (newValue !== undefined) {
        const { code } = item[item.length - 1]
        newValue = code
      }
      // console.log('onConfirm', item, newValue)
      this.$emit('input', newValue)
      this.$emit('change', newValue, item)
      this.showPopup = false
    },
    onCancel() {
      this.showPopup = false
    },
    getSelectedLabel(value) {
      if (!value) return value
      const { popupOptions = {} } = this
      const getLabel = (obj, num = value.length) => {
        const _key = value.slice(0, num)
        let label
        for (const key in obj) {
          if (key.slice(0, num) === _key) {
            label = obj[key]
            break
          }
        }
        return label
      }
      // 同一省份前两位一样，同一城市前四位一样
      const { province_list = {}, city_list = {}, county_list = {} } = popupOptions
      const labels = [getLabel(province_list, 2), getLabel(city_list, 4), getLabel(county_list)]

      return labels.filter(v => Boolean(v)).join('/')
    }
  }
}
</script>
