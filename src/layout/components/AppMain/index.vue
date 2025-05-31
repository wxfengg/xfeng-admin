<template>
  <section class="app-main" :style="{ maxHeight: minHeight }">
    <router-view>
      <template #default="{ Component, route }">
        <Transition mode="out-in" name="fade-slide" appear>
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </Transition>
      </template>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { useSettingsStore, useTagsViewStore } from '@/store'
import variables from '@/styles/variables.module.scss'

const cachedViews = computed(() => useTagsViewStore().cachedViews) // 缓存页面集合
const minHeight = computed(() => {
  if (useSettingsStore().tagsView) {
    return `calc(100vh - ${variables['navbar-height']} - ${variables['tags-view-height']} - ${variables['copyright-height']})`
  } else {
    return `calc(100vh - ${variables['navbar-height']} - ${variables['copyright-height']})`
  }
})
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  height: 100%;
  background-color: var(--el-bg-color-page);
}
</style>
