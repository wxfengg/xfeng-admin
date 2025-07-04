<script setup lang="ts">
import {
  useAppStore,
  useTagsViewStore,
  useUserStore,
  useSettingsStore,
} from '@/store'
import defaultSettings from '@/settings'
import { DeviceEnum } from '@/enums/DeviceEnum'
import { MessageTypeEnum, MessageTypeLabels } from '@/enums/MessageTypeEnum'
import defaultAvatar from '@/assets/avatar.jpg'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()
const settingStore = useSettingsStore()

const route = useRoute()
const router = useRouter()

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE)

const { isFullscreen, toggle } = useFullscreen()

const activeTab = ref(MessageTypeEnum.MESSAGE)

const messages = ref([
  {
    id: 1,
    title: '系统升级通知：服务器将于今晚12点进行升级维护，请提前保存工作内容。',
    type: MessageTypeEnum.MESSAGE,
  },
  {
    id: 2,
    title: '新功能发布：我们的应用程序现在支持多语言功能。',
    type: MessageTypeEnum.MESSAGE,
  },
  {
    id: 3,
    title: '重要提醒：请定期更改您的密码以保证账户安全。',
    type: MessageTypeEnum.MESSAGE,
  },
  {
    id: 4,
    title: '通知：您有一条未读的系统消息，请及时查看。',
    type: MessageTypeEnum.NOTICE,
  },
  {
    id: 5,
    title: '新订单通知：您有一笔新的订单需要处理。',
    type: MessageTypeEnum.NOTICE,
  },
  {
    id: 6,
    title: '审核提醒：您的审核请求已被批准。',
    type: MessageTypeEnum.NOTICE,
  },
  { id: 7, title: '待办事项：完成用户权限设置。', type: MessageTypeEnum.TODO },
  { id: 8, title: '待办事项：更新产品列表。', type: MessageTypeEnum.TODO },
  { id: 9, title: '待办事项：备份数据库。', type: MessageTypeEnum.TODO },
])

const getFilteredMessages = (type: MessageTypeEnum) => {
  return messages.value.filter((message) => message.type === type)
}

/* 注销 */
const logout = async () => {
  await ElMessageBox.confirm('请确认是否退出当前系统？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    lockScroll: false,
  })

  await userStore.logout()
  await tagsViewStore.delAllViews()
  router.push(`/login?redirect=${route.fullPath}`)
}
</script>

<template>
  <div class="flex mr-10px">
    <template v-if="!isMobile">
      <!--全屏 -->
      <div class="nav-action-item" @click="toggle">
        <svg-icon
          :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
      </div>

      <!-- 消息通知 -->
      <el-dropdown class="message nav-action-item" trigger="click">
        <el-badge is-dot>
          <div class="flex-center h100% p10px">
            <i-ep-bell />
          </div>
        </el-badge>
        <template #dropdown>
          <div class="px-5 py-2">
            <el-tabs v-model="activeTab">
              <el-tab-pane
                v-for="(label, key) in MessageTypeLabels"
                :label="label"
                :name="key"
                :key="key">
                <div
                  class="w-[380px] py-2"
                  v-for="message in getFilteredMessages(key)"
                  :key="message.id">
                  <el-link type="primary">
                    <el-text class="w-350px" size="default" truncated>
                      {{ message.title }}
                    </el-text>
                  </el-link>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-divider />
            <div class="flex-x-between">
              <el-link type="primary" :underline="false">
                <span class="text-xs">查看更多</span>
                <el-icon class="text-xs"><ArrowRight /></el-icon>
              </el-link>
              <el-link type="primary" :underline="false">
                <span class="text-xs">全部已读</span>
              </el-link>
            </div>
          </div>
        </template>
      </el-dropdown>
    </template>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="nav-action-item" @click="settingStore.settingsVisible = true">
        <svg-icon icon-class="setting" />
      </div>
    </template>

    <!-- 用户头像 -->
    <el-dropdown class="nav-action-item" trigger="click">
      <div class="flex-center h100% p10px">
        <img
          :src="userStore.user.avatar || defaultAvatar"
          class="rounded-full mr-10px w34px w34px" />
        <span class="font-bold text-[16px]">{{ userStore.user.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <div class="dropdown-item-box">
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item @click="logout">
            <div class="dropdown-item-box">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.nav-action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: calc($navbar-height - 20px) !important;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;
  border-radius: 15px;

  &:hover {
    background: rgb(0 0 0 / 5%);
  }
}

:deep(.el-dropdown__popper.el-popper) {
  border-radius: 10px !important;
}

.dropdown-item-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 3px;
}

.el-dropdown-menu {
  padding: 8px !important;
  border-radius: 20px !important;
}

:deep(.el-dropdown-menu__item) {
  border-radius: 10px !important;
}

:deep(.el-dropdown-menu__item--divided) {
  margin: 0 !important;
}

:deep(.message .el-badge__content.is-fixed.is-dot) {
  top: 5px;
  right: 10px;
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

.dark .nav-action-item:hover {
  background: rgb(255 255 255 / 20%);
}

.layout-top .nav-action-item,
.layout-mix .nav-action-item {
  color: #fff;
}
</style>
