import {
  Button,
  Center,
  Heading,
  ListItem,
  Spinner,
  VStack,
  useToast,
  Text,
  Image,
  List,
} from '@chakra-ui/react'
import { Navbar } from '../../components/navbar'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import {
  generateDownloadURI,
  generateShareBucketKey,
} from '../../config/greenfield'
import { useEffect } from 'react'
import { useContentContract } from '../../hooks/useContentContract'
import { useNetwork } from 'wagmi'
import { CONTENT_CONTRACT_ADDRESS } from '../../config/env'

export const FriendAddress = () => {
  const { address } = useParams<{ address: string }>()
  const { contract } = useContentContract()
  const { data, error, isLoading } = useSWR(
    ['FriendAddress', address],
    async () => {
      if (!address || !contract) return
      const balance = (await contract.balanceOf(address)).toNumber()
      const tasks = new Array(balance).fill(0).map(async (_, i) => {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i)
          const uri = await contract.contentOf(tokenId)
          const postContent: {
            content: {
              title: string
              body: string
              images?: string[]
            }
          } = await fetch(uri)
            .then((res) => res.json())
            .catch(() => ({ content: { title: '', body: '', images: [] } }))
          return {
            postContent,
            uri,
            tokenId,
            index: i + 1,
          }
        } catch (err) {
          console.error(err)
          return
        }
      })
      return Promise.all(tasks)
    }
  )
  const toast = useToast()

  useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error?.message || error,
        status: 'error',
      })
    }
  }, [error, toast])

  const items = data || []
  const bucketName = address ? generateShareBucketKey(address) : ''

  console.log(items)

  const network = useNetwork()

  return (
    <VStack as="main">
      <Navbar />
      <Heading>Posts</Heading>
      <Text>Address: {address}</Text>
      <Text>Post total: {items.filter((item) => item).length}</Text>
      {items.length > 0 ? (
        <List w="full" maxW="700px">
          {items.map((item, key) => {
            if (!item) return null
            return (
              <ListItem
                key={key}
                borderBottom="1px solid"
                borderColor="gray.700"
                p="6"
                minH="180px"
                pos="relative"
              >
                {/* <Heading fontSize="lg">
                  {item.postContent.content.title || 'No Post Title'}
                </Heading> */}
                <Text mt={2} pr="200px">
                  {item.postContent.content.body || 'No Post Body'}
                </Text>
                {bucketName &&
                  item.postContent.content.images?.map((image) => {
                    return (
                      <Image
                        src={
                          image.startsWith('https://')
                            ? image
                            : generateDownloadURI(bucketName, image)
                        }
                        alt={image}
                        maxW="100px"
                        maxH="100px"
                      />
                    )
                  })}
                <VStack
                  pos="absolute"
                  top="0"
                  right="0"
                  h="full"
                  spacing="2"
                  py="6"
                  justify="start"
                  align="end"
                >
                  <Button
                    onClick={() => {
                      window.open(
                        `${network.chain?.blockExplorers?.default.url}/token/${CONTENT_CONTRACT_ADDRESS}?a=${item.index}`
                      )
                    }}
                  >
                    Token
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(item.uri)
                    }}
                  >
                    Source File
                  </Button>
                </VStack>
              </ListItem>
            )
          })}
        </List>
      ) : (
        <Center h="300px">{isLoading ? <Spinner /> : 'No files'}</Center>
      )}
    </VStack>
  )
}
