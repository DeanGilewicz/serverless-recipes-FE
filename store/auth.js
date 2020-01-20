export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  DELETE_USER(state) {
    state.user = null
  },
  UPDATE_USER_ATTRIBUTE(state, { attr, attrValue }) {
    state.user[attr] = attrValue
  }
}

export const actions = {
  setUser(context, user) {
    context.commit('SET_USER', user)
  },
  signUp(context, postData) {
    return this.$axios
      .$post('/dev/api/users/create', postData)
      .then((res) => {
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
        context.dispatch(
          'messages/setError',
          'Something went wrong. Please try again',
          { root: true }
        )
      })
  },
  resendConfirmation(context, postData) {
    return this.$axios
      .$post('/dev/api/users/resendConfirmation', postData)
      .then((res) => {
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
        context.dispatch('messages/setError', 'Invalid username', {
          root: true
        })
      })
  },
  userConfirmation(context, postData) {
    return this.$axios
      .$post('/dev/api/users/confirm', postData)
      .then((res) => {
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
        context.dispatch(
          'messages/setError',
          'Invalid username and confirmation code combination',
          {
            root: true
          }
        )
      })
  },
  forgotPassword(context, postData) {
    return this.$axios
      .$post('/dev/api/users/forgotPassword', postData)
      .then((res) => {
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
        context.dispatch('messages/setError', 'Invalid username', {
          root: true
        })
      })
  },
  forgotPasswordConfirm(context, postData) {
    return this.$axios
      .$post('/dev/api/users/forgotPasswordConfirm', postData)
      .then((data) => {
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
        context.dispatch(
          'messages/setError',
          'Invalid code and username combination',
          { root: true }
        )
      })
  },
  login(context, postData) {
    return this.$axios
      .$post('/dev/api/users/login', postData)
      .then((res) => {
        const user = {
          emailVerified: res.user.emailVerified,
          emailAddress: res.user.emailAddress,
          firstName: res.user.firstName,
          lastName: res.user.lastName
        }
        // trigger success state
        context.dispatch('state-machine/updatePendingState', 'success', {
          root: true
        })
        // save user info to vuex
        context.commit('SET_USER', user)
        // return user
        return res.user
      })
      .catch((e) => {
        // trigger error state status
        context.dispatch('state-machine/updateFailureState', null, {
          root: true
        })
        // set error message
        context.dispatch(
          'messages/setError',
          'Invalid username and password combination',
          { root: true }
        )
      })
  },
  updateUser(context, postData) {
    return this.$axios
      .$put('/dev/api/users/updateUser', postData, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
        // update user info in store
        this.$updateUserItem('firstName', res.firstName)
        this.$updateUserItem('lastName', res.lastName)
        // update vuex user
        context.commit('UPDATE_USER_ATTRIBUTE', {
          attr: 'firstName',
          attrValue: res.firstName
        })
        context.commit('UPDATE_USER_ATTRIBUTE', {
          attr: 'lastName',
          attrValue: res.lastName
        })
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
        context.dispatch('messages/setError', 'Unable to update user', {
          root: true
        })
      })
  },
  changePassword(context, postData) {
    return this.$axios
      .$post('/dev/api/users/changePassword', postData, {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        }
      })
      .then((res) => {
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
        context.dispatch('messages/setError', 'Unable to change password', {
          root: true
        })
      })
  },
  logout(context) {
    // log user out
    return this.$axios
      .$post(
        '/dev/api/users/logOut',
        {},
        {
          headers: {
            Authorization: this.$getAuthUserToken('idToken'),
            'X-Custom-Token': this.$getAuthUserToken('accessToken')
          }
        }
      )
      .then((res) => {
        context.commit('DELETE_USER')
        // return something so can chain
        return {}
      })
  },
  deleteUser(context) {
    return this.$axios
      .$delete('/dev/api/users/deleteUser', {
        headers: {
          Authorization: this.$getAuthUserToken('idToken')
        },
        data: {
          accessToken: this.$getAuthUserToken('accessToken')
        }
      })
      .then((res) => {
        // clear vuex
        context.commit('DELETE_USER')
        // clear storage
        this.$removeAuthUser()
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
        context.dispatch('messages/setError', 'Unable to delete user', {
          root: true
        })
      })
  },
  authorize(context) {
    return this.$axios
      .$post(
        '/dev/api/users/authorization',
        {},
        {
          headers: {
            Authorization: this.$getAuthUserToken('idToken'),
            'X-Custom-Token': this.$getAuthUserToken('refreshToken')
          }
        }
      )
      .then((res) => {
        if (res.message === 'Authorized') {
          return { authorized: true }
        }
        // update storage (tokens and expiration) and continue
        this.$updateAuthUserItem(
          'accessToken',
          res.AuthenticationResult.AccessToken
        )
        this.$updateAuthUserItem('idToken', res.AuthenticationResult.IdToken)
        this.$updateAuthUserItem(
          'expiration',
          new Date().getTime() + 59 * 60 * 1000
        ) // 59 mins from now
      })
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
