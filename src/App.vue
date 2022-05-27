<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import type { SettingsGroupKind } from '@/types/SettingsState'

const settingsStore = useSettingsStore()
const { settingsState } = storeToRefs(settingsStore)
const { appSettings, defaultSettings } = toRefs(settingsState.value)

onMounted(() => {
  let settingsFromStorage: string | null = localStorage.getItem('appSettings')
  const parsedSettings: SettingsGroupKind[] | null =
    settingsFromStorage !== null ? JSON.parse(settingsFromStorage) : null

  if (
    parsedSettings === null ||
    typeof parsedSettings !== 'object' ||
    (Array.isArray(parsedSettings) && parsedSettings.length === 0)
  ) {
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings.value))
  }

  if (appSettings.value.length === 0) {
    settingsFromStorage = localStorage.getItem('appSettings')
    appSettings.value = settingsFromStorage
      ? JSON.parse(settingsFromStorage)
      : defaultSettings.value
  }
})
</script>

<template>
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
</style>
