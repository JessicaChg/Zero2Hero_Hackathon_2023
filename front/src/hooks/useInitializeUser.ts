import { useCallback } from 'react'
import { useCreateBucket, useGetBucket } from './greenfield'
import { useAccount } from 'wagmi'
import {
  client,
  generatePrivateBucketKey,
  generateShareBucketKey,
} from '../config/greenfield'

export function useInitializeUser() {
  const { address } = useAccount()
  const createBucket = useCreateBucket()
  const getBucketInfo = useGetBucket()

  return useCallback(async () => {
    if (!address) return
    await createBucket(generatePrivateBucketKey(address), {
      visibility: 'VISIBILITY_TYPE_PRIVATE',
    })

    const shareBucketKey = generateShareBucketKey(address)
    await createBucket(shareBucketKey, {
      visibility: 'VISIBILITY_TYPE_PRIVATE',
    })
    const shareBucketInfo = await getBucketInfo(shareBucketKey)
    const shareBucketId = shareBucketInfo?.bucketInfo?.id
    if (!shareBucketId) {
      throw new Error('bucket info not found')
    }

    await client.crosschain.mirrorBucket({
      operator: address,
      id: shareBucketId,
    })
  }, [address, createBucket, getBucketInfo])
}
