<script setup lang="ts">
import { useExtensionsStore } from '@/stores/extensions'
import AppIcon from '@/components/global/AppIcon.vue'
import Extension from '@/components/extensions/AppExtension.vue'

const extensions = useExtensionsStore()
</script>

<template>
  <span
    @click="extensions.toggleIsExtensions"
    class="material-icons-round material-icons md-light icon-btn"
  >
    <AppIcon name="extension" />
  </span>
  <div class="extensions">
    <Extension
      v-for="(extension, idx) in extensions.extensionsLinks"
      :key="extension.id"
      :extension="extension"
      :orderIndex="idx"
    />
  </div>
</template>

<style lang="scss" scoped>
.extensions {
  display: flex;
  max-width: 40%;
  user-select: none;
  color: (--text-color-secondary);
  position: absolute;
  left: 60px;
}
</style>
