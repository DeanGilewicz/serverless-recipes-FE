export const state = () => ({
  user: null
})

export const getters = {
  user(state) {
    return state.user
  }
  // isAuthenticated(state) {
  // 	return state.user.token !== null;
  // }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  setUser(vuexContext, user) {
    vuexContext.commit('setUser', user)
  }
}
