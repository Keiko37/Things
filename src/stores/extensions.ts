import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { ExtensionsState } from '@/types/ExtensionsState'

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
    toggleIsExtensions,
    toggleExtensionActivity,
  }
})
