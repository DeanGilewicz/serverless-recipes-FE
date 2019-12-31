export default function(context) {
  const isAuthenticated = context.store.getters['auth/isAuthenticated']
  if (!isAuthenticated) {
    // check storage for user
    const doesUserExist = context.app.$doesUserExist()
    if (doesUserExist) {
      const user = context.app.$getUserNoAuth()
      context.store.dispatch('auth/setUser', user)
      // check token validity
      console.log('IS AUTHED', context.app.$isUserAuthed())
      if (!context.app.$isUserAuthed()) {
        return context.$axios
          .$post(
            '/dev/api/users/authorization',
            {},
            {
              headers: {
                Authorization: context.app.$getAuthUserToken('idToken'),
                'X-Custom-Token': context.app.$getAuthUserToken('refreshToken')
              }
            }
          )
          .then((res) => {
            // update storage (tokens and expiration) and continue
            context.app.$updateAuthUserItem(
              'accessToken',
              res.AuthenticationResult.AccessToken
            )
            context.app.$updateAuthUserItem(
              'idToken',
              res.AuthenticationResult.IdToken
            )
            context.app.$updateAuthUserItem(
              'expiration',
              new Date().getTime() + 59 * 60 * 1000
            ) // 59 mins from now
          })
          .catch((e) => {
            console.log(e)
            // refresh token expired - exit and re-auth
            return context.redirect('/')
          })
      }
    } else {
      return context.redirect('/')
    }
  }
}
