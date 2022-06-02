<script setup lang="ts">
import { useFullscreen } from '@/composables/fullscreen'
import AppIcon from '@/components/global/AppIcon.vue'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <span @click="toggle" class="icon-btn">
    <AppIcon v-if="isFullscreen" name="fullscreen_exit" />
    <AppIcon v-else name="fullscreen" />
  </span>
</template>
