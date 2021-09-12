<template>
  <transition :style="{ 'transition-delay': getTransitionSeconds }" name="item">
    <li
      v-if="group.subSettings && group.groupChecked"
      :class="{
        'settings-nav-item-checked':
          getCheckedNav === indexInArray && getCheckedSubsetting === orderIdx,
      }"
      @click="
        selectSubsetting({ group: group, subsettingIndex: this.orderIdx })
      "
      class="nav__item nav__subsetting"
    >
      {{ subsetting.title }}
    </li>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SubsettingNav',
  props: {
    subsetting: Object,
    orderIdx: Number,
    group: Object,
    indexInArray: Number,
  },
  computed: {
    ...mapGetters(['getCheckedNav', 'getCheckedSubsetting']),
    getTransitionSeconds() {
      const resultNumber = this.orderIdx * 0.05;
      return resultNumber + 's';
    },
  },
  methods: {
    ...mapActions(['selectSubsetting']),
  },
};
</script>

<style lang="scss" scoped>
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
