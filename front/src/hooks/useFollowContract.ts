import { useCallback, useMemo } from 'react'
import FollowJSON from '../assets/abi/Follow.json'
import { useProvider } from './useProvider'
import { ethers } from 'ethers'

export function useCreateFollowContract() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  return useCallback(
    (contractAddress: string) =>
      new ethers.Contract(contractAddress, FollowJSON, signer),
    [signer]
  )
}

export function useFollowContract(contractAddress?: string) {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  const contract = useMemo(
    () =>
      contractAddress
        ? new ethers.Contract(contractAddress, FollowJSON, signer)
        : null,
    [contractAddress, signer]
  )
  return useMemo(
    () => ({
      contract,
    }),
    [contract]
  )
}
