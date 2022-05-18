interface ExtensionsState {
  isExtensions: boolean
  isPomodoroOpened: boolean
  extensionsLinks: ExtensionLink[]
}

interface ExtensionLink {
  id: number
  active: boolean
  title: string
  icon: string
  link: string
}

export type { ExtensionsState, ExtensionLink }
