import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Bookmark } from '@/types/BookmarksState'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const isBookmarks = ref<boolean>(false)
  const toggleIsBookmarks = (value?: boolean) => {
    if (typeof value === 'undefined') {
      isBookmarks.value = !isBookmarks.value
    } else {
      isBookmarks.value = value
    }
  }

  const isBookmarkEditing = ref<boolean>(false)
  const toggleIsBookmarkEditing = (value?: boolean) => {
    if (typeof value === 'undefined') {
      isBookmarkEditing.value = !isBookmarkEditing.value
    } else {
      isBookmarkEditing.value = value
    }
  }

  const bookmarks = ref<Bookmark[]>([])
  const setAllBookmarks = (newValue: Bookmark[]) => {
    bookmarks.value = newValue
  }
  const addToBookmarks = (bookmark: Bookmark) => {
    bookmarks.value.push(bookmark)
  }
  const removeFromBookmarks = (bookmark: Bookmark) => {
    bookmarks.value.splice(bookmarks.value.indexOf(bookmark), 1)
  }
  const updateBookmark = (oldBookmark: Bookmark, newBookmark: Bookmark) => {
    const oldBookmarkIndex = bookmarks.value.indexOf(oldBookmark)
    bookmarks.value[oldBookmarkIndex] = newBookmark
  }

  const moreModalNumber = ref<number>(0)
  const editableBookmark = ref<Bookmark | null>(null)
  const toggleBookmarks = (bool: boolean) => {
    if (isBookmarks.value) {
      setMoreModalNumber(0)
    }
    if (isBookmarks.value && isBookmarkEditing.value) {
      toggleIsBookmarkEditing()
    }
    toggleIsBookmarks(bool)
  }
  const setMoreModalNumber = (bookmarkId: number) => {
    moreModalNumber.value = bookmarkId
  }
  const setEditableBookmark = (bookmark: Bookmark | null) => {
    editableBookmark.value = bookmark
  }

  watch(bookmarks, () => localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value)), {
    flush: 'post',
    deep: true,
  })
  return {
    isBookmarks,
    toggleIsBookmarks,
    isBookmarkEditing,
    toggleIsBookmarkEditing,
    bookmarks,
    setAllBookmarks,
    addToBookmarks,
    removeFromBookmarks,
    updateBookmark,
    moreModalNumber,
    editableBookmark,
    toggleBookmarks,
    setMoreModalNumber,
    setEditableBookmark,
  }
})
