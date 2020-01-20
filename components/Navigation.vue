<template>
  <div class="w-full">
    <div class="max-w-lg">
      <div>
        <div v-if="this.$store.state.auth.user">
          <span
            >Logged in as: {{ this.$store.state.auth.user.emailAddress }}</span
          >
        </div>
        <nuxt-link
          to="/my-account"
          class="inline-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          My Account
        </nuxt-link>
        <nuxt-link
          to="/recipes"
          class="inline-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          My Recipes
        </nuxt-link>
        <form
          @submit.prevent="onLogOut"
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          action=""
        >
          <input
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Log Out"
            type="submit"
          />
          <span v-if="errorMsg">{{ errorMsg }}</span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navigation',
  data() {
    return {
      errorMsg: ''
    }
  },
  methods: {
    onLogOut() {
      // clear component error
      this.errorMsg = ''
      // check if local user
      if (!this.$doesUserExist()) {
        // no local user so clear vuex user
        this.$store.dispatch('auth/deleteUser')
        // redirect
        return this.$router.push('/')
      }
      // xhr logout
      this.$store
        .dispatch('auth/logout')
        .then((res) => {
          // clear user
          this.$removeAuthUser()
          // redirect
          this.$router.push('/')
        })
        .catch((e) => {
          // console.error(e)
          this.errorMsg = 'Log out failed. Something went wrong'
        })
    }
  }
}
</script>

<style></style>
