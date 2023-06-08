import { useNetwork, useSwitchNetwork } from 'wagmi'
import { greenfieldTestnet } from '../config/wallet'

export function useTemporaryGreenFieldNetwork() {
  const network = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  return async (fn: () => void | Promise<void>) => {
    const id = network.chain?.id
    if (greenfieldTestnet.id !== id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await switchNetworkAsync(greenfieldTestnet.id)
    }
    await fn()
    if (greenfieldTestnet.id !== id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await switchNetworkAsync(id)
    }
  }
}
