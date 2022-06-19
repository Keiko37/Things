<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Bookmark } from '@/types/BookmarksState'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useClickOutside } from '@/composables/clickOutside'
import AppIcon from '@/components/global/AppIcon.vue'
import EditBookmark from '@/components/bookmarks/EditBookmark.vue'
import BookmarksList from '@/components/bookmarks/BookmarksList.vue'

const bookmarksStore = useBookmarksStore()
const { isBookmarks, isBookmarkEditing } = storeToRefs(bookmarksStore)

const savedBookmarks = localStorage.getItem('bookmarks')

if (savedBookmarks !== null) {
  let parsedBookmarks: Bookmark[] = JSON.parse(savedBookmarks)
  if (Array.isArray(parsedBookmarks) && parsedBookmarks.length > 0) {
    bookmarksStore.setAllBookmarks(parsedBookmarks)
  }
}

const clickOutside = useClickOutside()
const { vClickOutside } = clickOutside

function switchBookmarksWindow() {
  bookmarksStore.toggleIsBookmarks()
  if (isBookmarkEditing.value) {
    bookmarksStore.toggleIsBookmarkEditing(false)
  }
}
</script>

<template>
  <span
    @click.stop="switchBookmarksWindow"
    class="material-icons material-icons-round md-light bookmarks-icon icon-btn"
  >
    <AppIcon name="bookmarks" />
  </span>
  <div v-if="isBookmarks" class="bookmarks" v-click-outside="switchBookmarksWindow">
    <EditBookmark v-if="isBookmarkEditing" key="edit" />
    <BookmarksList v-else key="list" />
  </div>
</template>

<style lang="scss" scoped>
span {
  height: 7%;
}
.bookmarks {
  min-width: 190px;
  max-height: 70%;
  z-index: 10;
  padding: 5px 0 10px 0;
  background-color: var(--bg-color);
  border-radius: 0 5px 5px 5px;
  color: var(--text-color-secondary);
  position: absolute;
  transform: translateX(40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.switch-enter-active,
.switch-leave-active {
  transition: all 0.2s;
}
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
}
.switch-enter-to,
.switch-leave-from {
  opacity: 1;
}
</style>
