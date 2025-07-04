import request from '@/utils/request'

const GENERATOR_BASE_URL = '/api/v1/generator'

class GeneratorAPI {
  /** 获取数据表分页列表 */
  static getTablePage(params: TablePageQuery) {
    return request<any, PageResult<TablePageVO[]>>({
      url: `${GENERATOR_BASE_URL}/table/page`,
      method: 'get',
      params: params,
    })
  }

  /** 获取代码生成配置 */
  static getGenConfig(tableName: string) {
    return request<any, GenConfigForm>({
      url: `${GENERATOR_BASE_URL}/${tableName}/config`,
      method: 'get',
    })
  }

  /** 获取代码生成配置 */
  static saveGenConfig(tableName: string, data: GenConfigForm) {
    return request({
      url: `${GENERATOR_BASE_URL}/${tableName}/config`,
      method: 'post',
      data: data,
    })
  }

  /** 获取代码生成预览数据 */
  static getPreviewData(tableName: string) {
    return request<any, GeneratorPreviewVO[]>({
      url: `${GENERATOR_BASE_URL}/${tableName}/preview`,
      method: 'get',
    })
  }

  /** 重置代码生成配置 */
  static resetGenConfig(tableName: string) {
    return request({
      url: `${GENERATOR_BASE_URL}/${tableName}/config`,
      method: 'delete',
    })
  }

  /**
   * 下载 ZIP 文件
   * @param url
   * @param fileName
   */
  static download(tableName: string, fileName?: string) {
    return request({
      url: `${GENERATOR_BASE_URL}/${tableName}/download`,
      method: 'get',
      responseType: 'blob',
    }).then((res) => {
      const blob = new Blob([res.data], { type: 'application/zip' })
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName || '下载文件.zip'
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }
}

export default GeneratorAPI

/** 代码生成预览对象 */
export interface GeneratorPreviewVO {
  /** 文件生成路径 */
  path: string
  /** 文件名称 */
  fileName: string
  /** 文件内容 */
  content: string
}

/**  数据表分页查询参数 */
export interface TablePageQuery extends PageQuery {
  /** 关键字(表名) */
  keywords?: string
}

/** 数据表分页对象 */
export interface TablePageVO {
  /** 表名称 */
  tableName: string

  /** 表描述 */
  tableComment: string

  /** 存储引擎 */
  engine: string

  /** 字符集排序规则 */
  tableCollation: string

  /** 创建时间 */
  createTime: string
}

/** 代码生成配置表单 */
export interface GenConfigForm {
  /** 主键 */
  id?: number

  /** 表名 */
  tableName?: string

  /** 业务名 */
  businessName?: string

  /** 模块名 */
  moduleName?: string

  /** 包名 */
  packageName?: string

  /** 实体名 */
  entityName?: string

  /** 作者 */
  author?: string

  /** 上级菜单 */
  parentMenuId?: number

  /** 字段配置列表 */
  fieldConfigs?: FieldConfig[]
}

/** 字段配置 */
export interface FieldConfig {
  /** 主键 */
  id?: number

  /** 列名 */
  columnName?: string

  /** 列类型 */
  columnType?: string

  /** 字段名 */
  fieldName?: string

  /** 字段类型 */
  fieldType?: string

  /** 字段描述 */
  fieldComment?: string

  /** 是否在列表显示 */
  isShowInList?: number

  /** 是否在表单显示 */
  isShowInForm?: number

  /** 是否在查询条件显示 */
  isShowInQuery?: number

  /** 是否必填 */
  isRequired?: number

  /** 表单类型 */
  formType?: number

  /** 查询类型 */
  queryType?: number

  /** 字段长度 */
  maxLength?: number

  /** 字段排序 */
  fieldSort?: number

  /** 字典类型 */
  dictType?: string
}
