import { VStack } from '@chakra-ui/react'
import { Navbar } from '../components/navbar'
import { useAccount } from 'wagmi'
import { SearchUser } from '../components/SearchUser'
import { SearchDAO } from '../components/SearchDAO'
import { Recommendation } from '../components/Recommendation'

export const Root = () => {
  const { address } = useAccount()

  return (
    <>
      <VStack as="main">
        <Navbar />
        {address ? (
          <>
            <VStack w="full" maxW="500px">
              <SearchUser />
            </VStack>
            <VStack w="full" mt="20" maxW="500px">
              <SearchDAO />
            </VStack>
            <VStack w="full" mt="20" maxW="500px">
              <Recommendation />
            </VStack>
          </>
        ) : null}
      </VStack>
    </>
  )
}
