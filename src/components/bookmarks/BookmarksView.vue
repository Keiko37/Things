<script setup lang="ts">
import type { Bookmark } from '@/types/BookmarksState'
import { useBookmarksStore } from '@/stores/bookmarks'
import EditBookmark from '@/components/bookmarks/EditBookmark.vue'
import BookmarksList from '@/components/bookmarks/BookmarksList.vue'

const bookmarksStore = useBookmarksStore()

const savedBookmarks = localStorage.getItem('bookmarks')

if (savedBookmarks !== null) {
  let parsedBookmarks: Bookmark[] = JSON.parse(savedBookmarks)
  if (parsedBookmarks) {
    bookmarksStore.setAllBookmarks(parsedBookmarks)
  }
}

function switchBookmarksWindow() {
  bookmarksStore.toggleIsBookmarks()
}
</script>

<template>
  <span
    @click.stop="switchBookmarksWindow"
    class="material-icons material-icons-round md-light bookmarks-icon icon-btn"
    >bookmarks</span
  >
  <div v-if="bookmarksStore.bookmarksState.isBookmarks" class="bookmarks">
    <EditBookmark v-if="bookmarksStore.bookmarksState.isBookmarkEditing" key="edit" />
    <BookmarksList v-else key="list" />
  </div>
</template>

<style lang="scss" scoped>
span {
  height: 7%;
}
.bookmarks {
  min-width: 180px;
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
