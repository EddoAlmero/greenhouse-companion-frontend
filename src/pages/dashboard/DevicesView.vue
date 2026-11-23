
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Plus,
  Search,
  Cpu,
  Wifi,
  WifiOff,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-vue-next'

type DeviceStatus = 'online' | 'offline' | 'unknown'
type DeviceRole = 'owner' | 'admin' | 'viewer'

interface Device {
  id: string
  name: string
  hardware_id: string
  status: DeviceStatus
  role: DeviceRole
  created_at: string
}

const devices = ref<Device[]>([
  {
    id: 'dev-001',
    name: 'Greenhouse Main Unit',
    hardware_id: 'ESP32-GH-001',
    status: 'online',
    role: 'owner',
    created_at: '2026-11-20T08:30:00',
  },
  {
    id: 'dev-002',
    name: 'Greenhouse Backup Unit',
    hardware_id: 'ESP32-GH-002',
    status: 'offline',
    role: 'admin',
    created_at: '2026-11-21T10:15:00',
  },
  {
    id: 'dev-003',
    name: 'Experimental Unit',
    hardware_id: 'ESP32-GH-003',
    status: 'unknown',
    role: 'viewer',
    created_at: '2026-11-22T14:00:00',
  },
])

const searchQuery = ref('')
const statusFilter = ref<'all' | DeviceStatus>('all')

const isRegisterModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedDevice = ref<Device | null>(null)

const deviceName = ref('')
const hardwareId = ref('')
const formError = ref('')

const filteredDevices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return devices.value.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(query) ||
      device.hardware_id.toLowerCase().includes(query) ||
      device.id.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter.value === 'all' ||
      device.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const onlineCount = computed(() =>
  devices.value.filter((device) => device.status === 'online').length,
)

const offlineCount = computed(() =>
  devices.value.filter((device) => device.status === 'offline').length,
)

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function statusLabel(status: DeviceStatus) {
  const labels: Record<DeviceStatus, string> = {
    online: 'Online',
    offline: 'Offline',
    unknown: 'Unknown',
  }

  return labels[status]
}

function openRegisterModal() {
  deviceName.value = ''
  hardwareId.value = ''
  formError.value = ''
  isRegisterModalOpen.value = true
}

function closeRegisterModal() {
  isRegisterModalOpen.value = false
  formError.value = ''
}

function registerDevice() {
  const name = deviceName.value.trim()
  const hardware = hardwareId.value.trim()

  if (!name || !hardware) {
    formError.value = 'Please fill in both device name and hardware ID.'
    return
  }

  const duplicate = devices.value.some(
    (device) => device.hardware_id.toLowerCase() === hardware.toLowerCase(),
  )

  if (duplicate) {
    formError.value = 'This hardware ID is already registered.'
    return
  }

  const newDevice: Device = {
    id: `dev-${String(Date.now()).slice(-6)}`,
    name,
    hardware_id: hardware,
    status: 'unknown',
    role: 'admin',
    created_at: new Date().toISOString(),
  }

  devices.value.unshift(newDevice)
  closeRegisterModal()
}

function openEditModal(device: Device) {
  selectedDevice.value = device
  deviceName.value = device.name
  hardwareId.value = device.hardware_id
  formError.value = ''
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  selectedDevice.value = null
  formError.value = ''
}

function updateDevice() {
  if (!selectedDevice.value) return

  const name = deviceName.value.trim()
  const hardware = hardwareId.value.trim()

  if (!name || !hardware) {
    formError.value = 'Please fill in both fields.'
    return
  }

  const duplicate = devices.value.some(
    (device) =>
      device.id !== selectedDevice.value?.id &&
      device.hardware_id.toLowerCase() === hardware.toLowerCase(),
  )

  if (duplicate) {
    formError.value = 'This hardware ID is already used by another device.'
    return
  }

  selectedDevice.value.name = name
  selectedDevice.value.hardware_id = hardware

  closeEditModal()
}

function deleteDevice(device: Device) {
  const confirmed = window.confirm(
    `Are you sure you want to remove "${device.name}"?`,
  )

  if (!confirmed) return

  devices.value = devices.value.filter((item) => item.id !== device.id)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">
          Devices
        </h3>

        <p class="mt-1 text-sm text-gray-500">
          Register and manage your greenhouse devices.
        </p>
      </div>

      <button
        type="button"
        @click="openRegisterModal"
        class="flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <Plus :size="18" />
        Register Device
      </button>
    </section>

    <!-- Summary Cards -->
    <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Total Devices
            </p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ devices.length }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Cpu :size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Online Devices
            </p>
            <p class="mt-2 text-3xl font-bold text-emerald-600">
              {{ onlineCount }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wifi :size="22" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">
              Offline Devices
            </p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ offlineCount }}
            </p>
          </div>

          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <WifiOff :size="22" />
          </div>
        </div>
      </div>
    </section>

    <!-- Device List -->
    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 class="font-bold text-gray-900">
            Registered Devices
          </h4>
          <p class="mt-1 text-xs text-gray-500">
            View and manage devices connected to your account.
          </p>
        </div>

        <button
          type="button"
          @click="statusFilter = 'all'; searchQuery = ''"
          class="flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          <RefreshCw :size="14" />
          Reset Filters
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row">
        <div class="relative flex-1">
          <Search
            :size="18"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search device name, ID, or hardware ID..."
            class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <select
          v-model="statusFilter"
          class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <!-- Desktop Table -->
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th class="px-6 py-4">Device</th>
              <th class="px-6 py-4">Hardware ID</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Registered</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="device in filteredDevices"
              :key="device.id"
              class="transition hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Cpu :size="19" />
                  </div>

                  <div>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ device.name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">
                      {{ device.id }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="font-mono text-xs text-gray-600">
                  {{ device.hardware_id }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                  :class="{
                    'bg-emerald-50 text-emerald-700': device.status === 'online',
                    'bg-rose-50 text-rose-700': device.status === 'offline',
                    'bg-gray-100 text-gray-600': device.status === 'unknown',
                  }"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="{
                      'bg-emerald-500': device.status === 'online',
                      'bg-rose-500': device.status === 'offline',
                      'bg-gray-400': device.status === 'unknown',
                    }"
                  />
                  {{ statusLabel(device.status) }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                  {{ device.role }}
                </span>
              </td>

              <td class="px-6 py-4 text-xs text-gray-500">
                {{ formatDate(device.created_at) }}
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-1">
                  <button
                    type="button"
                    @click="openEditModal(device)"
                    title="Edit device"
                    class="rounded-lg p-2 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <Pencil :size="16" />
                  </button>

                  <button
                    type="button"
                    @click="deleteDevice(device)"
                    title="Delete device"
                    class="rounded-lg p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="filteredDevices.length === 0"
          class="px-6 py-12 text-center"
        >
          <Cpu :size="30" class="mx-auto text-gray-300" />
          <p class="mt-3 text-sm font-semibold text-gray-700">
            No devices found
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="divide-y divide-gray-100 md:hidden">
        <article
          v-for="device in filteredDevices"
          :key="device.id"
          class="p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Cpu :size="19" />
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-gray-900">
                  {{ device.name }}
                </p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ device.id }}
                </p>
              </div>
            </div>

            <span
              class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="{
                'bg-emerald-50 text-emerald-700': device.status === 'online',
                'bg-rose-50 text-rose-700': device.status === 'offline',
                'bg-gray-100 text-gray-600': device.status === 'unknown',
              }"
            >
              {{ statusLabel(device.status) }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p class="text-gray-400">Hardware ID</p>
              <p class="mt-1 break-all font-mono text-gray-700">
                {{ device.hardware_id }}
              </p>
            </div>

            <div>
              <p class="text-gray-400">Role</p>
              <p class="mt-1 capitalize text-gray-700">
                {{ device.role }}
              </p>
            </div>

            <div>
              <p class="text-gray-400">Registered</p>
              <p class="mt-1 text-gray-700">
                {{ formatDate(device.created_at) }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              @click="openEditModal(device)"
              class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
            >
              <Pencil :size="14" />
              Edit
            </button>

            <button
              type="button"
              @click="deleteDevice(device)"
              class="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
            >
              <Trash2 :size="14" />
              Delete
            </button>
          </div>
        </article>

        <div
          v-if="filteredDevices.length === 0"
          class="px-6 py-12 text-center"
        >
          <Cpu :size="30" class="mx-auto text-gray-300" />
          <p class="mt-3 text-sm font-semibold text-gray-700">
            No devices found
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      </div>

      <div class="border-t border-gray-100 px-5 py-4">
        <p class="text-xs text-gray-400">
          Showing {{ filteredDevices.length }} of {{ devices.length }} devices
        </p>
      </div>
    </section>

    <!-- Register Modal -->
    <div
      v-if="isRegisterModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
      @click.self="closeRegisterModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-bold text-gray-900">
              Register New Device
            </h4>
            <p class="mt-1 text-sm text-gray-500">
              Add a greenhouse device to your account.
            </p>
          </div>

          <button
            type="button"
            @click="closeRegisterModal"
            class="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X :size="19" />
          </button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="registerDevice">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Device Name
            </label>
            <input
              v-model="deviceName"
              type="text"
              placeholder="e.g. Greenhouse Main Unit"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Hardware ID
            </label>
            <input
              v-model="hardwareId"
              type="text"
              placeholder="e.g. ESP32-GH-001"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <p class="mt-2 text-xs text-gray-400">
              Enter the hardware identifier assigned to your device.
            </p>
          </div>

          <p v-if="formError" class="text-sm text-rose-600">
            {{ formError }}
          </p>

          <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              @click="closeRegisterModal"
              class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Register Device
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
      @click.self="closeEditModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-bold text-gray-900">
              Edit Device
            </h4>
            <p class="mt-1 text-sm text-gray-500">
              Update device name or hardware ID.
            </p>
          </div>

          <button
            type="button"
            @click="closeEditModal"
            class="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X :size="19" />
          </button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="updateDevice">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Device Name
            </label>
            <input
              v-model="deviceName"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Hardware ID
            </label>
            <input
              v-model="hardwareId"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <p v-if="formError" class="text-sm text-rose-600">
            {{ formError }}
          </p>

          <div class="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              @click="closeEditModal"
              class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
