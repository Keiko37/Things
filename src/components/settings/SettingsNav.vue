<template>
  <li
    :class="{ 'settings-nav-item-checked': getCheckedNav === indexInArray }"
    @click="selectNav(indexInArray)"
    class="nav__item"
  >
    {{ group.title }}
  </li>

  <ul class="nav__subsettings">
    <SubsettingNav
      v-for="(subsetting, idx) in group.subSettings"
      :key="subsetting.title"
      :orderIdx="idx"
      :subsetting="subsetting"
      :group="group"
      :indexInArray="indexInArray"
    />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SubsettingNav from './SubsettingNav.vue';

export default {
  name: 'SettingsNav',
  components: {
    SubsettingNav,
  },
  props: {
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
    ...mapActions(['selectNav', 'selectSubsetting']),
  },
};
</script>

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
.settings-nav-item-checked {
  font-weight: 600;
  opacity: 1;
}
</style>
