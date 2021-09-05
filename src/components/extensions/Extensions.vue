<template>
  <span
    @click="toggleExtensions"
    class="material-icons-round material-icons md-light icon-btn"
    >extension</span
  >
  <div v-if="getIsExtensions" class="extensions">
    <Extension
      v-for="extension in getExtensionsIcons"
      :key="extension.id"
      :extension="extension"
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
    ...mapGetters(['getIsExtensions', 'getExtensionsIcons']),
  },
  methods: {
    ...mapActions(['toggleExtensions']),
  },
};
</script>

<style lang="scss" scoped>
.extensions {
  user-select: none;
  color: $text-color-secondary;
  position: absolute;
  left: 60px;
}
</style>
