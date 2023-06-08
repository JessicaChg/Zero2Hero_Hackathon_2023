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
import { FC } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'
import { useFollowRegisterContract } from '../hooks/useFollowRegisterContract'
import { useCreateFollowContract } from '../hooks/useFollowContract'
import { Navbar } from '../components/navbar'
import { Link } from 'react-router-dom'

export const Followers: FC = () => {
  const { address } = useAccount()
  const { getOwnedFollowContract } = useFollowRegisterContract()
  const createFollowContract = useCreateFollowContract()
  const { data, isLoading, error } = useSWR(
    [`Followers`, address],
    async () => {
      if (!address) return
      const followContractAddress = await getOwnedFollowContract(address)
      const followContract = createFollowContract(followContractAddress!)
      const total = (await followContract.totalSupply()).toNumber()
      return Promise.all(
        new Array(total)
          .fill(0)
          .map(async (_, i) => followContract.ownerOf(i + 1))
      )
    },
    {
      revalidateOnFocus: false,
    }
  )
  console.log(data, isLoading, error)

  return (
    <VStack as="main">
      <Navbar />
      <Heading>Followers {`(${data?.length || 0})`} </Heading>
      {(data?.length || 0) > 0 ? (
        <UnorderedList w="full" maxW="700px">
          {data?.map((item, key) => {
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
