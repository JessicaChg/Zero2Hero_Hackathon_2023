import { FOLLOW_REGISTER_CONTRACT_ADDRESS } from './../config/env'
import { useCallback, useMemo } from 'react'
import { useProvider } from './useProvider'
import FollowRegisterJSON from '../assets/abi/FollowRegister.json'
import { ethers } from 'ethers'

export const ZeroAddress = '0x0000000000000000000000000000000000000000'

export function useFollowRegisterContract() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  const contract = useMemo(
    () =>
      signer
        ? new ethers.Contract(
            FOLLOW_REGISTER_CONTRACT_ADDRESS,
            FollowRegisterJSON,
            signer
          )
        : null,
    [signer]
  )
  const getOwnedFollowContract = useCallback(
    async (address: string) => {
      if (!contract) return
      return contract.ownedFollowContract(address) as string
    },
    [contract]
  )
  const deployFollowContract = useCallback(
    async (address: string) => {
      if (!contract) return
      return contract.deployFollowContract(address)
    },
    [contract]
  )
  const totalSupply = useCallback(() => {
    if (!contract) return
    return contract.totalSupply()
  }, [contract])

  return {
    contract,
    getOwnedFollowContract,
    deployFollowContract,
    totalSupply,
  }
}
