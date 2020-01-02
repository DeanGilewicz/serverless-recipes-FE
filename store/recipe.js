/* create as a function since created on server side want a new instance each time */
export const state = () => ({
  recipes: [],
  recipe: null
})

export const mutations = {
  setRecipes(state, recipes) {
    state.recipes = recipes
  },
  setRecipe(state, recipe) {
    state.recipe = recipe
  },
  addRecipe(state, recipe) {
    state.recipes.push(recipe)
  }
  // updateRecipe(state, recipeField, recipeFieldValue) {
  //   state.recipe[recipeField] = recipeFieldValue
  // }
}

export const actions = {
  setRecipes(state, recipes) {
    state.commit('setRecipes', recipes)
  },
  setRecipe(state, recipe) {
    state.commit('setRecipe', recipe)
  },
  addRecipe(state, recipe) {
    state.commit('addRecipe', recipe)
  }
  // updateRecipe(state, recipeField, recipeFieldValue) {
  //   state.commit('updateRecipe', state, recipeField, recipeFieldValue)
  // }
}

export const getters = {
  recipes(state) {
    return state.recipes
  },
  recipe(state) {
    return state.recipe
  }
}
