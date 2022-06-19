<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SettingsGroupKind, SettingKind } from '@/types/SettingsState'
import { isSettingMultiple, isSettingToggle, isSettingNumber } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import { useClockStore } from '@/stores/clock'
import AppIcon from '@/components/global/AppIcon.vue'

const props = defineProps<{
  group: SettingsGroupKind
  setting: SettingKind
}>()

const settings = useSettingsStore()
const clock = useClockStore()

const settingValue = ref(0)
onMounted(() => {
  if (isSettingNumber(props.setting)) {
    settingValue.value = props.setting.selectedValue
  }
})

function changeSetting(event: Event) {
  let newValue: boolean | number | string | undefined

  if (event.target === null) {
    throw new Error('changeSetting: event target not found.')
  }
  switch (props.setting.type) {
    case 'toggle':
      newValue = (event.target as HTMLInputElement).checked
      break
    case 'number':
      newValue = settingValue.value
      break
    case 'multiple':
      newValue = (event.target as HTMLInputElement).value
      break
    default:
      throw new Error('changeSetting: wrong setting type.')
  }

  const isNotificationSetting = notificationSettingHandler(event, newValue)
  if (isNotificationSetting) {
    return
  }

  if (newValue === undefined) {
    throw new Error('changeSetting: new value of setting is undefined.')
  }
  settings.setSetting(newValue, props.group.id, props.setting.title)

  if (props.group.title === 'clock') {
    clock.timerClockVisible()
  }
}

function notificationSettingHandler(event: Event, newValue: string | number | boolean) {
  if (
    props.setting.title !== 'notifications' ||
    !(event.target as HTMLInputElement).checked ||
    newValue === undefined
  ) {
    return false
  }
  if (Notification.permission === 'granted') {
    settings.setSetting(newValue, props.group.id, props.setting.title)
  }

  if (Notification.permission === 'denied') {
    setTimeout(() => ((event.target as HTMLInputElement).checked = false), 400)
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        settings.setSetting(true, props.group.id, props.setting.title)
      }
      if (permission === 'denied') {
        ;(event.target as HTMLInputElement).checked = false
        settings.setSetting(false, props.group.id, props.setting.title)
      }
    })
  }
  return true
}

function incrementNumber() {
  ++settingValue.value
  changeSetting({ type: 'number' } as Event)
}
function decrementNumber() {
  if (settingValue.value <= 0) {
    return
  }
  --settingValue.value
  changeSetting({ type: 'number' } as Event)
}
</script>

<template>
  <div class="setting">
    <h1 class="setting__title">{{ setting.title }}</h1>

    <div v-if="isSettingMultiple(setting)" class="setting__multiple">
      <div v-for="item in setting.values" :key="item.title">
        <input
          class="setting__radio"
          type="radio"
          :id="item.title"
          :name="setting.title"
          :value="item.value"
          :checked="item.value === setting.selectedValue"
          @click="changeSetting($event)"
        />
        <label :for="item.title">{{ item.title }}</label>
      </div>
    </div>

    <div v-if="isSettingToggle(setting)" class="setting__toggle">
      <input
        :checked="setting.selectedValue"
        :id="'checkbox__' + setting.title"
        type="checkbox"
        class="toggle"
        @change="changeSetting($event)"
      />
      <label :for="'checkbox__' + setting.title" class="toggle-trail">
        <span class="toggle-handler"></span>
      </label>
    </div>

    <div v-if="isSettingNumber(setting)" class="setting__number">
      <button @click="decrementNumber()" class="icon-btn setting__number-button">
        <AppIcon name="remove" />
      </button>
      <input v-model="settingValue" class="setting__number-input" step="1" type="number" readonly />
      <button @click="incrementNumber()" class="icon-btn setting__number-button">
        <AppIcon name="add" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// disable arrows in input number
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
input[type='number']:hover,
input[type='number']:focus {
  -moz-appearance: number-input;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 5px;
  margin: 0 0 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  &__title {
    font-size: 1.5rem;
    flex: 0 1 60%;
    text-transform: capitalize;
  }
  &__multiple {
    display: flex;
    flex: 0 1 60%;
    justify-content: space-evenly;
  }
  &__radio {
    display: none;
  }
  &__radio + label {
    cursor: pointer;
  }
  &__radio:checked + label {
    font-weight: 500;
  }
  &__number {
    position: relative;
    display: flex;
    align-items: center;
  }
  &__number-input {
    background-color: transparent;
    color: var(--text-color);
    width: 1.2rem;
    margin: 0 3px;
    text-align: center;
    cursor: default;
    user-select: none;
  }
  &__number-button {
    background-color: transparent;
    border-radius: 50%;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

// toggle checkbox
.toggle {
  position: absolute;
  opacity: 0;
  z-index: -1;
  &-trail {
    display: flex;
    align-items: center;
    width: 3em;
    height: 1.5em;
    background: transparent;
    border-radius: 2.5em;
    border: 1px solid var(--text-color-secondary);
    transition: all 0.5s ease;
    cursor: pointer;
  }
  &-handler {
    display: flex;
    margin-left: 0.1em;
    justify-content: center;
    align-items: center;
    width: 1.2em;
    height: 1.2em;
    background: transparent;
    border: 1px solid var(--text-color-secondary);
    border-radius: 50%;
    transition: all 0.5s ease;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
  &:checked + .toggle-trail {
    .toggle-handler {
      margin-left: 53%;
      &::before {
        content: '\2714';
        font-size: 0.8em;
      }
    }
  }
}
</style>
