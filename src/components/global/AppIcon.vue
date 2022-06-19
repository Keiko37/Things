<script setup lang="ts">
import icons from '@/assets/icons'

const props = defineProps<{
  name: string
  size?: number
}>()

const iconData = icons[props.name as keyof typeof icons]
</script>

<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#FFFFFF"
      :height="size || 25"
      :width="size || 25"
      viewBox="0 0 40 40"
    >
      <path :d="iconData" />
    </svg>
  </div>
</template>
