<script setup lang="ts">
import PieChart from './components/PieChart.vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import MapChart from './components/MapChart.vue'
import LineBarChart from './components/LineBarChart.vue'
</script>

<template>
  <div class="size-full overflow-x-hidden flex justify-between gap-x-5px">
    <div class="w-28% flex-y-center flex-col justify-between">
      <div class="w-full h-48%">
        <PieChart />
      </div>
      <div class="w-full h-48%">
        <BarChart />
      </div>
    </div>

    <div class="w-44% h-full">
      <MapChart />
    </div>

    <div class="w-28% flex-y-center flex-col justify-between">
      <div class="w-full h-48%">
        <LineChart />
      </div>
      <div class="w-full h-48%">
        <LineBarChart />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
