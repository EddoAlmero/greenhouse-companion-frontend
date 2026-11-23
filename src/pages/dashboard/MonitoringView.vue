
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from 'chart.js'

import {
  Droplets,
  Sprout,
  Thermometer,
  Activity,
  Clock,
  TrendingUp,
} from 'lucide-vue-next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
)

// Sensor definitions
const sensorList = [
  {
    key: 'ambient_temp_c',
    title: 'Ambient Temperature',
    label: 'Ambient Temperature',
    value: 28.6,
    unit: '°C',
    icon: Thermometer,
    color: '#059669',
    description: 'Temperature of the surrounding air',
  },
  {
    key: 'ambient_humidity',
    title: 'Ambient Humidity',
    label: 'Ambient Humidity',
    value: 68,
    unit: '%',
    icon: Droplets,
    color: '#0ea5e9',
    description: 'Humidity level of the surrounding air',
  },
  {
    key: 'soil_temp_c',
    title: 'Soil Temperature',
    label: 'Soil Temperature',
    value: 24.3,
    unit: '°C',
    icon: Thermometer,
    color: '#f59e0b',
    description: 'Temperature measured in the soil',
  },
  {
    key: 'soil_moisture',
    title: 'Soil Moisture',
    label: 'Soil Moisture',
    value: 42,
    unit: '%',
    icon: Sprout,
    color: '#8b5cf6',
    description: 'Moisture level measured in the soil',
  },
] as const

type SensorKey = typeof sensorList[number]['key']
type TimeRange = '1h' | '6h' | '24h' | '7d'

const selectedSensor = ref<SensorKey>('ambient_temp_c')
const selectedRange = ref<TimeRange>('1h')

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '1 Hour', value: '1h' },
  { label: '6 Hours', value: '6h' },
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
]

// Simulated historical data
const chartLabels: Record<TimeRange, string[]> = {
  '1h': ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00'],
  '6h': ['03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00'],
  '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

const chartReadings: Record<SensorKey, Record<TimeRange, number[]>> = {
  ambient_temp_c: {
    '1h': [26.2, 26.8, 27.5, 28.1, 29.2, 28.8, 28.6],
    '6h': [24.8, 25.2, 26.1, 27.4, 28.1, 28.8, 28.6],
    '24h': [25.1, 24.7, 26.2, 29.2, 30.1, 27.8, 25.9],
    '7d': [26.1, 27.2, 28.0, 27.5, 29.1, 28.4, 28.6],
  },
  ambient_humidity: {
    '1h': [72, 71, 70, 69, 67, 68, 68],
    '6h': [78, 76, 74, 72, 70, 69, 68],
    '24h': [82, 79, 75, 68, 65, 70, 76],
    '7d': [75, 72, 69, 71, 67, 70, 68],
  },
  soil_temp_c: {
    '1h': [23.1, 23.3, 23.7, 24.0, 24.5, 24.4, 24.3],
    '6h': [22.5, 22.8, 23.1, 23.7, 24.0, 24.2, 24.3],
    '24h': [22.8, 22.5, 23.1, 24.5, 25.0, 24.1, 23.4],
    '7d': [23.0, 23.2, 23.8, 24.1, 24.6, 24.2, 24.3],
  },
  soil_moisture: {
    '1h': [48, 47, 45, 44, 43, 42, 42],
    '6h': [55, 53, 51, 48, 46, 44, 42],
    '24h': [58, 55, 51, 46, 43, 45, 42],
    '7d': [52, 49, 47, 45, 44, 43, 42],
  },
}

const activeSensor = computed(() => {
  return sensorList.find((sensor) => sensor.key === selectedSensor.value)!
})

const chartData = computed(() => ({
  labels: chartLabels[selectedRange.value],
  datasets: [
    {
      label: activeSensor.value.label,
      data: chartReadings[selectedSensor.value][selectedRange.value],
      borderColor: activeSensor.value.color,
      backgroundColor: `${activeSensor.value.color}18`,
      borderWidth: 2.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: activeSensor.value.color,
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#111827',
      padding: 12,
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      callbacks: {
        label: (context) =>
          `${context.parsed.y} ${activeSensor.value.unit}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#9ca3af',
        font: { size: 11 },
      },
      border: { display: false },
    },
    y: {
      beginAtZero: false,
      grid: { color: '#f3f4f6' },
      ticks: {
        color: '#9ca3af',
        font: { size: 11 },
        callback: (value) => `${value} ${activeSensor.value.unit}`,
      },
      border: { display: false },
    },
  },
}))
</script>

<template>
  <div>
    <!-- Page Introduction -->
    <section class="mb-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">
            Monitoring
          </h3>

          <p class="mt-1 text-sm text-gray-500">
            Monitor greenhouse sensor readings and historical data.
          </p>
        </div>

        <div class="flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          Simulated Data
        </div>
      </div>
    </section>

    <!-- Sensor Summary -->
    <section class="mb-8">
      <div class="mb-4">
        <h4 class="text-lg font-bold text-gray-900">
          Current Sensor Readings
        </h4>

        <p class="mt-1 text-sm text-gray-500">
          Overview of the latest greenhouse environmental measurements.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="sensor in sensorList"
          :key="sensor.key"
          type="button"
          @click="selectedSensor = sensor.key"
          class="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          :class="selectedSensor === sensor.key
            ? 'border-emerald-500 ring-2 ring-emerald-100'
            : 'border-gray-200'"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">
                {{ sensor.title }}
              </p>

              <div class="mt-4 flex items-baseline gap-1">
                <span class="text-3xl font-bold tracking-tight text-gray-900">
                  {{ sensor.value }}
                </span>

                <span class="text-sm font-medium text-gray-500">
                  {{ sensor.unit }}
                </span>
              </div>
            </div>

            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
              <component :is="sensor.icon" :size="22" />
            </div>
          </div>

          <div class="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
            <span class="h-2 w-2 rounded-full bg-emerald-500" />

            <p class="text-xs text-gray-500">
              Latest simulated reading
            </p>
          </div>
        </button>
      </div>
    </section>

    <!-- Historical Chart -->
    <section class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h4 class="text-lg font-bold text-gray-900">
            Historical Sensor Data
          </h4>

          <p class="mt-1 text-sm text-gray-500">
            {{ activeSensor.description }}
          </p>
        </div>

        <!-- Time Range Filter -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            type="button"
            @click="selectedRange = range.value"
            class="rounded-lg px-3 py-2 text-xs font-semibold transition"
            :class="selectedRange === range.value
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- Selected Sensor -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
        <div>
          <p class="text-xs font-medium text-gray-500">
            Selected Parameter
          </p>

          <p class="mt-1 font-semibold text-gray-900">
            {{ activeSensor.label }}
          </p>
        </div>

        <div class="text-right">
          <p class="text-xs font-medium text-gray-500">
            Latest Reading
          </p>

          <p class="mt-1 text-xl font-bold text-gray-900">
            {{ activeSensor.value }} {{ activeSensor.unit }}
          </p>
        </div>
      </div>

      <!-- Chart -->
      <div class="mt-6 h-80 w-full">
        <Line
          :data="chartData"
          :options="chartOptions"
        />
      </div>

      <div class="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
        <Clock :size="14" />
        <span>Demo data — timestamps are illustrative</span>
      </div>
    </section>

    <!-- Latest Reading Information -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Activity :size="20" />
          </div>

          <div>
            <h4 class="font-semibold text-gray-900">
              Monitoring Status
            </h4>

            <p class="text-xs text-gray-500">
              Sensor data source
            </p>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between">
          <span class="text-sm text-gray-500">
            Data Availability
          </span>

          <span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Simulation
          </span>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp :size="20" />
          </div>

          <div>
            <h4 class="font-semibold text-gray-900">
              Selected Time Range
            </h4>

            <p class="text-xs text-gray-500">
              Historical data period
            </p>
          </div>
        </div>

        <p class="mt-5 text-lg font-bold text-gray-900">
          {{ timeRanges.find((range) => range.value === selectedRange)?.label }}
        </p>
      </div>
    </section>
  </div>
</template>
