<template>
  <div class="container mx-auto">
    <div class="flex justify-center">
      <div
        v-show="isOpen"
        class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      >
        <div class="max-w-2xl p-6 mx-4 bg-white rounded-md shadow-xl">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
