<script setup lang="ts">
defineOptions({
  name: 'User',
  inheritAttrs: false,
})

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from '@/api/user'
import DeptAPI from '@/api/dept'
import RoleAPI from '@/api/role'

const isExpand = ref(false)

const queryFormRef = ref(ElForm)
const userFormRef = ref(ElForm)

const loading = ref(false)
const removeIds = ref([])
const total = ref(0)
const pageData = ref<UserPageVO[]>()
/** 部门下拉选项 */
const deptOptions = ref<OptionType[]>()
/** 角色下拉选项 */
const roleOptions = ref<OptionType[]>()
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  pageNum: 1,
  pageSize: 10,
})

/**  用户弹窗对象  */
const dialog = reactive({
  visible: false,
  title: '',
})

/** 导入弹窗显示状态 */
const importDialogVisible = ref(false)

// 用户表单数据
const formData = reactive<UserForm>({
  status: 1,
})

/** 用户表单校验规则  */
const rules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
})

/** 查询 */
function handleQuery() {
  loading.value = true
  UserAPI.getPage(queryParams)
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
  queryParams.deptId = undefined
  queryParams.createTime = undefined
  handleQuery()
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id)
}

/** 重置密码 */
function hancleResetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    '请输入用户「' + row.username + '」的新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  ).then(
    ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning('密码至少需要6位字符，请重新输入')
        return false
      }
      UserAPI.updatePassword(row.id, value).then(() => {
        ElMessage.success('密码重置成功，新密码是：' + value)
      })
    },
    () => {
      ElMessage.info('已取消重置密码')
    }
  )
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true
  // 加载角色下拉数据源
  roleOptions.value = await RoleAPI.getOptions()
  // 加载部门下拉数据源
  deptOptions.value = await DeptAPI.getOptions()

  if (id) {
    dialog.title = '修改用户'
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data })
    })
  } else {
    dialog.title = '新增用户'
  }
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false
  userFormRef.value.resetFields()
  userFormRef.value.clearValidate()

  formData.id = undefined
  formData.status = 1
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.id
      loading.value = true
      if (userId) {
        UserAPI.update(userId, formData)
          .then(() => {
            ElMessage.success('修改用户成功')
            handleCloseDialog()
            handleResetQuery()
          })
          .finally(() => (loading.value = false))
      } else {
        UserAPI.add(formData)
          .then(() => {
            ElMessage.success('新增用户成功')
            handleCloseDialog()
            handleResetQuery()
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(',')
  if (!userIds) {
    ElMessage.warning('请勾选删除项')
    return
  }

  ElMessageBox.confirm('确认删除用户?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(
    function () {
      loading.value = true
      UserAPI.deleteByIds(userIds)
        .then(() => {
          ElMessage.success('删除成功')
          handleResetQuery()
        })
        .finally(() => (loading.value = false))
    },
    function () {
      ElMessage.info('已取消删除')
    }
  )
}
/** 打开导入弹窗 */
function handleOpenImportDialog() {
  importDialogVisible.value = true
}

/** 导入用户成功 */
function handleOpenImportDialogSuccess() {
  handleQuery()
}

/** 导出用户 */
function handleExport() {
  UserAPI.export(queryParams).then((response: any) => {
    const fileData = response.data
    const fileName = decodeURI(
      response.headers['content-disposition'].split(';')[1].split('=')[1]
    )
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'

    const blob = new Blob([fileData], { type: fileType })
    const downloadUrl = window.URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <LayoutCom :show-btn="false" :has-tree="true">
    <template #tree>
      <dept-tree v-model="queryParams.deptId" @node-click="handleQuery" />
    </template>

    <template #search>
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="auto">
        <el-row :gutter="22">
          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="用户名" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入用户名搜索"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable>
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6">
            <el-form-item label="创建时间">
              <el-date-picker
                :editable="false"
                v-model="queryParams.createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6" v-show="isExpand">
            <el-form-item label="用户昵称" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入用户昵称搜索"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6" v-show="isExpand">
            <el-form-item label="部门" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入部门名称搜索"
                clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="6" v-show="isExpand">
            <el-form-item label="手机号码" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入手机号码搜索"
                clearable
                @keyup.enter="handleQuery" />
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

                <!-- 展开/收起 -->
                <el-link
                  class="ml-12px"
                  type="primary"
                  :underline="false"
                  @click="isExpand = !isExpand">
                  <template v-if="isExpand">
                    收起
                    <i-ep-arrow-up />
                  </template>
                  <template v-else>
                    展开
                    <i-ep-arrow-down />
                  </template>
                </el-link>
              </div>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </template>

    <template #header>
      <el-button
        v-hasPerm="['sys:user:add']"
        type="success"
        plain
        @click="handleOpenDialog()">
        <template #icon><i-ep-plus /></template>
        新增
      </el-button>
      <el-button
        v-hasPerm="['sys:user:delete']"
        type="danger"
        plain
        :disabled="removeIds.length === 0"
        @click="handleDelete()">
        <template #icon><i-ep-delete /></template>
        批量删除
      </el-button>
    </template>

    <template #content>
      <el-table
        v-loading="loading"
        :data="pageData"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          key="id"
          label="编号"
          align="center"
          prop="id"
          width="60" />
        <el-table-column
          key="username"
          label="用户名"
          align="center"
          prop="username" />
        <el-table-column
          label="用户昵称"
          prop="nickname"
          width="120"
          align="center" />

        <el-table-column
          label="性别"
          width="100"
          align="center"
          prop="genderLabel" />

        <el-table-column
          label="部门"
          width="150"
          align="center"
          prop="deptName" />
        <el-table-column
          label="手机号码"
          align="center"
          prop="mobile"
          width="120" />

        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
              {{ scope.row.status == 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180" />
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:user:password:reset']"
              type="primary"
              size="small"
              link
              @click="hancleResetPassword(scope.row)">
              <i-ep-refresh-left />
              重置密码
            </el-button>
            <el-button
              v-hasPerm="['sys:user:edit']"
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id)">
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:user:delete']"
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row.id)">
              <i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 用户表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :append-to-body="false"
      width="600px"
      @close="handleCloseDialog">
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <dictionary v-model="formData.gender" code="gender" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取 消</el-button>

          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </LayoutCom>
</template>

<style lang="scss" scoped></style>
