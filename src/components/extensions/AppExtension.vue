<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { ExtensionLink } from '@/types/ExtensionsState'
import { useExtensionsStore } from '@/stores/extensions'
import AppIcon from '@/components/global/AppIcon.vue'

const props = defineProps<{
  extension: ExtensionLink
  orderIndex: number
}>()

const extensions = useExtensionsStore()
const { getExtensionsSettings } = storeToRefs(extensions)
const { toggleExtensionActivity } = extensions

const transitionSeconds = computed<string>(() => {
  const resultNumber = props.orderIndex * 0.05
  return resultNumber + 's'
})

/** Finds the setting in the extension settings by extension link and looks that it's active */
function isExtensionEnabled(extensionLink: string) {
  return getExtensionsSettings.value.settings.find((setting) => setting.title === extensionLink)
    ?.selectedValue
}
</script>

<template>
  <transition :style="{ 'transition-delay': transitionSeconds }" name="item">
    <div
      v-if="isExtensionEnabled(extension.link) && extensions.isExtensions"
      @click="toggleExtensionActivity(extension.id)"
      :data-title="extension.title"
      class="tooltip"
    >
      <div class="icon-btn extension-icon">
        <AppIcon :name="extension.icon" />
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
