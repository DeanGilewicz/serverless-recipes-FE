export const state = () => ({
  state: 'initial'
})

export const mutations = {
  updateInitialState(state, nextState) {
    // initial to pending (loading)
    state.state = nextState
  },
  updatePendingState(state, nextState) {
    // pending to either success or failure
    state.state = nextState
  },
  updateSuccessState(state, nextState) {
    // success to initial
    state.state = nextState
  },
  updateFailureState(state, nextState) {
    // failure to try again
    state.state = nextState
  },
  updateTryAgainState(state, nextState) {
    // try again to initial (if user decides not to try again) otherwise success or failure
    state.state = nextState
  }
}

export const actions = {
  updateInitialState(state) {
    state.commit('updateInitialState', 'pending')
  },
  updatePendingState(state, nextState) {
    state.commit('updatePendingState', nextState)
  },
  updateSuccessState(state, nextState) {
    state.commit('updateSuccessState', 'initial')
  },
  updateFailureState(state, nextState) {
    state.commit('updateFailureState', 'tryAgain')
  },
  updateTryAgainState(state, nextState) {
    state.commit('updateTryAgainState', nextState)
  }
}

export const getters = {
  currentState(state) {
    return state.state
  }
}
