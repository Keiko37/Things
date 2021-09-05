<template>
  <span
    @click.stop="toggleSetting"
    class="icon-btn material-icons material-icons-round md-light"
    >settings</span
  >

  <div v-if="getIsSettings" class="settings">
    <div class="settings__header">
      <h1 class="settings__title">Settings</h1>
    </div>
    <div class="settings__main">
      <ul class="settings__nav">
        <SettingsNav
          v-for="(group, idx) in getAppSettings"
          :key="group.id"
          :group="group"
          :indexInArray="idx"
        />
      </ul>

      <div class="settings__view">
        <SettingsView
          v-for="group in getAppSettings"
          :key="group.id"
          :group="group"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SettingsNav from '@/components/settings/SettingsNav';
import SettingsView from '@/components/settings/SettingsView';

export default {
  name: 'Settings',
  components: {
    SettingsNav,
    SettingsView,
  },
  computed: {
    ...mapGetters(['getAppSettings', 'getIsSettings']),
  },
  methods: {
    ...mapActions(['toggleSetting']),
  },
};
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  user-select: none;
  flex-direction: column;
  position: absolute;
  z-index: 10;
  right: 3%;
  top: 8%;
  min-width: 290px;
  max-width: 800px;
  width: 50%;
  min-height: 250px;
  height: 75%;
  background-color: $bg-color;
  border-radius: 10px 0 10px 10px;
  padding: 20px;
  color: $text-color-secondary;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(129, 129, 129, 0.2);
    border-radius: 10px;
  }

  &__title {
    font-size: 3rem;
    flex: 1 1 30%;
  }
  &__header,
  &__main {
    display: flex;
  }
  &__header {
    margin-bottom: 10px;
  }
  &__main {
    flex: 1 0 auto;
  }
  &__nav {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    flex: 0 1 30%;
  }
  &__view {
    flex: 0 1 90%;
    display: flex;
    flex-direction: column;
  }
}
</style>
