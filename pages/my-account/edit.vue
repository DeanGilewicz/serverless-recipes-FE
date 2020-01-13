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
    <Loader :showLoader="currentState === 'pending'" />

		<Modal v-if="showModal" @close="showModal = false">
      <h3 v-if="currentState === 'failure'" slot="header">Oh no something went wrong</h3>
      <p v-if="currentState === 'failure'" slot="body">We were unable to update {{user.firstName}} {{user.lastName}}</p>
      <div v-if="currentState === 'failure'" slot="footer">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
      <h3 v-if="currentState === 'success'" slot="header">Success</h3>
      <p v-if="currentState === 'success'" slot="body">Your account has been updated</p>
      <div v-if="currentState === 'success'" slot="footer">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ok
        </button>
      </div>
      <h3 v-if="currentState !== 'failure' && currentState !== 'success'" slot="header">Delete {{user.firstName}} {{user.lastName}}</h3>
      <p v-if="currentState !== 'failure' && currentState !== 'success'" slot="body">Are you sure you want to delete this user?</p>
      <div v-if="currentState !== 'failure' && currentState !== 'success'" slot="footer">
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
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
export default {
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
      this.$set(this.user, e.target.name, e.target.value)
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
        this.user.firstName
      )
      const validLastName = this.$validTextInput('lastName', this.user.lastName)
      // const validEmailAddress = this.$validEmail(
      //   'emailAddress',
      //   this.user.emailAddress
      // )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validFirstName.valid) {
        this.$store.dispatch('messages/setError', validFirstName.message)
      }
      if (!validLastName.valid) {
        this.$store.dispatch('messages/setError', validLastName.message)
      }
      // if (!validEmailAddress.valid) {
      //   this.$store.dispatch('messages/setError', validEmailAddress.message)
      // }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
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
          this.$store.dispatch('messages/setError', 'Unable to update user')
        })
    },
    onDeleteUser() {
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
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
          // trigger loading state
          this.$store.dispatch('state-machine/updatePendingState', 'success')
          // clear vuex
          this.$store.dispatch('auth/deleteUser')
          // clear storage
          this.$removeAuthUser()
          // redirect to home page
          this.$router.push('/')
        })
        .catch((e) => {
          // console.error(e)
          // trigger loading state
          this.$store.dispatch('state-machine/updateFailureState')
          // user not found
          this.$store.dispatch('messages/setError', 'Unable to delete user')
        })
    }
  }
}
</script>

<style></style>
