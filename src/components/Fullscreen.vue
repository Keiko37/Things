<template>
  <span
    v-if="!getFullscreen"
    @click="toggleFullscreen"
    class="icon-btn material-icons-round md-light"
    >fullscreen</span
  >
  <span
    v-else
    @click="toggleFullscreen"
    class="icon-btn material-icons-round md-light"
    >fullscreen_exit</span
  >
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Fullscreen',
  data() {
    return {
      isFullscreen: false,
    };
  },
  computed: {
    ...mapGetters(['getFullscreen']),
  },
  methods: {
    ...mapActions(['switchFullscreen']),
    toggleFullscreen() {
      document.cancelFullScreen =
        document.cancelFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen;
      const elem = document.querySelector('html');
      if (document.fullscreenElement) {
        document.cancelFullScreen();
        this.switchFullscreen(false);
        return;
      }
      elem.requestFullscreen();
      this.switchFullscreen(true);
    },
  },
  mounted() {
    const isFullscreen = Boolean(document.fullscreenElement);
    this.switchFullscreen(isFullscreen);
  },
};
</script>
