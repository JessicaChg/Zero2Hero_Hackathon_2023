import { DAO_REGISTER_CONTRACT_ADDRESS } from '../config/env'
import { useMemo } from 'react'
import { useProvider } from './useProvider'
import { ethers } from 'ethers'
import DAORegisterJSON from '../assets/abi/DaoRegister.json'

export function useDAORegisterContract() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  const contract = useMemo(
    () =>
      signer
        ? new ethers.Contract(
            DAO_REGISTER_CONTRACT_ADDRESS,
            DAORegisterJSON,
            signer
          )
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
