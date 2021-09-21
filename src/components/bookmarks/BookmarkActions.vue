<template>
  <div class="more-actions">
    <span
      @click="toggleMoreActive"
      class="
        material-icons material-icons-round
        md-light
        more__icon
        icon-btn
        md-18
      "
      >more_horiz</span
    >
    <div v-if="bookmark.id === getMoreModalNumber" class="more__modal">
      <span
        @click="editBookmark"
        class="
          material-icons material-icons-round
          md-light
          more__icon
          icon-btn
          md-18
        "
        >edit</span
      >
      <span
        @click="deleteBookmark"
        class="
          material-icons material-icons-round
          md-light
          more__icon
          icon-btn
          md-18
        "
        >delete</span
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'BookmarkActions',
  props: {
    bookmark: Object,
  },
  computed: {
    ...mapGetters(['getMoreModalNumber']),
  },
  methods: {
    ...mapMutations([
      'setMoreModalNumber',
      'toggleBookmarkEditing',
      'setEditableBookmark',
      'removeFromBookmarks',
    ]),
    ...mapActions(['removeBookmark']),
    toggleMoreActive() {
      if (
        this.getMoreModalNumber === 0 ||
        this.getMoreModalNumber !== this.bookmark.id
      ) {
        this.setMoreModalNumber(this.bookmark.id);
        return;
      }
      if (
        this.getMoreModalNumber !== 0 &&
        this.getMoreModalNumber === this.bookmark.id
      ) {
        this.setMoreModalNumber(0);
        return;
      }
    },
    editBookmark() {
      this.setMoreModalNumber(0);
      this.setEditableBookmark(this.bookmark);
      this.toggleBookmarkEditing();
    },
    deleteBookmark() {
      this.removeBookmark(this.bookmark);
    },
  },
};
</script>

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
