import Vue from 'vue'

const validationSuccess = (message) => {
  return {
    valid: true,
    message: ''
  }
}

const validationFailure = (message) => {
  return {
    valid: false,
    message
  }
}

const validEmail = (inputName, inputValue) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (inputValue === '') {
    return validationFailure(`Email cannot be blank`)
  }
  if (!re.test(inputValue)) {
    return validationFailure(`Please enter a valid email`)
  }
  return validationSuccess()
}

const validTextInput = (inputName, inputValue) => {
  if (inputValue === '') {
    return validationFailure(`${inputName} cannot be blank`)
  }
  return validationSuccess()
}

const validPassword = (inputName, inputValue) => {
  inputName = inputName || 'password'
  // at least one number, one lowercase and one uppercase letter and at least six characters
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (inputValue === '') {
    return validationFailure(
      `${inputName.charAt(0).toUpperCase() +
        inputName.slice(1)} cannot be blank`
    )
  }
  if (!re.test(inputValue)) {
    return validationFailure(
      `Please provide a ${inputName} that is at least eight characters and contains at least one number, one special character, one lowercase and one uppercase letter`
    )
  }
  return validationSuccess()
}

// use client side
Vue.prototype.$validEmail = validEmail
Vue.prototype.$validTextInput = validTextInput
Vue.prototype.$validPassword = validPassword

// inject into context (server side)
// export default ({ app }, inject) => {
//   app.validEmail = validEmail
//   app.validTextInput = validTextInput
//   app.validPassword = validPassword
// }

// client and server side (including Vue instance and Vuex)
// export default ({ app }, inject) => {
//   inject('validEmail', validEmail)
//   inject('validTextInput', validTextInput)
//   inject('validPassword', validPassword)
// }
