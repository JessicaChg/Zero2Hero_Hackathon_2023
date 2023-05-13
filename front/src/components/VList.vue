<script setup lang="ts">
import useDeployStore from '@/store/deploy'
const store = useDeployStore()

const scrollBox = ref(null)
const items = ref(null)

const state = reactive({
  DataList: [],
  ItemBoxHeight: 0,
  Itemnum: 1,
  startIndex: 0
})

const originList = computed(() =>
  store.whiteList.map((e) => ({
    text: e,
    tid: e
  }))
)

const virtualList = computed(() => {
  let endIndex = state.startIndex + state.Itemnum
  if (endIndex >= originList.value.length) endIndex = originList.value.length
  return originList.value.slice(state.startIndex, endIndex)
})

const doscroll = () => {
  const curScrollTop = scrollBox.value.scrollTop
  if (curScrollTop > state.ItemBoxHeight) {
    const index = ~~(scrollBox.value.scrollTop / state.ItemBoxHeight)
    items.value.style.setProperty(
      'padding-top',
      `${index * state.ItemBoxHeight}px`
    )
    state.startIndex = index
  } else {
    items.value.style.setProperty('padding-top', '0px')
    state.startIndex = 0
  }
}

watchEffect(() => {
  if (originList.value.length > 0) {
    nextTick(() => {
      // 计算每行高度
      state.ItemBoxHeight = items.value.children[0].offsetHeight
      //计算屏幕内能显示的行数   +5是防止下拉过快出现白屏
      state.Itemnum =
        ~~(scrollBox.value.clientHeight / state.ItemBoxHeight) + 50
      // 设置列表总高度
      const ListHeight = state.ItemBoxHeight * originList.value.length
      items.value.style.setProperty('height', `${ListHeight}px`)
    })
  }
})
</script>
<template>
  <div class="addr-list">
    <div ref="scrollBox" class="container" @scroll="doscroll">
      <div ref="items" style="box-sizing: border-box">
        <div class="item" v-for="item in virtualList" :key="item.tid">
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.container {
  height: 500px;
  overflow-y: scroll;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
.container .item {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}
</style>
