<template>
  <div>
    <h1>Recipe</h1>
    <!-- <form
			@submit.prevent="onDelete"
			class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			action=""
		> -->
    <form
      @submit.prevent="showModal = true"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      action=""
    >
      <div class="flex items-center justify-between">
        <button
          :disabled="currentState === 'pending'"
          class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Delete Recipe
        </button>
      </div>
    </form>
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
      <div v-if="updatedRecipe" class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="recipeName"
          >Recipe Name</label
        >
        <input
          id="recipeName"
          :value="updatedRecipe.recipeName"
          @input="updateLocalRecipe($event)"
          name="recipeName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="recipeName"
        />
      </div>
      <div v-if="updatedRecipe && updatedRecipe.ingredients">
        <div
          v-for="(ingredient, index) in updatedRecipe.ingredients"
          :key="index"
        >
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="ingredientName"
              >Ingredient Name</label
            >
            <input
              id="ingredientName"
              :value="ingredient.name"
              @input="updateLocalRecipeIngredient($event, 'name', index)"
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
              :value="ingredient.amount"
              @input="updateLocalRecipeIngredient($event, 'amount', index)"
              name="ingredientAmount"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Ingredient Amount"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              @click="deleteLocalRecipeIngredient($event, index)"
              class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Delete Ingredient
            </button>
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
            ref="additionalIngredientName"
            :value="additionalIngredientName"
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
            ref="additionalIngredientAmount"
            :value="additionalIngredientAmount"
            name="additionalIngredientAmount"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Additional Ingredient Amount"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            @click="addLocalRecipeIngredient"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Add Ingredient
          </button>
        </div>
      </div>
      <div v-if="updatedRecipe" class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="recipeInstructions"
          >Recipe Instructions</label
        >
        <textarea
          id="instructions"
          :value="updatedRecipe.instructions"
          @input="updateLocalRecipe($event)"
          name="instructions"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="instructions"
        ></textarea>
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
          :disabled="currentState === 'pending'"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update Recipe
        </button>
      </div>
    </form>
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
        We were unable to update {{ updatedRecipe.name }}
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
        Your recipe has been updated
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
        Delete {{ updatedRecipe.recipeName }}
      </h3>
      <p
        slot="body"
        v-if="currentState !== 'failure' && currentState !== 'success'"
      >
        Are you sure you want to delete this recipe?
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
          @click="onDelete"
          class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
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
  name: 'EditRecipe',
  layout: 'auth',
  middleware: ['auth', 'reset'],
  components: { Loader, Modal },
  data() {
    return {
      additionalIngredientName: '',
      additionalIngredientAmount: '',
      updatedRecipe: null, // deep clone of recipe
      showModal: false
    }
  },
  computed: {
    ...mapGetters({
      currentState: 'state-machine/currentState',
      errors: 'messages/errors'
    })
  },
  created() {
    // check vuex for this recipe - if fail then xhr request this recipe
    if (!this.$store.getters['recipe/recipe']) {
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // xhr request to get recipe
      this.$store
        .dispatch('recipe/getRecipe', this.$route.params.rid)
        .then((recipe) => {
          this.updatedRecipe = JSON.parse(JSON.stringify(recipe))
        })
        .catch((e) => {
          if (e.message === 'No recipe exists') {
            return this.$router.push('/recipes')
          }
          // show modal
          this.showModal = true
        })
    } else {
      // create copy and store as updated recipe
      this.updatedRecipe = JSON.parse(
        JSON.stringify(this.$store.getters['recipe/recipe'])
      )
    }
  },
  methods: {
    // ...mapActions('recipe', ['updateRecipe']),
    updateLocalRecipe(e) {
      this.$set(
        this.updatedRecipe,
        e.target.name,
        this.$sanitizeData(e.target.value)
      )
    },
    updateLocalRecipeIngredient(e, field, index) {
      const ingredient = this.updatedRecipe.ingredients[index]
      this.$set(ingredient, field, this.$sanitizeData(e.target.value))
    },
    deleteLocalRecipeIngredient(e, index) {
      const ingredients = this.updatedRecipe.ingredients
      this.$delete(ingredients, index)
    },
    addLocalRecipeIngredient() {
      const name = this.$refs.additionalIngredientName.value
      const amount = this.$refs.additionalIngredientAmount.value
      // only add ingredient if not empty
      if (!name || !amount) {
        return
      }
      // add additional ingredient
      this.updatedRecipe.ingredients.push({
        name: this.$sanitizeData(name),
        amount: this.$sanitizeData(amount)
      })
      // reset additional ingredient
      this.$refs.additionalIngredientName.value = ''
      this.$refs.additionalIngredientAmount.value = ''
    },
    onCancelUpdate() {
      this.updatedRecipe = JSON.parse(
        JSON.stringify(this.$store.getters['recipe/recipe'])
      )
    },
    onCloseModal() {
      // reset state machine
      this.$store.dispatch('state-machine/setInitialState')
      // close modal
      this.showModal = false
    },
    onSubmit() {
      // plugin fns
      const validRecipeName = this.$validTextInput(
        'recipeName',
        this.$sanitizeData(this.updatedRecipe.recipeName)
      )
      const validRecipeInstructions = this.$validTextInput(
        'instructions',
        this.$sanitizeData(this.updatedRecipe.instructions)
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
      if (this.updatedRecipe.ingredients.length < 1) {
        this.$store.dispatch(
          'messages/setError',
          'A recipe must have at least one ingredient'
        )
      }
      // do not make network request if errors
      if (this.$store.getters['messages/errors'].length > 0) {
        return
      }
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // construct post data obj
      const postData = {
        recipeId: this.$route.params.rid,
        ...this.updatedRecipe
      }
      // xhr update recipe
      this.$store.dispatch('recipe/updateRecipe', postData).then((res) => {
        // show modal
        this.showModal = true
      })
    },
    onDelete() {
      // trigger loading state
      this.$store.dispatch('state-machine/updateInitialState')
      // xhr delete recipe
      this.$store
        .dispatch('recipe/deleteRecipe', this.$route.params.rid)
        .then((res) => {
          // remove recipe
          this.updatedRecipe = this.$store.getters['recipe/recipe']
          // close modal
          this.showModal = false
          // return to recipe page
          this.$router.push('/recipes')
        })
    }
  }
}
</script>

<style></style>
