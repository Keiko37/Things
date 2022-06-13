<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { SettingsGroupKind } from '@/types/SettingsState'
import { isSubsettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import SubsettingsGroup from '@/components/settings/SubsettingsGroup.vue'

const props = defineProps<{ group: SettingsGroupKind }>()

const settings = useSettingsStore()
const { checkedGroupId, expandedGroupId } = storeToRefs(settings)
/** Set group checked and if group has subsettings, set expanded group id */
const onGroupClickHandler = () => {
  settings.setGroupChecked(props.group.id)
  if (isSubsettingsGroup(props.group)) {
    settings.setExpandedGroupId(props.group.id)
  } else {
    settings.setExpandedGroupId()
  }
}
</script>

<template>
  <li
    :class="{ 'group-checked': checkedGroupId === group.id }"
    @click="onGroupClickHandler"
    class="nav__item"
  >
    {{ group.title }}
  </li>

  <ul class="nav__subsettings" v-if="isSubsettingsGroup(group) && expandedGroupId === group.id">
    <SubsettingsGroup
      v-for="(subsettingsGroup, idx) in group.subSettings"
      :group="group"
      :subsettings-group="subsettingsGroup"
      :order-idx="idx"
      :key="subsettingsGroup.title"
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
.group-checked {
  font-weight: 600;
  opacity: 1;
}
</style>
