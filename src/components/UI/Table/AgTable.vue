<template>
  <div class="container mx-auto">
    <div class="-my-2 overflow-x-auto sm:-mx-12 lg:-mx-12">
      <div class="py-2 align-middle inline-block min-w-full sm:px-12 lg:px-12">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <slot name="headers"></slot>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <slot></slot>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AgTable',
};
</script>
