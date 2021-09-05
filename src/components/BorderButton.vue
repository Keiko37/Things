<template>
  <button class="border-button">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'BorderButton',
  props: {
    text: String,
  },
};
</script>

<style lang="scss" scoped>
.border-button {
  padding: 5px 10px;
  font-weight: 500;
  text-transform: uppercase;
  color: rgb(228, 228, 228);
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
}
</style>
