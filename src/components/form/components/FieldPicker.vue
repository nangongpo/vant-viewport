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
      @click="openPopup">
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
      style="display: none" />
    <van-popup v-model="showPopup" v-bind="popupAttrs">
      <van-picker
        :columns="popupOptions"
        :title="title || label"
        :confirm-button-text="confirmButtonText"
        :cancel-button-text="cancelButtonText"
        :loading="popupLoading"
        :readonly="readonly"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :swipe-duration="swipeDuration"
        :value-key="defaultProps.label"
        :toolbar-position="toolbarPosition"
        :show-toolbar="showToolbar"
        :allow-html="allowHtml"
        :default-index="defaultIndex"
        @confirm="onConfirm"
        @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Picker } from 'vant'
import popupAttrs from '../utils/popup-attrs'
import remoteOptionMixin from '../mixins/remote-options'

const compName = 'FieldPicker'

export default {
  name: compName,
  inheritAttrs: false,
  mixins: [remoteOptionMixin(compName)],
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
    options: {
      type: Array,
      default() {
        return []
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
    }
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
      this.showPopup = true
      this.popupOptions = await this._getRemoteOptions()
    },
    // item object
    onConfirm(item) {
      let newValue = item
      if (newValue !== undefined) {
        const { defaultProps } = this
        const { value: valueKey } = defaultProps
        newValue = item[valueKey]
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
      const { value: valueKey, label: labelKey } = this.defaultProps
      const text = this.popupOptions.reduce((t, v) => v[valueKey] === value ? v[labelKey] : t, '')
      return text
    }
  }
}
</script>
