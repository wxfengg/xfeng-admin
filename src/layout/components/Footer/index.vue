<script setup lang="ts">
defineOptions({
  name: 'Footer',
})
</script>

<template>
  <div class="flex-center footer-container">
    <a
      href="https://wxfengg.github.io/xfeng-blog"
      target="_blank"
      class="color-gray"
      rel="noopener noreferrer">
      Copyright BY © XFeng
    </a>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  height: $copyright-height;
}
</style>
