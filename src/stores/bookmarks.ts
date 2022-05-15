import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import type { BookmarksState, Bookmark } from '@/types/BookmarksState'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarksState: BookmarksState = reactive({
    isBookmarks: false,
    isBookmarkEditing: false,
    bookmarks: [],
    moreModalNumber: 0,
    editableBookmark: null,
  })

  const toggleIsBookmarks = (value: boolean) => {
    if (typeof value === 'undefined') {
      bookmarksState.isBookmarks = !bookmarksState.isBookmarks
    } else {
      bookmarksState.isBookmarks = value
    }
  }
  const toggleBookmarkEditing = () => (bookmarksState.isBookmarkEditing = !bookmarksState.isBookmarkEditing)

  const setAllBoolmarks = (newValue: []) => {
    bookmarksState.bookmarks = newValue
  }
  const addToBoookmarks = (bookmark: Bookmark) => {
    bookmarksState.bookmarks.push(bookmark)
  }
  const removeFromBookmarks = (bookmark: Bookmark) => {
    bookmarksState.bookmarks.splice(bookmarksState.bookmarks.indexOf(bookmark), 1)
  }

  const setMoreModalNumber = (bookmarkId: number) => {
    bookmarksState.moreModalNumber = bookmarkId
  }
  const setEditableBookmark = (bookmark: Bookmark) => {
    bookmarksState.editableBookmark = bookmark
  }

  const updateBookmark = (oldBookmark: Bookmark, newBookmark: Bookmark) => {
    const oldBookmarkIndex = bookmarksState.bookmarks.indexOf(oldBookmark)
    bookmarksState.bookmarks[oldBookmarkIndex] = newBookmark
  }

  // TODO: see what it is
  // toggleBookmarks(context, bool) {
  //   if (context.state.isBookmarks) {
  //     context.commit('setMoreModalNumber', 0);
  //   }
  //   if (context.state.isBookmarks && context.state.bookmarkEditing) {
  //     context.commit('toggleBookmarkEditing');
  //   }
  //   context.commit('setIsBookmarks', bool);
  // },
  watch(
    () => bookmarksState.bookmarks,
    () => localStorage.setItem('bookmarks', JSON.stringify(bookmarksState.bookmarks)),
    { flush: 'post' }
  )
  return {
    bookmarksState,
    toggleIsBookmarks,
    toggleBookmarkEditing,
    setAllBoolmarks,
    addToBoookmarks,
    removeFromBookmarks,
    setMoreModalNumber,
    setEditableBookmark,
    updateBookmark,
  }
})
