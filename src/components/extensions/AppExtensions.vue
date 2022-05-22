<script setup lang="ts">
import Extension from '@/components/extensions/AppExtension.vue'
import { useExtensionsStore } from '@/stores/extensions'

const extensions = useExtensionsStore()
</script>

<template>
  <span
    @click="extensions.toggleIsExtensions"
    class="material-icons-round material-icons md-light icon-btn"
    >extension</span
  >
  <div class="extensions">
    <Extension
      v-for="(extension, idx) in extensions.extensionsState.extensionsLinks"
      :key="extension.id"
      :extension="extension"
      :orderIdx="idx"
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
