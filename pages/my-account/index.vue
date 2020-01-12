<template>
  <div class="">
    <div class="">
			<h1>My Account</h1>
      <div v-if="user" class="container-user">
        <div class="user-name">
          <p>Name</p>
          <span>{{user.firstName}}</span> <span>{{user.lastName}}</span>
        </div>
        <div class="user-email-address">
          <p>Email Address</p>
          <span>{{user.emailAddress}}</span>
        </div>
        <div class="flex items-center justify-between">
          <nuxt-link
            to="/my-account/edit"
            class="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Account
          </nuxt-link>
          <nuxt-link
            to="/my-account/change-password"
            class="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Change Password
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
