<script setup lang="ts">
import type { Bookmark } from '@/types/BookmarksState'
import BookmarkActions from '@/components/bookmarks/BookmarkActions.vue'

defineProps<{ bookmark: Bookmark }>()
</script>

<template>
  <li class="bookmark">
    <a :href="bookmark.link" class="bookmark__link">
      <img
        :src="bookmark.icon"
        class="bookmark__icon"
        :alt="bookmark.name + 'icon'"
        height="16"
        width="16"
      />
      <span class="bookmark__title">{{ bookmark.name }}</span>
    </a>
    <BookmarkActions :bookmark="bookmark" />
  </li>
</template>

<style lang="scss" scoped>
.bookmark {
  display: flex;
  align-items: center;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:hover .more-actions {
    visibility: visible;
  }
  &__link {
    padding: 7px 30px 7px 12px;
    width: 100%;
    display: block;
    display: flex;
    align-items: center;
  }
  &__icon {
    margin-right: 7px;
  }
  &__title {
    font-size: 16px;
    color: var(--text-color);
    opacity: 0.7;
    font-weight: 500;
  }
}
</style>
