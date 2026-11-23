
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Fan,
  Droplets,
  Power,
  SlidersHorizontal,
  Zap,
  Settings2,
  Activity,
} from 'lucide-vue-next'

type ActuatorMode = 'manual' | 'automatic'

interface Actuator {
  id: 'fan' | 'pump'
  name: string
  description: string
  on: boolean
  duty: number
  icon: typeof Fan
}

const mode = ref<ActuatorMode>('manual')

const actuators = ref<Actuator[]>([
  {
    id: 'fan',
    name: 'Cooling Fan',
    description: 'Greenhouse ventilation and air circulation',
    on: true,
    duty: 65,
    icon: Fan,
  },
  {
    id: 'pump',
    name: 'Water Pump',
    description: 'Water distribution and irrigation system',
    on: false,
    duty: 50,
    icon: Droplets,
  },
])

const activeCount = computed(() => {
  return actuators.value.filter((actuator) => actuator.on).length
})

function toggleActuator(actuator: Actuator) {
  if (mode.value !== 'manual') return
  actuator.on = !actuator.on
}

function updateDuty(actuator: Actuator, value: number) {
  actuator.duty = value
}

function setMode(newMode: ActuatorMode) {
  mode.value = newMode
}
</script>

<template>
  <div>
    <!-- Page Introduction -->
    <section class="mb-8">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">
            Device Control
          </h3>

          <p class="mt-1 text-sm text-gray-500">
            Manage and adjust your greenhouse equipment.
          </p>
        </div>

        <div class="flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          Simulation Mode
        </div>
      </div>
    </section>

    <!-- Control Summary -->
    <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Total Actuators
            </p>

            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ actuators.length }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal :size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Active Actuators
            </p>

            <p class="mt-2 text-3xl font-bold text-emerald-600">
              {{ activeCount }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Activity :size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Control Mode
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-900">
              {{ mode === 'manual' ? 'Manual' : 'Automatic' }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Settings2 :size="22" />
          </div>
        </div>
      </div>
    </section>

    <!-- Control Mode -->
    <section class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h4 class="font-bold text-gray-900">
            Control Mode
          </h4>

          <p class="mt-1 text-sm text-gray-500">
            Select how greenhouse actuators are controlled.
          </p>
        </div>

        <div class="flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            @click="setMode('manual')"
            class="rounded-lg px-4 py-2 text-sm font-semibold transition"
            :class="mode === 'manual'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'"
          >
            Manual
          </button>

          <button
            type="button"
            @click="setMode('automatic')"
            class="rounded-lg px-4 py-2 text-sm font-semibold transition"
            :class="mode === 'automatic'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'"
          >
            Automatic
          </button>
        </div>
      </div>

      <div class="mt-4 rounded-xl bg-gray-50 p-4">
        <p class="text-sm leading-6 text-gray-600">
          <span class="font-semibold text-gray-800">
            {{ mode === 'manual' ? 'Manual mode:' : 'Automatic mode:' }}
          </span>

          {{
            mode === 'manual'
              ? 'You can manually turn actuators on or off and adjust their duty levels.'
              : 'Manual actuator controls are disabled in this preview. Automatic operation will be connected to backend configuration later.'
          }}
        </p>
      </div>
    </section>

    <!-- Actuator Controls -->
    <section>
      <div class="mb-4">
        <h4 class="text-lg font-bold text-gray-900">
          Actuator Management
        </h4>

        <p class="mt-1 text-sm text-gray-500">
          Control individual greenhouse equipment.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <article
          v-for="actuator in actuators"
          :key="actuator.id"
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <!-- Actuator Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl"
                :class="actuator.on
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-gray-100 text-gray-500'"
              >
                <component :is="actuator.icon" :size="24" />
              </div>

              <div>
                <h5 class="font-bold text-gray-900">
                  {{ actuator.name }}
                </h5>

                <p class="mt-1 text-xs text-gray-500">
                  {{ actuator.id.toUpperCase() }}
                </p>
              </div>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="actuator.on
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ actuator.on ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="mt-5 text-sm text-gray-500">
            {{ actuator.description }}
          </p>

          <!-- Power Control -->
          <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
            <div>
              <p class="text-sm font-semibold text-gray-800">
                Power Status
              </p>

              <p class="mt-1 text-xs text-gray-500">
                {{ actuator.on ? 'Currently running' : 'Currently stopped' }}
              </p>
            </div>

            <button
              type="button"
              @click="toggleActuator(actuator)"
              :disabled="mode === 'automatic'"
              class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
              :class="actuator.on
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'"
            >
              <Power :size="17" />
              {{ actuator.on ? 'Turn Off' : 'Turn On' }}
            </button>
          </div>

          <!-- Duty Control -->
          <div class="mt-6 border-t border-gray-100 pt-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  Duty Level
                </p>

                <p class="mt-1 text-xs text-gray-500">
                  Adjust actuator output level
                </p>
              </div>

              <span class="text-xl font-bold text-gray-900 tabular-nums">
                {{ actuator.duty }}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              :value="actuator.duty"
              @input="updateDuty(actuator, Number(($event.target as HTMLInputElement).value))"
              :disabled="mode === 'automatic'"
              class="mt-5 w-full cursor-pointer accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            />

            <div class="mt-2 flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <!-- Actuator Footer -->
          <div class="mt-6 flex items-center gap-2 rounded-xl bg-gray-50 p-3">
            <Zap
              :size="16"
              :class="actuator.on ? 'text-emerald-600' : 'text-gray-400'"
            />

            <p class="text-xs text-gray-500">
              {{
                actuator.on
                  ? `Running at ${actuator.duty}% duty level`
                  : 'Actuator is currently inactive'
              }}
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
