<script setup lang="ts">
import type { SettingsGroupKind } from '@/types/SettingsState'
import { isSubsettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import Setting from '@/components/settings/SettingVariant.vue'
import { storeToRefs } from 'pinia'
import { toRefs } from 'vue'

defineProps<{
  group: SettingsGroupKind
}>()

const appSettings = useSettingsStore()
const { settingsState } = storeToRefs(appSettings)
const { checkedSubsettingIndex } = toRefs(settingsState.value)
</script>

<template>
  <div class="setting-view" v-if="group.groupChecked && checkedSubsettingIndex !== null">
    <Setting
      v-for="setting in group.settings"
      :key="setting.title"
      :setting="setting"
      :group="group"
    />
  </div>
  <div
    class="setting-view"
    v-if="group.groupChecked && checkedSubsettingIndex !== null && isSubsettingsGroup(group)"
  >
    <Setting
      v-for="subsetting in group.subSettings[checkedSubsettingIndex].settings"
      :key="subsetting.title"
      :setting="subsetting"
      :group="group"
      :subsettingGroup="group.subSettings[checkedSubsettingIndex]"
    />
  </div>
</template>

<style lang="scss" scoped>
.setting-view {
  padding: 10px 30px;
}
</style>
