<script setup lang="ts">
import type { SettingsGroupKind } from '@/types/SettingsState'
import SettingVariant from '@/components/settings/SettingVariant.vue'

defineProps<{
  group: SettingsGroupKind
}>()
</script>

<template>
  <div class="setting-view">
    <SettingVariant
      v-for="setting in group.settings"
      :key="setting.title"
      :setting="setting"
      :group="group"
    />
  </div>
</template>

<style lang="scss" scoped>
.setting-view {
  padding: 10px 30px;
}
</style>
