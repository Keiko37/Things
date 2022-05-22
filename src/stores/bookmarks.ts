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

  const toggleIsBookmarks = (value?: boolean) => {
    if (typeof value === 'undefined') {
      bookmarksState.isBookmarks = !bookmarksState.isBookmarks
    } else {
      bookmarksState.isBookmarks = value
    }
  }
  const toggleBookmarkEditing = () =>
    (bookmarksState.isBookmarkEditing = !bookmarksState.isBookmarkEditing)

  const setAllBookmarks = (newValue: Bookmark[]) => {
    bookmarksState.bookmarks = newValue
  }
  const addToBookmarks = (bookmark: Bookmark) => {
    bookmarksState.bookmarks.push(bookmark)
  }
  const removeFromBookmarks = (bookmark: Bookmark) => {
    bookmarksState.bookmarks.splice(bookmarksState.bookmarks.indexOf(bookmark), 1)
  }

  const setMoreModalNumber = (bookmarkId: number) => {
    bookmarksState.moreModalNumber = bookmarkId
  }
  const setEditableBookmark = (bookmark: Bookmark | null) => {
    bookmarksState.editableBookmark = bookmark
  }

  const updateBookmark = (oldBookmark: Bookmark, newBookmark: Bookmark) => {
    const oldBookmarkIndex = bookmarksState.bookmarks.indexOf(oldBookmark)
    bookmarksState.bookmarks[oldBookmarkIndex] = newBookmark
  }
  const toggleBookmarks = (bool: boolean) => {
    if (bookmarksState.isBookmarks) {
      setMoreModalNumber(0)
    }
    if (bookmarksState.isBookmarks && bookmarksState.isBookmarkEditing) {
      toggleBookmarkEditing()
    }
    toggleIsBookmarks(bool)
  }

  watch(
    () => bookmarksState.bookmarks,
    () => localStorage.setItem('bookmarks', JSON.stringify(bookmarksState.bookmarks)),
    { flush: 'post' }
  )
  return {
    bookmarksState,
    toggleIsBookmarks,
    toggleBookmarkEditing,
    setAllBookmarks,
    addToBookmarks,
    removeFromBookmarks,
    setMoreModalNumber,
    setEditableBookmark,
    updateBookmark,
    toggleBookmarks,
  }
})
