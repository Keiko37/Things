<script setup lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks'
import Bookmark from '@/components/bookmarks/BookmarkItem.vue'

const bookmarksStore = useBookmarksStore()
</script>

<template>
  <div
    v-if="bookmarksStore.bookmarksState.bookmarks.length > 0"
    @click="bookmarksStore.toggleBookmarkEditing()"
    class="add-bookmark"
  >
    <span
      class="material-icons material-icons-round md-light md-24 bookmarks-icon icon-btn add-bookmark__icon"
      >add</span
    >
  </div>
  <p
    v-if="bookmarksStore.bookmarksState.bookmarks.length <= 0"
    @click="bookmarksStore.toggleBookmarkEditing()"
    class="no-bookmarks"
  >
    Add first bookmark
  </p>
  <ul class="bookmarks__list scroll-ui">
    <Bookmark
      v-for="bookmark in bookmarksStore.bookmarksState.bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
    />
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
