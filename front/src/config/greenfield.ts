import { Client } from '@bnb-chain/greenfield-chain-sdk'
import { greenfieldTestnet } from './wallet'

export const client = Client.create(
  greenfieldTestnet.rpcUrls.default.http[0],
  String(greenfieldTestnet.id)
)

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders()
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest'
  )

  return finalSps
}

export const selectSp = async () => {
  const sps = await client.sp.getStorageProviders()
  const finalSps = (sps ?? []).filter(
    (v: any) => v?.description?.moniker !== 'QATest'
  )
  const selectIndex = 0
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress)
  const selectSpInfo = {
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  }
  return selectSpInfo
}

export const generatePrivateBucketKey = (address: string) =>
  `relation-private-${address.substring(0, 11).toLocaleLowerCase()}`

export const generateShareBucketKey = (address: string) =>
  `relation-share-${address.substring(0, 11).toLocaleLowerCase()}`

export const generateDAOBucketKey = (daoName: string, address: string) =>
  `relation-dao-${daoName}-${address.substring(0, 5)}`

export const generateDAOProfileBucketKey = (
  daoName: string,
  timestamp: number
) => `dao-${daoName}-${timestamp}-profile.json`

export const generateDownloadURI = (bucketName: string, objectName: string) =>
  `https://gnfd-testnet-sp-1.nodereal.io/view/${bucketName}/${objectName}`

export const onDownload = (bucketName: string, objectName: string) => {
  window.open(generateDownloadURI(bucketName, objectName))
}

export const endpoint = 'https://gnfd-testnet-sp-1.bnbchain.org'
