<template>
  <div class="">
    <div class="">
			<h1>Change Password</h1>
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
				<div class="flex items-center justify-between">
					<button
						class="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						@click="onCancel"
					>
						Cancel
					</button>
					<button
            :disabled="currentState === 'pending'"
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Change Password
					</button>
				</div>
			</form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />

    <Modal v-if="showModal" @close="showModal = false">
      <h3 v-if="currentState === 'failure'" slot="header">Oh no something went wrong</h3>
      <p v-if="currentState === 'failure'" slot="body">We were unable to change your password</p>
      <div v-if="currentState === 'failure'" slot="footer">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
      <h3 v-if="currentState === 'success'" slot="header">Success</h3>
      <p v-if="currentState === 'success'" slot="body">Your password has been updated</p>
      <div v-if="currentState === 'success'" slot="footer">
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
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
export default {
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
    currentState() {
      return this.$store.getters['state-machine/currentState']
    },
    errors() {
      return this.$store.getters['messages/errors']
    }
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
        this.currentPassword
      )
      const validNewPassword = this.$validPassword(
        'new password',
        this.newPassword
      )
      const validConfirmPassword = this.$validPassword(
        'confirm password',
        this.confirmPassword
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
      if (this.newPassword !== this.confirmPassword) {
        this.$store.dispatch('messages/setError', 'passwords do not match')
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // set up post data obj
      const postData = {
        accessToken: this.$getAuthUserToken('accessToken'),
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      }
      return this.$axios
        .$post('/dev/api/users/changePassword', postData, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // not storing password anywhere - show success UI
          // trigger loading state
          this.$store.dispatch('state-machine/updatePendingState', 'success')
          // show modal
          this.showModal = true
        })
        .catch((e) => {
          // console.error(e)
          // trigger loading state
          this.$store.dispatch('state-machine/updateFailureState')
          // user not found
          this.$store.dispatch('messages/setError', 'Unable to change password')
        })
    }
  }
}
</script>

<style></style>
