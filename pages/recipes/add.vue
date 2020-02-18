<template>
  <div class="page-add-recipe">
    <div class="py-4 text-center">
      <h1 class="text-3xl">ADD RECIPE</h1>
    </div>
    <nav class="py-4 text-center">
      <nuxt-link
        to="/recipes"
        class="inline-block w-full xs:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        All Recipes
      </nuxt-link>
    </nav>
    <div class="w-full max-w-md my-0 mx-auto">
      <form @submit.prevent="onSubmit" class="px-8 pt-6 pb-8 mb-4" action="">
        <Error :errors="errors" />
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
            placeholder="name"
          />
        </div>
        <div v-if="ingredients">
          <div
            v-for="(ingredient, index) in ingredients"
            :key="index"
            class="my-8"
          >
            <div class="mb-2">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="ingredientName"
                >Ingredient Name</label
              >
              <input
                id="ingredientName"
                v-model="ingredient.name"
                name="ingredientName"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="name"
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="ingredientAmount"
                >Ingredient Amount</label
              >
              <input
                id="ingredientAmount"
                v-model="ingredient.amount"
                name="ingredientAmount"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="amount"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                @click="deleteLocalRecipeIngredient($event, index)"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Delete Ingredient
              </button>
            </div>
          </div>
        </div>
        <div class="my-8">
          <div class="mb-2">
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
              placeholder="additional name"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="additionalIngredientAmount"
              >Additional Ingredient Amount</label
            >
            <input
              id="additionalIngredientAmount"
              v-model="additionalIngredientAmount"
              name="additionalIngredientAmount"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="additional amount"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              @click="addLocalIngredient"
              class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Add Ingredient
            </button>
          </div>
        </div>
        <div class="mb-8">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="recipeInstructions"
            >Recipe Instructions</label
          >
          <textarea
            id="recipeInstructions"
            v-model="recipeInstructions"
            name="recipeInstructions"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="instructions"
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
        We were unable to create this {{ recipeName }} recipe
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
        Your {{ recipeName }} recipe has been created
      </p>
      <div slot="footer" v-if="currentState === 'success'">
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
import { mapGetters } from 'vuex'
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
import Error from '@/components/Error'
export default {
  name: 'AddRecipe',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal, Error },
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
    ...mapGetters({
      currentState: 'state-machine/currentState',
      errors: 'messages/errors'
    })
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
    deleteLocalRecipeIngredient(e, index) {
      const ingredients = this.ingredients
      this.$delete(ingredients, index)
    },
    addLocalIngredient() {
      const name = this.additionalIngredientName
      const amount = this.additionalIngredientAmount
      // only add ingredient if not empty
      if (!name || !amount) {
        return
      }
      // add ingredient
      this.ingredients.push({
        name: this.$sanitizeData(this.additionalIngredientName),
        amount: this.$sanitizeData(this.additionalIngredientAmount)
      })
      // reset additional ingredient
      this.additionalIngredientName = ''
      this.additionalIngredientAmount = ''
    },
    onSubmit() {
      // plugin fns
      const validRecipeName = this.$validTextInput(
        'Recipe Name',
        this.$sanitizeData(this.recipeName)
      )
      const validRecipeInstructions = this.$validTextInput(
        'Recipe Instructions',
        this.$sanitizeData(this.recipeInstructions)
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
      // construct post data obj
      const postData = {
        recipeName: this.$sanitizeData(this.recipeName),
        ingredients: this.ingredients, // sanitize handled when ingredient created
        instructions: this.$sanitizeData(this.recipeInstructions),
        image: ''
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // xhr create recipe
      this.$store
        .dispatch('recipe/createRecipe', postData)
        .then((res) => {
          // show modal
          this.showModal = true
        })
        .catch((e) => {
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
/* .container {
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
} */
</style>
