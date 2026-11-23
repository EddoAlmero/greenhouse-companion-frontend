<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'
import { Power } from 'lucide-vue-next'

interface Props {
  title: string
  description: string
  icon: Component
  initialState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialState: false,
})

const isActive = ref(props.initialState)

function toggleActuator() {
  isActive.value = !isActive.value
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-xl"
        :class="isActive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-gray-100 text-gray-500'"
      >
        <component :is="icon" :size="22" />
      </div>

      <span
        class="rounded-full px-3 py-1 text-xs font-medium"
        :class="isActive
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-500'"
      >
        {{ isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>

    <div class="mt-5">
      <h3 class="font-semibold text-gray-900">
        {{ title }}
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        {{ description }}
      </p>
    </div>

    <button
      type="button"
      @click="toggleActuator"
      class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition"
      :class="isActive
        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        : 'bg-emerald-600 text-white hover:bg-emerald-700'"
    >
      <Power :size="17" />
      {{ isActive ? 'Turn Off' : 'Turn On' }}
    </button>
  </div>
</template>