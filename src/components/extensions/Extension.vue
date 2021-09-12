<template>
  <transition :style="{ 'transition-delay': getTransitionSeconds }" name="item">
    <div
      v-if="isExtensionEnabled(extension.extensionLink) && getIsExtensions"
      @click="openExtension(extension.extensionLink)"
      :data-title="extension.title"
      class="tooltip"
    >
      <div class="icon-btn material-icons-round md-light extension-icon">
        {{ extension.icon }}
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Extension',
  props: {
    extension: Object,
    orderIdx: Number,
  },
  computed: {
    ...mapGetters(['getExtensionsGroup', 'getIsExtensions']),
    getTransitionSeconds() {
      const resultNumber = this.orderIdx * 0.05;
      return resultNumber + 's';
    },
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
