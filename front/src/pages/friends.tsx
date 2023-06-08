import {
  Button,
  Center,
  Flex,
  Heading,
  ListItem,
  Spinner,
  UnorderedList,
  VStack,
  Text,
} from '@chakra-ui/react'
import { Navbar } from '../components/navbar'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { useFollowRegisterContract } from '../hooks/useFollowRegisterContract'
import { useCreateFollowContract } from '../hooks/useFollowContract'
import { useAccount } from 'wagmi'

export const Friends = () => {
  const { address } = useAccount()
  const { contract } = useFollowRegisterContract()
  const createFollowContract = useCreateFollowContract()

  const { data, isLoading, error } = useSWR(
    [`Following`, address],
    async () => {
      if (!contract || !address) return
      const len = (
        await contract.totalSupply().catch((e: any) => {
          console.warn('totalSupply: ', e)
        })
      ).toNumber()
      const tasks = new Array(len).fill(0).map(async (_, i) => {
        const index = len - i
        const a = await contract.ownerOf(index).catch((e: any) => {
          console.warn('ownerOf: ', e, address)
        })
        if (!a) return
        const contractAddress = await contract.ownedFollowContract(a)
        const currentFollowContract = createFollowContract(contractAddress)
        const isFollowing = await currentFollowContract
          .isFollowing(address)
          .catch((e: any) => {
            console.log(address, e)
          })
        return {
          address: a,
          isFollowing,
        }
      })
      return Promise.all(tasks)
    },
    {
      revalidateOnFocus: false,
    }
  )
  console.log(data, isLoading, error)

  const friends = data
    ?.filter((item) => item?.isFollowing)
    .map((item) => item?.address)

  return (
    <VStack as="main">
      <Navbar />
      <Heading>Following {`(${friends?.length || 0})`} </Heading>
      {(friends?.length || 0) > 0 ? (
        <UnorderedList w="full" maxW="700px">
          {friends?.map((item, key) => {
            return (
              <ListItem
                key={key}
                w="full"
                h="60px"
                lineHeight="60px"
                borderBottom="1px solid"
                borderColor="gray.700"
                px="10"
              >
                <Flex justify="space-between" align="center">
                  {item}
                  <Button as={Link} to={`/friend/${item}`}>
                    Homepage
                  </Button>
                </Flex>
              </ListItem>
            )
          })}
        </UnorderedList>
      ) : null}
      <Center>{isLoading ? <Spinner /> : <Text>No More</Text>}</Center>
    </VStack>
  )
}
