<script setup lang="ts">
defineOptions({
  name: 'Dept',
  inheritAttrs: false,
})

import DeptAPI, { DeptVO, DeptForm, DeptQuery } from '@/api/dept'

const queryFormRef = ref(ElForm)
const deptFormRef = ref(ElForm)

const loading = ref(false)
const ids = ref<number[]>([])
const dialog = reactive({
  title: '',
  visible: false,
})

const queryParams = reactive<DeptQuery>({})
const deptList = ref<DeptVO[]>()

const deptOptions = ref<OptionType[]>()

const formData = reactive<DeptForm>({
  status: 1,
  parentId: 0,
  sort: 1,
})

const rules = reactive({
  parentId: [
    { required: true, message: '上级部门不能为空', trigger: 'change' },
  ],
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '部门编号不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
})

/** 查询部门 */
function handleQuery() {
  loading.value = true
  DeptAPI.getList(queryParams).then((data) => {
    deptList.value = data
    loading.value = false
  })
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/**
 * 打开部门弹窗
 *
 * @param parentId 父部门ID
 * @param deptId 部门ID
 */
async function handleOpenDialog(parentId?: number, deptId?: number) {
  // 加载部门下拉数据
  const data = await DeptAPI.getOptions()
  deptOptions.value = [
    {
      value: 0,
      label: '顶级部门',
      children: data,
    },
  ]

  dialog.visible = true
  if (deptId) {
    dialog.title = '修改部门'
    DeptAPI.getFormData(deptId).then((data) => {
      Object.assign(formData, data)
    })
  } else {
    dialog.title = '新增部门'
    formData.parentId = parentId ?? 0
  }
}

/** 提交部门表单 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true
      const deptId = formData.id
      if (deptId) {
        DeptAPI.update(deptId, formData)
          .then(() => {
            ElMessage.success('修改成功')
            handleCloseDialog()
            handleQuery()
          })
          .finally(() => (loading.value = false))
      } else {
        DeptAPI.add(formData)
          .then(() => {
            ElMessage.success('新增成功')
            handleCloseDialog()
            handleQuery()
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds = [deptId || ids.value].join(',')

  if (!deptIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm(`确认删除已选中的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(
    () => {
      loading.value = true
      DeptAPI.deleteByIds(deptIds)
        .then(() => {
          ElMessage.success('删除成功')
          handleResetQuery()
        })
        .finally(() => (loading.value = false))
    },
    () => {
      ElMessage.info('已取消删除')
    }
  )
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false

  deptFormRef.value.resetFields()
  deptFormRef.value.clearValidate()

  formData.id = undefined
  formData.parentId = 0
  formData.status = 1
  formData.sort = 1
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <LayoutCom>
    <template #search>
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-row :gutter="22">
          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="部门名称" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入部门名称搜索"
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="部门状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable>
                <el-option :value="1" label="正常" />
                <el-option :value="0" label="禁用" />
              </el-select>
            </el-form-item>
          </el-col>

          <div class="flex-1 pr-13px">
            <el-form-item>
              <div class="w-full flex-y-center justify-end">
                <el-button type="primary" @click="handleQuery">
                  <template #icon><i-ep-search /></template>
                  搜索
                </el-button>
                <el-button @click="handleResetQuery">
                  <template #icon><i-ep-refresh /></template>
                  重置
                </el-button>
              </div>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </template>
    <template #header>
      <el-button
        v-hasPerm="['sys:dept:add']"
        type="success"
        plain
        @click="handleOpenDialog(0, undefined)">
        <template #icon><i-ep-plus /></template>
        新增
      </el-button>
      <el-button
        v-hasPerm="['sys:dept:delete']"
        type="danger"
        plain
        :disabled="ids.length === 0"
        @click="handleDelete()">
        <template #icon><i-ep-delete /></template>批量删除
      </el-button>
    </template>
    <template #content>
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        class="table-1"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="部门名称" min-width="200" />
        <el-table-column
          prop="code"
          label="部门编号"
          width="200"
          align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="100" align="center" />

        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:dept:add']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(scope.row.id, undefined)"
              ><i-ep-plus />新增
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(scope.row.parentId, scope.row.id)"
              ><i-ep-edit />编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:delete']"
              type="danger"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)">
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </LayoutCom>
</template>

<style lang="scss" scoped></style>
