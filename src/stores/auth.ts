
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(
    localStorage.getItem('access_token'),
  )

  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setSession(accessToken: string, userData: User) {
    token.value = accessToken
    user.value = userData

    localStorage.setItem('access_token', accessToken)
  }

  function clearSession() {
    token.value = null
    user.value = null

    localStorage.removeItem('access_token')
  }

  return {
    token,
    user,
    isAuthenticated,
    setSession,
    clearSession,
  }
})
