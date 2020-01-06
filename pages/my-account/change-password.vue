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
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Change Password
					</button>
				</div>
			</form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: ['auth'],
  data() {
    return {
      errors: [],
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    onCancel() {
      this.errors = []
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
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
      this.errors = []
      // validate
      if (!validCurrentPassword.valid) {
        this.errors.push(validCurrentPassword.message)
      }
      if (!validNewPassword.valid) {
        this.errors.push(validNewPassword.message)
      }
      if (!validConfirmPassword.valid) {
        this.errors.push(validConfirmPassword.message)
      }
      // exit if new password and confirm password do not match
      if (this.newPassword !== this.confirmPassword) {
        this.errors.push('passwords do not match')
      }
      // do not make network request if errors
      if (this.errors.length > 0) {
        return
      }
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
          console.log('PASSWORD CHANGE SUCESS')
        })
        .catch((e) => {
          console.error(e)
          // user not found
          this.errors.push('Unable to change password')
        })
    }
  }
}
</script>

<style></style>
