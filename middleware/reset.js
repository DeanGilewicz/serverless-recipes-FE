export default function(context) {
  if (context.store.getters['messages/errors'].length > 0) {
    context.store.dispatch('messages/clearErrors')
  }
  // reset state machine
  context.store.dispatch('state-machine/setInitialState')
}
