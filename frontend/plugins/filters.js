import Vue from 'vue'

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('shortend', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.substring(0, 6) + '...' + value.substring(38)
})
