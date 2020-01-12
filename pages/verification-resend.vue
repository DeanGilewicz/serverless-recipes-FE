<template>
  <div class="container">
    <div v-if="currentState === 'success'" class="w-full max-w-xs text-left p-8">
      <p>Please check your email for your confirmation code.</p>
      <nuxt-link to="/verification">Confirmation</nuxt-link>
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
          <button
            :disabled="currentState === 'pending'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <span v-if="currentState === 'tryAgain'">Try Again</span>
            <span v-else>Resend</span>
          </button>
        </div>
      </form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />
  </div>
</template>

<script>
import Loader from '@/components/Loader'
export default {
  middleware: ['reset'],
  components: {
    Loader
  },
  data() {
    return {
      username: ''
    }
  },
  // computed: mapGetters('state-machine', ['currentState']),
  computed: {
    currentState() {
      return this.$store.getters['state-machine/currentState']
    },
    errors() {
      return this.$store.getters['messages/errors']
    }
  },
  // created() {
  //   // clear any errors if returning back to this template
  //   if (this.$store.getters['messages/errors'].length > 0) {
  //     this.$store.dispatch('messages/clearErrors')
  //   }
  //   // reset state machine
  //   this.$store.dispatch('state-machine/setInitialState')
  // },
  methods: {
    onSubmit() {
      // plugin fns
      const validUsername = this.$validTextInput('Username', this.username)
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
      // set up post data obj
      const postData = {
        username: this.username
      }
      return this.$axios
        .$post('/dev/api/users/resendConfirmation', postData)
        .then((data) => {
          // console.log('data', data)
          // trigger loading state
          this.$store.dispatch('state-machine/updatePendingState', 'success')
        })
        .catch((e) => {
          // console.log(e)
          // trigger loading state
          this.$store.dispatch('state-machine/updateFailureState')
          // user not found
          this.$store.dispatch('messages/setError', 'Username not found')
          /* eslint-disable unicorn/prefer-includes */
          // if (e.indexOf('Username/client id combination not found') > -1) {
          //   this.errors.push('Username and password combination not found')
          // }
        })
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
