
<script setup lang="ts">
import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
)

// Simulated historical sensor data
const chartData = {
  labels: [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
  ],

  datasets: [
    {
      label: 'Ambient Temperature',
      data: [26.2, 26.8, 27.5, 28.1, 29.2, 28.8, 28.6],
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Soil Temperature',
      data: [23.1, 23.3, 23.7, 24.0, 24.5, 24.4, 24.3],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false,
    },
  ],
}

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    intersect: false,
    mode: 'index',
  },

  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        color: '#6b7280',
        font: {
          size: 11,
        },
      },
    },

    tooltip: {
      backgroundColor: '#111827',
      padding: 12,
      titleFont: {
        size: 12,
      },
      bodyFont: {
        size: 12,
      },
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11,
        },
      },
      border: {
        display: false,
      },
    },

    y: {
      beginAtZero: false,
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11,
        },
        callback(value) {
          return `${value} °C`
        },
      },
      border: {
        display: false,
        dash: [4, 4],
      },
    },
  },
}
</script>

<template>
  <div class="h-64 w-full">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
