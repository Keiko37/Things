import { onMounted, onUnmounted, ref } from 'vue'

export function useFullscreen() {
  // TODO: add notification(with useNotification) on fullscreenchange event. Add event listener onMounted and remove onUnmounted hook.
  // TODO: add fullscreen support for apple devices
  const isFullscreen = ref(false)

  const enter = async () => {
    if (!document.fullscreenEnabled) {
      throw new Error(
        'Fullscreen: feature not being allowed, or full-screen mode not being supported.'
      )
    }
    if (!isFullscreen.value) {
      try {
        await document.body.requestFullscreen()
        isFullscreen.value = true
      } catch (e) {
        throw new Error('fullscreen: enter failed.')
      }
    } else {
      throw new Error('fullscreen: fullscreen already enabled.')
    }
  }

  const exit = async () => {
    if (isFullscreen.value) {
      try {
        await document.exitFullscreen()
        isFullscreen.value = false
      } catch (e) {
        throw new Error('fullscreen: exit failed.')
      }
    } else {
      throw new Error('fullscreen: fullscreen already disabled.')
    }
  }

  const toggle = () => {
    if (isFullscreen.value) {
      exit()
    } else {
      enter()
    }
  }

  const fullscreenChangeEvent = () => {
    if (window.innerHeight === screen.height && window.innerWidth === screen.width) {
      // this works only if the devtools are disabled. May be need some check on enabled devtools.
      isFullscreen.value = true
    } else {
      isFullscreen.value = false
    }
  }
  const fullscreenErrorEvent = () => {
    throw new Error('fullscreen: fullscreen change error.')
  }
  onMounted(() => {
    window.addEventListener('resize', fullscreenChangeEvent)
    window.addEventListener('fullscreenerror', fullscreenErrorEvent)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', fullscreenChangeEvent)
    window.removeEventListener('fullscreenerror', fullscreenErrorEvent)
  })
  return {
    isFullscreen,
    enter,
    exit,
    toggle,
  }
}
