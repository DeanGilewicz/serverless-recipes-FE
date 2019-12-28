export const state = () => ({
  user: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  deleteUser(state) {
    state.user = null
  }
}

export const actions = {
  setUser(state, user) {
    state.commit('setUser', user)
  },
  deleteUser(state) {
    state.commit('deleteUser')
  }
}

export const getters = {
  user(state) {
    return state.user
  },
  isAuthenticated(state) {
    if (!state.user) {
      return false
    }
    return true
  }
}
