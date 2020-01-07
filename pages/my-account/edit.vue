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
				<!-- <div v-if="user" class="mb-4">
					<label
						class="block text-gray-700 text-sm font-bold mb-2"
						for="emailAddress"
						>Email Address</label
					>
					<input
						id="emailAddress"
						:value="user.emailAddress"
						@input="updateLocalUser($event)"
						name="emailAddress"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						type="text"
						placeholder="email address"
					/>
				</div> -->
				<div class="flex items-center justify-between">
					<button
						class="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						@click="onCancelUpdate"
					>
						Cancel
					</button>
					<button
						class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						@click="showModal = true"
					>
						Delete User
					</button>
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Update User
					</button>
				</div>
			</form>
    </div>

		<Modal v-if="showModal" @close="showModal = false">
			<h3 slot="header">Delete {{user.firstName}} {{user.lastName}}</h3>
			<p slot="body">Are you sure you want to delete this user?</p>
			<div slot="footer">
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
// import { mapGetters, mapActions } from 'vuex'
import Modal from '@/components/Modal'
export default {
  layout: 'auth',
  middleware: ['auth'],
  components: { Modal },
  data() {
    return {
      errors: [],
      // user: null // deep clone of recipe
      // key: 1,
      showModal: false
    }
  },
  // created() {

  // }
  computed: {
    user: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters['auth/user']))
      },
      set(user) {
        // console.log('user', user)
        this.$store.dispatch('auth/setUser', user)
      }
    }
  },
  methods: {
    updateLocalUser(e) {
      this.$set(this.user, e.target.name, e.target.value)
    },
    onCancelUpdate() {
      this.user = JSON.parse(JSON.stringify(this.$store.getters['auth/user']))
    },
    onSubmit() {
      // plugin fns
      const validFirstName = this.$validTextInput(
        'firstName',
        this.user.firstName
      )
      const validLastName = this.$validTextInput('lastName', this.user.lastName)
      // const validEmailAddress = this.$validEmail(
      //   'emailAddress',
      //   this.user.emailAddress
      // )
      // clear errors
      this.errors = []
      // validate
      if (!validFirstName.valid) {
        this.errors.push(validFirstName.message)
      }
      if (!validLastName.valid) {
        this.errors.push(validLastName.message)
      }
      // if (!validEmailAddress.valid) {
      //   this.errors.push(validEmailAddress.message)
      // }
      // do not make network request if errors
      if (this.errors.length > 0) {
        return
      }
      // set up post data obj
      const postData = {
        accessToken: this.$getAuthUserToken('accessToken'),
        userAttributes: [
          {
            Name: 'name',
            Value: this.user.firstName
          },
          {
            Name: 'family_name',
            Value: this.user.lastName
          }
          // {
          // 	Name: "picture",
          // 	Value: ""
          // }
        ]
      }
      return this.$axios
        .$put('/dev/api/users/updateUser', postData, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // update user info in store
          this.$updateUserItem('firstName', res.firstName)
          this.$updateUserItem('lastName', res.lastName)
          // update user in vuex
          this.$store.dispatch('auth/updateUserAttribute', {
            attr: 'firstName',
            attrValue: res.firstName
          })
          this.$store.dispatch('auth/updateUserAttribute', {
            attr: 'lastName',
            attrValue: res.lastName
          })
        })
        .catch((e) => {
          console.error(e)
          // user not found
          this.errors.push('Unable to update user')
        })
    },
    onDeleteUser() {
      return this.$axios
        .$delete('/dev/api/users/deleteUser', {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          },
          data: {
            accessToken: this.$getAuthUserToken('accessToken')
          }
        })
        .then((res) => {
          // clear vuex
          this.$store.dispatch('auth/deleteUser')
          // clear storage
          this.$removeAuthUser()
          // redirect to home page
          this.$router.push('/')
        })
        .catch((e) => {
          console.error(e)
          this.errors.push('Unable to delete user')
        })
    }
  }
}
</script>

<style></style>
