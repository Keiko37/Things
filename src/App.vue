<template>
  <router-view />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getDefaultSettings', 'getAppSettings']),
  },
  methods: {
    ...mapActions(['setAppSettings']),
  },
  mounted() {
    let settingsType;
    try {
      settingsType = typeof JSON.parse(localStorage.getItem('appSettings'));
    } catch (e) {
      localStorage.setItem(
        'appSettings',
        JSON.stringify(this.getDefaultSettings)
      );
    }

    if (!localStorage.getItem('appSettings') || settingsType !== 'object') {
      localStorage.setItem(
        'appSettings',
        JSON.stringify(this.getDefaultSettings)
      );
    }
    if (this.getAppSettings.length === 0) {
      const settingsLS = JSON.parse(localStorage.getItem('appSettings'));
      this.setAppSettings(settingsLS);
    }
  },
};
</script>

<style lang="scss">
// @import 'assets/css/null.css';
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&display=swap');
// @import 'assets/scss/variables.scss';

body {
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
