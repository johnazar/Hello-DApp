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
        <v-btn class="primary" :disabled="!wallet_address" @click="disconnect"
          >Disconnect</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn class="primary" :disabled="!!wallet_address" @click="connect"
          >Connect Walletconnect (StandAlone)
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
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

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
        if (!walletconnect.connected) {
          localStorage.removeItem('walletconnect')
          return
        }
        const { accounts } = walletconnect
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
        this.connector = walletconnect
        const connector = new WalletConnect({
          bridge: this.bridge,
          qrcodeModal: QRCodeModal,
        })
        this.subscribeToEvents(connector)
        // console.log(walletconnect)
      } else {
        this.connector = null
        console.log('not connected')
      }
    },
    async connect() {
      // if (this.connector) return
      // create new connector
      const connector = new WalletConnect({
        bridge: this.bridge,
        qrcodeModal: QRCodeModal,
      })
      // check if already connected
      if (!connector.connected) {
        // create new session
        this.connector = await connector.createSession()
        this.subscribeToEvents(connector)
      }
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
      const connector = new WalletConnect({
        bridge: this.bridge,
        qrcodeModal: QRCodeModal,
      })
      if (!connector.connected) return
      this.wallet_addresses = []
      this.wallet_address = ''
      connector.killSession()
      this.connector = null
      localStorage.removeItem('walletconnect')
    },

    getMessage() {
      // not working
      const connector = new WalletConnect({
        bridge: this.bridge,
        qrcodeModal: QRCodeModal,
      })
      if (!connector.connected) return
      // Draft Custom Request
      const customRequest = {
        id: 1337,
        jsonrpc: '2.0',
        method: 'readMessage',
        params: [
          {
            from: '0x4389d68d757d43e3735A27e58E8b21d754257b19',
            to: '0x4389d68d757d43e3735A27e58E8b21d754257b19',
            data: '0x',
            gasPrice: '0x02540be400',
            gas: '0x9c40',
            value: '0x00',
            nonce: '0x0114',
          },
        ],
      }

      // Send Custom Request
      connector
        .sendCustomRequest(customRequest)
        .then((result) => {
          // Returns request result
          console.log(result)
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error)
        })
      console.log('getMessage')
    },
    updateMessage() {
      // code
    },
    validate() {
      this.$refs.form.validate()
    },
  },
}
</script>
