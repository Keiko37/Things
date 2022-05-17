<script setup lang="ts">
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import type { SettingsGroupKind } from '@/types/SettingsState'
import { isSubsettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import SubsettingNav from '@/components/settings/SubsettingNav.vue'

defineProps<{
  group: SettingsGroupKind
  indexInArray: number
}>()

const appSettings = useSettingsStore()
const { settingsState } = storeToRefs(appSettings)
const { checkedNavIndex } = toRefs(settingsState.value)
</script>

<template>
  <li
    :class="{ 'settings-nav-item-checked': checkedNavIndex === indexInArray }"
    @click="appSettings.setNavChecked(indexInArray)"
    class="nav__item"
  >
    {{ group.title }}
  </li>

  <ul class="nav__subsettings" v-if="isSubsettingsGroup(group)">
    <SubsettingNav
      v-for="(subsetting, idx) in group.subSettings"
      :key="subsetting.title"
      :orderIdx="idx"
      :subsetting="subsetting"
      :group="group"
      :indexInArray="indexInArray"
    />
  </ul>
</template>

<style lang="scss" scoped>
.nav {
  &__item {
    font-size: 2rem;
    font-weight: 500;
    text-transform: capitalize;
    margin-bottom: 5px;
    padding-left: 10px;
    cursor: pointer;
    opacity: 0.6;
  }
  &__subsettings {
    margin-left: 14px;
  }
  &__subsetting {
    font-size: 1.7rem;
  }
}
.settings-nav-item-checked {
  font-weight: 600;
  opacity: 1;
}
</style>
