import * as echarts from 'echarts'

/**
 * ECharts Hook 选项 定义成类型后续方便拓展
 * @property loading 是否开启loading，默认开启
 * @property resize 是否开启图表自适应，默认开启
 * @property map 是否开启地图模式，默认不开启, 传入地图配置后开启
 */
export interface HookOptions {
  loading?: boolean
  resize?: boolean
  map?: {
    mapName: string // 注册地图名称
    geoJson: any // 地图json数据
    specialAreas?: object // 特殊区域配置
  }
}

/**
 * Loadning 选项 定义成类型后续方便拓展
 * @property loadingText loading文本，默认'正在加载数据...'
 * @property textColor 文本颜色，默认'#000'
 * @property maskColor 遮罩颜色，默认'transparent'
 */
export interface LoadingOptions {
  text?: string // loading文本
  textColor?: string // 文本颜色
  maskColor?: string // 遮罩颜色
}

/**
 * 自定义 ECharts Hook
 * @param initOptions ECharts图表初始配置项
 * @param hookOptions hook 配置选项
 * @returns
 */
export const useEcharts = (
  initOptions: echarts.EChartsCoreOption,
  hookOptions?: HookOptions
) => {
  // 传入了 hookOptions 就是用传入的值。如果没有，则使用默认值。
  hookOptions = {
    loading: true,
    resize: true,
    ...hookOptions,
  }

  const domRef = ref<HTMLElement | null>(null)
  const { width, height } = useElementSize(domRef)

  let chartInstance: echarts.ECharts | null = null

  /** 初始化图表实例 */
  const initChart = async (loadingOptions?: LoadingOptions) => {
    if (!domRef.value || width.value <= 0 || height.value <= 0) return
    await nextTick()
    chartInstance = echarts.init(domRef.value)

    // 如果开启地图模式，注册地图数据
    if (hookOptions.map) {
      const { mapName, geoJson, specialAreas } = hookOptions.map
      // 注册地图数据
      echarts.registerMap(
        mapName,
        (geoJson.value as any) || (geoJson as any),
        specialAreas as any
      )
    }

    // 开启loading
    showLoading(loadingOptions)

    const opts: any = initOptions.value || initOptions

    chartInstance?.setOption(opts)
  }

  /** 设置图表配置项 */
  const setOptions = async (
    options: echarts.EChartsCoreOption,
    isReset?: boolean,
    lazyUpdate?: boolean
  ) => {
    if (!chartInstance) return
    chartInstance?.setOption(options, isReset, lazyUpdate)
    // 更新图表配置项后，关闭loading
    hideLoading()
  }

  /** 图表自适应 */
  const resize = () => {
    if (!Boolean(domRef.value && chartInstance) || !hookOptions.resize) return
    chartInstance?.resize()
  }

  /** 销毁图表 */
  const disposeChart = () => {
    if (!chartInstance) return
    chartInstance?.dispose()
    chartInstance = null
  }

  /** 打开loading */
  const showLoading = (loadingOptions?: LoadingOptions) => {
    if (!chartInstance || !hookOptions.loading) return

    loadingOptions = {
      text: '正在加载数据...',
      textColor: '#000',
      maskColor: 'transparent',
      ...loadingOptions,
    }
    console.log('🚀 ~ showLoading ~ loadingOptions:', loadingOptions)
    chartInstance.showLoading(loadingOptions)
  }

  /** 关闭loading */
  const hideLoading = () => {
    if (!chartInstance) return
    chartInstance.hideLoading()
  }

  // 当图表的宽高发生改变时，触发图表的resize方法来自适应
  const scope = effectScope()
  scope.run(() => {
    watch([width, height], () => resize())
  })

  onScopeDispose(() => {
    disposeChart() // 销毁图表实例
    scope.stop() // 停止作用域监听
  })

  return {
    domRef,
    initChart,
    setOptions,
    showLoading,
    hideLoading,
  }
}
