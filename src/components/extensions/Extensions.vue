<template>
  <span
    @click="toggleExtensions"
    class="material-icons-round material-icons md-light icon-btn"
    >extension</span
  >
  <div class="extensions">
    <Extension
      v-for="(extension, idx) in getExtensionsIcons"
      :key="extension.id"
      :extension="extension"
      :orderIdx="idx"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Extension from '@/components/extensions/Extension';

export default {
  name: 'Extensions',
  components: {
    Extension,
  },
  computed: {
    ...mapGetters(['getExtensionsIcons']),
  },
  methods: {
    ...mapActions(['toggleExtensions']),
  },
};
</script>

<style lang="scss" scoped>
.extensions {
  display: flex;
  max-width: 40%;
  user-select: none;
  color: $text-color-secondary;
  position: absolute;
  left: 60px;
}
</style>
