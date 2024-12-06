<script setup lang="ts">
// import Message from './Message.vue';
// 滚动加载代码
import { ref } from 'vue'
import { getLatestMessages } from '../api'
const cycle = ref(0)
const tabsValue = ref(0)

const sum = ref<Message[]>([]); // 明确指定类型为 Message 数组
const infinityValue = ref(false)
const hasMore = ref(true)

interface Message {
  id: number;
  username: string;
  content: string;
  created_at: string;
}
const loadMore = async (done) => {
  try {
    const newMessages = await getLatestMessages(5, cycle.value); // 这里传递 limit 和 offset
    if (newMessages.length > 0) {
      sum.value = [...sum.value, ...newMessages];
      cycle.value++;
    } else {
      hasMore.value = false; // 如果没有更多留言
    }
  } catch (error) {
    console.error('加载留言失败:', error);
    hasMore.value = false; // 处理错误时也可以设置没有更多留言
  } finally {
    infinityValue.value = false; // 结束加载状态
    done(); // 通知无限加载组件加载完成
  }
};

</script>

<template>
  <main>
    <h1 class="centered-title">SCIT匿名留言墙</h1>
    <nut-infinite-loading v-model="infinityValue" :has-more="hasMore" @load-more="loadMore">
      <div class="test" v-for="item in sum" :key="item.id">{{ item.content }}1111</div>
    </nut-infinite-loading>
  </main>
</template>
<style>
main {
  height: 100%;
  width: 100vw;
}

.centered-title {
  text-align: center;
  /* 使文本居中 */
  width: 100%;
  /* 占据一整行 */
  margin: 0;
  /* 去除默认的外边距 */
  font-weight: bold;
  /* 设置为粗体 */
  color: #fff;
  /* 设置文字颜色为白色 */
  text-shadow:
    1px 1px 0px rgba(0, 0, 0, 0.7),
    /* 黑色描边 */
    -1px -1px 0px rgba(0, 0, 0, 0.7),
    1px -1px 0px rgba(0, 0, 0, 0.7),
    -1px 1px 0px rgba(0, 0, 0, 0.7);
}

h1 {}

.test {
  padding: 12px 20px;
  /* 上下左右内边距 */
  border-top: 1px solid #eee;
  /* 上边框 */
  background-color: #fff;
  /* 白色背景 */
  border-radius: 8px;
  /* 圆角边框 */
  height: 20vh;
  /* 高度 */
  margin: 15px 88px;
  /* 上下间距 */
}
</style>
