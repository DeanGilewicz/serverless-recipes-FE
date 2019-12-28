<template>
  <div class="container">
    <div class="w-full max-w-xs">
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
            name="recipeName"
            v-model="recipeName"
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
								name="ingredientName"
								v-model="ingredient.name"
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
								name="ingredientAmount"
								v-model="ingredient.amount"
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
							name="additionalIngredientName"
							v-model="additionalIngredientName"
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
							name="additionalIngredientAmount"
							v-model="additionalIngredientAmount"
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
            placeholder="recipeInstructions"
          ></textarea>
        </div>
        <div class="flex items-center justify-between">
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Create Recipe
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
  components: {},
  data() {
    return {
      errors: [],
      recipeName: '',
      additionalIngredientName: '',
      additionalIngredientAmount: '',
      ingredients: [],
      recipeInstructions: ''
    }
  },
  methods: {
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
      console.log('submit')
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
