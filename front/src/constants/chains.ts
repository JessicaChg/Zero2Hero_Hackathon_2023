// 链节点信息

export const bscChain = {
  chainId: '0x38',
  chainName: 'Binance Smart Chain Mainnet',
  rpcUrls: ['https://bsc-dataseed.binance.org'] /* ... */,
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  }
}

export const goerliChain = {
  chainId: '0x5',
  chainName: 'Goerli',
  rpcUrls: ['https://rpc.ankr.com/eth_goerli'] /* ... */,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
}
export const ethChain = {
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  rpcUrls: ['https://eth.llamarpc.com'] /* ... */,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  }
}

export const polygonChain = {
  chainId: '0x89',
  chainName: 'Polygon Mainnet',
  rpcUrls: ['https://polygon-rpc.com'] /* ... */,
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  }
}

export const mumbaiChain = {
  chainId: '0x13881',
  chainName: 'Mumbai',
  rpcUrls: ['https://matic-mumbai.chainstacklabs.com'] /* ... */,
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  }
}

// platon mainnet
export const platonChain = {
  chainId: '0x335f9',
  chainName: 'PlatON Mainnet',
  rpcUrls: ['https://openapi2.platon.network/rpc'] /* ... */,
  nativeCurrency: {
    name: 'lat',
    symbol: 'lat',
    decimals: 18
  }
}

// platon 测试网
export const platonTest2Chain = {
  chainId: '0x21a9b4',
  chainName: 'PlatON Dev Testnet2',
  rpcUrls: ['https://devnet2openapi.platon.network/rpc'] /* ... */,
  nativeCurrency: {
    name: 'lat',
    symbol: 'lat',
    decimals: 18
  }
}

// Moonbeam
export const moonbeamChain = {
  chainId: '0x504',
  chainName: 'Moonbeam',
  rpcUrls: ['https://rpc.api.moonbeam.network'] /* ... */,
  nativeCurrency: {
    name: 'GLMR',
    symbol: 'GLMR',
    decimals: 18
  }
}

// Moonbase Alpha
export const moonbeamTestChain = {
  chainId: '0x507',
  chainName: 'Moonbase Alpha',
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'] /* ... */,
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18
  }
}

export const chainNameIdMap: any = {
  eth: 1,
  goerli: 5,

  polygon: 137,
  mumbai: 80001,

  platon: 210425,
  platon_dev: 2206132,

  moonbeam: 1284,
  moonbase: 1287
}

export const chainIdNameMap: any = {
  1: 'eth',
  5: 'goerli',

  137: 'polygon',
  80001: 'mumbai',

  210425: 'platon',
  2206132: 'platon_dev',

  1284: 'moonbeam',
  1287: 'moonbase'
}
