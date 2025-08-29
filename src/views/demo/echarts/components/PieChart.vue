<script setup lang="ts">
import { useEcharts } from '@/hooks/echarts'

defineOptions({ name: 'PieChart' })

const options = ref({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0,
    },
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca', '#ff6b72'],
      name: '饼图数据',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
        },
      },
      labelLine: {
        show: false,
      },
      data: [] as { name: string; value: number }[],
    },
  ],
})
const { domRef, initChart, showLoading, setOptions } = useEcharts(
  options.value,
  { loading: false }
)

const fetchData = async () => {
  showLoading()

  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  const dataList = [
    [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 300, name: '视频广告' },
    ],
    [
      { value: 335, name: '直接访问' },
      { value: 310, name: '邮件营销' },
      { value: 234, name: '联盟广告' },
      { value: 135, name: '视频广告' },
      { value: 1548, name: '搜索引擎' },
    ],
    [
      { value: 400, name: '直接访问' },
      { value: 200, name: '邮件营销' },
      { value: 100, name: '联盟广告' },
      { value: 220, name: '视频广告' },
      { value: 800, name: '搜索引擎' },
    ],
    [
      { value: 300, name: '直接访问' },
      { value: 500, name: '邮件营销' },
      { value: 450, name: '视频广告' },
      { value: 600, name: '搜索引擎' },
    ],
    [
      { value: 250, name: '直接访问' },
      { value: 400, name: '邮件营销' },
      { value: 200, name: '联盟广告' },
      { value: 300, name: '视频广告' },
      { value: 700, name: '搜索引擎' },
    ],
  ]

  options.value.series[0].data =
    dataList[Math.floor(Math.random() * dataList.length)]

  setOptions(options.value)
}

onMounted(() => initChart().then(() => fetchData()))
</script>

<template>
  <div ref="domRef" class="size-full"></div>
  <el-button
    type="primary"
    class="absolute top-10px left-10px"
    size="small"
    @click="fetchData">
    切换数据
  </el-button>
</template>

<style lang="scss" scoped></style>
