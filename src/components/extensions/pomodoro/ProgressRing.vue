<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  radius: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    validator(value: number) {
      return value <= 100 || value >= 0 ? true : false
    },
  },
  stroke: {
    type: Number,
    required: true,
  },
})
if (import.meta.env.DEV) {
  const isValidProgress = (progress: number) => {
    return progress <= 100 && progress >= 0
  }

  if (!isValidProgress(props.progress)) {
    console.warn('ProgressRing props validation: progress has invalid value.')
  }
}
const strokeDashoffset = computed(
  () => circumference.value - (props.progress / 100) * circumference.value
)
const circumference = computed(() => normalizedRadius.value * 2 * Math.PI)
const normalizedRadius = computed(() => props.radius - props.stroke * 2)
</script>

<template>
  <svg :height="radius * 2" :width="radius * 2">
    <circle
      :stroke-dasharray="circumference + ' ' + circumference"
      :style="{ strokeDashoffset: strokeDashoffset }"
      :stroke-width="stroke"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
      stroke="white"
      fill="transparent"
    />
  </svg>
</template>

<style lang="scss" scoped>
circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
