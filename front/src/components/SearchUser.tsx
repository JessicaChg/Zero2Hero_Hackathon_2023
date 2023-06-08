import {
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useFollowRegisterContract } from '../hooks/useFollowRegisterContract'
import { isPrimitiveEthAddress } from '../utils/address'
import useSWR from 'swr'
import { useFollowContract } from '../hooks/useFollowContract'
import { useAccount } from 'wagmi'

export const SearchUser: FC = () => {
  const { address } = useAccount()
  const [searchUserKey, setSearchUserKey] = useState('')
  const { getOwnedFollowContract } = useFollowRegisterContract()
  const {
    data: contractAddress,
    isLoading,
    error,
  } = useSWR(['getOwnedFollowContract', searchUserKey], async () => {
    if (!isPrimitiveEthAddress(searchUserKey)) return
    return getOwnedFollowContract(searchUserKey)
  })
  const { contract: followContract } = useFollowContract(contractAddress)
  const {
    data: isFollowing,
    isLoading: isGettingFollowingStatus,
    mutate,
  } = useSWR(
    ['followContract?.isFollowing', contractAddress],
    async () => {
      if (!followContract) return false
      return followContract.isFollowing(address).catch((e: any) => {
        console.error(e)
        return false
      })
    },
    {
      revalidateOnFocus: false,
    }
  )
  const toast = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error?.message || error,
        status: 'error',
      })
    }
  }, [error, toast])

  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const onFollow = async () => {
    if (!contractAddress) return
    if (isFollowLoading) return
    if (!followContract) return
    setIsFollowLoading(true)
    try {
      const tx = await followContract.follow()
      await tx.wait()
      await mutate()
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || err,
        status: 'error',
      })
    }
    setIsFollowLoading(false)
  }

  return (
    <>
      <Heading>Search User</Heading>
      <Flex w="full" pos="relative">
        <Input
          placeholder="User Address"
          value={searchUserKey}
          onChange={(e) => setSearchUserKey(e.target.value)}
          w="full"
        />
        {isLoading ? <Spinner pos="absolute" top="2" right="2" /> : null}
      </Flex>
      {contractAddress ? (
        <Button
          onClick={onFollow}
          isLoading={isFollowLoading || isGettingFollowingStatus}
          colorScheme="pink"
          isDisabled={isFollowing}
        >
          Follow it
        </Button>
      ) : null}
    </>
  )
}
