<script setup lang="ts">
import { useExtensionsStore } from '@/stores/extensions'
import Clock from '@/components/AppClock.vue'
import Fullscreen from '@/components/FullscreenButton.vue'
import Settings from '@/components/settings/AppSettings.vue'
import Bookmarks from '@/components/bookmarks/BookmarksView.vue'
import Extensions from '@/components/extensions/AppExtensions.vue'
import Pomodoro from '@/components/extensions/pomodoro/ExtensionPomodoro.vue'

const extensions = useExtensionsStore()
</script>

<template>
  <div class="desktop">
    <header class="desktop__header">
      <Extensions />
      <Settings />
    </header>

    <main class="desktop__main">
      <Bookmarks />
      <Pomodoro v-if="extensions.isPomodoroOpened" />
      <Clock />
    </main>
    <footer class="desktop__footer">
      <Fullscreen />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.desktop {
  font-family: var(--text-font);
  padding: 10px 15px;
  font-weight: 300;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('../assets/images/background.jpg');
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: bottom; // x y
  background-size: cover;
  display: flex;
  flex-direction: column;
}
.desktop__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.desktop__main {
  display: flex;
  flex: 1 1 auto;
}
.desktop__footer {
  display: flex;
  justify-content: space-between;
}
</style>
