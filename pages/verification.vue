<template>
  <div class="container">
    <Success
      v-if="currentState === 'success'"
      message="Your account has been confirmed."
      :showLink="true"
      :link="{ destination: '/', text: 'Login' }"
    />
    <div v-else class="w-full max-w-sm">
      <form
        @submit.prevent="onSubmit"
        class="bg-white xs:shadow-md rounded px-8 pt-6 pb-8 mb-4"
        action=""
      >
        <Error :errors="errors" />
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
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="confirmation-code"
            >Confirmation Code</label
          >
          <input
            id="confirmation-code"
            v-model="confirmationCode"
            name="confirmation-code"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="******"
          />
        </div>
        <div class="xs:flex xs:items-center xs:justify-between">
          <button
            :disabled="currentState === 'pending'"
            class="w-full xs:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <span v-if="currentState === 'tryAgain'">Try Again</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '@/components/Loader'
import Success from '@/components/Success'
import Error from '@/components/Error'
export default {
  name: 'Verification',
  middleware: ['reset'],
  components: {
    Loader,
    Success,
    Error
  },
  data() {
    return {
      username: '',
      confirmationCode: ''
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
      const validConfirmationCode = this.$validTextInput(
        'Confirmation Code',
        this.$sanitizeData(this.confirmationCode)
      )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validUsername.valid) {
        this.$store.dispatch('messages/setError', validUsername.message)
      }
      if (!validConfirmationCode.valid) {
        this.$store.dispatch('messages/setError', validConfirmationCode.message)
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // construct post data obj
      const postData = {
        username: this.$sanitizeData(this.username),
        confirmationCode: this.$sanitizeData(this.confirmationCode)
      }
      // xhr confirm user
      this.$store.dispatch('auth/userConfirmation', postData)
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

/* .title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
} */

/* .subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
} */

/* .links {
  padding-top: 15px;
} */
</style>
