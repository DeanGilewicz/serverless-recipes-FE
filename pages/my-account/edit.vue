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
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Update User
					</button>
				</div>
			</form>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
// import Modal from '@/components/Modal'
export default {
  layout: 'auth',
  middleware: ['auth'],
  // components: { Modal },
  data() {
    return {
      errors: []
      // user: null // deep clone of recipe
      // key: 1,
      // showModal: false
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
      console.log('POSTDATA', postData)
      // return this.$axios
      //   .$put('/dev/api/users/updateUser', postData, {
      //     headers: {
      //       Authorization: this.$getAuthUserToken('idToken')
      //     }
      //   })
      //   .then((res) => {
      //     // add recipe to vuex
      //     this.$store.dispatch('recipe/setRecipe', res.Attributes)
      //   })
      //   .catch((e) => {
      //     console.error(e)
      //     // user not found
      //     this.errors.push('Unable to update recipe')
      //   })
    },
    onDelete() {
      console.log('onDelete')
      // const recipeId = this.$route.params.rid
      // return this.$axios
      //   .$delete(`dev/api/recipes/${recipeId}/delete`, {
      //     headers: {
      //       Authorization: this.$getAuthUserToken('idToken')
      //     }
      //   })
      //   .then((res) => {
      //     // remove deleted recipe from vuex
      //     this.$store
      //       .dispatch('recipe/deleteRecipe', res.Attributes)
      //       .then(() => {
      //         this.showModal = false
      //         this.updatedRecipe = this.$store.getters['recipe/recipe']
      //         this.$router.push('/recipes')
      //       })
      //   })
      //   .catch((e) => {
      //     console.error(e)
      //     // user not found
      //     this.errors.push('Unable to delete recipe')
      //   })
    }
  }
}
</script>

<style></style>
