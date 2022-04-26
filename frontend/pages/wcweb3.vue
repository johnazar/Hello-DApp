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
          @click="disconnectProvider"
          >Disconnect</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn class="primary" :disabled="!!wallet_address" @click="connectweb3"
          >Connect Walletconnect (Provider)
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Second card -->
    <v-card class="mx-auto mt-4" max-width="500">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="mb-1">
            Current message: <v-icon @click="getMessage">mdi-refresh</v-icon>
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
        <v-btn class="primary" :disabled="!allowUpdate" @click="updateMessage">
          Update message</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  rpc: {
    4: 'https://rinkeby.arbitrum.io/rpc/',
  },
})
//  Create Web3 instance
const web3 = new Web3(provider)
export default {
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
    this.loadConnection()
  },
  methods: {
    loadConnection() {
      // Check local storage
      if (window.localStorage.walletconnect) {
        const walletconnect = JSON.parse(localStorage.getItem('walletconnect'))
        const { accounts } = walletconnect
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
        this.connector = walletconnect
        this.subscribeToEventsProvider(provider)
      } else {
        console.log('⚡', 'Not connected')
      }
    },

    async connectweb3() {
      //  Create WalletConnect Provider
      // const provider = new WalletConnectProvider({
      //   rpc: {
      //     4: 'https://rinkeby.arbitrum.io/rpc/',
      //     // ...
      //   },
      // })
      try {
        //  Enable session (triggers QR Code modal)
        await provider.enable()
        this.subscribeToEventsProvider(provider)

        //  Get Accounts
        const accounts = await web3.eth.getAccounts()
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]

        // //  Get Chain Id
        const chainId = await web3.eth.getChainId()
        this.chainId = chainId
        console.log('⚡', chainId)

        // //  Get Network Id
        const networkId = await web3.eth.net.getId()
        this.network_id = networkId
        console.log('⚡', networkId)

        // Contract not working
        // const contract = new web3.eth.Contract(
        //   this.$store.getters['contract/HelloDApp_abi'],
        //   this.$store.getters['contract/HelloDApp_contract']
        // )

        // contract.methods
        //   .readMessage()
        //   .call()
        //   .then(console.log)
        //   .catch(console.error())
      } catch (error) {
        console.error(error)
      }
    },
    subscribeToEventsProvider(provider) {
      // Subscribe to accounts change
      provider.on('accountsChanged', (accounts) => {
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
        console.log('⚡', 'accountsChanged')
      })
      provider.on('disconnect', (code, reason) => {
        console.log(code, reason)
        this.wallet_addresses = []
        this.wallet_address = ''
        // Delete connector from localstorage and update wallet_address
        console.log('⚡', 'disconnect')
      })
    },
    async disconnectProvider() {
      this.wallet_addresses = []
      this.wallet_address = ''
      try {
        await provider.disconnect()
      } catch (error) {}

      localStorage.removeItem('walletconnect')
    },

    getMessage() {
      console.log('⚡', 'getMessage')
    },
    updateMessage() {
      console.log('⚡', 'updateMessage')
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
