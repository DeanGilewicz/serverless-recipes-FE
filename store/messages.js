export const state = () => ({
  errors: [],
  success: ''
})

export const mutations = {
  clearErrors(state) {
    state.errors.length = 0
  },
  setError(state, error) {
    state.errors.push(error)
  },
  setErrors(state, errors) {
    state.errors.push(errors)
  },
  clearSuccess(state) {
    state.success = ''
  },
  setSuccess(state, message) {
    state.success = message
  }
}

export const actions = {
  clearErrors(state) {
    state.commit('clearErrors')
  },
  setError(state, error) {
    state.commit('setError', error)
  },
  setErrors(state, errors) {
    state.commit('setErrors', errors)
  },
  clearAndSetErrors(state, errors) {
    state.commit('clearErrors')
    state.commit('setErrors', errors)
  },
  clearSuccess(state) {
    state.commit('clearSuccess')
  },
  setSuccess(state, message) {
    state.commit('setSuccess', message)
  }
}

export const getters = {
  errors(state) {
    return state.errors
  },
  success(state) {
    return state.success
  }
}
