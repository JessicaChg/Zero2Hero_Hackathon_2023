import { useCallback } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { client, selectSp } from '../config/greenfield'
import { GRNToString, newBucketGRN } from '@bnb-chain/greenfield-chain-sdk'

export function useCreateBucket() {
  const { address } = useAccount()
  return useCallback(
    async (
      bucketName: string,
      options?: {
        visibility: 'VISIBILITY_TYPE_PUBLIC_READ' | 'VISIBILITY_TYPE_PRIVATE'
      }
    ) => {
      if (!address) return
      const visibility = options?.visibility || 'VISIBILITY_TYPE_PUBLIC_READ'
      const spInfo = await selectSp()
      const tx = await client.bucket.createBucket({
        bucketName,
        creator: address,
        visibility,
        chargedReadQuota: '0',
        spInfo,
      })

      const simulateInfo = await tx.simulate({
        denom: 'BNB',
      })

      return await tx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: address,
        granter: '',
      })
    },
    [address]
  )
}

export function useGetBucket() {
  const { address } = useAccount()
  return useCallback(
    async (bucketName: string) => {
      if (!address) return
      return client.bucket.headBucket(bucketName)
    },
    [address]
  )
}

export function useCreateObject() {
  const { address } = useAccount()
  return useCallback(
    async (bucketName: string, objectName: string, file: File) => {
      if (!address) return

      const spInfo = await selectSp()
      const createObjectTx = await client.object.createObject({
        bucketName,
        objectName,
        spInfo,
        file,
        creator: address,
        expectSecondarySpAddresses: [],
      })

      const simulateInfo = await createObjectTx.simulate({
        denom: 'BNB',
      })

      const res = await createObjectTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: address,
        granter: '',
      })

      return await client.object.uploadObject({
        bucketName,
        objectName,
        body: file,
        txnHash: res.transactionHash,
        endpoint: spInfo.endpoint,
      })
    },
    [address]
  )
}

export function useMirrorBucket() {
  const { address } = useAccount()
  return useCallback(
    async (bucketId: string) => {
      if (!address) return
      const mirrorBucketTx = await client.crosschain.mirrorBucket({
        id: bucketId,
        operator: address,
      })

      const simulateInfo = await mirrorBucketTx.simulate({
        denom: 'BNB',
      })

      return await mirrorBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: address,
        granter: '',
      })
    },
    [address]
  )
}

export function useCreateGroup() {
  const { address } = useAccount()
  return useCallback(
    async (groupName: string, members: string[]) => {
      if (!address) return
      const tx = await client.group.createGroup({
        creator: address,
        groupName,
        members,
      })

      const simulateInfo = await tx.simulate({
        denom: 'BNB',
      })
      return await tx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || '5000000000',
        payer: address,
        granter: '',
      })
    },
    [address]
  )
}

export function useCreateBucketPolicy() {
  const { address } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()
  return useCallback(
    async (bucketName: string) => {
      if (!address) return
      const tx = await client.bucket.putBucketPolicy({
        operator: address,
        resource: GRNToString(newBucketGRN(bucketName)),
        principal: {
          type: 2,
          value: '32',
        },
        statements: [
          {
            effect: 1,
            actions: [6],
            resources: [],
          },
        ],
      })

      const s = await tx.simulate({
        denom: 'BNB',
      })

      return await tx.broadcast({
        denom: 'BNB',
        gasLimit: Number(s?.gasLimit),
        gasPrice: s?.gasPrice || '5000000000',
        payer: address,
        granter: '',
        signTypedDataCallback: async (addr: string, message: string) => {
          const msg = JSON.parse(message)
          console.log(msg)
          console.log(await signTypedDataAsync(msg))
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return await window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [addr, message],
          })
        },
      })
    },
    [address, signTypedDataAsync]
  )
}
