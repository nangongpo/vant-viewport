<template>
  <demo-block title="表单项类型" class="red-bg">
    <scrollbar>
      <van-form @submit="onSubmit">
        <van-field name="switch" label="开关">
          <template #input>
            <van-switch v-model="switchChecked" size="20" />
          </template>
        </van-field>

        <van-field name="checkbox" label="复选框">
          <template #input>
            <van-checkbox v-model="checkbox" shape="square" />
          </template>
        </van-field>

        <van-field name="checkboxGroup" label="复选框组">
          <template #input>
            <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
              <van-checkbox name="1" shape="square">
                复选框 1
              </van-checkbox>
              <van-checkbox name="2" shape="square">
                复选框 2
              </van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>

        <van-field name="radio" label="单选框">
          <template #input>
            <van-radio-group v-model="radio" direction="horizontal">
              <van-radio name="1">单选框 1</van-radio>
              <van-radio name="2">单选框 2</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field name="stepper" label="步进器">
          <template #input>
            <van-stepper v-model="stepper" />
          </template>
        </van-field>

        <van-field name="rate" label="评分">
          <template #input>
            <van-rate v-model="rate" />
          </template>
        </van-field>

        <van-field name="slider" label="滑块">
          <template #input>
            <van-slider v-model="slider" />
          </template>
        </van-field>

        <van-field name="uploader" label="文件上传">
          <template #input>
            <van-uploader v-model="uploader" max-count="2" />
          </template>
        </van-field>

        <field-picker />
        <field-datetime-picker />
        <field-area />
        <field-calendar />

        <div style="margin: 16px 16px 0">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </scrollbar>
  </demo-block>
</template>

<script>
import { Form, Field, Switch, Checkbox, CheckboxGroup, Radio, RadioGroup, Stepper, Rate, Slider, Uploader } from 'vant'
import FieldArea from '@/components/form/FieldArea'
import FieldPicker from '@/components/form//FieldPicker'
import FieldCalendar from '@/components/form/FieldCalendar'
import FieldDatetimePicker from '@/components/form/FieldDatetimePicker'

export default {
  name: 'VForm',
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [Switch.name]: Switch,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Stepper.name]: Stepper,
    [Rate.name]: Rate,
    [Slider.name]: Slider,
    [Uploader.name]: Uploader,
    FieldArea,
    FieldPicker,
    FieldCalendar,
    FieldDatetimePicker
  },

  data() {
    return {
      rate: 3,
      radio: '1',
      slider: 50,
      stepper: 1,
      uploader: [{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }],
      checkbox: false,
      checkboxGroup: [],
      switchChecked: false
    }
  },

  methods: {
    onSubmit(values) {
      console.log(values)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
