<script setup lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks'
import BookmarkItem from '@/components/bookmarks/BookmarkItem.vue'
import { storeToRefs } from 'pinia'

const bookmarksStore = useBookmarksStore()
const { bookmarks } = storeToRefs(bookmarksStore)
const { toggleIsBookmarkEditing } = bookmarksStore
</script>

<template>
  <div v-if="bookmarks.length > 0" @click="toggleIsBookmarkEditing()" class="add-bookmark">
    <span
      class="material-icons material-icons-round md-light md-24 bookmarks-icon icon-btn add-bookmark__icon"
      >add</span
    >
  </div>
  <p v-if="bookmarks.length <= 0" @click="toggleIsBookmarkEditing()" class="no-bookmarks">
    Add first bookmark
  </p>
  <ul class="bookmarks__list scroll-ui">
    <BookmarkItem v-for="bookmark in bookmarks" :key="bookmark.id" :bookmark="bookmark" />
  </ul>
</template>

<style lang="scss" scoped>
.add-bookmark {
  width: 100%;
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &__icon {
    align-self: flex-end;
  }
  &:hover > &__icon {
    opacity: 0.8;
  }
}
.no-bookmarks {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.6;
  text-align: center;
  cursor: pointer;
  padding: 8px 0 8px 0;
  &:hover {
    opacity: 1;
  }
}
</style>
