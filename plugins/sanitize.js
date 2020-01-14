import Vue from 'vue'
import { sanitize } from 'dompurify'

const sanitizeData = (value) => {
  return sanitize(value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_STYLE: ['style']
  })
}

// use client side
Vue.prototype.$sanitizeData = sanitizeData
