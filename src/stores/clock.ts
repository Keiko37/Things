import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { SettingsGroup, SettingMultiple } from '@/types/SettingsState'

function isClockSize(value: string): value is ClockSize {
  const clockSizes = ['6rem', '11rem', '15rem']
  return clockSizes.includes(value)
}
type ClockSize = '6rem' | '11rem' | '15rem'

export const useClockStore = defineStore('clock', () => {
  const currentTime = ref<string | null>(null)
  const clockIntervalId = ref<number | null>(null)

  const settingsStore = useSettingsStore()

  const getClockSize = computed<ClockSize>(() => {
    // TODO: replace to clock store
    const clockSettings: SettingsGroup | undefined = settingsStore.settingsState.appSettings.find(
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

  const isClockVisible = ref(false)
  const clockVisibleTimerId = ref(0)

  const timerClockVisible = () => {
    clearTimeout(clockVisibleTimerId.value)
    setClockVisible(true)
    clockVisibleTimerId.value = window.setTimeout(() => setClockVisible(false), 2000)
  }
  const setClockVisible = (value: boolean) => {
    isClockVisible.value = value
  }

  return {
    currentTime,
    clockIntervalId,
    isClockVisible,
    getClockSize,
    timerClockVisible,
  }
})
