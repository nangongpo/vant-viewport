<template>
  <div class="van-cell van-field2 field-calendar" :class="classname">
		<van-field
			:label="label"
			:value="getSelectedLabel(value)"
			:disabled="disabled"
			:readonly="true"
			:clickable="!disabled"
			v-bind="$attrs"
			v-on="$listeners"
			@click="openPopup" />
		<!-- 用于表单校验，需设置name -->
		<van-field
			:name="name"
			:label="label"
			:value="isArrayDate(value) ? undefined : value"
			:disabled="disabled"
			:readonly="true"
			:clickable="!disabled"
			style="display: none">
			<template v-if="isArrayDate(value)" #input>
				<!-- van-checkbox-group组件支持 any[], 触发表单更新 -->
				<van-checkbox-group :value="value" />
			</template>
		</van-field>
		<!-- 弹窗展示 poppable = true -->
		<van-calendar
			v-model="showPopup"
			v-bind="popupAttrs"
			:type="type"
			:title="title || label"
			:readonly="readonly"
			:color="color"
			:min-date="minDate"
			:max-date="maxDate"
			:default-date="currentData"
			:row-height="rowHeight"
			:formatter="formatter"
			:poppable="true"
			:show-mark="showMark"
			:show-title="showTitle"
			:show-subtitle="showSubtitle"
			:show-confirm="showConfirm"
			:confirm-text="confirmText"
			:confirm-disabled-text="confirmDisabledText"
			:first-day-of-week="firstDayOfWeek"
			:max-range="maxRange"
			:range-prompt="rangePrompt"
			:allow-same-day="allowSameDay"
			@confirm="onConfirm" />
	</div>
</template>

<script>
import { Field, Calendar, CheckboxGroup } from 'vant'
import popupAttrs from '../utils/popup-attrs'
import dayjs, { dateFormat, toDate } from '../utils/date'

const shouldArrayDate = (type) => ['range', 'multiple'].includes(type)

const compName = 'FieldCalendar'

export default {
  name: compName,
  components: {
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [CheckboxGroup.name]: CheckboxGroup
  },
  props: {
    classname: String,
    name: {
      type: String,
      required: true
    },
    label: String,
    value: [Number, String, Date, Array],
    disabled: {
      type: Boolean,
      default: false
    },
    type: { // 选择类型: single表示选择单个日期，multiple表示选择多个日期，range表示选择日期区间
      type: String,
      default: 'single'
    },
    title: String, // 弹窗标题
    color: { // 主题色，对底部按钮和选中日期生效
      type: String,
      default: '#ee0a24'
    },
    minDate: Date, // 可选择的最小日期
    maxDate: Date, // 可选择的最大日期, 当前日期的六个月后
    defaultDate: [Date, Array], // 默认选中的日期，type 为 multiple 或 range 时为数组，传入 null 表示默认不选择
    rowHeight: { // 日期行高
      type: [Number, String],
      default: 64
    },
    formatter: Function, // 日期格式化函数 (day: Day) => Day
    showMark: { // 是否显示月份背景水印
      type: Boolean,
      default: true
    },
    showTitle: { // 是否展示日历标题
      type: Boolean,
      default: true
    },
    showSubtitle: { // 是否展示日历副标题（年月）
      type: Boolean,
      default: true
    },
    showConfirm: { // 是否展示确认按钮
      type: Boolean,
      default: true
    },
    readonly: Boolean, // 是否为只读状态，只读状态下不能选择日期 false
    confirmText: { // 确认按钮的文字
      type: String,
      default: '确定'
    },
    confirmDisabledText: { // 确认按钮处于禁用状态时的文字
      type: String,
      default: '确定'
    },
    firstDayOfWeek: { // 设置周起始日
      type: Number,
      default: 0
    },
    maxRange: [Number, String], // 最多可选天数, 仅type=range|multiple时有效
    rangePrompt: String, // 超过最多可选天数时的提示文案, 仅type=range|multiple时有效
    allowSameDay: { // 是否允许日期范围的起止时间为同一天, 仅type=range有效
      type: Boolean,
      default: true
    },
    sameDayFormat: { // allowSameDay = true时显示在输入框中的格式
      type: String,
      default: 'YYYY/MM/DD HH:mm'
    },
    format: { // 显示在输入框中的格式
      type: String,
      default: 'YYYY/MM/DD'
    },
    valueFormat: { // 可选，绑定值的格式
      type: String,
      default: 'YYYY/MM/DD'
    }
  },
  data() {
    this.popupAttrs = popupAttrs
    return {
      showPopup: false
    }
  },
  computed: {
    currentData() {
      const { isArrayDate, value, defaultDate } = this
      if (value === null) return value
      const _value = isArrayDate(value)
        ? value.filter(v => Boolean(v)).map(v => toDate(v))
        : toDate(value)

      if (_value && !_value.length) {
        return null
      }

      return _value !== undefined ? _value : defaultDate
    }
  },
  methods: {
    openPopup() {
      this.showPopup = true
    },
    // item array|string
    onConfirm(item) {
      let newValue = item
      if (newValue !== undefined) {
        newValue = this.dateFormat2(item, true)
      }
      // console.log('onConfirm', item, newValue)
      this.$emit('input', newValue)
      this.$emit('change', newValue, item)
      this.showPopup = false
    },
    getSelectedLabel(value) {
      if (!value) return value
      return this.dateFormat2(value)
    },
    isArrayDate(value) {
      return shouldArrayDate(this.type) && Array.isArray(value)
    },
    dateFormat2(value, isValueFormat = false) {
      const { isArrayDate, format, valueFormat, type, allowSameDay, sameDayFormat } = this
      let _format = isValueFormat ? valueFormat : format
      if (!isArrayDate(value)) {
        return dateFormat(value, _format)
      }

      const [start, end] = value
      if (!start || !end) {
        return isValueFormat ? null : ''
      }
      let startDate = start
      let endDate = end
      let separator = ','
      if (type === 'range') {
        if (allowSameDay) {
          startDate = dayjs(start).startOf('day')
          endDate = dayjs(end).endOf('day')
          _format = sameDayFormat
        }
        separator = ' - '
      }
      const _value = [startDate, endDate].map(v => dateFormat(v, _format))

      if (isValueFormat) {
        return _value
      }

      return _value.join(separator)
    }
  }
}
</script>
