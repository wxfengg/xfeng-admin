<script setup lang="ts">
defineOptions({
  name: 'Log',
  inheritAttrs: false,
})

import LogAPI, { LogPageVO, LogPageQuery } from '@/api/log'

const queryFormRef = ref(ElForm)

const loading = ref(false)
const total = ref(0)

const queryParams = reactive<LogPageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: '',
  createTime: ['', ''],
})

// 日志表格数据
const pageData = ref<LogPageVO[]>()

/** 查询 */
function handleQuery() {
  loading.value = true
  LogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}
/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  queryParams.createTime = undefined
  handleQuery()
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <LayoutCom>
    <template #search>
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="auto">
        <el-row :gutter="22">
          <el-col :span="24" :md="12" :lg="6">
            <el-form-item prop="keywords" label="关键字">
              <el-input
                v-model="queryParams.keywords"
                placeholder="日志内容"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item prop="createTime" label="操作时间">
              <el-date-picker
                :editable="false"
                class="!w-[240px]"
                v-model="queryParams.createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>

          <div class="flex-1 pr-13px">
            <el-form-item>
              <div class="w-full flex-y-center justify-end">
                <el-button type="primary" @click="handleQuery">
                  <i-ep-search />
                  搜索
                </el-button>
                <el-button @click="handleResetQuery">
                  <i-ep-refresh />
                  重置
                </el-button>
              </div>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </template>

    <template #content>
      <el-table v-loading="loading" :data="pageData" border>
        <el-table-column
          label="操作时间"
          prop="createTime"
          width="180"
          align="center" />
        <el-table-column
          label="操作人"
          prop="operator"
          width="120"
          align="center" />
        <el-table-column
          label="日志模块"
          prop="module"
          width="100"
          align="center" />
        <el-table-column
          label="日志内容"
          prop="content"
          align="center"
          show-overflow-tooltip />
        <el-table-column label="IP 地址" prop="ip" width="150" align="center" />
        <el-table-column
          label="地区"
          prop="region"
          width="150"
          align="center" />
        <el-table-column
          label="浏览器"
          prop="browser"
          width="180"
          align="center" />
        <el-table-column
          label="终端系统"
          prop="os"
          width="200"
          align="center"
          show-overflow-tooltip />
        <el-table-column
          label="执行时间(ms)"
          prop="executionTime"
          width="120"
          align="center" />
      </el-table>
    </template>

    <template #pagination>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery" />
    </template>
  </LayoutCom>
</template>

<style lang="scss" scoped></style>
