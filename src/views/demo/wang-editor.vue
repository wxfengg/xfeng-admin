<!-- wangEditor富文本编辑器示例 -->
<script setup lang="ts">
import Editor from '@/components/WangEditor/index.vue'

const value = ref('初始内容')
</script>

<template>
  <LayoutCom :show-search="false">
    <template #content>
      <editor v-model="value" style="height: 80%" />
    </template>
  </LayoutCom>
</template>
