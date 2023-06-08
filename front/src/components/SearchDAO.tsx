import { Button, Flex, Heading, Input, useToast } from '@chakra-ui/react'
import { useState, type FC } from 'react'
import { useDAOContract } from '../hooks/useDAOContract'
import useSWR from 'swr'
import { isPrimitiveEthAddress } from '../utils/address'
import { useAccount } from 'wagmi'

export const SearchDAO: FC = () => {
  const { address } = useAccount()
  const [searchDAOKey, setSearchDAOKey] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const toast = useToast()
  const { contract } = useDAOContract(
    isPrimitiveEthAddress(searchDAOKey) ? searchDAOKey : undefined
  )

  const isFreeJoinResponse = useSWR(['isFreeJoin', searchDAOKey], async () => {
    if (!contract) return false
    return await contract.isFreeJoin().catch(() => false)
  })

  const isMemberResponse = useSWR(['isMember', searchDAOKey], async () => {
    if (!contract) return false
    return await contract.isMember(address).catch(() => false)
  })

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

  return (
    <>
      <Heading>Search DAO</Heading>
      <Flex w="full" pos="relative">
        <Input
          placeholder="DAO Address"
          onChange={(e) => setSearchDAOKey(e.target.value)}
          value={searchDAOKey}
        />
      </Flex>
      {isFreeJoinResponse.data ? (
        <Button
          isLoading={
            isFreeJoinResponse.isLoading ||
            isJoining ||
            isMemberResponse.isLoading
          }
          colorScheme="purple"
          onClick={onJoin}
          isDisabled={isMemberResponse.data}
        >
          {isMemberResponse.data ? 'Joined' : 'Join it'}
        </Button>
      ) : null}
    </>
  )
}
