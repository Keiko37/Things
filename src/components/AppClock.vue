<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useClockStore } from '@/stores/clock'

const settings = useSettingsStore()
const { isSettings } = storeToRefs(settings)

const clock = useClockStore()
const { clockIntervalId, currentTime, isClockVisible, getClockSize } = storeToRefs(clock)

const updateCurrentTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  currentTime.value = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`
}

/**
 * the first updateCurrentTime() call is needed
 * for the initial render with the defined content(time value)
 */
updateCurrentTime()
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
