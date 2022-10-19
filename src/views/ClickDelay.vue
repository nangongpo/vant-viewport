<template>
  <scrollbar class="wrapper h5">
    <div class="h2 text-center">尝试检测移动端click延时</div>

    <ul>
      取消click延时响应的两种做法：
      <li>
        设置视口标签，禁用缩放页面性能，浏览器也会相应勾销对双击的响应。添加如下代码
        <p>
          <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no,
            min-scale=1.0, max-scale=1.0"&gt;</code>
        </p>
      </li>
      <li>
        利用touch系列事件包装一组监听器，只有touch持续时间小于某个值才归为点击（大于就是长按或者拖拽了），进而执行事件处理函数。
      </li>
    </ul>

    <div class="div">click me and console.log('fast click')</div>
    <p class="p">click me and console.log('normal, slow and delay click')</p>
  </scrollbar>
</template>

<script>
export default {
  name: 'ClickDelay',
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    var div = document.querySelector('.div')
    var divStart = 0
    div.addEventListener('touchstart', function () {
      divStart = Date.now()
    })
    this.setFastClick(div, function () {
      console.log('fast click, time:' + (Date.now() - divStart))
      divStart = 0
    })

    var p = document.querySelector('.p')
    var pStart = 0
    p.addEventListener('touchstart', function () {
      pStart = Date.now()
    })
    p.addEventListener('click', function () {
      console.log('normal, slow and delay click, time:' + (Date.now() - pStart))
      pStart = 0
    })
  },
  methods: {
    setFastClick(obj, callback) {
      var isMove = false
      var startTime = 0
      obj.addEventListener('touchstart', function () {
        startTime = Date.now()
      })
      obj.addEventListener('touchmove', function () {
        isMove = true
      })
      obj.addEventListener('touchend', function () {
        // 触摸开始至完结小于150ms算点击；高于150ms、滑动等等可能归为长按、拖动
        if (isMove === false && Date.now() - startTime < 150) {
          callback && callback()
        }
        isMove = false
        startTime = 0
      })
    }
  }
}
</script>
<style lang="less" scoped>
.div {
  width: 200px;
  height: 200px;
  background-color: pink;
}

.p {
  width: 200px;
  height: 200px;
  background-color: green;
}
</style>
