export default {
  state: {
    currentTime: null,
  },
  getters: {
    getCurrentTime(state) {
      return state.currentTime;
    },
  },
  mutations: {
    setCurrentTime(state) {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      state.currentTime = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;
    },
  },
  actions: {
    activateClock(context) {
      setInterval(() => context.commit('setCurrentTime'), 1000);
    },
  },
};
