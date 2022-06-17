<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Bookmark } from '@/types/BookmarksState'
import { useBookmarksStore } from '@/stores/bookmarks'

const bookmarksStore = useBookmarksStore()
const { moreModalNumber } = storeToRefs(bookmarksStore)
const { setMoreModalNumber, setEditableBookmark, toggleIsBookmarkEditing, removeFromBookmarks } =
  bookmarksStore

const props = defineProps<{ bookmark: Bookmark }>()

function toggleMoreActive() {
  if (moreModalNumber.value === 0 || moreModalNumber.value !== props.bookmark.id) {
    setMoreModalNumber(props.bookmark.id)
    return
  }
  if (moreModalNumber.value !== 0 && moreModalNumber.value === props.bookmark.id) {
    setMoreModalNumber(0)
    return
  }
}

function editBookmark() {
  setMoreModalNumber(0)
  setEditableBookmark(props.bookmark)
  toggleIsBookmarkEditing()
}
</script>

<template>
  <div class="more-actions">
    <span
      @click="toggleMoreActive"
      class="material-icons material-icons-round md-light more__icon icon-btn md-18"
      >more_horiz</span
    >
    <div v-if="bookmark.id === moreModalNumber" class="more__modal">
      <span
        @click="editBookmark"
        class="material-icons material-icons-round md-light more__icon icon-btn md-18"
        >edit</span
      >
      <span
        @click="removeFromBookmarks(bookmark)"
        class="material-icons material-icons-round md-light more__icon icon-btn md-18"
        >delete</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.more-actions {
  visibility: hidden;
  position: relative;
}
.more__modal {
  visibility: visible;
  top: 0;
  left: -40px;
  position: absolute;
}
</style>
