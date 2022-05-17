<script setup lang="ts">
import { computed } from 'vue'

const isFullscreen = computed<boolean>(() => document.fullscreenElement !== null)

function toggleFullscreen() {
  if (isFullscreen.value) {
    document
      .exitFullscreen()
      .then(() => console.log('Exited from Full screen mode'))
      .catch((err) => console.error(err))
  } else {
    document.documentElement.requestFullscreen()
  }
}
</script>

<template>
  <span @click="toggleFullscreen" class="material-icons-round material-icons md-light icon-btn">
    {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
  </span>
</template>
