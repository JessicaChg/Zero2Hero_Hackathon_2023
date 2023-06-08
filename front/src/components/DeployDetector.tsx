import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState, type FC, useMemo } from 'react'
import useSWR from 'swr'
import {
  ZeroAddress,
  useFollowRegisterContract,
} from '../hooks/useFollowRegisterContract'
import { useAccount } from 'wagmi'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import { useCreateBucket, useGetBucket } from '../hooks/greenfield'
import { generateShareBucketKey } from '../config/greenfield'
import { fnNone } from '../utils/fn'

export const DeployDetector: FC<{
  isDisabled?: boolean
}> = ({ isDisabled }) => {
  const { address } = useAccount()
  const createBucket = useCreateBucket()
  const getBucketInfo = useGetBucket()

  const { getOwnedFollowContract, deployFollowContract } =
    useFollowRegisterContract()
  const toast = useToast()
  const { data: ownedFollowContractAddress, mutate } = useSWR(
    [`getOwnedFollowContract`, address],
    async () => {
      if (!address) return null
      return getOwnedFollowContract(address).catch((err) => {
        console.error('getOwnedFollowContract: ', err)
        return ZeroAddress
      })
    },
    {
      revalidateOnFocus: false,
    }
  )
  const { data: bucketInfo } = useSWR(
    [`getBucketInfo`, address],
    async () => {
      if (!address) return
      const bucketName = generateShareBucketKey(address)
      return getBucketInfo(bucketName)
    },
    {
      revalidateOnFocus: false,
    }
  )

  const [isDeploying, setIsDeploying] = useState(false)

  const deploy = async () => {
    if (!address) return
    if (isDeploying) return
    setIsDeploying(true)
    try {
      const tx = (await deployFollowContract(address)) as TransactionResponse
      const r = await tx.wait()
      await mutate()
      console.log(r)
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Deploy Failed',
        description: e?.message || e,
        status: 'error',
      })
    }
    setIsDeploying(false)
  }

  const isOpen = useMemo(() => {
    if (!address) return false
    if (isDisabled) return false
    if (ownedFollowContractAddress === ZeroAddress) return true
    if (!bucketInfo) return true
    return false
  }, [address, bucketInfo, isDisabled, ownedFollowContractAddress])

  const [isCreatingBucket, setIsCreatingBucket] = useState(false)
  const onCreateBucket = async () => {
    if (!address) return
    if (isCreatingBucket) return
    setIsCreatingBucket(true)
    const bucketName = generateShareBucketKey(address)
    await createBucket(bucketName)
    setIsCreatingBucket(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={fnNone} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalBody>
          <VStack spacing="4">
            <VStack spacing="2">
              <Text>1. Create personal storage</Text>
              <Button
                w="full"
                onClick={onCreateBucket}
                isLoading={isCreatingBucket}
                isDisabled={!!bucketInfo}
              >
                Create
              </Button>
            </VStack>

            <VStack spacing="2">
              <Text>2. Deploy follow contract</Text>
              <Button
                w="full"
                onClick={deploy}
                isLoading={isDeploying}
                isDisabled={ownedFollowContractAddress !== ZeroAddress}
              >
                Deploy
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
