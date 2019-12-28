<template>
	<div class="w-full ">
    <div class="max-w-lg">
      <div>
				<div v-if="this.$store.state.auth.user">
					<span>Logged in as: {{this.$store.state.auth.user.emailAddress}}</span>
				</div>
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
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onLogOut() {
      if (!this.$doesUserExist()) {
        // clear vuex user
        this.$store.dispatch('deleteUser')
        // redirect
        return this.$router.push('/')
      }
      // log user out
      return this.$axios
        .$post(
          '/dev/api/users/logOut',
          {},
          {
            headers: {
              Authorization: this.$getAuthUserToken('accessToken')
            }
          }
        )
        .then((data) => {
          // clear vuex user
          this.$store.dispatch('auth/deleteUser')
          // clear storage user
          this.$removeAuthUser()
          // redirect
          this.$router.push('/')
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }
}
</script>

<style>
</style>