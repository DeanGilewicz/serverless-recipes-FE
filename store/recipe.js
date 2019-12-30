/* create as a function since created on server side want a new instance each time */
export const state = () => ({
  recipes: [],
  recipe: null
})

export const mutations = {
  setRecipes(state, recipes) {
    state.recipes = recipes
  },
  // setRecipe(state, recipe) {
  //   state.recipe = recipe;
  // },
  addRecipe(state, recipe) {
    state.recipes.push(recipe)
  }
}

export const actions = {
  setRecipes(state, recipes) {
    state.commit('setRecipes', recipes)
  },
  addRecipe(state, recipe) {
    state.commit('addRecipe', recipe)
  }
}

export const getters = {
  recipes(state) {
    return state.recipes
  },
  recipe(state) {
    return state.recipe
  }
}
