import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useFullscreenStore = defineStore('fullscreen', () => {
  const fullscreenStore: { isFullscreen: boolean } = reactive({
    isFullscreen: false,
  })
  const toggleFullscreen = () => (fullscreenStore.isFullscreen = !fullscreenStore.isFullscreen)

  return {
    fullscreenStore,
    toggleFullscreen,
  }
})
