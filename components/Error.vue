<template>
  <div
    v-if="errors && errors.length > 0"
    class="mb-8 text-left bg-red-600 shadow border rounded py-2 px-4"
  >
    <p class="text-lg">{{ title }}</p>
    <ul>
      <li v-for="(error, index) in errors" :key="index" class="ml-5 list-disc">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Oh no, there are errors:'
    },
    errors: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>
