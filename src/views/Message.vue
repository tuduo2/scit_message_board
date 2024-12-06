<template>
  <div class="message-input">
    <nut-input v-model="username" placeholder="请输入用户名" clearable class="username-input" />
    <nut-input v-model="message" placeholder="请输入留言" clearable @confirm="submitMessage" />
    <nut-button @click="submitMessage">提交</nut-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Input as NutInput, Button as NutButton } from '@nutui/nutui';
import { createMessage } from '../api'; // 确保路径正确

export default defineComponent({
  components: {
    NutInput,
    NutButton,
  },
  setup() {
    const username = ref('');
    const message = ref('');

    const submitMessage = async () => {
      if (username.value.trim() && message.value.trim()) {
        try {
          const data = await createMessage(username.value, message.value);
          console.log('留言创建成功:', data);
          // 清空输入框
          username.value = '';
          message.value = '';
        } catch (error) {
          console.error('留言创建失败:', error);
          alert('留言提交失败，请重试');
        }
      } else {
        alert('用户名和留言内容不能为空');
      }
    };

    return {
      username,
      message,
      submitMessage,
    };
  },
});
</script>

<style scoped>
.message-input {
  display: flex;
  flex-direction: column;
}

.username-input {
  margin-bottom: 10px;
}
</style>