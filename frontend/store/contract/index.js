export const state = () => ({
  HelloDApp_contract: '0x4389d68d757d43e3735A27e58E8b21d754257b19',
  HelloDApp_abi: [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_msg',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: 'oldString',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'newString',
          type: 'string',
        },
      ],
      name: 'Updatedmessage',
      type: 'event',
    },
    {
      inputs: [],
      name: 'message',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'readMessage',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_newMsg',
          type: 'string',
        },
      ],
      name: 'updateMessage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
})

export const mutations = {}

export const actions = {}

export const getters = {
  HelloDApp_contract: (state) => state.HelloDApp_contract,
  HelloDApp_abi: (state) => state.HelloDApp_abi,
}
