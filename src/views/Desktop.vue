<template>
  <div @click="closeWindows($event)" class="desktop">
    <header class="header">
      <Extensions />
      <Settings />
    </header>

    <main class="main">
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

import Extensions from '@/components/extensions/Extensions';
import Pomodoro from '@/components/extensions/pomodoro/Pomodoro';

export default {
  name: 'Desktop',
  components: { Clock, Fullscreen, Settings, Extensions, Pomodoro },
  computed: {
    ...mapGetters(['getIsSettings', 'getPomodoroIsOpened']),
  },
  methods: {
    ...mapActions(['toggleSetting']),
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
      if (!settingsOnFocus && this.getIsSettings) {
        this.toggleSetting();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// @import '../assets/scss/variables.scss';

/* Rules for sizing the icon. */
.material-icons-round.md-18 {
  font-size: 18px;
}
.material-icons-round.md-24 {
  font-size: 24px;
}
.material-icons-round.md-36 {
  font-size: 36px;
}
.material-icons-round.md-48 {
  font-size: 48px;
}

/* Rules for using icons as black on a light background. */
.material-icons-round.md-dark {
  color: rgba(0, 0, 0, 0.54);
}
.material-icons-round.md-dark.md-inactive {
  color: rgba(0, 0, 0, 0.26);
}

/* Rules for using icons as white on a dark background. */
.material-icons-round.md-light {
  color: rgba(255, 255, 255, 1);
}
.material-icons-round.md-light.md-inactive {
  color: rgba(255, 255, 255, 0.3);
}

.desktop {
  font-family: $text-font;
  padding: 10px 15px;
  font-weight: 300;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('../assets/images/background4.jpg');
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
}
.main {
  display: flex;
  // align-items: center;
  // justify-content: center;
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
