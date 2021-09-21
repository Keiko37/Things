<template>
  <div class="bookmarks__edit">
    <div @click="backToList" class="bookmarks__back">
      <span
        class="
          material-icons material-icons-round
          md-light md-24
          bookmarks-icon
          icon-btn
          add-bookmark__icon
        "
        >arrow_back</span
      >
    </div>
    <form class="form">
      <div class="input-group">
        <input
          :class="{ invalid: this.nameInvalid }"
          v-model.trim="name"
          id="name"
          type="text"
        />
        <label for="name">name</label>
      </div>

      <div class="input-group">
        <input
          :class="{ invalid: this.linkInvalid }"
          v-model.trim="link"
          id="link"
          type="text"
        />
        <label for="link">link</label>
      </div>

      <BorderButton
        @click.enter.prevent="addBookmark"
        class="submit-button"
        :text="getEditableBookmark ? 'edit link' : 'add link'"
      />
    </form>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import BorderButton from '@/components/BorderButton.vue';

export default {
  name: 'EditBookmark',
  components: { BorderButton },
  data() {
    return {
      name: '',
      nameInvalid: false,
      link: '',
      linkInvalid: false,
    };
  },
  computed: {
    ...mapGetters(['getEditableBookmark']),
  },
  methods: {
    ...mapMutations(['toggleBookmarkEditing', 'setEditableBookmark']),
    ...mapActions(['editBookmark', 'addNewBookmark']),
    backToList() {
      this.toggleBookmarkEditing();
      this.setEditableBookmark(null);
    },
    addBookmark() {
      this.nameInvalid = this.name.length <= 0;
      this.linkInvalid = this.link.length <= 0;

      if (this.nameInvalid || this.linkInvalid) {
        setTimeout(() => {
          this.nameInvalid = false;
          this.linkInvalid = false;
        }, 500);
        return;
      }
      let protocol = this.link.match(/^([a-zA-Z]+):\/\//);
      let bookmarkIcon = this.buildIconUrl(this.link);
      const newBookmark = {
        id: this.getEditableBookmark ? this.getEditableBookmark.id : Date.now(),
        title: this.name,
        icon: bookmarkIcon,
        url: protocol ? this.link : `http://${this.link}`,
      };
      if (this.getEditableBookmark) {
        this.editBookmark({
          old: this.getEditableBookmark,
          new: newBookmark,
        });
        this.toggleBookmarkEditing();
        return;
      }
      this.addNewBookmark(newBookmark);
      this.toggleBookmarkEditing();
    },
    buildIconUrl(url) {
      const protocol = url.match(/^([a-zA-Z]+):\/\//);
      if (
        protocol &&
        (protocol[0] === 'https://' || protocol[0] === 'http://')
      ) {
        const cleanUrl = url.match(/https?:\/\/(?:www\.|)([\w.-]+).*/gm);
        const resultLink = `https://api.statvoo.com/favicon/?url=${cleanUrl}`;
        return resultLink;
      }
      if (protocol === null) {
        const resultLink = `https://api.statvoo.com/favicon/?url=http://${url}`;
        return resultLink;
      }
      if (protocol && protocol[0] === 'ftp://') {
        const cleanUrl = url.match(/(?<=@)[^/]+/);
        const resultLink = `https://api.statvoo.com/favicon/?url=http://${cleanUrl}`;
        return resultLink;
      }
      return url;
    },
  },
  mounted() {
    if (this.getEditableBookmark) {
      this.name = this.getEditableBookmark.title;
      this.link = this.getEditableBookmark.url;
    }
  },
};
</script>

<style lang="scss" scoped>
.bookmarks__edit {
  padding: 0 5px 10px 5px;
}
.bookmarks__back {
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
.form {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 0 10px;
  & input {
    background-color: transparent;
    border-bottom: 1px solid $border-color;
    outline: none;
    color: $text-color;
    caret-color: $border-color;
    margin-bottom: 15px;
    transition: all 0.4s;
    order: 2;
    &:focus {
      border-color: $border-color-active;
    }
    &:focus ~ label {
      color: #fff;
    }
  }
  & label {
    transition: all 0.4s;
    text-transform: uppercase;
    &:focus {
      font-size: 20px;
    }
  }
}
.input-group {
  display: flex;
  flex-direction: column;
}
.invalid {
  border-color: brown !important;
}
</style>
