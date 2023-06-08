import { Button, Flex, Heading, VStack, useToast } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useFollowContract } from '../hooks/useFollowContract'
import useSWR from 'swr'
import {
  ZeroAddress,
  useFollowRegisterContract,
} from '../hooks/useFollowRegisterContract'
import { Link } from 'react-router-dom'
import { useDAOContract } from '../hooks/useDAOContract'
import { useAccount } from 'wagmi'

export const UserItem: FC<{ address: string }> = ({ address }) => {
  const { getOwnedFollowContract } = useFollowRegisterContract()
  const account = useAccount()
  const { data: contractAddress } = useSWR(
    ['getOwnedFollowContract', address],
    async () => {
      if (!address) return
      return getOwnedFollowContract(address)
    },
    {
      revalidateOnFocus: false,
    }
  )
  const { contract: followContract } = useFollowContract(contractAddress)
  const { data: isFollowing, mutate } = useSWR(
    ['followContract?.isFollowing', contractAddress, account.address],
    async () => {
      if (!followContract) return false
      if (!account.address) return
      return followContract.isFollowing(account.address).catch((e: any) => {
        console.error(e)
        return false
      })
    },
    {
      revalidateOnFocus: false,
    }
  )
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const toast = useToast()
  const onFollow = async () => {
    if (isLoadingFollow) return
    if (!followContract) return
    setIsLoadingFollow(true)
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
    setIsLoadingFollow(false)
  }

  if (contractAddress === ZeroAddress) return null

  return (
    <Flex
      borderBottom="1px solid"
      borderColor="gray.700"
      py="4"
      justify="space-between"
    >
      <Flex
        align="center"
        minH="60px"
        lineHeight="60px"
        whiteSpace="pre"
        wordBreak="break-all"
        mr="20px"
      >
        DAO:
        {address.slice(0, 6)}...{address.slice(address.length - 6)}
      </Flex>
      <VStack spacing="2" direction="column">
        <Button
          onClick={onFollow}
          isLoading={isLoadingFollow}
          isDisabled={isFollowing}
        >
          {isFollowing ? 'Followed' : 'Follow'}
        </Button>
        <Button as={Link} to={`/friend/${address}`}>
          Homepage
        </Button>
      </VStack>
    </Flex>
  )
}

export const DAOItem: FC<{ address: string }> = ({ address }) => {
  const { contract } = useDAOContract(address)
  const account = useAccount()
  const [isJoining, setIsJoining] = useState(false)
  const toast = useToast()
  const isFreeJoinResponse = useSWR(['isFreeJoin', address], async () => {
    if (!contract) return false
    return await contract.isFreeJoin().catch(() => false)
  })
  const isMemberResponse = useSWR(
    ['isMember', address, account.address],
    async () => {
      if (!contract) return false
      return await contract.isMember(account.address).catch(() => false)
    }
  )
  const onJoin = async () => {
    if (!contract) return
    setIsJoining(true)
    try {
      const tx = await contract.join()
      await tx.wait()
      await Promise.all([
        isMemberResponse.mutate(),
        isFreeJoinResponse.mutate(),
      ])
      toast({
        title: 'Joined successfully',
        status: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Join Failed',
        description: String(err?.message || err).substring(0, 30),
        status: 'error',
      })
    }
    setIsJoining(false)
  }

  if (!isFreeJoinResponse.data) return null

  return (
    <Flex
      borderBottom="1px solid"
      borderColor="gray.700"
      py="4"
      justify="space-between"
    >
      <Flex
        align="center"
        minH="60px"
        lineHeight="60px"
        whiteSpace="pre"
        wordBreak="break-all"
        mr="20px"
      >
        User:
        {address.slice(0, 6)}...{address.slice(address.length - 6)}
      </Flex>
      <VStack spacing="2" direction="column" justify="center">
        <Button
          onClick={onJoin}
          isLoading={isJoining}
          isDisabled={isMemberResponse.data}
        >
          {isMemberResponse.data ? 'Joined' : 'Join'}
        </Button>
      </VStack>
    </Flex>
  )
}

export const Recommendation: FC = () => {
  return (
    <Flex direction="column" w="full">
      <Heading textAlign="center">Recommendation</Heading>
      <Heading textAlign="center" fontSize="2xl" mt="4">
        Users
      </Heading>
      <Flex direction="column">
        <UserItem address="0xa296651a7FE677ca62e077562fEF853cC37A107a" />
        <UserItem address="0x4d1642ADb33cC25DdFc8b1b5e6C5a04F59A8c316" />
        <UserItem address="0x5Ab532448796b4B8d399E248F56BD92D64821ff1" />
      </Flex>
      <Heading textAlign="center" fontSize="2xl" mt="4">
        DAOs
      </Heading>
      <Flex direction="column">
        <DAOItem address="0xBCA8214811BCf07b677fA0faB84c11aAE92718fa" />
        <DAOItem address="0xB18BAC8e0512d0b8355B7892158b7943f2ac0825" />
        <DAOItem address="0xeE991ac142CB50Be554E611985dd01e6D94c5093" />
      </Flex>
    </Flex>
  )
}
