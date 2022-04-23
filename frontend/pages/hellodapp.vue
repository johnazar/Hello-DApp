<template>
  <div>
    <v-card
      class="mx-auto"
      :class="ethereumSupported ? 'green lighten-3' : 'red lighten-3'"
      max-width="450"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-1">
            {{
              ethereumSupported
                ? 'Ethereum is Supported'
                : 'Ethereum is not Supported'
            }}
          </v-list-item-title>

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
          <v-list-item-subtitle>networkID: {{ network }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions v-if="ethereumSupported">
        <v-spacer></v-spacer>
        <v-btn class="primary" :disabled="!wallet_address" @click="disconnect"
          >Disconnect</v-btn
        >
        <v-btn class="primary" :disabled="!!wallet_address" @click="connect"
          >Connecting to MetaMask</v-btn
        >
      </v-card-actions>
      <v-card-actions v-else>
        Non-Ethereum browser detected. You should consider trying MetaMask!
      </v-card-actions>
    </v-card>
    <!-- Second card -->
    <v-card class="mx-auto mt-4" max-width="450">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-1">
            Current message: <v-icon @click="getMessage">mdi-refresh</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>{{ message }}</v-list-item-subtitle>
          <v-list-item-title class="mb-1"> New message: </v-list-item-title>
          <v-text-field v-model="newMessage" dense> </v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="primary"
          :disabled="!wallet_address"
          @click="updateMessage"
        >
          Update message</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    ethereumSupported: false,
    message: '',
    newMessage: '',
  }),
  computed: {
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
    network: {
      get() {
        return this.$store.getters['wallet/network']
      },
      set(v) {
        return this.$store.commit('wallet/SET_NETWORK', v)
      },
    },
  },
  async mounted() {
    this.ethereumSupported = await this.isEthereumSupported()
    if (this.$web3 !== null) {
      this.getMessage()
    }
  },
  methods: {
    async isEthereumSupported() {
      if (this.$web3) {
        try {
          // get account address if connected
          await this.$web3.eth
            .getAccounts()
            .then((v) => (this.wallet_addresses = v))
          this.wallet_address = this.wallet_addresses[0]
          this.$web3.eth.net.getId().then((v) => (this.network = v))
          // this.$web3.eth.subscribe(
          //   'logs',
          //   {
          //     removed: true,
          //   },
          //   (error, result) => console.log(error, result)
          // )

          return true
        } catch (error) {
          console.log(error)
          return false
        }
      } else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    },
    connect() {
      if (this.isEthereumSupported) {
        // Will Start the metamask extension
        this.wallet_addresses = this.$web3.eth.requestAccounts().then((v) => {
          this.wallet_addresses = v
          this.wallet_address = v[0]
        })
        this.$web3.eth.net.getId().then((v) => (this.network = v))
      }
    },
    disconnect() {
      this.wallet_addresses = []
      this.wallet_address = ''
      console.log('to do')
      // this.$web3.eth.clearSubscriptions()
    },

    getMessage() {
      this.$HelloDApp_contract.methods
        .readMessage()
        .call()
        .then((v) => (this.message = v))
        .catch(console.error())
    },
    updateMessage() {
      this.$HelloDApp_contract.methods
        .updateMessage(this.newMessage)
        .send({
          from: this.wallet_address,
        })
        .then(console.log())
        .catch(console.error())
    },
  },
}
</script>
