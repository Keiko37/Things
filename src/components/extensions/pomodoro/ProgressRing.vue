<template>
  <svg :height="radius * 2" :width="radius * 2">
    <circle
      stroke="white"
      :stroke-dasharray="circumference + ' ' + circumference"
      :style="{ strokeDashoffset: strokeDashoffset }"
      :stroke-width="stroke"
      fill="transparent"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
  </svg>
</template>

<script>
export default {
  name: 'ProgressRing',
  props: {
    radius: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
      validator(value) {
        return value <= 100 || value >= 0 ? true : false;
      },
    },
    stroke: {
      type: Number,
      required: true,
    },
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.progress / 100) * this.circumference;
    },
    normalizedRadius() {
      return this.radius - this.stroke * 2;
    },
    circumference() {
      return this.normalizedRadius * 2 * Math.PI;
    },
  },
};
</script>

<style lang="scss" scoped>
circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
