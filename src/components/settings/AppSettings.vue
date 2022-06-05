<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import AppIcon from '@/components/global/AppIcon.vue'
import SettingsNav from '@/components/settings/SettingsNav.vue'
import SettingsView from '@/components/settings/SettingsView.vue'

const settings = useSettingsStore()
const { settingsState } = storeToRefs(settings)
const { appSettings, isSettings } = toRefs(settingsState.value)

watch(isSettings, () => {
  if (isSettings.value === true) {
    settings.setNavChecked(0)
  }
})
</script>

<template>
  <span
    @click.stop="settings.toggleIsSettings"
    class="material-icons material-icons-round md-light icon-btn"
  >
    <AppIcon name="settings" />
  </span>
  <transition name="animation">
    <div v-if="isSettings" class="settings scroll-ui">
      <div class="settings__header">
        <h1 class="settings__title">Settings</h1>
      </div>
      <div class="settings__main">
        <ul class="settings__nav">
          <SettingsNav
            v-for="(group, idx) in appSettings"
            :key="group.id"
            :group="group"
            :indexInArray="idx"
          />
        </ul>

        <div class="settings__view">
          <SettingsView v-for="group in appSettings" :key="group.id" :group="group" />
        </div>
      </div>
    </div>
  </transition>
</template>

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
  background-color: var(--bg-color);
  border-radius: 10px 0 10px 10px;
  padding: 20px;
  color: var(--text-color-secondary);

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

.animation-enter-active,
.animation-leave-active {
  transition: all 0.2s;
}
.animation-enter-from,
.animation-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
.animation-leave-from,
.animation-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>
