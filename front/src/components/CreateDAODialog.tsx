import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  Text,
} from '@chakra-ui/react'
import { ChangeEvent, FC, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { useDAORegisterContract } from '../hooks/useDAORegisterContract'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import { useCreateObject } from '../hooks/greenfield'
import {
  generateDAOProfileBucketKey,
  generateDownloadURI,
  generateShareBucketKey,
} from '../config/greenfield'
import { generateTextFile } from '../utils/file'
import { fnNone } from '../utils/fn'

export const CreateDAODialog: FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { address } = useAccount()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('')
  const { contract } = useDAORegisterContract()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const createObject = useCreateObject()
  const onCreateDAO = useCallback(async () => {
    if (!address || !contract || isLoading) return
    setIsLoading(true)
    try {
      const bucketName = await generateShareBucketKey(address)
      const objectName = generateDAOProfileBucketKey(name, new Date().getTime())
      const fileContent = JSON.stringify({
        avatar,
        description,
      })
      const file = generateTextFile(fileContent, objectName)
      await createObject(bucketName, objectName, file)
      const uri = generateDownloadURI(bucketName, objectName)
      console.log('upload uri: ', uri)
      await (
        (await contract.deployDaoContract(
          address,
          name,
          uri
        )) as TransactionResponse
      ).wait()
      const total = await contract.totalSupply()
      const [, daoAddress] = await contract.daoOf(total.toNumber())
      toast({
        status: 'success',
        title: 'Successfully deployed DAO',
        description: `dao address: ${daoAddress}`,
      })
      console.log(daoAddress)
    } catch (err: any) {
      console.log(err)
      toast({
        title: 'Deploy Failed',
        description: err?.message || err,
        status: 'error',
      })
    }
    setIsLoading(false)
  }, [
    address,
    avatar,
    contract,
    createObject,
    description,
    isLoading,
    name,
    toast,
  ])

  const [isUploading, setIsUploading] = useState(false)
  const onUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!address) return
    if (isUploading) return
    setIsUploading(true)
    try {
      const file = e.target.files?.[0]
      if (!file) return
      const bucketName = generateShareBucketKey(address)
      const objectName = `image-${new Date().getTime()}-${file.name}`
      await createObject(bucketName, objectName, file)
      setAvatar(objectName)
    } catch (err: any) {
      toast({
        title: 'Upload avatar failed',
        description: err?.message || err,
        status: 'error',
      })
    }
    setIsUploading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? fnNone : onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create DAO</ModalHeader>
        <ModalBody>
          <Input
            placeholder="DAO Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            mt="2"
          />
          <Text mt={4}>Avatar: </Text>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            mt={2}
            onChange={onUploadImage}
            isDisabled={isUploading}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            w="full"
            onClick={onCreateDAO}
            isDisabled={!name}
            isLoading={isLoading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
