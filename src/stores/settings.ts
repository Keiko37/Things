import { reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  SettingsState,
  SettingsGroupKind,
  SettingsGroup,
  SubsettingsGroup,
} from '@/types/SettingsState'
import { isSubsettingsGroup } from '@/types/SettingsState'

export const useSettingsStore = defineStore('settings', () => {
  const settingsState: SettingsState = reactive({
    isSettings: false,
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

  const selectSubsetting = (group: SettingsGroupKind, subsettingIndex: number) => {
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
    subsettingGroup?: SettingsGroup
  ) => {
    setSetting(newValue, groupOfSettings, settingName, subsettingGroup)
    setNavChecked() // uncheck all nav's
    const subsettingIdx = settingsState.checkedSubsettingIndex
    const settingIdx = settingsState.checkedNavIndex
    if (settingIdx !== null) {
      setNavChecked(settingIdx)
    }
    if (subsettingGroup !== undefined && settingIdx !== null && subsettingIdx !== null) {
      selectSubsetting(settingsState.appSettings[settingIdx], subsettingIdx)
    }
  }

  const setSetting = (
    newValue: number | string | boolean,
    groupOfSettings: SettingsGroup,
    settingName: string,
    subsettingGroup: SettingsGroup | undefined
  ) => {
    const foundGroup = settingsState.appSettings.find(
      (group) => group.title === groupOfSettings.title
    )
    if (!foundGroup) {
      throw new Error('setSetting: settings group not found.')
    }
    if (!subsettingGroup) {
      const foundSetting = foundGroup.settings.find((setting) => setting.title === settingName)
      if (foundSetting) {
        foundSetting.selectedValue = newValue
      }
      return
    }
    if (!isSubsettingsGroup(foundGroup)) {
      throw new Error('setSetting: founded setting group not equal "SubsettingGroup" type.')
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

  watch(
    () => settingsState.appSettings,
    () => {
      localStorage.setItem('appSettings', JSON.stringify(settingsState.appSettings))
    },
    { flush: 'post', deep: true }
  )

  return {
    settingsState,
    findSettingsGroupByName,
    getExtensionsGroup,
    setAppSettings,
    toggleIsSettings,
    setNavChecked,
    selectSubsetting,
    setSetting,
    updateSetting,
  }
})
