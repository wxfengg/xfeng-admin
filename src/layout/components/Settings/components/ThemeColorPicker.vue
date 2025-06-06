<template>
  <el-color-picker
    v-model="currentColor"
    :predefine="colorPresets"
    show-alpha
    popper-class="theme-picker-dropdown" />
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/store'

const settingsStore = useSettingsStore()

// 定义颜色预设
const colorPresets = [
  '#646cff',
  '#3b82f6',
  '#8b5cf6',
  '#a855f7',
  '#0ea5e9',
  '#06b6d4',
  '#f43f5e',
  '#ef4444',
  '#ec4899',
  '#d946ef',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
]

const currentColor = computed({
  get: () => settingsStore.themeColor,
  set: (value) => settingsStore.changeThemeColor(value),
})
</script>

<style scoped>
:deep(.theme-picker-dropdown) {
  z-index: 99999 !important;
}
</style>
