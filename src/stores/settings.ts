import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { SettingsGroupKind } from '@/types/SettingsState'
import { isSubsettingsGroup } from '@/types/SettingsState'

export const useSettingsStore = defineStore('settings', () => {
  const appSettings = ref<SettingsGroupKind[]>([])
  const defaultSettings: SettingsGroupKind[] = [
    {
      id: 1,
      title: 'clock',
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
    //   settings: [],
    // },
  ]

  /** Find settings group by passed title
   * @param nestedGroup - if we want to find a setting inside a nested group
   */
  const findSettingsGroupByName = (groupTitle: string, nestedGroup?: SettingsGroupKind[]) => {
    const target = nestedGroup || appSettings.value

    let foundGroup: SettingsGroupKind | undefined
    target.forEach((group) => {
      if (group.title === groupTitle) {
        foundGroup = group
      }
      if (isSubsettingsGroup(group)) {
        const foundNestedGroup = findSettingsGroupByName(groupTitle, group.subSettings)
        if (foundNestedGroup !== undefined) {
          foundGroup = foundNestedGroup
        }
      }
    })
    return foundGroup
  }

  /** Find settings group by passed id
   * @param nestedGroup - if we want to find a setting inside a nested group
   */
  const findSettingsGroupById = (settingsGroupId: number, nestedGroup?: SettingsGroupKind[]) => {
    const target = nestedGroup || appSettings.value

    let foundGroup: SettingsGroupKind | undefined
    target.forEach((group) => {
      if (group.id === settingsGroupId) {
        foundGroup = group
      }
      if (isSubsettingsGroup(group)) {
        const foundNestedGroup = findSettingsGroupById(settingsGroupId, group.subSettings)
        if (foundNestedGroup !== undefined) {
          foundGroup = foundNestedGroup
        }
      }
    })
    return foundGroup
  }

  /** Set all settings */
  const setAppSettings = (newValue: SettingsGroupKind[]) => {
    appSettings.value = newValue
  }

  const isSettings = ref<boolean>(false)
  /** Toggle a boolean settings window variable */
  const toggleIsSettings = () => {
    isSettings.value = !isSettings.value
  }

  const checkedGroupId = ref<number | null>(null)
  /** Set checked group id to ref variable or set null */
  const setGroupChecked = (id?: number) => {
    if (id === undefined) {
      checkedGroupId.value = null
      return
    }
    checkedGroupId.value = id
  }

  const expandedGroupId = ref<number | null>(null)
  /** Set expanded group id to ref variable or set null */
  const setExpandedGroupId = (id?: number) => {
    if (id === undefined) {
      expandedGroupId.value = null
      return
    }
    expandedGroupId.value = id
  }

  /** Check setting value and new value types, then paste new value to setting */
  const setSetting = (
    newValue: number | string | boolean,
    settingsGroupId: number,
    settingName: string
  ) => {
    const foundGroup = findSettingsGroupById(settingsGroupId)
    if (!foundGroup) {
      throw new Error('setSetting: settings group not found.')
    }
    const foundSetting = foundGroup.settings.find((setting) => setting.title === settingName)
    if (!foundSetting) {
      throw new Error('setSetting: setting not found.')
    }

    const settingValueType = typeof foundSetting.selectedValue
    const newValueType = typeof newValue

    if (settingValueType === newValueType) {
      foundSetting.selectedValue = newValue
    } else {
      throw new Error(
        `setSetting: type of setting value is ${settingValueType} but must be ${newValueType}.`
      )
    }
  }

  watch(
    () => appSettings.value,
    () => {
      localStorage.setItem('appSettings', JSON.stringify(appSettings.value))
    },
    { flush: 'post', deep: true }
  )

  return {
    defaultSettings,
    appSettings,
    setAppSettings,
    findSettingsGroupByName,
    findSettingsGroupById,
    setSetting,
    isSettings,
    toggleIsSettings,
    checkedGroupId, // idk for now need it or not
    setGroupChecked,
    expandedGroupId,
    setExpandedGroupId,
  }
})
