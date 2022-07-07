<template>
  <van-field
    readonly
    clickable
    name="calendar"
    :value="value"
    label="日历"
    placeholder="点击选择日期"
    @click="showCalendar = true">
    <template #extra>
      <van-calendar
        v-model="showCalendar"
        round
        get-container="body"
        @confirm="onConfirm"
      />
    </template>
  </van-field>
</template>

<script>
import { Field, Calendar } from 'vant'
export default {
  components: {
    [Field.name]: Field,
    [Calendar.name]: Calendar
  },
  data() {
    return {
      value: '',
      showCalendar: false
    }
  },

  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    onConfirm(date) {
      this.value = this.formatDate(date)
      this.showCalendar = false
    }
  }
}
</script>
