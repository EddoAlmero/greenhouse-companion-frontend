
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  return String(route.meta.title ?? 'Dashboard')
})

const pageDescription = computed(() => {
  return String(
    route.meta.description ?? 'Manage your greenhouse system.'
  )
})
</script>

<template>
  <section>
    <div class="mb-8">
      <h3 class="text-2xl font-bold text-gray-900">
        {{ pageTitle }}
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        {{ pageDescription }}
      </p>
    </div>

    <div class="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <span class="text-2xl font-bold">GC</span>
      </div>

      <h4 class="mt-5 text-lg font-semibold text-gray-900">
        {{ pageTitle }} Page
      </h4>

      <p class="mt-2 max-w-md text-sm leading-6 text-gray-500">
        This section is currently under development.
        The feature will be implemented in the next development stage.
      </p>
    </div>
  </section>
</template>
