<template>
  <div class="container">
    <div class="w-full max-w-xs">
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
            for="firstName"
            >First Name</label
          >
          <input
            id="firstName"
            name="firstName"
            v-model="firstName"
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
            name="lastName"
            v-model="lastName"
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
            name="emailAddress"
            v-model="emailAddress"
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
            name="password"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="******"
          />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          <div class="flex flex-col text-left">
            <nuxt-link
              class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/"
            >
              Log In
            </nuxt-link>
            <nuxt-link
              class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/"
            >
              Forgot Password?
            </nuxt-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      errors: [],
      emailAddress: '',
      firstName: '',
      lastName: '',
      password: '',
      picture: ''
    }
  },
  methods: {
    onSubmit() {
      // plugin fns
      const validEmail = this.$validEmail('Email Address', this.emailAddress)
      const validFirstName = this.$validTextInput('First Name', this.firstName)
      const validLastName = this.$validTextInput('Last Name', this.lastName)
      const validPassword = this.$validPassword('Password', this.password)
      // clear errors
      this.errors = []
      // validate
      if (!validFirstName.valid) {
        this.errors.push(validFirstName.message)
      }
      if (!validLastName.valid) {
        this.errors.push(validLastName.message)
      }
      if (!validEmail.valid) {
        this.errors.push(validEmail.message)
      }
      if (!validPassword.valid) {
        this.errors.push(validPassword.message)
      }
      // do not make network request if errors
      if (this.errors.length > 0) {
        return
      }
      // set up post data obj
      const postData = {
        emailAddress: this.emailAddress,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        picture: this.picture
      }
      return this.$axios
        .$post('/dev/api/users/create', postData)
        .then((data) => {
          console.log('data', data)
          // vuexContext.commit("method", data);
        })
        .catch((e) => console.error(e))
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
