export default {
  state: () => ({
    isSettings: false,
    clockVisible: false,
    checkedNav: null,
    checkedSubsetting: false,
    appSettings: [
      {
        id: 1,
        title: 'clock',
        groupChecked: false,
        settings: [
          {
            title: 'size',
            values: [
              { title: 'small', value: '6rem' },
              { title: 'medium', value: '11rem' },
              { title: 'large', value: '15rem' },
            ],
            type: 'multiple',
            selectedValue: '11rem',
          },
        ],
      },
      {
        id: 2,
        title: 'extensions',
        groupChecked: false,
        settings: [
          {
            title: 'pomodoro',
            selectedValue: true,
            type: 'toggle',
          },
        ],
        subSettings: [
          {
            title: 'pomodoro',
            subsettingChecked: false,
            list: [
              {
                title: 'loop',
                selectedValue: false,
                type: 'toggle',
              },
              {
                title: 'notifications',
                selectedValue: false,
                type: 'toggle',
              },
              {
                title: 'focus timer duration',
                selectedValue: 1,
                type: 'number',
              },
              {
                title: 'rest timer duration',
                selectedValue: 1,
                type: 'number',
              },
              {
                title: 'long rest timer duration',
                selectedValue: 15,
                type: 'number',
              },
              {
                title: 'a long break in every one',
                selectedValue: 4,
                type: 'number',
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: 'fullscreen',
        groupChecked: false,
        settings: [],
      },
    ],
  }),
  getters: {
    getAppSettings(state) {
      return state.appSettings;
    },
    getIsSettings(state) {
      return state.isSettings;
    },
    getCheckedNav(state) {
      return state.checkedNav;
    },
    getClockSize(state) {
      const clockSettings = state.appSettings.find(
        (group) => group.title === 'clock'
      );
      const sizeSettings = clockSettings.settings.find(
        (setting) => setting.title === 'size'
      );
      return sizeSettings.selectedValue;
    },
    getClockVisible(state) {
      return state.clockVisible;
    },
    getExtensionsGroup(state) {
      return state.appSettings.find((group) => group.title === 'extensions');
    },
    getCheckedSubsetting(state) {
      return state.checkedSubsetting;
    },
    getPomodoroSettingsList(state) {
      return state.appSettings
        .find((group) => group.title === 'extensions')
        .subSettings.find((subsetting) => subsetting.title === 'pomodoro').list;
    },
    getFocusTimerMinutes(state, getters) {
      return getters.getPomodoroSettingsList.find(
        (subsetting) => subsetting.title === 'focus timer duration'
      ).selectedValue;
    },
    getRestTimerMinutes(state, getters) {
      return getters.getPomodoroSettingsList.find(
        (subsetting) => subsetting.title === 'rest timer duration'
      ).selectedValue;
    },
    getAlarmOn(state, getters) {
      return getters.getPomodoroSettingsList.find(
        (subsetting) => subsetting.title === 'notifications'
      ).selectedValue;
    },
    getLoopTimerOn(state, getters) {
      return getters.getPomodoroSettingsList.find(
        (subsetting) => subsetting.title === 'loop'
      ).selectedValue;
    },
  },
  mutations: {
    changeIsSettings(state) {
      state.isSettings = !state.isSettings;
    },
    setNavChecked(state, idx) {
      if (state.checkedNav !== null) {
        state.appSettings[state.checkedNav].groupChecked = false;
      }
      state.checkedSubsetting = false;
      state.appSettings[idx].groupChecked = true;
      state.checkedNav = idx;
    },
    setSubsettingChecked(state, { group, subsettingIndex }) {
      const foundGroup = state.appSettings.find(
        (groupOfSettings) => groupOfSettings.title === group.title
      );
      const foundSubsetting = foundGroup.subSettings[subsettingIndex];

      if (
        state.checkedSubsetting !== null &&
        state.checkedSubsetting !== false
      ) {
        foundGroup.subSettings[
          state.checkedSubsetting
        ].subsettingChecked = false;
      }
      foundSubsetting.subsettingChecked = true;
      state.checkedSubsetting = subsettingIndex;
    },
    setSetting(
      state,
      { newValue, groupOfSettings, settingName, subsettingGroup }
    ) {
      const foundGroup = state.appSettings.find(
        (group) => group.title === groupOfSettings.title
      );
      if (subsettingGroup) {
        const foundSubsettingGroup = foundGroup.subSettings.find(
          (subsettings) => subsettings.title === subsettingGroup.title
        );
        const foundSubsetting = foundSubsettingGroup.list.find(
          (subsetting) => subsetting.title === settingName
        );
        foundSubsetting.selectedValue = newValue;
      }
      if (!subsettingGroup) {
        const foundSetting = foundGroup.settings.find(
          (setting) => setting.title === settingName
        );
        foundSetting.selectedValue = newValue;
      }
    },
    toggleClockVisible(state) {
      state.clockVisible = state.clockVisible ? false : true;
    },
    setPomodoroToggle(state, settingObj) {
      const foundGroup = state.appSettings.find(
        (setting) => setting.title === 'extensions'
      ).subSettings;

      const foundPomodoroSettings = foundGroup.find(
        (subsetting) => subsetting.title === 'pomodoro'
      ).list;

      const foundSetting = foundPomodoroSettings.find(
        (setting) => setting.title === settingObj.searchedSetting
      );

      foundSetting.selectedValue = settingObj.newValue;
    },
  },
  actions: {
    toggleSetting(context) {
      context.commit('changeIsSettings');
    },
    selectNav(context, idx) {
      context.commit('setNavChecked', idx);
    },
    selectSubsetting(context, args) {
      context.commit('setSubsettingChecked', args);
    },
    updateSetting(context, settingObj) {
      context.commit('setSetting', settingObj);
    },
    timerClockVisible(context) {
      context.commit('toggleClockVisible');
      setTimeout(() => context.commit('toggleClockVisible'), 2000);
    },
    setPomodoroToggle(context, settingObj) {
      context.commit('setPomodoroToggle', settingObj);
    },
  },
};
