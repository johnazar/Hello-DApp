import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

export default {
  data: () => ({
    // Web3 Modal
    web3ModalInstance: null,
    web3Instance: null,
    providerInstance: null,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.infuraIdDapp,
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
    // Web3 Modal
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
  },
  async mounted() {},
  methods: {
    // these methods will be accessed globally
    // Web3 init
    initWeb3(provider) {
      const web3 = new Web3(provider)
      return web3
    },
    // Web3 Modal init
    initModal() {
      if (!this.web3ModalInstance) {
        this.web3ModalInstance = new Web3Modal({
          network: 'rinkeby',
          // theme: 'dark',
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
      } else {
        console.log('Nothing Cached')
      }
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
        const accounts = await this.web3Instance.eth.getAccounts()
        // const accounts = await this.web3Instance.eth.requestAccounts() // correct approach
        // console.log('getAccounts', accounts)
        this.wallet_addresses = accounts
        this.wallet_address = accounts[0]
      } catch (error) {
        console.log(error)
      }
    },

    async disconnectWebModal() {
      // test if wallet is connected
      // this.initModal()
      if (!this.web3ModalInstance) return
      console.log(this.web3ModalInstance.cachedProvider)
      try {
        // currectly disconnect wallet connect
        if (this.web3ModalInstance.cachedProvider === 'walletconnect') {
          await this.providerInstance.disconnect()
        } else if (this.web3ModalInstance.cachedProvider === 'injected') {
          // Disconnect metamask somehow -\()/-
          // await window.ethereum.request({
          //   method: 'wallet_requestPermissions',
          //   params: [],
          // })
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
        this.disconnectWebModal().then().catch(console.error)
      })
    },
  },
}
