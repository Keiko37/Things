import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import type { SettingsGroup, SubsettingsGroup } from '@/types/SettingsState'
import type { ExtensionsState } from '@/types/ExtensionsState'
import { useSettingsStore } from '@/stores/settings'
import { isSubsettingsGroup } from '@/types/SettingsState'

export const useExtensionsStore = defineStore('extensions', () => {
  const extensionsState: ExtensionsState = reactive({
    isExtensions: false,
    isPomodoroOpened: false,
    extensionsLinks: [
      {
        id: 1,
        active: false,
        title: 'pomodoro timer',
        icon: 'timer',
        link: 'pomodoro',
      },
    ],
  })

  const settings = useSettingsStore()

  const getExtensionsSettings = computed<SubsettingsGroup>(() => {
    const extensions: SettingsGroup | undefined = settings.settingsState.appSettings.find(
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

  const toggleIsExtensions = () => (extensionsState.isExtensions = !extensionsState.isExtensions)

  const toggleExtensionActivity = (extensionId: number) => {
    const foundExtension = extensionsState.extensionsLinks.find((ext) => ext.id === extensionId)
    if (typeof foundExtension !== 'undefined') {
      foundExtension.active = !foundExtension.active
    } else {
      throw Error('toggleExtensionActivity: extension not found.')
    }
  }

  return {
    extensionsState,
    getExtensionsSettings,
    toggleIsExtensions,
    toggleExtensionActivity,
  }
})
