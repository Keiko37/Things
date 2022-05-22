<script setup lang="ts">
import { computed } from 'vue'
import type { ExtensionLink } from '@/types/ExtensionsState'
import { useExtensionsStore } from '@/stores/extensions'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{
  extension: ExtensionLink
  orderIndex: number
}>()

const extensions = useExtensionsStore()
const appSettings = useSettingsStore()

function toggleExtension(extension: ExtensionLink) {
  extensions.toggleExtensionActivity(extension.id)
}

const transitionSeconds = computed<string>(() => {
  const resultNumber = props.orderIndex * 0.05
  return resultNumber + 's'
})

function isExtensionEnabled(extentionTitle: string) {
  return appSettings.getExtensionsGroup.settings.find((setting) => setting.title === extentionTitle)
    ?.selectedValue
}
</script>

<template>
  <transition :style="{ 'transition-delay': transitionSeconds }" name="item">
    <div
      v-if="isExtensionEnabled(extension.link) && extensions.extensionsState.isExtensions"
      @click="toggleExtension(extension)"
      :data-title="extension.title"
      class="tooltip"
    >
      <div class="icon-btn material-icons-round md-light extension-icon">
        {{ extension.icon }}
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.extension-icon {
  margin-right: 7px;
}
.item-enter-active,
.item-leave-active {
  transition: all 0.3s;
}
.item-enter-from,
.item-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
.item-leave-from,
.item-enter-to {
  opacity: 1;
}
</style>
