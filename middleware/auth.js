export default function(context) {
  const isAuthenticated = context.store.getters['auth/isAuthenticated']
  const isUserAuthed = context.app.$isUserAuthed()
  if (!isAuthenticated || !isUserAuthed) {
    // check storage for user
    const doesUserExist = context.app.$doesUserExist()
    if (doesUserExist) {
      const user = context.app.$getUserNoAuth()
      context.store.dispatch('auth/setUser', user)
      // update token
      context.store.dispatch('auth/authorize').catch((e) => {
        // refresh token expired - exit and re-auth
        return context.redirect('/')
      })
    } else {
      return context.redirect('/')
    }
  }
}
