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
import { ChangeEvent, FC, useState } from 'react'
import { useAccount } from 'wagmi'
import {
  generateDownloadURI,
  generateShareBucketKey,
} from '../config/greenfield'
import { useCreateObject } from '../hooks/greenfield'
import { generateTextFile } from '../utils/file'
import { useContentContract } from '../hooks/useContentContract'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import { fnNone } from '../utils/fn'

export const SendPostDialog: FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [title] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const { address } = useAccount()
  const createObject = useCreateObject()
  const { contract: contentContract } = useContentContract()
  const [isSending, setIsSending] = useState(false)
  const toast = useToast()
  const onPost = async () => {
    if (!address || !contentContract) return
    setIsSending(true)
    try {
      const bucketName = generateShareBucketKey(address)
      const filename = `post-${new Date().getTime()}.txt`
      const file = generateTextFile(
        JSON.stringify({
          content: {
            title,
            body: content,
            images,
          },
        }),
        filename
      )
      await createObject(bucketName, filename, file)
      const uri = generateDownloadURI(bucketName, filename)
      await ((await contentContract.post(uri)) as TransactionResponse).wait()
      toast({
        status: 'success',
        title: 'Successfully sent',
      })
    } catch (err: any) {
      toast({
        title: 'Send post failed',
        description: err?.message || err,
        status: 'error',
      })
    }
    setIsSending(false)
  }
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
      setImages([objectName])
    } catch (err: any) {
      toast({
        title: 'Upload image failed',
        description: err?.message || err,
        status: 'error',
      })
    }
    setIsUploading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={isSending ? fnNone : onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Post</ModalHeader>
        <ModalBody>
          {/* <Input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /> */}
          <Textarea
            placeholder="body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mt={2}
          />
          <Text mt={4}>Image: </Text>
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
            onClick={onPost}
            isLoading={isSending || isUploading}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
