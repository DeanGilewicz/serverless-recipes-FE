<template>
  <div class="page-my-account">
    <div class="py-4 text-center">
      <h1 class="text-3xl">MY ACCOUNT</h1>
    </div>
    <nav class="py-4 text-center">
      <nuxt-link
        to="/my-account/edit"
        class="inline-block bg-green-500 hover:bg-green-700 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Edit Account
      </nuxt-link>
      <nuxt-link
        to="/my-account/change-password"
        class="inline-block bg-green-500 hover:bg-green-700 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Change Password
      </nuxt-link>
    </nav>
    <div v-if="user" class="w-full max-w-md my-0 mx-auto">
      <div class="my-2 py-4 px-4">
        <p class="block text-gray-700 text-sm font-bold mb-2">Name</p>
        <span>{{ user.firstName }}</span> <span>{{ user.lastName }}</span>
      </div>
      <div class="my-2 py-4 px-4">
        <p class="block text-gray-700 text-sm font-bold mb-2">Email Address</p>
        <span>{{ user.emailAddress }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyAccount',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: {},
  data() {
    return {}
  },
  computed: mapGetters('auth', ['user'])
}
</script>

<style></style>
