<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Bookmark } from '@/types/BookmarksState'
import { useBookmarksStore } from '@/stores/bookmarks'
import AppIcon from '@/components/global/AppIcon.vue'

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
  <div class="actions">
    <div @click="toggleMoreActive" class="icon-btn">
      <AppIcon name="more_horiz" />
    </div>
    <div v-if="bookmark.id === moreModalNumber" class="more__modal">
      <div @click="editBookmark" class="icon-btn">
        <AppIcon name="edit" :size="18" />
      </div>
      <div @click="removeFromBookmarks(bookmark)" class="icon-btn">
        <AppIcon name="delete" :size="18" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.actions {
  margin-right: 5px;
  visibility: hidden;
  position: relative;
  display: flex;
  align-items: center;
}
.more__modal {
  visibility: visible;
  position: absolute;
  right: 25px;
  min-width: 40px;
  display: flex;
  justify-content: space-between;
}
</style>
