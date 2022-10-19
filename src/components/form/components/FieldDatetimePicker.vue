<template>
  <div class="van-cell van-field2 field-datetime-picker" :class="classname">
    <van-field
      :name="name"
      :label="label"
      :value="getSelectedLabel(value)"
      :disabled="disabled"
      :readonly="true"
      :clickable="!disabled"
      v-bind="$attrs"
      v-on="$listeners"
      @click="openPopup" />
    <van-popup v-model="showPopup" v-bind="popupAttrs">
      <van-datetime-picker
        :value="currentDate"
        :type="type"
        :title="title || label"
        :confirm-button-text="confirmButtonText"
        :cancel-button-text="cancelButtonText"
        :loading="popupLoading"
        :readonly="readonly"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :swipe-duration="swipeDuration"
        :show-toolbar="showToolbar"
        :filter="filter"
        :formatter="formatter"
        :columns-order="columnsOrder"
        :min-date="minDate"
        :max-date="maxDate"
        :min-hour="minHour"
        :max-hour="maxHour"
        :min-minute="minMinute"
        :max-minute="maxMinute"
        @confirm="onConfirm"
        @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, DatetimePicker } from 'vant'
import popupAttrs from '../utils/popup-attrs'
import { dateFormat, toDate } from '../utils/date'

const getFormatByType = (type, format) => {
  if (format) return format
  // date time datetime year-month month-day datehour
  const typeMap = {
    'date': 'YYYY/MM/DD',
    'time': 'HH:mm',
    'datetime': 'YYYY/MM/DD HH:mm',
    'year-month': 'YYYY年MM月',
    'month-day': 'MM月DD号',
    'datehour': 'DD HH:mm'
  }
  return typeMap[type] || typeMap.datetime
}

const compName = 'FieldDatetimePicker'

export default {
  name: compName,
  inheritAttrs: false,
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker
  },
  props: {
    classname: String,
    name: {
      type: String,
      required: true
    },
    label: String,
    value: [Number, String, Date],
    disabled: {
      type: Boolean,
      default: false
    },
    clickable: Boolean,
    title: String,
    type: { // date time datetime year-month month-day datehour
      type: String,
      default: 'datetime'
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
    showToolbar: { // 是否显示顶部栏
      type: Boolean,
      default: true
    },
    filter: Function, // 选项过滤函数 (type, vals) => vals
    formatter: Function, // 选项格式化函数 (type, val) => val
    columnsOrder: Array, // 自定义列排序数组, 子项可选值为 year、month、day、hour、minute
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
    minDate: Date, // type = date|datetime时生效,可选的最小时间，精确到分钟
    maxDate: Date, // type = date|datetime时生效,可选的最大时间，精确到分钟
    minHour: [Number, String], // type = time时生效, 默认值0
    maxHour: [Number, String], // type = time时生效, 默认值23
    minMinute: [Number, String], // type = time时生效, 默认值0
    maxMinute: [Number, String], // type = time时生效, 默认值59
    format: String, // 显示在输入框中的格式
    valueFormat: String // 可选，绑定值的格式
  },
  data() {
    this.popupAttrs = popupAttrs
    return {
      showPopup: false,
      popupLoading: this.loading
    }
  },
  computed: {
    currentDate() {
      const { value } = this
      return toDate(value)
    }
  },
  methods: {
    openPopup() {
      this.showPopup = true
    },
    // item string
    onConfirm(item) {
      let newValue = item
      if (newValue !== undefined) {
        const { type, valueFormat } = this
        newValue = dateFormat(item, getFormatByType(type, valueFormat))
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
      const { type, format } = this
      return dateFormat(value, getFormatByType(type, format))
    }
  }
}
</script>
