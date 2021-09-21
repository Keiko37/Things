export default {
  state: () => ({
    isBookmarks: false,
    bookmarkEditing: false,
    bookmarks: [],
    moreModalNumber: 0,
    editableBookmark: null,
  }),
  getters: {
    getIsBookmarks(state) {
      return state.isBookmarks;
    },
    getIsBookmarkEditing(state) {
      return state.bookmarkEditing;
    },
    getBookmarks(state) {
      return state.bookmarks;
    },
    getMoreModalNumber(state) {
      return state.moreModalNumber;
    },
    getEditableBookmark(state) {
      return state.editableBookmark;
    },
  },
  mutations: {
    setIsBookmarks(state, bool) {
      if (bool === false || bool === true) {
        state.isBookmarks = bool;
      } else {
        state.isBookmarks = !state.isBookmarks;
      }
    },
    setBookmarks(state, bookmarksArray) {
      state.bookmarks = bookmarksArray;
    },
    toggleBookmarkEditing(state) {
      state.bookmarkEditing = !state.bookmarkEditing;
    },
    addToBookmarks(state, bookmark) {
      state.bookmarks.push(bookmark);
    },
    removeFromBookmarks(state, bookmark) {
      const targetIndex = state.bookmarks.indexOf(bookmark);
      state.bookmarks.splice(targetIndex, 1);
    },
    setMoreModalNumber(state, bookmarkId) {
      state.moreModalNumber = bookmarkId;
    },
    setEditableBookmark(state, bookmark) {
      state.editableBookmark = bookmark;
    },
    changeBookmark(state, bookmark) {
      const indexOldBookmark = state.bookmarks.indexOf(bookmark.old);
      state.bookmarks[indexOldBookmark] = bookmark.new;
    },
  },
  actions: {
    toggleBookmarks(context, bool) {
      if (context.state.isBookmarks) {
        context.commit('setMoreModalNumber', 0);
      }
      if (context.state.isBookmarks && context.state.bookmarkEditing) {
        context.commit('toggleBookmarkEditing');
      }
      context.commit('setIsBookmarks', bool);
    },
    addNewBookmark(context, bookmark) {
      context.commit('addToBookmarks', bookmark);
      localStorage.setItem(
        'bookmarks',
        JSON.stringify(context.state.bookmarks)
      );
    },
    editBookmark(context, bookmark) {
      context.commit('changeBookmark', bookmark);
      context.commit('setEditableBookmark', null);
      localStorage.setItem(
        'bookmarks',
        JSON.stringify(context.state.bookmarks)
      );
    },
    removeBookmark(context, bookmark) {
      context.commit('removeFromBookmarks', bookmark);
      localStorage.setItem(
        'bookmarks',
        JSON.stringify(context.state.bookmarks)
      );
    },
  },
};
