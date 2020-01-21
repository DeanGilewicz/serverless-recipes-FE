<template>
  <div class="container">
    <div
      v-if="currentState === 'success'"
      class="w-full max-w-xs text-left p-8"
    >
      <span>Your password has been reset.<br />Please check your email.</span>
    </div>
    <div v-else class="w-full max-w-xs">
      <form
        @submit.prevent="onSubmit"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        action=""
      >
        <div v-if="errors.length > 0" class="mb-8 text-left">
          <p>Oh no, we have some errors:</p>
          <ul>
            <li v-for="(error, index) in errors" :key="index" class="list-disc">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
            >Username</label
          >
          <input
            id="username"
            v-model="username"
            name="username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
          />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <button
              :disabled="currentState === 'pending'"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <span v-if="currentState === 'tryAgain'">Try Again</span>
              <span v-else>Reset Password</span>
            </button>
          </div>
          <div class="flex flex-col text-left">
            <nuxt-link
              class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/sign-up"
            >
              Create Account
            </nuxt-link>
            <nuxt-link
              class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/"
            >
              Log In
            </nuxt-link>
          </div>
        </div>
      </form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '@/components/Loader'
export default {
  name: 'ForgotPassword',
  middleware: ['reset'],
  components: {
    Loader
  },
  data() {
    return {
      username: ''
    }
  },
  computed: {
    ...mapGetters({
      currentState: 'state-machine/currentState',
      errors: 'messages/errors'
    })
  },
  methods: {
    onSubmit() {
      // plugin fns
      const validUsername = this.$validTextInput(
        'Username',
        this.$sanitizeData(this.username)
      )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validUsername.valid) {
        this.$store.dispatch('messages/setError', validUsername.message)
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // construct post data obj
      const postData = {
        username: this.$sanitizeData(this.username)
      }
      // xhr forgot password
      this.$store.dispatch('auth/forgotPassword', postData)
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
