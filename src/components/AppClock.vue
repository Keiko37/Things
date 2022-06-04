<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, toRefs } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useClockStore } from '@/stores/clock'

const settings = useSettingsStore()
const { settingsState, getClockSize } = storeToRefs(settings)
const { isSettings, isClockVisible } = toRefs(settingsState.value)

const clock = useClockStore()
const { clockIntervalId, currentTime } = storeToRefs(clock)

const updateCurrentTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  currentTime.value = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`
}

onMounted(() => {
  clockIntervalId.value = window.setInterval(updateCurrentTime, 1000)
})
onUnmounted(() => {
  if (clockIntervalId.value) {
    window.clearInterval(clockIntervalId.value)
  }
})
</script>

<template>
  <div v-if="!isSettings || isClockVisible" :style="{ fontSize: getClockSize }" class="clock">
    {{ currentTime }}
  </div>
</template>

<style lang="scss" scoped>
.clock {
  color: var(--text-color);
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>
