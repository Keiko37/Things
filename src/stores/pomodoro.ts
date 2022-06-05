import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { SettingKind } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settingsStore = useSettingsStore()
  const { findSettingsGroupByName } = settingsStore

  const getPomodoroSettingsList = computed<SettingKind[]>(() => {
    const pomodoroSettings = findSettingsGroupByName('extensions', 'pomodoro')
    return pomodoroSettings.settings
  })

  const getFocusTimerMinutes = computed<number>(() => {
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

  return {
    getPomodoroSettingsList,
    getFocusTimerMinutes,
    getRestTimerMinutes,
    getLongRestTimerMinutes,
    numberOfPomodorosBeforeLongRest,
    getAlarmOn,
    getLoopTimerOn,
    setPomodoroSetting,
  }
})
