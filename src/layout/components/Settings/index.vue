<template>
  <el-drawer v-model="settingsVisible" size="360" title="系统设置">
    <el-divider>{{ $t('settings.theme') }}</el-divider>
    <div class="flex-center">
      <el-switch
        v-model="isDark"
        active-icon="Moon"
        inactive-icon="Sunny"
        @change="changeTheme" />
    </div>

    <el-divider>{{ $t('settings.interface') }}</el-divider>
    <div class="setting-item">
      <span class="text-xs">主色</span>
      <ThemeColorPicker />
    </div>
    <div class="setting-item">
      <span class="text-xs">{{ $t('settings.watermark') }}</span>
      <el-switch v-model="settingsStore.watermarkEnabled" />
    </div>

    <el-divider class="mt-80px!">关于</el-divider>
    <div class="flex flex-col">
      <span class="text-16px">
        「xfeng-admin」是一款轻量级后台管理系统前端模板，无过度封装，开箱即用。项目简洁易上手，欢迎Star支持！
      </span>
      <br />
      <span>Email:</span>
      <span class="mb-10px">wxfengg@gmail.com</span>

      <span>GitHub:</span>
      <span class="mb-10px">
        <el-link
          href="https://github.com/wxfengg/xfeng-admin"
          target="_blank"
          class="text-16px! color-#000!">
          https://github.com/wxfengg/xfeng-admin
        </el-link>
      </span>

      <span>Blog:</span>
      <span class="mb-10px">
        <el-link
          href="https://wxfengg.github.io/xfeng-blog"
          target="_blank"
          class="text-16px! color-#000!">
          https://wxfengg.github.io/xfeng-blog
        </el-link>
      </span>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useSettingsStore, usePermissionStore, useAppStore } from '@/store'
import { LayoutEnum } from '@/enums/LayoutEnum'
import { ThemeEnum } from '@/enums/ThemeEnum'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const settingsVisible = computed({
  get() {
    return settingsStore.settingsVisible
  },
  set() {
    settingsStore.settingsVisible = false
  },
})

/** 切换主题 */
const isDark = ref<boolean>(settingsStore.theme === ThemeEnum.DARK)
const changeTheme = (val: any) => {
  isDark.value = val
  settingsStore.changeTheme(isDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT)
}

/** 切换布局 */
function changeLayout(layout: string) {
  settingsStore.changeLayout(layout)
  if (layout === LayoutEnum.MIX) {
    route.name && againActiveTop(route.name as string)
  }
}

/** 重新激活顶部菜单 */
function againActiveTop(newVal: string) {
  const parent = findOutermostParent(permissionStore.routes, newVal)
  if (appStore.activeTopMenu !== parent.path) {
    appStore.activeTopMenu(parent.path)
  }
}

/** 递归查找最外层父节点 */
function findOutermostParent(tree: any[], findName: string) {
  let parentMap: any = {}

  function buildParentMap(node: any, parent: any) {
    parentMap[node.name] = parent

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        buildParentMap(node.children[i], node)
      }
    }
  }

  for (let i = 0; i < tree.length; i++) {
    buildParentMap(tree[i], null)
  }

  let currentNode = parentMap[findName]
  while (currentNode) {
    if (!parentMap[currentNode.name]) {
      return currentNode
    }
    currentNode = parentMap[currentNode.name]
  }

  return null
}
</script>

<style lang="scss" scoped>
.setting-item {
  @apply py-1 flex-x-between;
}
</style>
