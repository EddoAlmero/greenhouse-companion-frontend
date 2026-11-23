
<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  value: number | null
  unit: string
  icon: Component
  description: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">
          {{ title }}
        </p>

        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-3xl font-bold tracking-tight text-gray-900">
            {{ value ?? '--' }}
          </span>

          <span class="text-sm font-medium text-gray-500">
            {{ unit }}
          </span>
        </div>
      </div>

      <div
        class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
      >
        <component :is="icon" :size="22" />
      </div>
    </div>

    <div class="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
      <span
        class="h-2 w-2 rounded-full"
        :class="value === null ? 'bg-gray-400' : 'bg-emerald-500'"
      />

      <p class="text-xs text-gray-500">
        {{ value === null ? 'Waiting for device data' : description }}
      </p>
    </div>
  </div>
</template>
