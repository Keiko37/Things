<template>
  <div
    v-if="!getIsSettings || getClockVisible"
    :style="{ fontSize: getClockSize }"
    class="clock"
  >
    {{ getCurrentTime }}
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Clock',
  computed: {
    ...mapGetters([
      'getCurrentTime',
      'getIsSettings',
      'getClockSize',
      'getClockVisible',
    ]),
  },
  methods: {
    ...mapActions(['activateClock']),
  },
  mounted() {
    this.activateClock();
  },
};
</script>

<style lang="scss" scoped>
.clock {
  color: $text-color;
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>
