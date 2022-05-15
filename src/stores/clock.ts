import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useClockStore = defineStore('clock', () => {
  const clockState: { currentTime: string | null; clockIntervalId: number | null } = reactive({
    currentTime: null,
    clockIntervalId: null,
  })

  const updateCurrentTime = () => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    clockState.currentTime = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
  }
  const activateClock = () => (clockState.clockIntervalId = window.setInterval(updateCurrentTime, 1000))
  const deactivateClock = () =>
    clockState.clockIntervalId ? window.clearInterval(clockState.clockIntervalId) : undefined
  return {
    clockState,
    activateClock,
    deactivateClock,
  }
})
