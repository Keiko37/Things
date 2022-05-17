<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SettingsGroupKind, SettingKind, SubsettingsGroup } from '@/types/SettingsState'
import { isSettingMultiple, isSettingToggle, isSettingNumber } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{
  group: SettingsGroupKind
  setting: SettingKind
  subsettingGroup: SubsettingsGroup
}>()

const settings = useSettingsStore()

const settingValue = ref(0)
onMounted(() => {
  if (typeof props.setting.selectedValue === 'number') {
    settingValue.value = props.setting.selectedValue
  }
})
function changeSetting(
  event: Event,
  groupOfSettings: SettingsGroupKind,
  settingName: string,
  subsettingGroup: SubsettingsGroup
) {
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
      throw new Error('changeSetting: setting has the wrong type.')
  }
  // TODO: recheck notifications code section, move it inside new function
  if (
    props.setting.title === 'notifications' &&
    (event.target as HTMLInputElement).checked &&
    newValue !== undefined
  ) {
    if (Notification.permission === 'granted') {
      settings.updateSetting(newValue, groupOfSettings, settingName, subsettingGroup)
    }

    if (Notification.permission === 'denied') {
      setTimeout(() => ((event.target as HTMLInputElement).checked = false), 400)
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          settings.updateSetting(true, groupOfSettings, settingName, subsettingGroup)
        }
        if (permission === 'denied') {
          ;(event.target as HTMLInputElement).checked = false
          settings.updateSetting(false, groupOfSettings, settingName, subsettingGroup)
        }
      })
    }
    return
  }
  if (newValue === undefined) {
    throw new Error('changeSetting: new value is undefined.')
  }
  settings.updateSetting(newValue, groupOfSettings, settingName, subsettingGroup)

  if (props.group.title === 'clock') {
    settings.timerClockVisible()
  }
}

function incrementNumber() {
  ++settingValue.value
  changeSetting(
    { type: 'number' } as Event,
    props.group,
    props.setting.title,
    props.subsettingGroup
  )
}
function decrementNumber() {
  if (settingValue.value <= 0) {
    return
  }
  --settingValue.value
  changeSetting(
    { type: 'number' } as Event,
    props.group,
    props.setting.title,
    props.subsettingGroup
  )
}
</script>

<template>
  <div class="setting">
    <h1 class="setting__title">{{ setting.title }}</h1>

    <div class="setting__multiple" v-if="isSettingMultiple(setting)">
      <div v-for="item in setting.values" :key="item.title">
        <input
          class="setting__radio"
          type="radio"
          :id="item.title"
          :name="setting.title"
          :value="item.value"
          :checked="item.value === setting.selectedValue"
          @click="changeSetting($event, group, setting.title, subsettingGroup)"
        />
        <label :for="item.title">{{ item.title }}</label>
      </div>
    </div>

    <div class="setting__toggle" v-if="isSettingToggle(setting)">
      <input
        :checked="setting.selectedValue"
        :id="'checkbox__' + setting.title"
        type="checkbox"
        class="toggle"
        @change="changeSetting($event, group, setting.title, subsettingGroup)"
      />
      <label :for="'checkbox__' + setting.title" class="toggle-trail">
        <span class="toggle-handler"></span>
      </label>
    </div>

    <div v-if="isSettingNumber(setting)" class="setting__number">
      <button @click="decrementNumber()" class="setting__number-button">
        <span class="material-icons-outlined material-icons icon-btn md-light md-18"> remove </span>
      </button>
      <input v-model="settingValue" class="setting__number-input" step="1" type="number" readonly />
      <button @click="incrementNumber()" class="setting__number-button">
        <span class="material-icons-outlined material-icons icon-btn md-light md-18"> add </span>
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
  width: 100%;
  align-items: center;
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
  }
  &__number-input {
    background-color: transparent;
    color: $text-color;
    width: 1.2rem;
    height: 2rem;
    margin: 0 2px;
    text-align: center;
    cursor: default;
    user-select: none;
  }
  &__number-button {
    background-color: transparent;
    border-radius: 50%;
    height: 100%;
    width: 1.6rem;
    height: 1.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
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
    border: 1px solid $text-color-secondary;
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
    border: 1px solid $text-color-secondary;
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
