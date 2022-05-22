<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useExtensionsStore } from '@/stores/extensions'
import Clock from '@/components/AppClock.vue'
import Fullscreen from '@/components/FullscreenButton.vue'
import Settings from '@/components/settings/AppSettings.vue'
import Bookmarks from '@/components/bookmarks/BookmarksView.vue'
import Extensions from '@/components/extensions/AppExtensions.vue'
import Pomodoro from '@/components/extensions/pomodoro/ExtensionPomodoro.vue'

const appSettings = useSettingsStore()
const bookmarks = useBookmarksStore()
const extensions = useExtensionsStore()

function closeWindows(event: Event) {
  let settingsOnFocus = focusWindow(event, 'settings', 'desktop')
  let bookmarksOnFocus = focusWindow(event, 'bookmarks', 'desktop')
  if (!settingsOnFocus && appSettings.settingsState.isSettings) {
    appSettings.toggleIsSettings()
  }
  if (!bookmarksOnFocus && bookmarks.bookmarksState.isBookmarks) {
    bookmarks.toggleBookmarks(false)
  }
}

function focusWindow(event: Event, classForFinding: string, stopClass: string) {
  let classFind = false
  let currentElement = event.target
  while (
    currentElement !== null &&
    !Array(...(currentElement as Element).classList).includes(stopClass) &&
    !classFind
  ) {
    if (Array(...(currentElement as Element).classList).includes(classForFinding)) {
      return true
    }
    currentElement = (currentElement as Element).parentElement
  }
  return false
}
</script>

<template>
  <div @click="closeWindows($event)" class="desktop">
    <header class="header">
      <Extensions />
      <Settings />
    </header>

    <main class="main">
      <Bookmarks />
      <Pomodoro v-if="extensions.extensionsState.isPomodoroOpened" />
      <Clock />
    </main>
    <footer class="footer">
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
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.main {
  display: flex;
  flex: 1 1 auto;
}
.footer {
  display: flex;
  justify-content: space-between;
}
.icon-btn {
  cursor: pointer;
  opacity: 0.5;
  user-select: none;
  &:hover {
    opacity: 0.8;
  }
}
</style>
