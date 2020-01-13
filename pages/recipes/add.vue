<template>
  <div class="container">
    <div class="w-full max-w-xs">
      <nuxt-link to="/recipes">Go to Recipes</nuxt-link>
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
            for="recipeName"
            >Recipe Name</label
          >
          <input
            id="recipeName"
            v-model="recipeName"
            name="recipeName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="recipeName"
          />
        </div>
        <div v-if="ingredients">
          <div v-for="(ingredient, index) in ingredients" :key="index">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="ingredientName"
                >Ingredient Name</label
              >
              <input
                id="ingredientName"
                v-model="ingredient.name"
                name="ingredientName"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Ingredient Name"
              />
            </div>
            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="ingredientAmount"
                >Ingredient Amount</label
              >
              <input
                id="ingredientAmount"
                v-model="ingredient.amount"
                name="ingredientAmount"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Ingredient Amount"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="additionalIngredientName"
              >Additional Ingredient Name</label
            >
            <input
              id="additionalIngredientName"
              v-model="additionalIngredientName"
              name="additionalIngredientName"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Additional Ingredient Name"
            />
          </div>
          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="additionalIngredientAmount"
              >Additional Ingredient Amount</label
            >
            <input
              id="additionalIngredientAmount"
              v-model="additionalIngredientAmount"
              name="additionalIngredientAmount"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Additional Ingredient Amount"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              @click="addIngredient"
            >
              Add Ingredient
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="recipeInstructions"
            >Recipe Instructions</label
          >
          <textarea
            id="recipeInstructions"
            name="recipeInstructions"
            v-model="recipeInstructions"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="recipe instructions"
          ></textarea>
        </div>
        <div class="flex items-center justify-between">
          <button
            :disabled="currentState === 'pending'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Recipe
          </button>
        </div>
      </form>
    </div>
    <Loader :showLoader="currentState === 'pending'" />

		<Modal v-if="showModal" @close="showModal = false">
      <h3 v-if="currentState === 'failure'" slot="header">Oh no something went wrong</h3>
      <p v-if="currentState === 'failure'" slot="body">We were unable to create this {{recipeName}} recipe</p>
      <div v-if="currentState === 'failure'" slot="footer">
        <button
          @click="onCloseModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
      <h3 v-if="currentState === 'success'" slot="header">Success</h3>
      <p v-if="currentState === 'success'" slot="body">Your {{recipeName}} recipe has been created</p>
      <div v-if="currentState === 'success'" slot="footer">
        <button
          @click="onCloseModalSuccess"
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
  name: 'recipes-add',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      recipeName: '',
      additionalIngredientName: '',
      additionalIngredientAmount: '',
      ingredients: [],
      recipeInstructions: '',
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
    onCloseModal() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
    },
    onCloseModalSuccess() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
      // redirect to recipes
      this.$router.push('/recipes')
    },
    addIngredient() {
      // add ingredient
      this.ingredients.push({
        name: this.additionalIngredientName,
        amount: this.additionalIngredientAmount
      })
      // reset additional ingredient
      this.additionalIngredientName = ''
      this.additionalIngredientAmount = ''
    },
    onSubmit() {
      // plugin fns
      const validRecipeName = this.$validTextInput(
        'Recipe Name',
        this.recipeName
      )
      const validRecipeInstructions = this.$validTextInput(
        'Recipe Instructions',
        this.recipeInstructions
      )
      // clear errors
      this.$store.dispatch('messages/clearErrors')
      // validate
      if (!validRecipeName.valid) {
        this.$store.dispatch('messages/setError', validRecipeName.message)
      }
      if (!validRecipeInstructions.valid) {
        this.$store.dispatch(
          'messages/setError',
          validRecipeInstructions.message
        )
      }
      if (this.ingredients.length < 1) {
        this.$store.dispatch(
          'messages/setError',
          'A recipe must have at least one ingredient'
        )
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // set up post data obj
      const postData = {
        recipeName: this.recipeName,
        ingredients: this.ingredients,
        instructions: this.recipeInstructions,
        image: ''
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      return this.$axios
        .$post('/dev/api/recipes/create', postData, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          const addedRecipe = res.Item
          // add recipe to vuex
          this.$store.dispatch('recipe/addRecipe', addedRecipe)
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
          this.$store.dispatch('messages/setError', 'Unable to create recipe')
          // show modal
          this.showModal = true
        })
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
