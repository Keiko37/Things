import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClockStore = defineStore('clock', () => {
  const currentTime = ref<string | null>(null)
  const clockIntervalId = ref<number | null>(null)
  return {
    currentTime,
    clockIntervalId,
  }
})
