import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { SettingsGroup, SubsettingsGroup } from '@/types/SettingsState'
import type { ExtensionLink } from '@/types/ExtensionsState'
import { isSubsettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'

export const useExtensionsStore = defineStore('extensions', () => {
  const extensionsLinks = ref<ExtensionLink[]>([
    {
      id: 1,
      active: false,
      title: 'pomodoro timer',
      icon: 'timer',
      link: 'pomodoro',
    },
  ])
  const isPomodoroOpened = computed<boolean>(() => findExtensionByName('pomodoro').active)

  const settings = useSettingsStore()
  const findExtensionByName = (extensionLink: string): ExtensionLink => {
    const foundExtension: ExtensionLink | undefined = extensionsLinks.value.find(
      (extension) => extension.link === extensionLink
    )
    if (!foundExtension) {
      throw new Error('findExtensionByName: extension not found.')
    }
    return foundExtension
  }
  const getExtensionsSettings = computed<SubsettingsGroup>(() => {
    const extensions: SettingsGroup | undefined = settings.findSettingsGroupByName('extensions')
    if (!extensions) {
      throw new Error('getExtensionsSettings: "extensions" settings group not found.')
    }
    if (!isSubsettingsGroup(extensions)) {
      throw new Error(
        'getExtensionsSettings: subsettings not found in "extensions" settings group.'
      )
    }
    return extensions
  })

  const isExtensions = ref<boolean>(false)
  const toggleIsExtensions = () => (isExtensions.value = !isExtensions.value)

  const toggleExtensionActivity = (extensionId: number) => {
    const foundExtension = extensionsLinks.value.find((ext) => ext.id === extensionId)
    if (typeof foundExtension !== 'undefined') {
      foundExtension.active = !foundExtension.active
    } else {
      throw Error('toggleExtensionActivity: extension not found.')
    }
  }

  return {
    extensionsLinks,
    findExtensionByName,
    getExtensionsSettings,
    isPomodoroOpened,
    isExtensions,
    toggleIsExtensions,
    toggleExtensionActivity,
  }
})
