<template>
  <div class="van-cell van-field2 field-picker" :class="classname">
    <!-- 仅用于显示，不用设置name -->
    <van-field
      :label="label"
      :value="getSelectedLabel(value)"
      :disabled="disabled"
      :readonly="true"
      :clickable="!disabled"
      v-bind="$attrs"
      v-on="$listeners"
      @click="openPopup"
    >
    </van-field>
    <!-- 用于表单校验，需设置name -->
    <van-field
      :name="name"
      :label="label"
      :value="value"
      :disabled="disabled"
      :readonly="true"
      :clickable="!disabled"
      v-bind="$attrs"
      style="display: none"
    />
    <van-popup
      v-model="showPopup"
      v-bind="popupAttrs"
    >
      <van-picker
        :columns="popupOptions"
        :title="title || label"
        :confirm-button-text="confirmButtonText"
        :cancel-button-text="cancelButtonText"
        :value-key="defaultProps.label"
        :toolbar-position="toolbarPosition"
        :show-toolbar="showToolbar"
        :loading="popupLoading"
        :readonly="readonly"
        :allow-html="allowHtml"
        :default-index="defaultIndex"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :swipe-duration="swipeDuration"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Picker } from 'vant'
import popupAttrs from './utils/popup-attrs'
import Storage from './utils/storage'

const compName = 'FieldPicker'
const storage = new Storage(compName)

export default {
  name: compName,
  inheritAttrs: false,
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  props: {
    classname: String,
    name: {
      type: String,
      required: true
    },
    label: String,
    value: [Number, String],
    disabled: {
      type: Boolean,
      default: false
    },
    clickable: Boolean,
    title: String,
    options: Array,
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    toolbarPosition: {
      type: String,
      default: 'top' // top bottom
    },
    loading: Boolean,
    readonly: Boolean,
    showToolbar: { // 是否显示顶部栏
      type: Boolean,
      default: true
    },
    allowHtml: { // 是否允许选项内容中渲染 HTML
      type: Boolean,
      default: false
    },
    defaultIndex: { // 单列选择时，默认选中项的索引
      type: [Number, String],
      default: 0
    },
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
    defaultProps: { // columns的映射关系
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    isCacheOptions: {
      type: Boolean,
      default: true
    },
    getOptions: Function // 远程获取选项 return promise
  },
  data() {
    this.popupAttrs = popupAttrs
    return {
      showPopup: false,
      popupLoading: this.loading,
      popupOptions: []
    }
  },
  methods: {
    async openPopup() {
      try {
        const { name, options, isCacheOptions, getOptions } = this
        // 加载缓存
        if (isCacheOptions) {
          const popupOptions = storage.get(name) || []
          if (popupOptions.length) {
            this.popupOptions = popupOptions
            this.showPopup = true
            return
          }
        } else {
          this.popupOptions = options || []
        }

        this.showPopup = true
        // 远程获取
        if (getOptions) {
          this.popupLoading = true
          this.popupOptions = await getOptions()
          if (isCacheOptions) {
            storage.set(name, this.popupOptions)
          }
          this.popupLoading = false
        }
      } catch (err) {
        this.popupLoading = false
      }
    },
    onConfirm(item) {
      try {
        const { defaultProps } = this
        const { value: valueKey } = defaultProps
        const newValue = item[valueKey]

        this.$emit('input', newValue)
        this.$emit('change', newValue)
        this.showPopup = false
      } catch (err) {
        console.warn('FieldPicker', err.message)
      }
    },
    onCancel() {
      this.showPopup = false
    },
    getSelectedLabel(value) {
      const { value: valueKey, label: labelKey } = this.defaultProps
      const text = this.popupOptions.reduce((t, v) => v[valueKey] === value ? v[labelKey] : t, '')
      return text
    }
  }
}
</script>
