export default {
  state: {
    fullscreen: false,
  },
  getters: {
    getFullscreen(state) {
      return state.fullscreen;
    },
  },
  mutations: {
    changeFullscreen(state, bool) {
      state.fullscreen = bool;
    },
  },
  actions: {
    switchFullscreen(context, bool) {
      context.commit('changeFullscreen', bool);
    },
  },
};
