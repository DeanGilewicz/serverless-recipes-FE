// import Vue from 'vue'

const doesUserExist = () => {
  if (!window.localStorage.getItem('user')) {
    return false
  }
  return true
}

const isUserAuthed = () => {
  if (doesUserExist()) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const expiration = user.auth.expiration
    const timeNow = new Date().getTime()
    if (timeNow >= expiration) {
      return false
    }
    return true
  }
}

const getUserNoAuth = () => {
  if (!window.localStorage.getItem('user')) {
    return
  }
  const user = JSON.parse(window.localStorage.getItem('user'))
  // remove the auth
  delete user.auth
  return user
}

const setAuthUser = (user) => {
  const stringifyUser = JSON.stringify(user)
  window.localStorage.setItem('user', stringifyUser)
}

const updateAuthUserItem = (item, itemVal) => {
  if (doesUserExist()) {
    const stringifiedUser = window.localStorage.getItem('user')
    const user = JSON.parse(stringifiedUser)
    user.auth[item] = itemVal
    setAuthUser(user)
  }
}

const removeAuthUser = () => {
  if (doesUserExist()) {
    window.localStorage.removeItem('user')
  }
}

const getAuthUserToken = (item) => {
  if (doesUserExist()) {
    const stringifiedUser = window.localStorage.getItem('user')
    const user = JSON.parse(stringifiedUser)
    return user.auth[item]
  }
}

// use client side
// Vue.prototype.$doesUserExist = doesUserExist
// Vue.prototype.$setAuthUser = setAuthUser
// Vue.prototype.$getAuthUser = getAuthUser
// Vue.prototype.$updateAuthUserItem = updateAuthUserItem
// Vue.prototype.$removeAuthUser = removeAuthUser
// Vue.prototype.$getAuthUserToken = getAuthUserToken

// client and server side (including Vue instance and Vuex)
// inject [name] is available in context $[name]
export default ({ app }, inject) => {
  inject('doesUserExist', doesUserExist)
  inject('isUserAuthed', isUserAuthed)
  inject('setAuthUser', setAuthUser)
  inject('getUserNoAuth', getUserNoAuth)
  inject('updateAuthUserItem', updateAuthUserItem)
  inject('removeAuthUser', removeAuthUser)
  inject('getAuthUserToken', getAuthUserToken)
}
