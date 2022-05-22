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
import { isSubsettingsGroup } from '@/types/SettingsState'

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
    checkedNavIndex: null,
    checkedSubsettingIndex: null,
    appSettings: [],
    defaultSettings: [
      {
        id: 0,
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
        id: 1,
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
            id: 0,
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
      //   id: 2,
      //   title: 'fullscreen',
      //   groupChecked: false,
      //   settings: [],
      // },
    ],
  })

  const findSettingsGroupByName = (settingsGroupTitle: string, subsettingsGroupTitle?: string) => {
    const foundSettingsGroup: SettingsGroupKind | undefined = settingsState.appSettings.find(
      (settingsGroup: SettingsGroup) => settingsGroup.title === settingsGroupTitle
    )
    if (foundSettingsGroup === undefined) {
      throw new Error(`findSettingsGroupByName: settings group ${settingsGroupTitle} not found.`)
    }
    if (subsettingsGroupTitle === undefined) {
      return foundSettingsGroup
    } else {
      if (!isSubsettingsGroup(foundSettingsGroup)) {
        throw new Error(
          'findSettingsGroupByName: settings group ${settingsGroupTitle} not equal type "SubsettingsGroup".'
        )
      }
      const foundSubsettingsGroup = foundSettingsGroup.subSettings.find(
        (subsettingsGroup) => subsettingsGroup.title === subsettingsGroupTitle
      )
      if (foundSubsettingsGroup === undefined) {
        throw new Error(
          `findSettingsGroupByName: subsetting group ${subsettingsGroupTitle} not found.`
        )
      }
      return foundSubsettingsGroup
    }
  }
  const getClockSize = computed<ClockSize>(() => {
    const clockSettings: SettingsGroup | undefined = settingsState.appSettings.find(
      (group) => group.title === 'clock'
    )
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

  const getExtensionsGroup = computed<SubsettingsGroup>(() => {
    const extensions: SettingsGroup | undefined = settingsState.appSettings.find(
      (group: SettingsGroup | SubsettingsGroup) => group.title === 'extensions'
    )
    if (!extensions) {
      throw new Error('getExtensionGroup: "extensions" subsettings group not found.')
    }
    if (!isSubsettingsGroup(extensions)) {
      throw new Error('getExtensionsGroup: "extensions is not subsetting group."')
    }
    return extensions
  })

  const getPomodoroSettingsList = computed<SettingKind[]>(() => {
    // TODO: replace in external module
    const pomodoroSettings = findSettingsGroupByName('extensions', 'pomodoro')
    return pomodoroSettings.settings
  })

  const getFocusTimerMinutes = computed<number>(() => {
    // TODO: replace in external module
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

  const numberOfPomodorosBeforeLongRest = computed<number>(() => {
    // TODO: replace in external module
    const pomodorosBeforeLongRestSetting: SettingKind | undefined =
      getPomodoroSettingsList.value.find((setting) => setting.title === 'a long break in every one')
    if (!pomodorosBeforeLongRestSetting) {
      throw new Error(
        'numberOfPomodorosBeforeLongRest: "pomodoros before long rest" setting not found.'
      )
    }
    if (typeof pomodorosBeforeLongRestSetting.selectedValue !== 'number') {
      throw new Error('numberOfPomodorosBeforeLongRest: "selected value" not equal "number" type.')
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
    settingsState.isSettings = !settingsState.isSettings
  }

  const setNavChecked = (idx?: number) => {
    if (typeof settingsState.checkedNavIndex === 'number') {
      settingsState.appSettings[settingsState.checkedNavIndex].groupChecked = false
    }
    if (idx === undefined) {
      // if we don' have index as entry parameter so let's just uncheck nav.
      return
    }
    // settingsState.isCheckedSubsetting = false // idk what's this for now
    settingsState.appSettings[idx].groupChecked = true
    settingsState.checkedNavIndex = idx
  }

  const selectSubsetting = (group: SubsettingsGroup, subsettingIndex: number) => {
    // TODO: maybe pass only the targetGroupTitle and not the whole group
    const foundGroup = settingsState.appSettings.find(
      (groupOfSettings) => groupOfSettings.title === group.title
    )
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

  const updateSetting = (
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
    const foundGroup = settingsState.appSettings.find(
      (group) => group.title === groupOfSettings.title
    )
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
      const foundSubsetting = foundSubsettingGroup.settings.find(
        (subsetting) => subsetting.title === settingName
      )
      if (foundSubsetting) {
        foundSubsetting.selectedValue = newValue
      }
    }
  }

  const setClockVisible = (value: boolean) => {
    settingsState.isClockVisible = value
  }

  const setPomodoroSetting = (settingTitle: string, newValue: number | string | boolean) => {
    const pomodoroSettingsGroup = findSettingsGroupByName('extensions', 'pomodoro')

    const foundSetting = pomodoroSettingsGroup.settings.find(
      (setting) => setting.title === settingTitle
    )
    if (foundSetting === undefined) {
      throw new Error('setPomodoroSetting: pomodoro setting not found.')
    }
    if (typeof foundSetting.selectedValue !== typeof newValue) {
      throw new Error(
        'setPomodoroSetting: type of the settings selected value is not equal to the type of the new value.'
      )
    }
    foundSetting.selectedValue = newValue
  }

  const timerClockVisible = () => {
    clearTimeout(settingsState.clockVisibleTimerId)
    setClockVisible(true)
    settingsState.clockVisibleTimerId = window.setTimeout(() => setClockVisible(false), 2000)
  }

  return {
    settingsState,
    findSettingsGroupByName,
    getClockSize,
    getExtensionsGroup,
    getPomodoroSettingsList,
    getFocusTimerMinutes,
    getRestTimerMinutes,
    getLongRestTimerMinutes,
    numberOfPomodorosBeforeLongRest,
    getAlarmOn,
    getLoopTimerOn,
    setAppSettings,
    toggleIsSettings,
    setNavChecked,
    selectSubsetting,
    setSetting,
    setClockVisible,
    setPomodoroSetting,
    timerClockVisible,
    updateSetting,
  }
})
