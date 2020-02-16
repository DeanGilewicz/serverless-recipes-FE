<template>
  <div class="container">
    <Success
      v-if="currentState === 'success'"
      message="Thanks for signing up. Please check your email to confirm your&nbsp;account."
      :showLink="true"
      :link="{ destination: '/', text: 'Home' }"
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
            for="firstName"
            >First Name</label
          >
          <input
            id="firstName"
            v-model="firstName"
            name="firstName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="First Name"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="lastName"
            >Last Name</label
          >
          <input
            id="lastName"
            v-model="lastName"
            name="lastName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="emailAddress"
            >Email Address</label
          >
          <input
            id="emailAddress"
            v-model="emailAddress"
            name="emailAddress"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Email Address"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            name="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="******"
          />
        </div>
        <div class="xs:flex xs:items-center xs:justify-between">
          <div>
            <button
              :disabled="currentState === 'pending'"
              class="w-full xs:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
            >
              <span v-if="currentState === 'tryAgain'">Try Again</span>
              <span v-else>Sign Up</span>
            </button>
          </div>
          <div class="xs:flex xs:flex-col xs:text-left mt-4 xs:mt-0">
            <nuxt-link
              class="w-full xs:w-auto inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/"
            >
              Log In
            </nuxt-link>
            <nuxt-link
              class="w-full xs:w-auto inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/password-forgot"
            >
              Forgot Password?
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
import Success from '@/components/Success'
import Error from '@/components/Error'
export default {
  name: 'SignUp',
  middleware: ['reset'],
  components: {
    Loader,
    Success,
    Error
  },
  data() {
    return {
      emailAddress: '',
      firstName: '',
      lastName: '',
      password: '',
      picture: ''
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
      const validEmail = this.$validEmail(
        'Email Address',
        this.$sanitizeData(this.emailAddress)
      )
      const validFirstName = this.$validTextInput(
        'First Name',
        this.$sanitizeData(this.firstName)
      )
      const validLastName = this.$validTextInput(
        'Last Name',
        this.$sanitizeData(this.lastName)
      )
      const validPassword = this.$validPassword(
        'Password',
        this.$sanitizeData(this.password)
      )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validFirstName.valid) {
        this.$store.dispatch('messages/setError', validFirstName.message)
      }
      if (!validLastName.valid) {
        this.$store.dispatch('messages/setError', validLastName.message)
      }
      if (!validEmail.valid) {
        this.$store.dispatch('messages/setError', validEmail.message)
      }
      if (!validPassword.valid) {
        this.$store.dispatch('messages/setError', validPassword.message)
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // construct post data obj
      const postData = {
        emailAddress: this.$sanitizeData(this.emailAddress),
        firstName: this.$sanitizeData(this.firstName),
        lastName: this.$sanitizeData(this.lastName),
        password: this.$sanitizeData(this.password),
        picture: this.$sanitizeData(this.picture)
      }
      // xhr sign up
      this.$store.dispatch('auth/signUp', postData)
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
