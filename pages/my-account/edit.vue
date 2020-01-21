<template>
  <div class="">
    <div class="">
      <h1>My Account</h1>
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
        <div v-if="user" class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="firstName"
            >First Name</label
          >
          <input
            id="firstName"
            :value="user.firstName"
            @input="updateLocalUser($event)"
            name="firstName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="first name"
          />
        </div>
        <div v-if="user" class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="lastName"
            >Last Name</label
          >
          <input
            id="lastName"
            :value="user.lastName"
            @input="updateLocalUser($event)"
            name="lastName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="last name"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            @click="onCancelUpdate"
            class="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Cancel
          </button>
          <button
            @click="showModal = true"
            class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Delete User
          </button>
          <button
            :disabled="currentState === 'pending'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update User
          </button>
        </div>
      </form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />

    <Modal v-if="showModal" @close="showModal = false">
      <h3
        slot="header"
        v-if="currentState === 'failure' || currentState === 'tryAgain'"
      >
        Oh no something went wrong
      </h3>
      <p
        slot="body"
        v-if="currentState === 'failure' || currentState === 'tryAgain'"
      >
        We were unable to update {{ user.firstName }} {{ user.lastName }}
      </p>
      <div
        slot="footer"
        v-if="currentState === 'failure' || currentState === 'tryAgain'"
      >
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
      <h3 slot="header" v-if="currentState === 'success'">Success</h3>
      <p slot="body" v-if="currentState === 'success'">
        Your account has been updated
      </p>
      <div slot="footer" v-if="currentState === 'success'">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ok
        </button>
      </div>
      <h3
        slot="header"
        v-if="currentState !== 'failure' && currentState !== 'success'"
      >
        Delete {{ user.firstName }} {{ user.lastName }}
      </h3>
      <p
        slot="body"
        v-if="currentState !== 'failure' && currentState !== 'success'"
      >
        Are you sure you want to delete this user?
      </p>
      <div
        slot="footer"
        v-if="currentState !== 'failure' && currentState !== 'success'"
      >
        <button
          @click="showModal = false"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          @click="onDeleteUser"
          class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
export default {
  name: 'EditAccount',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      // user: null // deep clone of recipe
      showModal: false
    }
  },
  computed: {
    currentState() {
      return this.$store.getters['state-machine/currentState']
    },
    errors() {
      return this.$store.getters['messages/errors']
    },
    user: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters['auth/user']))
      },
      set(user) {
        this.$store.dispatch('auth/setUser', user)
      }
    }
  },
  methods: {
    updateLocalUser(e) {
      this.$set(this.user, e.target.name, this.$sanitizeData(e.target.value))
    },
    onCancelUpdate() {
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // reset user
      this.user = JSON.parse(JSON.stringify(this.$store.getters['auth/user']))
    },
    onCloseModal() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
    },
    onSubmit() {
      // plugin fns
      const validFirstName = this.$validTextInput(
        'firstName',
        this.$sanitizeData(this.user.firstName)
      )
      const validLastName = this.$validTextInput(
        'lastName',
        this.$sanitizeData(this.user.lastName)
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
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // construct post data obj
      const postData = {
        accessToken: this.$getAuthUserToken('accessToken'),
        userAttributes: [
          {
            Name: 'name',
            Value: this.$sanitizeData(this.user.firstName)
          },
          {
            Name: 'family_name',
            Value: this.$sanitizeData(this.user.lastName)
          }
          // {
          // 	Name: "picture",
          // 	Value: ""
          // }
        ]
      }
      // xhr update user
      this.$store.dispatch('auth/updateUser', postData).then((res) => {
        // show modal
        this.showModal = true
      })
    },
    onDeleteUser() {
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // xhr delete user
      this.$store.dispatch('auth/deleteUser').then((res) => {
        // redirect to home page
        this.$router.push('/')
      })
    }
  }
}
</script>

<style></style>
