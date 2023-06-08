import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ReactComponent as LogoSVG } from '../assets/svg/logo.svg'
import { Link } from 'react-router-dom'
import { DeployDetector } from '../components/DeployDetector'
import { CreateDAODialog } from '../components/CreateDAODialog'
import { SendPostDialog } from '../components/SendPostDialog'
import { useAccount } from 'wagmi'

export const Navbar = () => {
  const createDAODialogStatus = useDisclosure()
  const sendPostDialogStatus = useDisclosure()
  const { address } = useAccount()

  return (
    <Flex direction="column" mb="10">
      <Flex
        align="center"
        justify="space-between"
        w="full"
        h="16"
        py="4"
        px={4}
      >
        <Box as={Link} to="/">
          <Icon as={LogoSVG} h="10" w="auto" />
        </Box>
        <ConnectButton />
      </Flex>
      {address ? (
        <>
          <Flex gap="4">
            <Button as={Link} to="/following">
              Following
            </Button>
            <Button as={Link} to="/followers">
              Followers
            </Button>
            <Button as={Link} to={`/friend/${address}`}>
              My Post
            </Button>
            <Button onClick={sendPostDialogStatus.onOpen}>Send Post</Button>
            <Button as={Link} to={`/dao/${address}`}>
              My DAO
            </Button>
            <Button onClick={createDAODialogStatus.onOpen}>Create DAO</Button>
          </Flex>
          <DeployDetector
            isDisabled={
              sendPostDialogStatus.isOpen || createDAODialogStatus.isOpen
            }
          />
          <CreateDAODialog
            isOpen={createDAODialogStatus.isOpen}
            onClose={createDAODialogStatus.onClose}
          />
          <SendPostDialog
            isOpen={sendPostDialogStatus.isOpen}
            onClose={sendPostDialogStatus.onClose}
          />
        </>
      ) : null}
    </Flex>
  )
}
