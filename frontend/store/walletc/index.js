export const state = () => ({
  connector: null,
  connected: false,
  bridge: 'https://bridge.walletconnect.org',
  networkId: 4,
  chainId: 4,
})

export const mutations = {
  SET_CONNECTOR(state, payload) {
    state.connector = payload
  },
  SET_CHAIN_ID(state, payload) {
    state.chainId = payload
  },
  SET_NETWORK_ID(state, payload) {
    state.chainId = payload
  },
}

export const actions = {}

export const getters = {
  connector: (state) => state.connector,
  connected: (state) => state.connected,
  bridge: (state) => state.bridge,
  networkId: (state) => state.networkId,
  chainId: (state) => state.chainId,
}
