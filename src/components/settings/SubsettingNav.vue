<script setup lang="ts">
import type { SubsettingsGroup, SettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { toRefs } from 'vue'

const props = defineProps<{
  subsetting: SettingsGroup
  orderIdx: number
  group: SubsettingsGroup
  indexInArray: number
}>()

const appSettings = useSettingsStore()
const { settingsState } = storeToRefs(appSettings)
const { checkedNavIndex, checkedSubsettingIndex } = toRefs(settingsState.value)

const getTransitionSeconds = () => {
  const resultNumber = props.orderIdx * 0.05
  return resultNumber + 's'
}
</script>

<template>
  <transition :style="{ 'transition-delay': getTransitionSeconds }" name="item">
    <li
      v-if="group.subSettings && group.groupChecked"
      :class="{
        'settings-nav-item-checked':
          checkedNavIndex === indexInArray && checkedSubsettingIndex === orderIdx,
      }"
      @click="appSettings.selectSubsetting(group, orderIdx)"
      class="nav__item nav__subsetting"
    >
      {{ subsetting.title }}
    </li>
  </transition>
</template>

<style lang="scss" scoped>
.item-enter-active,
.item-leave-active {
  transition: all 0.3s;
}
.item-enter-from,
.item-leave-to {
  transform: translateY(-5px);
  opacity: 0 !important;
}
.item-leave-from,
.item-enter-to {
  opacity: 0.6;
}
</style>
