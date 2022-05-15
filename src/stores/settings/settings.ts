import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  SettingsState,
  SettingsGroupKind,
  SettingsGroup,
  SubsettingsGroup,
  SettingMultiple,
  SettingKind,
} from '@/types/SettingsState'
import { isSubsettingsGroup, isSettingsGroup } from '@/types/SettingsState'

function isClockSize(value: string): value is ClockSize {
  const clockSizes = ['6rem', '11rem', '15rem']
  return clockSizes.includes(value)
}
type ClockSize = '6rem' | '11rem' | '15rem'

export const useSettingsStore = defineStore('settings', () => {
  const settingsState: SettingsState = reactive({
    isSettings: false,
    isClockVisible: false,
    clockVisibleTimerId: 0,
    checkedNavIdx: null,
    checkedSubsettingIndex: null,
    appSettings: [],
    defaultSettings: [
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
            id: 2.1,
            title: 'pomodoro',
            groupChecked: false,
            settings: [
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
                selectedValue: 25,
                type: 'number',
              },
              {
                title: 'rest timer duration',
                selectedValue: 5,
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
      // {
      //   id: 3,
      //   title: 'fullscreen',
      //   groupChecked: false,
      //   settings: [],
      // },
    ],
  })

  const getClockSize = computed<ClockSize>(() => {
    const clockSettings: SettingsGroup | undefined = settingsState.appSettings.find((group) => group.title === 'clock')
    if (!clockSettings) {
      throw new Error('getClockSize: "clock" settings not found.')
    }
    const sizeSetting: SettingMultiple | undefined = clockSettings.settings.find(
      (setting): setting is SettingMultiple =>
        typeof setting.selectedValue === 'string' &&
        setting.title === 'size' &&
        isClockSize(setting.selectedValue) &&
        'values' in setting
    )
    if (!sizeSetting) {
      throw new Error('getClockSize: "clock size" setting not found.')
    }
    if (!isClockSize(sizeSetting.selectedValue)) {
      throw new Error('getClockSize: "selected size" setting value is not the "ClockSize" type.')
    }
    return sizeSetting.selectedValue
  })

  const getExtensionsGroup = computed<SettingsGroup>(() => {
    const extensions: SettingsGroup | undefined = settingsState.appSettings.find(
      (group: SettingsGroup) => group.title === 'extensions'
    )
    if (!extensions) {
      throw new Error('getExtensionGroup: "extensions" settings group not found.')
    }
    return extensions
  })

  const getPomodoroSettingsList = computed<SettingKind[]>(() => {
    // TODO: replace in external module
    const extensionsSettings = settingsState.appSettings.find((group) => group.title === 'extensions')
    if (!extensionsSettings || !isSubsettingsGroup(extensionsSettings)) {
      throw new Error('getPomodoroSettingsList: "extensions" settings not found.')
    }
    const pomodoroSettings: SettingsGroup | undefined = extensionsSettings.subSettings.find(
      (subsetting) => subsetting.title === 'pomodoro'
    )
    if (!pomodoroSettings) {
      throw new Error('getPomodoroSettingsList: "pomodoro" settings not found.')
    }
    if (!isSettingsGroup(pomodoroSettings)) {
      throw new Error('getClockSize: "selected size" setting value is not the "ClockSize" type.')
    }
    return pomodoroSettings.settings
  })

  const getFocusTimerMinutes = computed<number>(() => {
    // TODO: replace in external module
    if (typeof getPomodoroSettingsList.value === 'undefined') {
      throw new Error('getFocusTimerMinutes: getPomodoroList is undefined.')
    }
    const focusTimerSetting = getPomodoroSettingsList.value.find(
      (subsetting) => subsetting.title === 'focus timer duration'
    )
    if (!focusTimerSetting) {
      throw new Error('getFocusTimerMinutes: "focus timer" setting not found.')
    }
    if (typeof focusTimerSetting.selectedValue !== 'number') {
      throw new Error('getFocusTimerMinutes: "selected value" not equal "number" type.')
    }
    return focusTimerSetting.selectedValue
  })

  const getRestTimerMinutes = computed<number>(() => {
    // TODO: replace in external module
    const restTimerSetting: SettingKind | undefined = getPomodoroSettingsList.value.find(
      (setting) => setting.title === 'rest timer duration'
    )
    if (!restTimerSetting) {
      throw new Error('getRestTimerMinutes: "rest timer" setting not found.')
    }
    if (typeof restTimerSetting.selectedValue !== 'number') {
      throw new Error('getRestTimerMinutes: "selected value" not equal "number" type.')
    }
    return restTimerSetting.selectedValue
  })

  const getLongRestTimerMinutes = computed<number>(() => {
    // TODO: replace in external module
    const longRestTimerSetting: SettingKind | undefined = getPomodoroSettingsList.value.find(
      (setting) => setting.title === 'long rest timer duration'
    )
    if (!longRestTimerSetting) {
      throw new Error('getLongRestTimerMinutes: "long rest timer" setting not found.')
    }
    if (typeof longRestTimerSetting.selectedValue !== 'number') {
      throw new Error('getLongRestTimerMinutes: "selected value" not equal "number" type.')
    }
    return longRestTimerSetting.selectedValue
  })

  const getPomodorosBeforeLongRest = computed<number>(() => {
    // TODO: replace in external module
    const pomodorosBeforeLongRestSetting: SettingKind | undefined = getPomodoroSettingsList.value.find(
      (setting) => setting.title === 'a long break in every one'
    )
    if (!pomodorosBeforeLongRestSetting) {
      throw new Error('getPomodorosBeforeLongRest: "pomodoros before long rest" setting not found.')
    }
    if (typeof pomodorosBeforeLongRestSetting.selectedValue !== 'number') {
      throw new Error('getPomodorosBeforeLongRest: "selected value" not equal "number" type.')
    }
    return pomodorosBeforeLongRestSetting.selectedValue
  })

  const getAlarmOn = computed<boolean>(() => {
    // TODO: replace in external module
    const alarmOnSetting: SettingKind | undefined = getPomodoroSettingsList.value.find(
      (setting) => setting.title === 'notifications'
    )
    if (!alarmOnSetting) {
      throw new Error('getAlarmOn: "pomodoro alarm on" setting not found.')
    }
    if (typeof alarmOnSetting.selectedValue !== 'boolean') {
      throw new Error('getAlarmOn: "selected value" not equal "boolean" type.')
    }
    return alarmOnSetting.selectedValue
  })

  const getLoopTimerOn = computed<boolean>(() => {
    // TODO: replace in external module
    const loopTimerOnSetting: SettingKind | undefined = getPomodoroSettingsList.value.find(
      (setting) => setting.title === 'loop'
    )
    if (!loopTimerOnSetting) {
      throw new Error('getLoopTimerOn: "loop timer on" setting not found.')
    }
    if (typeof loopTimerOnSetting.selectedValue !== 'boolean') {
      throw new Error('getLoopTimerOn: "selected value" not equal "boolean" type.')
    }
    return loopTimerOnSetting.selectedValue
  })

  const setAppSettings = (value: SettingsGroupKind[]): void => {
    settingsState.appSettings = value
  }

  const toggleIsSettings = (): void => {
    // TODO: replace name on toggleIsSettings
    settingsState.isSettings = !settingsState.isSettings
  }

  const setNavChecked = (idx?: number) => {
    if (typeof settingsState.checkedNavIdx === 'number') {
      settingsState.appSettings[settingsState.checkedNavIdx].groupChecked = false
    }
    if (idx === undefined) {
      // if we don' have index as entry parameter so let's just uncheck nav.
      return
    }
    // settingsState.isCheckedSubsetting = false // idk what's this for now
    settingsState.appSettings[idx].groupChecked = true
    settingsState.checkedNavIdx = idx
  }

  const selectSubsetting = (group: SubsettingsGroup, subsettingIndex: number) => {
    // TODO: maybe pass only the targetGroupTitle and not the whole group
    const foundGroup = settingsState.appSettings.find((groupOfSettings) => groupOfSettings.title === group.title)
    let foundSubsetting: SettingsGroup
    if (!foundGroup) {
      throw new Error('setSubsettingsChecked: group not found.')
    }
    if (isSubsettingsGroup(foundGroup)) {
      foundSubsetting = foundGroup.subSettings[subsettingIndex]
      foundSubsetting.groupChecked = true
    }
    if (settingsState.checkedSubsettingIndex && isSubsettingsGroup(foundGroup)) {
      foundGroup.subSettings[settingsState.checkedSubsettingIndex].groupChecked = false
    }
    settingsState.checkedSubsettingIndex = subsettingIndex
  }

  const updateSettings = (
    newValue: number | string | boolean,
    groupOfSettings: SettingsGroup,
    settingName: string,
    subsettingGroup: SubsettingsGroup
  ) => {
    setSetting(newValue, groupOfSettings, settingName, subsettingGroup)
    setNavChecked()
    // TODO: rewrite code below and maybe do that with  watch(settingsState.appSettings...)
    // localStorage.setItem(
    //   'appSettings',
    //   JSON.stringify(context.getters.getAppSettings)
    // );
    // const subsettingIdx = context.state.checkedSubsetting;
    // const settingIdx = context.state.checkedNav;
    // context.dispatch('selectNav', settingIdx);
    // if (settingObj.subsettingGroup) {
    //   context.dispatch('selectSubsetting', {
    //     group: context.state.appSettings[settingIdx],
    //     subsettingIndex: subsettingIdx,
    //   });
    // }
  }

  const setSetting = (
    newValue: number | string | boolean,
    groupOfSettings: SettingsGroup,
    settingName: string,
    subsettingGroup: SubsettingsGroup
  ) => {
    const foundGroup = settingsState.appSettings.find((group) => group.title === groupOfSettings.title)
    if (!foundGroup) {
      throw new Error('setSetting: settings group not found.')
    }
    if (!isSubsettingsGroup(foundGroup)) {
      throw new Error('setSetting: founded setting group not equal "SubsettingGroup" type.')
    }
    if (!subsettingGroup) {
      const foundSetting = foundGroup.settings.find((setting) => setting.title === settingName)
      if (foundSetting) {
        foundSetting.selectedValue = newValue
      }
      return
    }
    const foundSubsettingGroup = foundGroup.subSettings.find(
      (subsettings) => subsettings.title === subsettingGroup.title
    )
    if (foundSubsettingGroup) {
      const foundSubsetting = foundSubsettingGroup.settings.find((subsetting) => subsetting.title === settingName)
      if (foundSubsetting) {
        foundSubsetting.selectedValue = newValue
      }
    }
  }

  const setClockVisible = (value: boolean) => {
    settingsState.isClockVisible = value
  }

  const setPomodoroSetting = (searchedSettingTitle: string, newValue: number | string | boolean) => {
    const extensionsSettingsGroup: SettingsGroupKind | undefined = settingsState.appSettings.find(
      (setting) => setting.title === 'extensions' && isSubsettingsGroup(setting)
    )
    if (typeof extensionsSettingsGroup === 'undefined') {
      throw new Error('setPomodoroSetting: extensions settings group not found.')
    }
    if (!isSubsettingsGroup(extensionsSettingsGroup)) {
      throw new Error('setPomodoroSetting: extensionsSettingsGroup not equal type "SubsettingsGroup".')
    }

    const pomodoroGroup = extensionsSettingsGroup.subSettings.find((subsetting) => subsetting.title === 'pomodoro')
    if (!pomodoroGroup) {
      throw new Error('setPomodoroSetting: pomodoro group not found.')
    }

    const foundSetting = pomodoroGroup.settings.find((setting) => setting.title === searchedSettingTitle)
    if (!foundSetting) {
      throw new Error('setPomodoroSetting: pomodoro setting not found.')
    }
    if (typeof foundSetting.selectedValue === typeof newValue) {
      foundSetting.selectedValue = newValue
    } else {
      throw new Error(
        'setPomodoroSetting: type of the settings selected value is not equal to the type of the new value.'
      )
    }
  }

  const timerClockVisible = () => {
    clearTimeout(settingsState.clockVisibleTimerId)
    setClockVisible(true)
    setTimeout(() => setClockVisible(false), 2000)
  }
  return {
    settingsState,
    getClockSize,
    getExtensionsGroup,
    getPomodoroSettingsList,
    getFocusTimerMinutes,
    getRestTimerMinutes,
    getLongRestTimerMinutes,
    getPomodorosBeforeLongRest,
    getAlarmOn,
    getLoopTimerOn,
    setAppSettings,
    toggleIsSettings,
    selectSubsetting,
    setSetting,
    setClockVisible,
    setPomodoroSetting,
    timerClockVisible,
    setNavChecked,
  }
})
