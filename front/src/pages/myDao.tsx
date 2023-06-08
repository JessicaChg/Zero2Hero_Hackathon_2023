import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  List,
  ListItem,
  Spinner,
  VStack,
  Text,
} from '@chakra-ui/react'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from '../components/navbar'
import useSWR from 'swr'
import { useDAORegisterContract } from '../hooks/useDAORegisterContract'
import { useCreateDAOContract } from '../hooks/useDAOContract'
import {
  generateDownloadURI,
  generateShareBucketKey,
} from '../config/greenfield'
import { useNetwork } from 'wagmi'

export const MyDAO: FC = () => {
  const { address } = useParams<{
    address: string
  }>()
  const { contract } = useDAORegisterContract()
  const createDAOContract = useCreateDAOContract()

  const { data = [], isLoading } = useSWR(
    ['MyDAO', address],
    async () => {
      if (!contract || !address) return null
      const total = (await contract.totalSupply()).toNumber()
      const tasks = new Array(total).fill(0).map(async (_, index) => {
        try {
          const i = index + 1
          const [ownerAddress, daoAddress] = await contract
            .daoOf(i)
            .catch(() => [])
          if (!daoAddress) return
          const daoContract = createDAOContract(daoAddress)
          const balance = (await daoContract.balanceOf(address)).toNumber()
          if (balance <= 0) return
          const uri = await daoContract.daoURI()
          const name = await daoContract.name()
          const members = (await daoContract.totalSupply()).toNumber()
          const res: { avatar: string; description: string } = await fetch(uri)
            .then((res) => res.json())
            .catch(() => {
              return { avatar: '', description: '' }
            })
          return {
            ownerAddress,
            daoAddress,
            balance,
            uri,
            name,
            members,
            ...res,
          }
        } catch (err) {
          console.log(err)
          return
        }
      })
      return Promise.all(tasks)
    },
    {
      revalidateOnFocus: false,
    }
  )

  const network = useNetwork()

  const bucketName = address ? generateShareBucketKey(address) : ''

  const items = data || []
  console.log(items)

  return (
    <VStack as="main">
      <Navbar />
      <Heading>DAO</Heading>
      {items.length > 0 ? (
        <List w="full" maxW="700px">
          {items.map((item, key) => {
            if (!item) return null
            if (item.balance <= 0) return null
            return (
              <ListItem
                key={key}
                borderBottom="1px solid"
                borderColor="gray.700"
                p="4"
                pos="relative"
              >
                <Flex align="center" h="60px" lineHeight="60px">
                  <Avatar
                    src={
                      item.avatar.startsWith('https://')
                        ? item.avatar
                        : generateDownloadURI(bucketName, item.avatar)
                    }
                    size="sm"
                    mr={2}
                  />
                  <Box>{item.name}</Box>
                  <Box as="span" fontSize="xs">
                    ({item.daoAddress})
                  </Box>
                  <Flex
                    h="full"
                    direction="column"
                    ml="auto"
                    py={2}
                    justify="center"
                    align="right"
                    pos="absolute"
                    right="0"
                    top="0"
                  >
                    <Button
                      onClick={() => {
                        window.open(
                          `${network.chain?.blockExplorers?.default.url}/token/${item.daoAddress}`
                        )
                      }}
                    >
                      Contract
                    </Button>
                    <Button
                      mt={2}
                      onClick={() => {
                        window.open(item.uri)
                      }}
                    >
                      Source Profile
                    </Button>
                  </Flex>
                </Flex>
                <Box fontSize="sm">members: {item.members}</Box>
                <Text mt={2}>{item.description || 'No description'}</Text>
              </ListItem>
            )
          })}
        </List>
      ) : (
        <Center h="300px">{isLoading ? <Spinner /> : 'No DAOs'}</Center>
      )}
    </VStack>
  )
}
