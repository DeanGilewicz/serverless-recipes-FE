export default function(context) {
  const isAuthenticated = context.store.getters['auth/isAuthenticated']
  if (!isAuthenticated) {
    // check storage for user
    const doesUserExist = context.app.$doesUserExist()
    if (doesUserExist) {
      // get user
      const user = context.app.$getUserNoAuth()
      // set on vuex
      context.store.dispatch('auth/setUser', user)
    } else {
      context.redirect('/')
    }
  }
}
