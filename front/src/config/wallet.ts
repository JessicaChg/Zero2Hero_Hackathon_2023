import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { Chain, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { bscTestnet } from 'wagmi/chains'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

// const GRPC_URL = 'https://gnfd-testnet-fullnode-tendermint-us.nodereal.io'
const GRPC_URL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'

export const greenfieldTestnet: Chain = {
  id: 5600,
  name: 'Greenfield Testnet',
  network: 'greenfield-testnet',
  rpcUrls: {
    default: {
      http: [GRPC_URL],
    },
    public: {
      http: [GRPC_URL],
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  testnet: true,
}

const { chains, publicClient } = configureChains(
  [
    bscTestnet,
    // , polygonMumbai
  ],
  [publicProvider()]
)

const walletOptions = {
  chains,
  appName: 'Relation Social',
}

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet(walletOptions)],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains, wagmiConfig }
