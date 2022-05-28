<template>
  <div>
    <v-card class="mx-auto" max-width="500">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-1"> Wallet connect </v-list-item-title>

          <v-list-item-subtitle
            >contract_adress:
            {{
              $store.state.contract.HelloDApp_contract | shortend
            }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >wallet_address:
            {{ wallet_address | shortend }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >networkId: {{ networkId }}</v-list-item-subtitle
          >
          <v-list-item-subtitle>chainId: {{ chainId }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-btn
          class="primary"
          :disabled="!wallet_address"
          @click="$nuxt.$emit('disconnectWebModalEvent')"
          >Disconnect</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          class="primary"
          :disabled="!!wallet_address"
          @click="connectWebModal()"
          >Connect Web3 Modal
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Second card -->
    <v-card class="mx-auto mt-4" max-width="500">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-1">
            Current message:
            <v-icon @click="refreshMessage">mdi-refresh</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>{{ message }}</v-list-item-subtitle>
          <v-list-item-title class="mt-4 mb-1">
            New message:
          </v-list-item-title>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="newMessage"
              :rules="messageRules"
              clearable
              dense
            >
            </v-text-field>
          </v-form>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn class="primary" @click="validate"> Validate</v-btn> -->
        <v-btn class="primary" :disabled="!allowUpdate"> Update message</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'universal',
  data: () => ({
    ethereumSupported: false,
    formValid: false,
    message: '',
    newMessage: '',
    messageRules: [
      (v) => !!v || 'Message is required',
      (v) => (v && v.length <= 25) || 'Message must be less than 10 characters',
    ],
  }),
  computed: {
    allowUpdate() {
      return this.formValid && !!this.wallet_address
    },
    connector: {
      get() {
        return this.$store.getters['walletc/connector']
      },
      set(v) {
        return this.$store.commit('walletc/SET_CONNECTOR', v)
      },
    },
    bridge() {
      return this.$store.getters['walletc/bridge']
    },
    wallet_addresses: {
      get() {
        return this.$store.getters['wallet/wallet_addresses']
      },
      set(v) {
        return this.$store.commit('wallet/SET_WALLET_ADDRESSES', v)
      },
    },
    wallet_address: {
      get() {
        return this.$store.getters['wallet/wallet_address']
      },
      set(v) {
        return this.$store.commit('wallet/SET_WALLET', v)
      },
    },
    chainId: {
      get() {
        return this.$store.getters['walletc/chainId']
      },
      set(v) {
        return this.$store.commit('walletc/SET_CHAIN_ID', v)
      },
    },
    networkId: {
      get() {
        return this.$store.getters['walletc/networkId']
      },
      set(v) {
        return this.$store.commit('walletc/SET_NETWORK_ID', v)
      },
    },
  },
  mounted() {
    this.refreshMessage()
  },
  methods: {
    refreshMessage() {
      console.log('⚡', 'refreshMessage')
      this.$DAppContract.methods
        .readMessage()
        .call()
        .then((v) => (this.message = v))
        .catch(console.error())
    },
  },
}
</script>
