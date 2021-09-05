<template>
  <div
    class="setting-view"
    v-if="group.groupChecked && getCheckedSubsetting === false"
  >
    <Setting
      v-for="setting in group.settings"
      :key="setting.title"
      :setting="setting"
      :group="group"
    />
  </div>
  <div
    class="setting-view"
    v-if="group.groupChecked && getCheckedSubsetting !== false"
  >
    <Setting
      v-for="subsetting in group.subSettings[getCheckedSubsetting].list"
      :key="subsetting.title"
      :setting="subsetting"
      :group="group"
      :subsettingGroup="group.subSettings[getCheckedSubsetting]"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Setting from '@/components/settings/Setting';

export default {
  name: 'SettingsView',
  components: {
    Setting,
  },
  props: {
    group: Object,
  },
  computed: {
    ...mapGetters(['getCheckedSubsetting']),
  },
};
</script>

<style lang="scss" scoped>
.setting-view {
  padding: 10px 30px;
}
</style>
