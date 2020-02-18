<template>
  <div class="page-edit-account">
    <div class="py-4 text-center">
      <h1 class="text-3xl">CHANGE PASSWORD</h1>
    </div>
    <nav class="py-4 text-center">
      <nuxt-link
        to="/my-account"
        class="inline-block w-full xs:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Account
      </nuxt-link>
    </nav>
    <div class="w-full max-w-md my-0 mx-auto">
      <form
        @submit.prevent="onSubmit"
        class="px-4 xs:px-8 pt-3 xs:pt-6 pb-4 xs:pb-8 mb-4"
        action=""
      >
        <Error :errors="errors" />
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="currentPassword"
            >Current Password</label
          >
          <input
            id="currentPassword"
            v-model="currentPassword"
            name="currentPassword"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="********"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="newPassword"
            >New Password</label
          >
          <input
            id="newPassword"
            v-model="newPassword"
            name="newPassword"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="********"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="confirmPassword"
            >Confirm Password</label
          >
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            name="confirmPassword"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="********"
          />
        </div>
        <div class="pt-4 xs:flex xs:justify-between">
          <button
            @click="onCancel"
            class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Cancel
          </button>
          <button
            :disabled="currentState === 'pending'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Change Password
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
        We were unable to change your password
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
        Your password has been updated
      </p>
      <div slot="footer" v-if="currentState === 'success'">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ok
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
export default {
  name: 'ChangePassword',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showModal: false
    }
  },
  computed: {
    ...mapGetters({
      currentState: 'state-machine/currentState',
      errors: 'messages/errors'
    })
  },
  methods: {
    onCancel() {
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // reset data
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    onCloseModal() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
    },
    onSubmit() {
      // plugin fns
      const validCurrentPassword = this.$validPassword(
        'current password',
        this.$sanitizeData(this.currentPassword)
      )
      const validNewPassword = this.$validPassword(
        'new password',
        this.$sanitizeData(this.newPassword)
      )
      const validConfirmPassword = this.$validPassword(
        'confirm password',
        this.$sanitizeData(this.confirmPassword)
      )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validCurrentPassword.valid) {
        this.$store.dispatch('messages/setError', validCurrentPassword.message)
      }
      if (!validNewPassword.valid) {
        this.$store.dispatch('messages/setError', validNewPassword.message)
      }
      if (!validConfirmPassword.valid) {
        this.$store.dispatch('messages/setError', validConfirmPassword.message)
      }
      // exit if new password and confirm password do not match
      if (
        this.$sanitizeData(this.newPassword) !==
        this.$sanitizeData(this.confirmPassword)
      ) {
        this.$store.dispatch('messages/setError', 'passwords do not match')
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
        currentPassword: this.$sanitizeData(this.currentPassword),
        newPassword: this.$sanitizeData(this.newPassword)
      }
      // xhr change password
      this.$store.dispatch('auth/changePassword', postData).then((res) => {
        // show modal
        this.showModal = true
      })
    }
  }
}
</script>

<style></style>
