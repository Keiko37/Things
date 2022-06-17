/** useClickOutside creates a directive that takes a callback
 * that will be called when a click occurs outside an element
 */
export function useClickOutside() {
  let clickOutsideHandler: (event: Event) => void

  const vClickOutside = {
    mounted(el: Element, binding: { value: () => void }) {
      clickOutsideHandler = (event: Event) => {
        if (!event.composedPath().includes(el)) {
          binding.value()
        }
      }
      window.addEventListener('click', clickOutsideHandler)
    },
    unmounted() {
      window.removeEventListener('click', clickOutsideHandler)
    },
  }

  return {
    vClickOutside,
  }
}
