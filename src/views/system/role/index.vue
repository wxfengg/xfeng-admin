<script setup lang="ts">
defineOptions({
  name: 'Role',
  inheritAttrs: false,
})

const route = useRoute()

import RoleAPI, { RolePageVO, RoleForm, RolePageQuery } from '@/api/role'
import MenuAPI from '@/api/menu'

const queryFormRef = ref(ElForm)
const roleFormRef = ref(ElForm)
const permTreeRef = ref<InstanceType<typeof ElTree>>()

const loading = ref(false)
const ids = ref<number[]>([])
const total = ref(0)

const queryParams = reactive<RolePageQuery>({
  pageNum: 1,
  pageSize: 10,
})

// 角色表格数据
const roleList = ref<RolePageVO[]>()
// 菜单权限下拉
const menuPermOptions = ref<OptionType[]>([])

// 弹窗
const dialog = reactive({
  title: '',
  visible: false,
})
// 角色表单
const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  code: '',
  name: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  dataScope: [{ required: true, message: '请选择数据权限', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
})

// 选中的角色
interface CheckedRole {
  id?: number
  name?: string
}
const checkedRole = ref<CheckedRole>({})
const assignPermDialogVisible = ref(false)

const permKeywords = ref('')
const isExpanded = ref(true)

const parentChildLinked = ref(true)

/** 查询 */
function handleQuery() {
  loading.value = true
  RoleAPI.getPage(queryParams)
    .then((data) => {
      roleList.value = data.list
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
  handleQuery()
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id)
}

/** 打开角色弹窗 */
function handleOpenDialog(roleId?: number) {
  dialog.visible = true
  if (roleId) {
    dialog.title = '修改角色'
    RoleAPI.getFormData(roleId).then((data) => {
      Object.assign(formData, data)
    })
  } else {
    dialog.title = '新增角色'
  }
}

/** 提交角色表单 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true
      const roleId = formData.id
      if (roleId) {
        RoleAPI.update(roleId, formData)
          .then(() => {
            ElMessage.success('修改成功')
            handleCloseDialog()
            handleResetQuery()
          })
          .finally(() => (loading.value = false))
      } else {
        RoleAPI.add(formData)
          .then(() => {
            ElMessage.success('新增成功')
            handleCloseDialog()
            handleResetQuery()
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}

/** 关闭角色弹窗 */
function handleCloseDialog() {
  dialog.visible = false

  roleFormRef.value.resetFields()
  roleFormRef.value.clearValidate()

  formData.id = undefined
  formData.sort = 1
  formData.status = 1
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(',')
  if (!roleIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(
    () => {
      loading.value = true
      RoleAPI.deleteByIds(roleIds)
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

/** 打开分配菜单权限弹窗 */
async function handleOpenAssignPermDialog(row: RolePageVO) {
  const roleId = row.id
  if (roleId) {
    assignPermDialogVisible.value = true
    loading.value = true

    checkedRole.value.id = roleId
    checkedRole.value.name = row.name

    // 获取所有的菜单
    menuPermOptions.value = await MenuAPI.getOptions()

    // 回显角色已拥有的菜单
    RoleAPI.getRoleMenuIds(roleId)
      .then((data) => {
        const checkedMenuIds = data
        checkedMenuIds.forEach((menuId) =>
          permTreeRef.value!.setChecked(menuId, true, false)
        )
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/** 分配菜单权限提交 */
function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id
  if (roleId) {
    const checkedMenuIds: number[] = permTreeRef
      .value!.getCheckedNodes(false, true)
      .map((node: any) => node.value)

    loading.value = true
    RoleAPI.updateRoleMenus(roleId, checkedMenuIds)
      .then(() => {
        ElMessage.success('分配权限成功')
        assignPermDialogVisible.value = false
        handleResetQuery()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/** 展开/收缩 菜单权限树  */
function togglePermTree() {
  isExpanded.value = !isExpanded.value
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand()
      } else {
        node.collapse()
      }
    })
  }
}

/** 权限筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val)
})

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any
  }
) {
  if (!value) return true
  return data.label.includes(value)
}

/** 父子菜单节点是否联动 change*/
function handleparentChildLinkedChange(val: any) {
  parentChildLinked.value = val
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <LayoutCom :show-btn="false">
    <template #search>
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="auto">
        <el-row :gutter="22">
          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="角色名称" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入角色名称搜索"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="角色编码" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入角色编码搜索"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="角色状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable>
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
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
      <el-button type="success" plain @click="handleOpenDialog()">
        <template #icon><i-ep-plus /></template>
        新增
      </el-button>
      <el-button
        type="danger"
        plain
        :disabled="ids.length === 0"
        @click="handleDelete()">
        <template #icon><i-ep-delete /></template>
        批量删除
      </el-button>
    </template>

    <template #content>
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="角色名称"
          prop="name"
          min-width="100"
          align="center" />
        <el-table-column
          label="角色编码"
          prop="code"
          width="150"
          align="center" />

        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="sort" width="80" align="center" />

        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenAssignPermDialog(scope.row)">
              <i-ep-position />
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)">
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)">
              <i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery" />

      <!-- 角色表单弹窗 -->
      <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog">
        <el-form
          ref="roleFormRef"
          :model="formData"
          :rules="rules"
          label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入角色名称" />
          </el-form-item>

          <el-form-item label="角色编码" prop="code">
            <el-input v-model="formData.code" placeholder="请输入角色编码" />
          </el-form-item>

          <el-form-item label="数据权限" prop="dataScope">
            <el-select v-model="formData.dataScope">
              <el-option :key="0" label="全部数据" :value="0" />
              <el-option :key="1" label="部门及子部门数据" :value="1" />
              <el-option :key="2" label="本部门数据" :value="2" />
              <el-option :key="3" label="本人数据" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="formData.sort"
              controls-position="right"
              :min="0"
              style="width: 100px" />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
            <el-button @click="handleCloseDialog">取 消</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 分配权限弹窗 -->
      <el-drawer
        v-model="assignPermDialogVisible"
        :title="'【' + checkedRole.name + '】权限分配'"
        size="500">
        <div class="flex-x-between">
          <el-input
            v-model="permKeywords"
            clearable
            class="w-[200px]"
            placeholder="菜单权限名称">
            <template #prefix>
              <i-ep-search />
            </template>
          </el-input>

          <div class="flex-center">
            <el-button
              type="primary"
              size="small"
              plain
              @click="togglePermTree">
              <i-ep-switch />
              {{ isExpanded ? '收缩' : '展开' }}
            </el-button>
            <el-checkbox
              v-model="parentChildLinked"
              @change="handleparentChildLinkedChange"
              class="ml-5">
              父子联动
            </el-checkbox>

            <el-tooltip placement="bottom">
              <template #content>
                如果只需勾选菜单权限，不需要勾选子菜单或者按钮权限，请关闭父子联动
              </template>
              <i-ep-QuestionFilled
                class="ml-1 color-[--el-color-primary] inline-block cursor-pointer" />
            </el-tooltip>
          </div>
        </div>

        <el-tree
          ref="permTreeRef"
          node-key="value"
          show-checkbox
          :data="menuPermOptions"
          :filter-node-method="handlePermFilter"
          :default-expand-all="true"
          :check-strictly="!parentChildLinked"
          class="mt-5">
          <template #default="{ data }">
            {{ data.label }}
          </template>
        </el-tree>

        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleAssignPermSubmit">
              确 定
            </el-button>
            <el-button @click="assignPermDialogVisible = false"
              >取 消</el-button
            >
          </div>
        </template>
      </el-drawer>
    </template>
  </LayoutCom>
</template>

<style lang="scss" scoped></style>
