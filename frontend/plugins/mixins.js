import Vue from 'vue'
// import SnackbarsMixin from '~/mixins/snackbars'
import ConnectionsMixin from '~/mixins/wallet_connection'
// Vue.mixin(SnackbarsMixin)
// All functions needed to connect and interact with wallet
Vue.mixin(ConnectionsMixin)
