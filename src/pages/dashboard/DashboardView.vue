
<script setup lang="ts">
import SensorCard from '../../components/dashboard/SensorCard.vue'
import SensorChart from '../../components/dashboard/SensorChart.vue'
import ActuatorCard from '../../components/dashboard/ActuatorCard.vue'

import {
  Cpu,
  Droplets,
  Sprout,
  Thermometer,
  Wind,
} from 'lucide-vue-next'

// Temporary mock telemetry data
const sensors = [
  {
    title: 'Ambient Temperature',
    value: 28.6,
    unit: '°C',
    icon: Thermometer,
    description: 'Simulated sensor reading',
  },
  {
    title: 'Ambient Humidity',
    value: 68,
    unit: '%',
    icon: Droplets,
    description: 'Simulated sensor reading',
  },
  {
    title: 'Soil Temperature',
    value: 24.3,
    unit: '°C',
    icon: Thermometer,
    description: 'Simulated sensor reading',
  },
  {
    title: 'Soil Moisture',
    value: 42,
    unit: '%',
    icon: Sprout,
    description: 'Simulated sensor reading',
  },
]
</script>

<template>
  <!-- Page Introduction -->
  <section class="mb-8">
    <h3 class="text-2xl font-bold text-gray-900">
      Dashboard Overview
    </h3>

    <p class="mt-1 text-sm text-gray-500">
      Monitor and manage your greenhouse environment from one place.
    </p>
  </section>

  <!-- Device Status -->
  <section class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Cpu :size="24" />
        </div>

        <div>
          <h4 class="font-semibold text-gray-900">
            Greenhouse Device
          </h4>

          <p class="text-sm text-gray-500">
            Device connection status
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1.5 sm:self-center">
        <span class="h-2 w-2 rounded-full bg-gray-400" />
        <span class="text-xs font-semibold text-gray-600">
          Not Connected
        </span>
      </div>
    </div>
  </section>

  <!-- Sensor Overview -->
  <section class="mb-8">
    <div class="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h4 class="text-lg font-bold text-gray-900">
          Environment Overview
        </h4>

        <p class="text-sm text-gray-500">
          Real-time greenhouse sensor readings
        </p>
      </div>

      <span class="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        Demo Data
      </span>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SensorCard
        v-for="sensor in sensors"
        :key="sensor.title"
        :title="sensor.title"
        :value="sensor.value"
        :unit="sensor.unit"
        :icon="sensor.icon"
        :description="sensor.description"
      />
    </div>
  </section>

  <!-- Monitoring and Actuator -->
  <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">

    <!-- Monitoring Chart -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
      <h4 class="font-bold text-gray-900">
        Sensor Monitoring
      </h4>

      <p class="mt-1 text-sm text-gray-500">
        Historical sensor data and trends
      </p>

      <div class="mt-6">
        <SensorChart />
      </div>
    </div>

    <!-- Actuator Control -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h4 class="font-bold text-gray-900">
        Actuator Control
      </h4>

      <p class="mt-1 text-sm text-gray-500">
        Manage greenhouse equipment
      </p>

      <div class="mt-6 space-y-4">
        <ActuatorCard
          title="Cooling Fan"
          description="Control the greenhouse ventilation fan"
          :icon="Wind"
        />

        <ActuatorCard
          title="Water Pump"
          description="Control the irrigation water pump"
          :icon="Droplets"
        />
      </div>
    </div>

  </section>
</template>
