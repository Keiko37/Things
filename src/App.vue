<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import type { SettingsGroupKind } from '@/types/SettingsState'
import LogoLoader from './components/LogoLoader.vue'

const settings = useSettingsStore()
const { appSettings, defaultSettings } = storeToRefs(settings)

function loadSettingsFromStorage(): SettingsGroupKind[] | null {
  let settingsFromStorage = localStorage.getItem('appSettings')
  return settingsFromStorage !== null ? JSON.parse(settingsFromStorage) : null
}

const isAppLoading = ref(true)
onMounted(() => {
  window.setTimeout(() => (isAppLoading.value = false), 2000)
  const parsedSettings = loadSettingsFromStorage()

  if (
    parsedSettings === null ||
    typeof parsedSettings !== 'object' ||
    (Array.isArray(parsedSettings) && parsedSettings.length === 0)
  ) {
    localStorage.setItem('appSettings', JSON.stringify(settings.defaultSettings))
  }

  if (appSettings.value.length === 0) {
    const settingsFromStorage = localStorage.getItem('appSettings')
    appSettings.value = settingsFromStorage
      ? JSON.parse(settingsFromStorage)
      : defaultSettings.value
  }
})
</script>

<template>
  <Transition name="fade">
    <LogoLoader v-if="isAppLoading" />
  </Transition>
  <router-view />
</template>

<style lang="scss">
body {
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
