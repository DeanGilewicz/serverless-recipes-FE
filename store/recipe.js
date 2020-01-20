/* create as a function since created on server side want a new instance each time */
export const state = () => ({
  recipes: [],
  recipe: null
})

export const mutations = {
  SET_RECIPES(state, recipes) {
    state.recipes = recipes
  },
  SET_RECIPE(state, recipe) {
    state.recipe = recipe
  },
  ADD_RECIPE(state, recipe) {
    state.recipes.push(recipe)
  },
  DELETE_RECIPE(state, recipe) {
    // delete recipe from recipes
    if (state.recipes.length > 0) {
      state.recipes = state.recipes.filter(
        (r) => r.recipeId !== recipe.recipeId
      )
    }
    // delete current recipe
    state.recipe = null
  }
}

export const actions = {
  setRecipe(context, recipe) {
    context.commit('SET_RECIPE', recipe)
  },
  createRecipe(context, postData) {
    return this.$axios
      .$post('/dev/api/recipes/create', postData, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        const addedRecipe = res.Item
        // add recipe to vuex
        context.commit('ADD_RECIPE', addedRecipe)
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
        // return something so can chain
        return {}
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        // set error message
        context.dispatch('messages/setError', 'Unable to create recipe', {
          root: true
        })
        // throw to chain catch
        throw new Error('Unable to create recipe')
      })
  },
  getRecipes(context) {
    return this.$axios
      .$get('/dev/api/recipes', {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // add recipe to vuex
        context.commit('SET_RECIPES', res.Items)
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        // throw to chain catch
        throw new Error('Unable to get recipes')
      })
  },
  getRecipe(context, recipeId) {
    return this.$axios
      .$get('/dev/api/recipes/' + recipeId, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // redirect if no recipe exists
        if (res.Items.length < 1) {
          throw new Error('No recipe exists')
        }
        // add recipe to vuex
        context.dispatch('setRecipe', res.Items[0])
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
        return res.Items[0]
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        if (e.message === 'No recipe exists') {
          throw new Error('No recipe exists')
        }
      })
  },
  updateRecipe(context, postData) {
    return this.$axios
      .$put(`/dev/api/recipes/${postData.recipeId}/update`, postData, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // add recipe to vuex
        context.dispatch('setRecipe', res.Attributes)
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        // set error message
        context.dispatch('messages/setError', 'Unable to update recipe', {
          root: true
        })
      })
  },
  deleteRecipe(context, recipeId) {
    return this.$axios
      .$delete(`dev/api/recipes/${recipeId}/delete`, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // remove deleted recipe from vuex
        context.commit('DELETE_RECIPE', res.Attributes)
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
        // return something so can chain
        return {}
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        // set error message
        context.dispatch('messages/setError', 'Unable to delete recipe', {
          root: true
        })
      })
  }
}

export const getters = {
  recipes(state) {
    return state.recipes
  },
  recipe(state) {
    return state.recipe
  }
  // recipe: (state) => (recipeId) => {
  //   return state.recipes.find((prop) => prop.recipeId === recipeId)
  // }
}
