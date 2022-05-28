import Web3 from 'web3'

export default ({ store }, inject) => {
  let w3 = null
  w3 = new Web3(process.env.infuraIdDapp)
  const DAppContract = new w3.eth.Contract(
    store.state.contract.HelloDApp_abi,
    store.state.contract.HelloDApp_contract
  )
  inject('DAppContract', DAppContract)
}
