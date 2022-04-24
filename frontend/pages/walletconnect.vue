<template>
  <div>
    <v-card class="mx-auto" max-width="450">
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
          <v-list-item-subtitle>networkID: {{ chainId }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" :disabled="!wallet_address" @click="disconnect"
          >Disconnect</v-btn
        >
        <v-btn class="primary" :disabled="!!wallet_address" @click="connect"
          >Connect using Walletconnect</v-btn
        >
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
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
// import Web3 from 'web3'

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
        console.log(walletconnect)
      } else {
        console.log('not connected')
      }
    },
    async connect() {
      // create new connector
      const connector = new WalletConnect({
        bridge: this.bridge,
        qrcodeModal: QRCodeModal,
      })
      // this.connector = connector
      // check if already connected
      if (!connector.connected) {
        // create new session
        this.connector = await connector.createSession()
        this.subscribeToEvents(connector)
      }

      // subscribe to events
      // await this.subscribeToEvents(connector)
    },
    subscribeToEvents(connector) {
      connector.on('session_update', (error, payload) => {
        if (error) {
          throw error
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0]
        this.chainId = chainId
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
        console.log('session_update')
      })
      connector.on('connect', (error, payload) => {
        if (error) {
          throw error
        }

        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0]
        this.chainId = chainId
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
        console.log('connect')
      })
      connector.on('disconnect', (error, payload) => {
        if (error) {
          throw error
        }

        // Delete connector from localstorage and update wallet_address
        this.disconnect()
        console.log('disconnect')
      })
    },

    disconnect() {
      this.wallet_addresses = []
      this.wallet_address = ''
      const connector = new WalletConnect({
        bridge: this.bridge,
        qrcodeModal: QRCodeModal,
      })
      if (connector.connected) {
        connector.killSession()
      }
      this.connector = null
      localStorage.removeItem('walletconnect')
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
        .then((this.newMessage = ''))
        .catch(console.error())
    },
    validate() {
      this.$refs.form.validate()
    },
    async isEthereumSupported() {
      if (this.$web3) {
        try {
          // get account address if connected
          await this.$web3.eth
            .getAccounts()
            .then((v) => (this.wallet_addresses = v))
          this.wallet_address = this.wallet_addresses[0]
          this.$web3.eth.net.getId().then((v) => (this.network = v))

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
  },
}
</script>
