<script setup lang="ts">
const route = useRoute()

interface Props {
  showTitle?: boolean // 是否显示标题
  showBtn?: boolean // 是否显示搜索、重置按钮
  showSearch?: boolean // 是否显示搜索区域
  hasTree?: boolean // 是否显示左边树区域
}
const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  showBtn: true,
  showSearch: true,
  hasTree: false,
})
</script>

<template>
  <div class="layout-container">
    <el-row :gutter="0" class="wh-full!">
      <el-col :span="4" v-if="hasTree">
        <el-card class="tree-container" shadow="always">
          <!-- 当左右布局时，左边树区域 -->
          <slot name="tree"></slot>
        </el-card>
      </el-col>
      <el-col :span="hasTree ? 20 : 24" class="wh-full!">
        <div class="app-container">
          <div class="search-container" v-if="showSearch">
            <!-- 搜索区域 -->
            <slot name="search"></slot>
          </div>

          <el-card
            shadow="always"
            border="none"
            :body-style="{ flex: 1, overflow: 'hidden' }"
            class="table-container">
            <template #header>
              <div class="table-header">
                <div class="table-header-title">
                  {{ showTitle ? route.meta.title : '' }}
                </div>
                <div class="table-header-button">
                  <!-- 表格顶部按钮区域 -->
                  <slot name="header"></slot>
                </div>
              </div>
            </template>

            <div class="wh-full! flex flex-col items-stretch overflow-hidden">
              <div class="flex-1 overflow-hidden">
                <!-- 表格主体内容区域 -->
                <slot name="content"></slot>
              </div>

              <div>
                <!-- 分页区域 -->
                <slot name="pagination"></slot>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 拓展插槽，用于给弹窗等模块放置 -->
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  padding: 15px;

  .tree-container {
    height: 100% !important;
    margin-right: 15px;
    border-radius: 10px !important;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    width: 100% !important;
    height: 100%;

    .search-container {
      padding: 18px 18px 0;
      margin-bottom: 15px;
      background-color: var(--el-bg-color-overlay);
      border-radius: 10px;
      box-shadow: rgb(99 99 99 / 20%) 0 2px 8px 0;

      :deep(.el-form-item) {
        width: 100% !important;
      }
    }

    .table-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: stretch;
      overflow-y: hidden;
      border-radius: 10px !important;

      .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .table-header-title {
          font-size: 17px;
          font-weight: bold;
          color: #1d1d1d;
        }
      }
    }
  }
}
</style>
