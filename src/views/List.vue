<template>
  <div
		class="list-wrapper">
		<van-tabs
			v-model="active"
			sticky
			@click="switchActive">
			<template v-for="(item, index) in activeList">
				<van-tab
					:title="item.title"
					:name="item.name"
					:dot="activeDot[item.name]"
					:key="index">
				</van-tab>
			</template>
		</van-tabs>
		<scrollbar>
			<van-pull-refresh
				v-model="refreshing"
				@refresh="onRefresh">
				<van-list
					v-model="loading"
					:error.sync="error"
					:finished="finished"
					error-text="请求失败，点击重新加载"
					finished-text="没有更多了"
					@load="() => onLoad(this.active)">
					<van-cell
						v-for="item in list"
						:key="item.id"
						:title="item.title"
						@click="goDetail(item)" />
				</van-list>
			</van-pull-refresh>
		</scrollbar>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PullRefresh, List, Tab, Tabs } from 'vant'

export default {
  name: 'List',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List
  },
  data() {
    return {
      activeList: [
        { title: '已预约', name: 'appointed' },
        { title: '已过期', name: 'expired' },
        { title: '已取消', name: 'cancelled' },
        { title: '全部', name: 'all' }
      ],
      active: 'appointed',
      activeDot: {},
      list: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  created() {
    console.log('list page')
    this.getList()
  },
  methods: {
    switchActive(name, title) {
      console.log(name, title)
      this.list = []
      this.error = false
      this.loading = true
      this.finished = false
      this.refreshing = false
      if (name === 'all') {
        return this.getList()
      }
    },
    getList() {
      this.loading = true
      setTimeout(() => {
        this.list = Array.from({ length: 100 }, (_, idx) => {
          return {
            id: idx + 1,
            title: `订单${idx + 1}`,
            active: ['appointed', 'expired', 'cancelled'][(100 - idx) % 3]
          }
        })
        this.loading = false
      }, 2000)
    },
    onLoad(activeName) {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }

        for (let i = 0; i < 20; i++) {
          const id = this.list.length + 1
          this.list.push({ id, title: `订单${id}` })
        }
        this.loading = false
        this.activeDot[activeName] = true

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad(this.active)
    },
    goDetail(item) {
      this.$router.push({ name: 'Detail', params: { id: String(item.id) } })
    }
  }
}
</script>
<style lang="less" scoped>
.list-wrapper {
  .scroller-wrapper {
    height: calc(100vh - 50px);
  }
}
</style>

