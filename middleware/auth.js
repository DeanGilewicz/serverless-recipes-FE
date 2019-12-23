export default function(context) {
  const user = context.store.getters.isAuthenticated
  // const user = context.store.state.user;
  if (!user) {
    context.redirect('/')
  }
}
