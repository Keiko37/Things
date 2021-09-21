<template>
  <span
    @click.stop="toggleBookmarks"
    class="material-icons material-icons-round md-light bookmarks-icon icon-btn"
    >bookmarks</span
  >
  <div v-if="getIsBookmarks" class="bookmarks">
    <EditBookmark v-if="getIsBookmarkEditing" key="edit" />
    <BookmarksList v-else key="list" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import EditBookmark from '@/components/bookmarks/EditBookmark';
import BookmarksList from '@/components/bookmarks/BookmarksList';

export default {
  name: 'Bookmarks',
  components: { EditBookmark, BookmarksList },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getIsBookmarks', 'getIsBookmarkEditing']),
  },
  methods: {
    ...mapMutations(['setBookmarks']),
    ...mapActions(['toggleBookmarks']),
  },
  mounted() {
    const storageBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (storageBookmarks) {
      this.setBookmarks(storageBookmarks);
    }
  },
};
</script>

<style lang="scss" scoped>
span {
  height: 7%;
}
.bookmarks {
  min-width: 180px;
  max-height: 70%;
  z-index: 10;
  padding: 5px 0 10px 0;
  background-color: $bg-color;
  border-radius: 0 5px 5px 5px;
  color: $text-color-secondary;
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
