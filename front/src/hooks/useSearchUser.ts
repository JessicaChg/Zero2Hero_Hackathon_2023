import { useCallback } from 'react'
import { useGetBucket } from './greenfield'
import { generateShareBucketKey } from '../config/greenfield'

export function useSearchUser() {
  const getBucketInfo = useGetBucket()
  return useCallback(
    async (address: string) => {
      const shareBucketKey = generateShareBucketKey(address)
      return await getBucketInfo(shareBucketKey).catch(() => null)
    },
    [getBucketInfo]
  )
}
