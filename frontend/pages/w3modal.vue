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
        <v-btn class="primary" :disabled="!wallet_address">Disconnect</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="primary" :disabled="!!wallet_address" @click="initModal"
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
  mounted() {},
  methods: {
    // Web3 Modal init
    async initModal() {
      if (this.web3ModalInstance == null) {
        this.web3ModalInstance = new Web3Modal({
          network: 'rinkeby',
          theme: 'dark',
          cacheProvider: true,
          disableInjectedProvider: false,
          providerOptions: this.providerOptions,
        })
      }
      try {
        const provider = await this.web3ModalInstance.connect()
        const web3 = new Web3(provider)
        console.log(web3)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
