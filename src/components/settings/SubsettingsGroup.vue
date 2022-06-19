<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { SubsettingsGroup, SettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{
  subsettingsGroup: SettingsGroup
  group: SubsettingsGroup
  orderIdx: number
}>()

const settings = useSettingsStore()
const { checkedGroupId, expandedGroupId } = storeToRefs(settings)

const getTransitionDelaySeconds = () => {
  const resultNumber = props.orderIdx * 0.05
  return resultNumber + 's'
}
</script>

<template>
  <transition :style="{ 'transition-delay': getTransitionDelaySeconds }" name="item">
    <li
      v-if="expandedGroupId === group.id"
      @click="settings.setGroupChecked(subsettingsGroup.id)"
      :class="{
        'group-checked': checkedGroupId === subsettingsGroup.id,
      }"
      class="nav__item nav__subsetting"
    >
      {{ subsettingsGroup.title }}
    </li>
  </transition>
</template>

<style lang="scss" scoped>
.group-checked {
  font-weight: 600;
  opacity: 1;
}
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
