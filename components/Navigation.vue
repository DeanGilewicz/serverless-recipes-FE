<template>
  <div class="py-4 px-4 bg-gray-700 text-white">
    <nav
      class="xs:flex xs:justify-between xs:items-start max-w-5xl my-0 mx-auto"
    >
      <div class="mb-2">
        <nuxt-link to="/my-account" class="">
          My Account
        </nuxt-link>
      </div>
      <div class="mb-2">
        <nuxt-link to="/recipes" class="">
          My Recipes
        </nuxt-link>
      </div>
      <div v-if="this.$store.state.auth.user" class="hidden sm:block mb-2">
        <span>Hello, {{ this.$store.state.auth.user.emailAddress }}</span>
      </div>
      <form @submit.prevent="onLogOut" class="" action="">
        <input class="bg-transparent" value="Log Out" type="submit" />
        <span v-if="errorMsg">{{ errorMsg }}</span>
      </form>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
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
