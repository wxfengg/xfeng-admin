<!-- 文件上传组件示例 -->
<script setup lang="ts">
import ImageUpload from '@/components/Upload/ImageUpload.vue'
import FileUpload from '@/components/Upload/FileUpload.vue'
const size = ref('')
// 这里放外链图片，防止被删
const picUrls = ref([
  'https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg',
  'https://s2.loli.net/2023/05/24/RuHFMwW4rG5lIqs.jpg',
  'https://s2.loli.net/2023/05/24/ZPiGbcpR91WqInB.jpg',
  'https://s2.loli.net/2023/05/24/e1bcnEq3MFdmlNL.jpg',
  'https://s2.loli.net/2023/05/24/wZTSPj1yDQNcuhU.jpg',
])
const imageUploadArgData = [
  {
    argsName: 'v-model',
    type: 'Arrays',
    default: '[]',
    desc: '已经上传的图片数组',
  },
  {
    argsName: 'action',
    type: 'String',
    default: 'FileAPI.uploadUrl',
    desc: '文件上传地址',
  },
  {
    argsName: 'headers',
    type: 'Object',
    default: '{Authorization: localStorage.getItem(TOKEN_KEY),}',
    desc: '提示文本类型',
  },
  {
    argsName: 'data',
    type: 'Object',
    default: '{}',
    desc: '请求携带的额外参数',
  },
  {
    argsName: 'name',
    type: 'String',
    default: 'file',
    desc: '上传文件的参数名',
  },
  {
    argsName: 'limit',
    type: 'Number',
    default: 10,
    desc: '上传最大的图片数量',
  },
  {
    argsName: 'show-del-btn',
    type: 'Boolean',
    default: true,
    desc: '是否显示删除按钮',
  },
  {
    argsName: 'show-upload-btn',
    type: 'Boolean',
    default: true,
    desc: '是否显示上传按钮',
  },
  {
    argsName: 'upload-max-size',
    type: 'Number',
    default: '2 * 1024 * 1024',
    desc: '单个图片上传大小限制(单位byte)',
  },
  {
    argsName: 'accept',
    type: 'String',
    default: 'image/*',
    desc: '上传文件类型',
  },
]

const fileUrls = ref([
  {
    name: 'file one.jpg',
    url: 'https://s2.loli.net/2023/05/24/yNsxFC8rLHMZQcK.jpg',
  },
  {
    name: 'file two.jpg',
    url: 'https://s2.loli.net/2023/05/24/RuHFMwW4rG5lIqs.jpg',
  },
])

const fileUploadArgData = [
  {
    argsName: 'v-model',
    type: 'Arrays',
    default: '[]',
    desc: '已经上传的文件数组',
  },
  {
    argsName: 'action',
    type: 'String',
    default: 'FileAPI.uploadUrl',
    desc: '文件上传地址',
  },
  {
    argsName: 'limit',
    type: 'Number',
    default: 10,
    desc: '上传最大的文件数量',
  },
  {
    argsName: 'show-del-btn',
    type: 'Boolean',
    default: true,
    desc: '是否显示删除按钮',
  },
  {
    argsName: 'show-upload-btn',
    type: 'Boolean',
    default: true,
    desc: '是否显示上传按钮',
  },
  {
    argsName: 'upload-max-size',
    type: 'Number',
    default: '2 * 1024 * 1024',
    desc: '单个文件上传大小限制(单位byte)',
  },
  {
    argsName: 'accept',
    type: 'String',
    default: '*',
    desc: '上传文件类型',
  },
  {
    argsName: 'upload-btn-text',
    type: 'String',
    default: '上传文件',
    desc: '上传按钮文本',
  },
  {
    argsName: 'show-tip',
    type: 'Boolean',
    default: false,
    desc: '是否显示提示',
  },
  {
    argsName: 'tip',
    type: 'String',
    default: '""',
    desc: '提示文本',
  },
  {
    argsName: 'headers',
    type: 'Object',
    default: '{Authorization: localStorage.getItem(TOKEN_KEY),}',
    desc: '提示文本类型',
  },
  {
    argsName: 'data',
    type: 'Object',
    default: '{}',
    desc: '请求携带的额外参数',
  },
  {
    argsName: 'name',
    type: 'String',
    default: 'file',
    desc: '上传文件的参数名',
  },
  {
    argsName: 'style',
    type: 'Object',
    default: "{width:'300px'}",
    desc: '上传组件的样式',
  },
]
</script>
<template>
  <LayoutCom :show-search="false">
    <template #content>
      <div class="h-full overflow-auto">
        <el-form>
          <el-form-item label="图片上传">
            <image-upload v-model="picUrls" />
          </el-form-item>
          <el-form-item label="参数说明">
            <el-table :data="imageUploadArgData" border>
              <el-table-column prop="argsName" label="参数名称" width="300" />
              <el-table-column prop="type" label="参数类型" width="200" />
              <el-table-column prop="default" label="默认值" width="400" />
              <el-table-column prop="desc" label="描述" width="300" />
            </el-table>
          </el-form-item>
          <el-form-item label="文件上传">
            <file-upload v-model="fileUrls" />
          </el-form-item>
          <el-form-item label="参数说明">
            <el-table :data="fileUploadArgData" border>
              <el-table-column prop="argsName" label="参数名称" width="300" />
              <el-table-column prop="type" label="参数类型" width="200" />
              <el-table-column prop="default" label="默认值" width="400" />
              <el-table-column prop="desc" label="描述" width="300" />
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </LayoutCom>
</template>
