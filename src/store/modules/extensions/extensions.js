export default {
  state: () => ({
    isExtensions: false,
    pomodoroIsOpened: false,
    extensionsIcons: [
      {
        id: 1,
        title: 'pomodoro timer',
        icon: 'timer',
        extensionLink: 'pomodoro',
      },
    ],
  }),
  getters: {
    getIsExtensions(state) {
      return state.isExtensions;
    },
    getExtensionsIcons(state) {
      return state.extensionsIcons;
    },
    getPomodoroIsOpened(state) {
      return state.pomodoroIsOpened;
    },
  },
  mutations: {
    changeIsExtensions(state) {
      state.isExtensions = !state.isExtensions;
    },
    togglePomodoroIsOpened(state) {
      state.pomodoroIsOpened = !state.pomodoroIsOpened;
    },
  },
  actions: {
    toggleExtensions(context) {
      context.commit('changeIsExtensions');
    },
    showExtension(context, extensionLink) {
      if (extensionLink === 'pomodoro')
        context.commit('togglePomodoroIsOpened');
    },
  },
};
