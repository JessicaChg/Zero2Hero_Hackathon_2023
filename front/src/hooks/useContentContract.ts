import { useMemo } from 'react'
import { useProvider } from './useProvider'
import { ethers } from 'ethers'
import { CONTENT_CONTRACT_ADDRESS } from '../config/env'
import ContentJSON from '../assets/abi/Content.json'

export function useContentContract() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  const contract = useMemo(
    () =>
      signer
        ? new ethers.Contract(CONTENT_CONTRACT_ADDRESS, ContentJSON, signer)
        : null,
    [signer]
  )

  return useMemo(
    () => ({
      contract,
    }),
    [contract]
  )
}
