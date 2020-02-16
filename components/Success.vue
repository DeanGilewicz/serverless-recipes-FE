<template>
  <div
    class="w-full max-w-sm text-left p-8 bg-green-500 shadow border rounded py-2 px-4"
  >
    <p v-html="message"></p>
    <div v-if="showLink" class="mt-4 mb-2">
      <nuxt-link
        :to="link.destination"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {{ link.text }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    showLink: {
      type: Boolean,
      default: false
    },
    link: {
      type: Object,
      required: false
    }
  }
}
</script>

<style></style>
