import Web3 from 'web3'

export default ({ store }, inject) => {
  let web3 = null
  if (!process.client) return // don't run on serverside
  web3 =
    window.ethereum && window.ethereum.isMetaMask
      ? new Web3(window.ethereum)
      : null
  inject('web3', web3)
  // Inject the $web3 instance into the context object in Nuxt
  if (!web3) return
  const contract = new web3.eth.Contract(
    store.state.contract.HelloDApp_abi, // コントラクトのコンパイル後の設定ファイル
    store.state.contract.HelloDApp_contract // ネットワークIDごとに保存されているコントラクトのアドレスを読み込む
  )
  // Inject the $web3 instance into the context object in Nuxt
  inject('HelloDApp_contract', contract)
}
