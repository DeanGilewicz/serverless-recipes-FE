<template>
  <div class="container">
    <div class="w-full max-w-xs">
      <form @submit.prevent="createUser" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">First Name</label>
          <input
            id="firstName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="first name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">Last Name</label>
          <input
            id="lastName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="last name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="email address"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            id="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="******************"
          />
          <!--  border-red-500 -->
          <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
        </div>
        <div class="flex items-center justify-between">
          <div>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >Sign In</button>
          </div>
          <div class="flex flex-col items-center justify-between">
            <a
              class="inline-block align-baseline my-1 font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >Forgot Password?</a>
            <a
              class="inline-block align-baseline my-1 font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >Create Account</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import axios from '~/plugins/axios'
export default {
  components: {},
  methods: {
    // async fetchSomething() {
    //   const res = await this.$axios.post(apiUrl + '/dev/api/users/create', {
    //     firstName: 'Fred',
    //     lastName: 'Flintstone',
    //     emailAddress: 'gilewiczd@gmail.com',
    //     password: 'Password123!'
    //   })
    //   console.log(res)
    //   // this.ip = ip
    // }
    createUser() {
      // return fetch({ store, params }) {
      this.$axios
        .post(process.env.apiUrl + '/dev/api/users/create', {
          firstName: 'Fred',
          lastName: 'Flintstone',
          emailAddress: 'gilewiczd@gmail.com',
          password: 'Password123!'
        })
        .then((res) => {
          console.log('RES', res)
          // store.commit('setStars', res.data)
        })
        .catch((err) => {
          console.error('err', err)
        })
      // }
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
</style>
