export const state = () => ({
    wallet_addresses: [],
    wallet_address: '',
    owner_address: '',
    provider: null,
    library: null,
    network: null,
})

export const mutations = {
    SET_WALLET(state, payload) {
        state.wallet_address = payload
    },
    SET_WALLET_ADDRESSES(state, payload) {
        state.wallet_addresses = payload
    },
    SET_OWNER_ADDRESS(state, payload) {
        state.owner_address = payload
    },
    SET_PROVIDER(state, payload) {
        state.provider = payload
    },
    SET_LIBRARY(state, payload) {
        state.library = payload
    },
    SET_NETWORK(state, payload) {
        state.network = payload
    },
}

export const actions = {}

export const getters = {
    wallet_addresses: (state) => state.wallet_addresses,
    wallet_address: (state) => state.wallet_address,
    owner_address: (state) => state.owner_address,
    provider: (state) => state.provider,
    library: (state) => state.library,
    network: (state) => state.network,
}
