<template>
  <li
    :class="{ 'settings-nav-item-checked': getCheckedNav === indexInArray }"
    @click="selectNav(indexInArray)"
    class="nav__item"
  >
    {{ group.title }}
  </li>
  <ul v-if="group.subSettings && group.groupChecked" class="nav__subsettings">
    <li
      :class="{
        'settings-nav-item-checked':
          getCheckedNav === indexInArray && getCheckedSubsetting === idx,
      }"
      @click="selectSubsetting({ group: group, subsettingIndex: idx })"
      class="nav__item nav__subsetting"
      v-for="(subsetting, idx) in group.subSettings"
      :key="subsetting.title"
    >
      {{ subsetting.title }}
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SettingsNav',
  props: {
    group: Object,
    indexInArray: Number,
  },
  computed: {
    ...mapGetters(['getCheckedNav', 'getCheckedSubsetting']),
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
