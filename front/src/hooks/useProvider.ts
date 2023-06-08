import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useNetwork } from 'wagmi'

export function useProvider() {
  const network = useNetwork()
  return useMemo(() => {
    const ethereum = (window as any).ethereum
    return ethereum
      ? new ethers.providers.Web3Provider(
          ethereum,
          network.chain
            ? {
                name: network.chain?.name,
                chainId: network.chain?.id,
              }
            : undefined
        )
      : null
  }, [network.chain])
}
