import { createStore } from 'vuex';
import clock from './modules/clock';
import fullscreen from './modules/fullscreen';
import settings from './modules/settings';
import bookmarks from './modules/bookmarks';

import extensions from './modules/extensions/extensions';
import pomodoro from './modules/extensions/pomodoro';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { clock, fullscreen, settings, bookmarks, extensions, pomodoro },
});
