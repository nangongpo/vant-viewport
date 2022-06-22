<template>
  <v-scrollbar>
    <van-form @submit="onSubmit">
      <br><br><br><br><br><br><br><br><br><br><br><br>
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <br><br><br><br>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </v-scrollbar>
</template>

<script>
import { Form, Field } from 'vant'

export default {
  components: {
    [Form.name]: Form,
    [Field.name]: Field
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      this.$dialog.alert({ title: '提交表单', message: '提交成功' }).then(() => {
        alert(123)
      })
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
