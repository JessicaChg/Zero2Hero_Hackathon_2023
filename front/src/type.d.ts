export {}

declare global {
  interface Window {
    ic: any
    BinanceChain: any
    ethereum: any
    relationOne: any
    Buffer: any
    solana: any
    okexchain: any
    LitJsSdk_litNodeClient: any
  }

  interface UserInfo {
    wallet: string
    address: string
    token: string
    chainId: string

    relationAuthorization: string
    name: string
    avatar: string
    relationId: string

    bindedDomain: string

    phase?: 'pre-mint' | 'public-mint'
    preminted: boolean
    premintStartLeft?: number

    premintedSum?: any

    mintedList: string[]

    referralRewards: any
  }

  interface SBT {
    imgUrl: string
    imgH: number
    image_url: string
    chainId: string
    chainName: string
    hasWhiteList: string
    chain_name: string
    semanticSBT: string
    verifyContract: string
    creator: string
    name: string
    description: string

    minted: boolean

    projectName: string
    status: string
    type: string
    updateTime: string
  }

  type MySBT = {
    contractAddress: string
    mintTime: number
    ownerAddress: string
    rdfData: string
    tokenId: string
    transactionHash: string

    subject?: string
    predicate?: string
    object?: string

    imgH: number
    image_url: string
    imageUrl: string
    creator: string
    name: string
    description: string
  }
}

// 自定义globalProperties类型申明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $getImgUrl: (path: string) => string
  }
}
