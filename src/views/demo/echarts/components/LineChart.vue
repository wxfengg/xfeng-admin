<script setup lang="ts">
import { useEcharts } from '@/hooks/echarts'
import * as echarts from 'echarts'

defineOptions({
  name: 'LineChart',
})

const colorList = ['#73EC8B', '#FFE700', '#F6ED0D', '#FD2BFF', '#9E87FF']
const options = ref({
  legend: {
    icon: 'circle',
    top: '0%',
    right: '5%',
    itemWidth: 6,
    itemGap: 20,
    textStyle: { color: '#333' },
  },
  grid: {
    top: '25%',
    bottom: '15%',
  },
  tooltip: {
    trigger: 'axis',
    borderWidth: 0,
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  xAxis: [
    {
      type: 'category',
      data: [] as string[],
      axisLine: { lineStyle: { color: '#8FD14F' } },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        margin: 15,
      },
      axisPointer: {
        label: {
          padding: [0, 0, 10, 0],
          margin: 15,
          backgroundColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fff' },
              { offset: 0.86, color: '#fff' },
              { offset: 0.86, color: '#33c0cd' },
              { offset: 1, color: '#33c0cd' },
            ],
          },
        },
      },
      boundaryGap: false,
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: 'cm',
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed', color: 'rgba(255,255,255,0.3)' },
      },
    },
    {
      type: 'value',
      name: 'm',
      position: 'right',
      axisTick: { show: false },
      axisLabel: { formatter: '{value}' },
      axisLine: { show: false },
      splitLine: { show: false },
    },
  ],
  series: [] as any[],
})
const { domRef, initChart, setOptions } = useEcharts(options.value, {
  loading: false,
})

const fetchData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })

  options.value.xAxis[0].data = ['100年', '600年', '1100年', '1600年']

  const series = [
    { name: '胸径', data: [10, 10, 30, 12] },
    { name: '树高', data: [5, 12, 11, 14] },
  ]

  const seriesArr = series.map((item, idx) => ({
    name: item.name,
    type: 'line',
    data: item.data,
    symbolSize: 7,
    symbol: 'circle',
    smooth: true,
    // 最后一条（这里只两条，所以 idx===1 的为右侧 Y 轴）
    yAxisIndex: idx === series.length - 1 ? 1 : 0,
    showSymbol: true,
    lineStyle: {
      width: 2,
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        { offset: 0, color: colorList[idx] },
        { offset: 1, color: colorList[idx] },
      ]),
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colorList[idx] + '80' }, // 半透明
        { offset: 1, color: colorList[idx] + '10' }, // 更透明
      ]),
    },
    itemStyle: {
      color: colorList[idx],
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  }))

  options.value.series = seriesArr

  setOptions(options.value)
}

onMounted(() => initChart().then(() => fetchData()))
</script>

<template>
  <div ref="domRef" class="size-full"></div>
</template>

<style lang="scss" scoped></style>
