import { useCallback, useMemo } from 'react'
import DAO_JSON from '../assets/abi/Dao.json'
import { useProvider } from './useProvider'
import { ethers } from 'ethers'

export function useCreateDAOContract() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  return useCallback(
    (contractAddress: string) =>
      new ethers.Contract(contractAddress, DAO_JSON, signer),
    [signer]
  )
}

export function useDAOContract(contractAddress?: string) {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  const contract = useMemo(
    () =>
      contractAddress
        ? new ethers.Contract(contractAddress, DAO_JSON, signer)
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
