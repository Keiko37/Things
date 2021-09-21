<template>
  <div @click="closeWindows($event)" class="desktop">
    <header class="header">
      <Extensions />
      <Settings />
    </header>

    <main class="main">
      <Bookmarks />
      <Pomodoro v-if="getPomodoroIsOpened" />
      <Clock />
    </main>
    <footer class="footer">
      <Fullscreen />
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Clock from '@/components/Clock';
import Fullscreen from '@/components/Fullscreen';
import Settings from '@/components/settings/Settings';
import Bookmarks from '@/components/bookmarks/Bookmarks';

import Extensions from '@/components/extensions/Extensions';
import Pomodoro from '@/components/extensions/pomodoro/Pomodoro';

export default {
  name: 'Desktop',
  components: { Clock, Fullscreen, Settings, Bookmarks, Extensions, Pomodoro },
  computed: {
    ...mapGetters(['getIsSettings', 'getIsBookmarks', 'getPomodoroIsOpened']),
  },
  methods: {
    ...mapActions(['toggleSetting', 'toggleBookmarks']),
    focusWindow(event, classForFinding, stopClass) {
      let classFind = false;
      let currentElement = event.target;
      while (
        !Array(...currentElement.classList).includes(stopClass) &&
        !classFind
      ) {
        if (Array(...currentElement.classList).includes(classForFinding)) {
          return true;
        }
        currentElement = currentElement.parentElement;
      }
      return false;
    },
    closeWindows(event) {
      let settingsOnFocus = this.focusWindow(event, 'settings', 'desktop');
      let bookmarksOnFocus = this.focusWindow(event, 'bookmarks', 'desktop');
      if (!settingsOnFocus && this.getIsSettings) {
        this.toggleSetting();
      }
      if (!bookmarksOnFocus && this.getIsBookmarks) {
        this.toggleBookmarks();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.desktop {
  font-family: $text-font;
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
