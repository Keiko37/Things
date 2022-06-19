type SettingsGroupKind = SettingsGroup | SubsettingsGroup

interface SettingsGroup {
  id: number
  title: string
  settings: SettingKind[]
}

function isSettingsGroup(group: object): group is SettingsGroup {
  return 'settings' in group
}

interface SubsettingsGroup extends SettingsGroup {
  subSettings: SettingsGroup[]
}

function isSubsettingsGroup(group: object): group is SubsettingsGroup {
  return 'subSettings' in group
}

type SettingKind = SettingMultiple | SettingToggle | SettingNumber

interface Setting {
  title: string
  type: string
}

interface SettingToggle extends Setting {
  selectedValue: boolean
}

function isSettingToggle(value: SettingKind): value is SettingToggle {
  return typeof value.selectedValue === 'boolean'
}

interface SettingNumber extends Setting {
  selectedValue: number
}

function isSettingNumber(value: SettingKind): value is SettingNumber {
  return typeof value.selectedValue === 'number'
}

interface SettingMultiple extends Setting {
  selectedValue: string
  values: SettingMultipleValue[]
}

function isSettingMultiple(value: SettingKind): value is SettingMultiple {
  return typeof value.selectedValue === 'string' && 'values' in value && Array.isArray(value.values)
}

interface SettingMultipleValue {
  title: string
  value: string
}

export type {
  SettingsGroupKind,
  SettingsGroup,
  SubsettingsGroup,
  SettingKind,
  Setting,
  SettingToggle,
  SettingNumber,
  SettingMultiple,
  SettingMultipleValue,
}

export { isSubsettingsGroup, isSettingsGroup, isSettingNumber, isSettingMultiple, isSettingToggle }
