<template>
  <div>
    <h1>Recipe</h1>
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
				<div v-for="(ingredient, index) in updatedRecipe.ingredients" :key="index">
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
							@input="updateLocalRecipeIngredient($event, 'amount',index)"
							name="ingredientAmount"
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							type="text"
							placeholder="Ingredient Amount"
						/>
					</div>
					<div class="flex items-center justify-between">
						<button
							class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="button"
							@click="deleteLocalRecipeIngredient($event, index)"
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
						:value="this.additionalIngredientName"
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
						:value="this.additionalIngredientAmount"
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
						@click="addLocalRecipeIngredient"
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
					name="instructions"
					:value="updatedRecipe.instructions"
					@input="updateLocalRecipe($event)"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					type="text"
					placeholder="instructions"
				></textarea>
			</div>
			<div class="flex items-center justify-between">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Update Recipe
				</button>
			</div>
		</form>
	</div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
export default {
  layout: 'auth',
  middleware: ['auth'],
  components: {},
  data() {
    return {
      errors: [],
      additionalIngredientName: '',
      additionalIngredientAmount: '',
      updatedRecipe: null, // deep clone of recipe
      key: 1
    }
  },
  created() {
    // check vuex for this recipe - if fail then xhr request this recipe
    if (!this.$store.getters['recipe/recipe']) {
      // stick it in vuex store
      return this.$axios
        .$get('/dev/api/recipes/' + this.$route.params.rid, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // create copy and store as updated recipe
          this.updatedRecipe = JSON.parse(JSON.stringify(res.Items[0]))
          // add recipe to vuex
          this.$store.dispatch('recipe/setRecipe', res.Items[0])
        })
        .catch((e) => {
          // console.error(e)
          // Unable to get recipe
        })
    } else {
      // create copy and store as updated recipe
      this.updatedRecipe = JSON.parse(
        JSON.stringify(this.$store.getters['recipe/recipe'])
      )
    }
  },
  // computed: {
  // recipe: {
  //   get() {
  //     return this.$store.state.recipe.recipe
  //   },
  //   set(recipe) {
  //     console.log(recipe)
  //     this.$store.commit('recipe/setRecipe', recipe)
  //   }
  // }
  // },
  // computed: mapGetters('recipe', ['recipe']),
  methods: {
    // ...mapActions('recipe', ['updateRecipe']),
    updateLocalRecipe(e) {
      this.$set(this.updatedRecipe, e.target.name, e.target.value)
    },
    updateLocalRecipeIngredient(e, field, index) {
      const ingredient = this.updatedRecipe.ingredients[index]
      this.$set(ingredient, field, e.target.value)
    },
    deleteLocalRecipeIngredient(e, index) {
      const ingredients = this.updatedRecipe.ingredients
      this.$delete(ingredients, index)
    },
    addLocalRecipeIngredient() {
      // add ingredient
      this.updatedRecipe.ingredients.push({
        name: this.$refs.additionalIngredientName.value,
        amount: this.$refs.additionalIngredientAmount.value
      })
      // reset additional ingredient
      this.$refs.additionalIngredientName.value = ''
      this.$refs.additionalIngredientAmount.value = ''
    },
    onSubmit() {
      // plugin fns
      const validRecipeName = this.$validTextInput(
        'recipeName',
        this.updatedRecipe.recipeName
      )
      const validRecipeInstructions = this.$validTextInput(
        'instructions',
        this.updatedRecipe.instructions
      )
      // clear errors
      this.errors = []
      // validate
      if (!validRecipeName.valid) {
        this.errors.push(validRecipeName.message)
      }
      if (!validRecipeInstructions.valid) {
        this.errors.push(validRecipeInstructions.message)
      }
      if (this.updatedRecipe.ingredients.length < 1) {
        this.errors.push('A recipe must have at least one ingredient')
      }
      // do not make network request if errors
      if (this.errors.length > 0) {
        return
      }
      // set up post data obj
      const postData = {
        ...this.updatedRecipe
      }
      const recipeId = this.$route.params.rid
      return this.$axios
        .$put(`dev/api/recipes/${recipeId}/update`, postData, {
          headers: {
            Authorization: this.$getAuthUserToken('idToken')
          }
        })
        .then((res) => {
          // add recipe to vuex
          this.$store.dispatch('recipe/setRecipe', res.Attributes)
        })
        .catch((e) => {
          console.error(e)
          // user not found
          this.errors.push('Unable to update recipe')
        })
    }
  }
}
</script>

<style></style>
