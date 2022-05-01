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
            Current message: <v-icon>mdi-refresh</v-icon>
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
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

export default {
  data: () => ({
    // modal
    web3ModalInstance: null,
    web3Instance: null,
    providerInstance: null,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.infuraId,
          // qrcode: false,
          // qrcodeModalOptions: {
          //     mobileLinks: [
          //         'rainbow',
          //         'metamask',
          //         'argent',
          //         'trust',
          //         'imtoken',
          //         'pillar',
          //     ],
          // },
        },
      },
    },
    // modal
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
    // this.loadConnection()
    this.loadCachedConnection()
  },
  methods: {
    // Web3 Modal init
    initModal() {
      if (!this.web3ModalInstance) {
        this.web3ModalInstance = new Web3Modal({
          network: 'rinkeby',
          theme: 'dark',
          cacheProvider: true,
          disableInjectedProvider: false,
          providerOptions: this.providerOptions,
        })
      }
    },
    async loadCachedConnection() {
      this.initModal()
      if (this.web3ModalInstance.cachedProvider) {
        try {
          if (this.web3ModalInstance.cachedProvider === 'walletconnect') {
            await this.connectWebModal('walletconnect')
          } else {
            await this.connectWebModal()
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    initWeb3(provider) {
      const web3 = new Web3(provider)
      return web3
    },

    async connectWebModal(usingProvider) {
      this.initModal()
      try {
        if (usingProvider) {
          this.providerInstance = await this.web3ModalInstance.connectTo(
            usingProvider
          )
        } else {
          this.providerInstance = await this.web3ModalInstance.connect()
        }
        // Subscribe to provider events
        this.SubscribeProvider(this.providerInstance)

        this.web3Instance = this.initWeb3(this.providerInstance)
        // getAccounts works for metamask & wallet connect
        const accounts = await this.web3Instance.eth.getAccounts()
        // console.log('getAccounts', accounts)
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
      } catch (error) {
        console.log(error)
      }
    },

    async disconnect() {
      // test if wallet is connected
      // this.initModal()
      if (!this.web3ModalInstance) return
      console.log(this.web3ModalInstance.cachedProvider)
      try {
        // currectly disconnect wallet connect
        if (this.web3ModalInstance.cachedProvider === 'walletconnect') {
          await this.providerInstance.disconnect()
        }
        await this.web3ModalInstance.clearCachedProvider()
      } catch (error) {
        console.log(error)
      }
      // return var to init state
      this.wallet_addresses = []
      this.wallet_address = ''
      this.web3ModalInstance = null
      this.providerInstance = null
      this.web3Instance = null
      localStorage.removeItem('walletconnect')
    },
    SubscribeProvider(provider) {
      provider.on('accountsChanged', (accounts) => {
        // console.log('accountsChanged:', accounts)
        if (accounts.length > 0) {
          this.wallet_address = accounts[0]
        } else {
          this.wallet_address = ''
        }
        this.wallet_addresses = accounts
      })
      // Subscribe to chainId change
      provider.on('chainChanged', (chainId) => {
        // console.log('chainChanged: ', chainId)
      })

      // Subscribe to provider connection
      provider.on('connect', (info) => {
        console.log('connect: ', info)
      })
      // Subscribe to session disconnection
      provider.on('disconnect', (code, reason) => {
        // console.log('disconnect')
        // console.log(code, reason)

        this.disconnect().then().catch(console.error)
      })
    },

    async loadConnection() {
      const cachedProviderName = JSON.parse(
        localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
      )
      console.log(cachedProviderName)
      // walletconnect
      if (cachedProviderName === 'walletconnect') {
        const walletconnect = JSON.parse(localStorage.getItem('walletconnect'))
        console.log(walletconnect)
        if (walletconnect.connected) {
          await this.connectWebModal('walletconnect')
        } else {
          localStorage.removeItem('walletconnect')
        }

        // desktop metamask
      } else if (cachedProviderName === 'injected') {
        if (this.wallet_address === '') {
          await this.connectWebModal()
        }
      } else {
        // set to null so we can initialize
        this.web3ModalInstance = null
      }
    },
  },
}
</script>
