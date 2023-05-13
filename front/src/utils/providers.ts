import {
  mumbaiChain,
  polygonChain,
  platonTest2Chain,
  platonChain,
  moonbeamChain,
  moonbeamTestChain,
  goerliChain,
  ethChain,
  bscChain
} from '@/constants/chains'
import useUserStore from '@/store/user'
import { ethers, providers } from 'ethers'
// import WalletConnectProvider from '@walletconnect/web3-provider'
import whiteListAbi from '@/abi/activity'
import sbtAbi from '@/abi/semantic'
import { updateModal } from '@/utils/wallet/hashkeyme'
import { contractMap } from '@/constants/contract'

const mode = import.meta.env.MODE
const isProd = mode === 'production'
const preWhiteListContract = isProd
  ? '0x6ecA3EA9Ab2DDF67eE9e63f38f1b885bCb78022e'
  : '0x18485c50219482355488e7af390eb3fd6a00e175'
const semanticContract = isProd
  ? '0xAeA3A3a38ee4A599Ea7d8c01C0Df08eDa74C27C3'
  : '0x771a76d41c0dafc8e3fd633d872b9b11231152ec'

// 默认链
export const defaultChain =
  mode === 'production' ? polygonChain : mumbaiChain

export const registerChain =
  mode === 'development' ? mumbaiChain :
  mode === 'production' ? bscChain : goerliChain
  // import.meta.env.MODE === 'production' ? polygonChain : mumbaiChain
const chainMap: any = {
  1: ethChain,
  5: goerliChain,
  56: bscChain,
  
  137: polygonChain,
  80001: mumbaiChain,

  210425: platonChain,
  2206132: platonTest2Chain,

  1284: moonbeamChain,
  1287: moonbeamTestChain
}

// 获取钱包对应的provider
export const getWalletProvider = async (wallet?: string) => {
  switch (wallet) {
    case 'binance':
      return window.BinanceChain
    case 'hashkeyme':
    case 'ok':
      return window.okexchain

    // default connect to metamask
    default:
      return window.ethereum
  }
}

export const getCurChain = async () => {
  const user = useUserStore()
  const wallet = user.wallet || ''
  if (wallet === 'hashkeyme') {
    updateModal()
  }

  const walletProvider = await getWalletProvider(user.wallet)
  const provider = new providers.Web3Provider(walletProvider)

  const curChainId = parseInt(await provider.send('eth_chainId', []))

  return curChainId
}

export const checkChain = async (
  targetChainId: string | number
): Promise<boolean> => {
  const user = useUserStore()
  console.log('checkChain')
  if (user.wallet === 'hashkeyme') {
    updateModal()
  }

  const walletProvider = await getWalletProvider(user.wallet)
  const provider = new providers.Web3Provider(walletProvider)

  const curChainId = parseInt(await provider.send('eth_chainId', []))

  const tarChainId = parseInt(targetChainId + '')
  const chain = chainMap[tarChainId]
  console.log(
    '%c [ chain ]-73',
    'font-size:13px; background:pink; color:#bf2c9f;',
    chain
  )
  const chainName = chain.chainName
  if (curChainId === tarChainId) return true

  walletProvider.on('chainChanged', (changedChain: any) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    // window.location.reload()
  })

  if (['hashkeyme', 'walletConnect'].includes(user.wallet)) {
    ElMessage.info(`Please switch to the ${chainName} network`)
    return false
  }

  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: chain.chainId }
    ])
    return true
  } catch (switchError: any) {
    // User rejected
    if (switchError.code === 4001) {
      return false
    }
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.send('wallet_addEthereumChain', [chain])
        // 添加成了会走到这里，添加了没有切过来也会
        const curChainId = parseInt(await provider.send('eth_chainId', []))
        return curChainId === parseInt(targetChainId + '')
      } catch (addError) {
        // handle "add" error
        return false
      }
    }
    // handle other "switch" errors
    return false
  }
}

export const getContractInstance = async (
  targetChainId: string,
  contractAddress: string,
  abi: any
) => {
  const user = useUserStore()
  if (!targetChainId) throw { code: -1, message: 'chainId is required' }

  const check = await checkChain(targetChainId)
  
  if (check === false) {
    const chain = chainMap[parseInt(targetChainId)]
    const chainName = chain.chainName
    throw { code: -1, desc: `Please switch to the ${chainName} network` }
  }

  const walletProvider = await getWalletProvider(user.wallet)
  const provider = new providers.Web3Provider(walletProvider)

  const accounts = await walletProvider.enable()

  const signer = provider.getSigner(accounts[0])

  let contract = new ethers.Contract(contractAddress, abi, signer)

  return contract
}

export const getChainRpcUrl = async (targetChainId = defaultChain.chainId) => {
  return chainMap[+targetChainId]?.rpcUrls[0]
}

export const getChainRpcProvider = async (targetChainId: string) => {
  if (!targetChainId) throw { code: -1, message: 'chainId is required' }
  const rpc = await getChainRpcUrl(targetChainId)
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  return provider
}

export const getRpcContract = async (
  targetChainId: string,
  contractAddress: string,
  abi: any
) => {
  if (!targetChainId) throw { code: -1, message: 'chainId is required' }
  const rpc = await getChainRpcUrl(targetChainId)
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  let contract = new ethers.Contract(contractAddress, abi, provider)
  return contract
}

export const checkIsUserInWhiteList = async () => {
  const user = useUserStore()
  if (!user.address) return false
  const chainId = defaultChain.chainId
  let rpcProvider = await getChainRpcProvider(chainId)
  let contract = new ethers.Contract(
    preWhiteListContract,
    whiteListAbi,
    rpcProvider
  )
  return await contract.whiteList(user.address)
}

export const checkIsUserMintedWhitelist = async () => {
  const user = useUserStore()
  if (!user.address) return false
  const chainId = defaultChain.chainId
  let rpcProvider = await getChainRpcProvider(chainId)
  let contract = new ethers.Contract(semanticContract, sbtAbi, rpcProvider)
  const count = await contract.balanceOf(user.address)
  return +count > 0
}

export const getWhitelistMintedCount = async () => {
  const chainId = defaultChain.chainId
  let rpcProvider = await getChainRpcProvider(chainId)
  let contract = new ethers.Contract(semanticContract, sbtAbi, rpcProvider)
  const count = await contract.getMinted()
  return +count
}

export const claimSbt = async () => {
  const contract = await getContractInstance(
    defaultChain.chainId,
    preWhiteListContract,
    whiteListAbi
  )
  const res = await contract.mint()
  const wait = await res.wait()
}
