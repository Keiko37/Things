<template>
  <div
    v-if="isExtensionEnabled(extension.extensionLink)"
    @click="openExtension(extension.extensionLink)"
    :data-title="extension.title"
    class="tooltip"
  >
    <div class="icon-btn material-icons-round md-light">
      {{ extension.icon }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Extension',
  props: {
    extension: Object,
  },
  computed: {
    ...mapGetters(['getExtensionsGroup']),
  },
  methods: {
    ...mapActions(['showExtension']),
    openExtension(extensionLink) {
      this.showExtension(extensionLink);
    },
    isExtensionEnabled(extentionTitle) {
      return this.getExtensionsGroup.settings.find(
        (setting) => setting.title === extentionTitle
      ).selectedValue;
    },
  },
};
</script>
