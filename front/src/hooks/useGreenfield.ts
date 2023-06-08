// import { useEffect } from 'react'
// import { useAccount, useNetwork } from 'wagmi'
// import { client, selectSp, getSps } from '../config/greenfield'
// import { FileHandler } from '@bnb-chain/greenfiled-file-handle'
// import { newBucketGRN, GRNToString } from '@bnb-chain/greenfield-chain-sdk'

// // const endpoint = 'https://gnfd-testnet-sp-1.bnbchain.org'
// const endpoint = 'https://gnfd-testnet-sp-5.bnbchain.org'

// export function useGreenfield() {
//   const account = useAccount()
//   const { chain } = useNetwork()
//   const onGenOffChainAuthKeyPairClick = async () => {
//     const sps = await getSps()
//     const spsForSign = sps.map((item: any) => ({
//       address: item.operatorAddress,
//       name: item.description.moniker,
//       endpoint: item.endpoint,
//     }))
//     const signAndUploadKeyOption = {
//       address: account.address!,
//       domain: window.location.origin,
//       chainId: +(chain?.id || 0),
//       expirationMs: 5 * 24 * 60 * 60 * 1000,
//       sps: spsForSign,
//     }

//     const { code, body, message } =
//       await client.offchainauth.genOffChainAuthKeyPairAndUpload(
//         signAndUploadKeyOption,
//         window?.ethereum
//       )
//     if (code !== 0) {
//       console.log('gen offchainauth key pair error', message)
//       return
//     }
//     const key = `${address}-${chain?.id}`
//     localStorage.setItem(key, JSON.stringify(body))
//     if (code === 0) {
//       alert('success')
//     }
//   }
//   // const testFn = useCallback(async () => {
//   //   if (!account.address) {
//   //     return
//   //   }
//   //   const bucket = await client.bucket.getUserBuckets({
//   //     address: account.address,
//   //     endpoint,
//   //   })

//   //   const bucketName = bucket.body?.[0].bucket_info.bucket_name
//   //   console.log(bucket, bucketName)
//   //   if (!bucketName) return

//   //   const object = await client.object.listObjects({
//   //     bucketName,
//   //     endpoint,
//   //   })

//   //   const objectName = object.body?.[0].object_info.object_name
//   //   if (!objectName) return
//   //   console.log(object, objectName)

//   //   // const headObject = await client.object.headObject(bucketName, objectName)
//   //   // console.log(headObject)
//   //   const get = await client.object.getObject({
//   //     bucketName,
//   //     objectName,
//   //     endpoint,
//   //   })
//   //   console.log(get)

//   //   // const a = await client.object.downloadFile({
//   //   //   bucketName,
//   //   //   objectName,
//   //   //   endpoint,
//   //   // })
//   //   // console.log(a)
//   // }, [client, account])

//   useEffect(() => {
//     // testFn()
//   }, [])

//   useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.createBucket = async (bucketName: string) => {
//       if (!account.address) return
//       const address = account.address
//       const spInfo = await selectSp()
//       const createBucketTx = await client.bucket.createBucket({
//         bucketName,
//         creator: address,
//         visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
//         chargedReadQuota: '0',
//         spInfo,
//       })

//       console.log('createBucketTx: ', createBucketTx)

//       const simulateInfo = await createBucketTx.simulate({
//         denom: 'BNB',
//       })

//       console.log('simulateInfo: ', simulateInfo)

//       const r = await createBucketTx.broadcast({
//         denom: 'BNB',
//         gasLimit: Number(simulateInfo?.gasLimit),
//         gasPrice: simulateInfo?.gasPrice || '5000000000',
//         payer: address,
//         granter: '',
//       })

//       console.log('result: ', r)
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.listBucket = async () => {
//       if (!account.address) return
//       const address = account.address
//       console.log(
//         await client.bucket.getUserBuckets({
//           address,
//           endpoint,
//         })
//       )
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.createObject = async (
//       bucketName: string,
//       objectName: string,
//       // content: string
//       file: File
//     ) => {
//       if (!account.address) return
//       // const file = new File([new Blob([content])], objectName)
//       console.log(file)
//       const spInfo = await selectSp()

//       const tx = await client.object.createObject({
//         bucketName,
//         objectName,
//         creator: account.address,
//         visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
//         spInfo,
//         file,
//         expectSecondarySpAddresses: [],
//       })

//       console.log(tx)

//       const simulateInfo = await tx.simulate({
//         denom: 'BNB',
//       })

//       console.log('simulateInfo: ', simulateInfo)

//       const r = await tx.broadcast({
//         denom: 'BNB',
//         gasLimit: Number(simulateInfo?.gasLimit),
//         gasPrice: simulateInfo?.gasPrice || '5000000000',
//         payer: account.address,
//         granter: '',
//       })
//       console.log(r)
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.getObject = async (bucketName: string, objectName: string) => {
//       if (!account.address) return

//       const e = await client.object.getObject({
//         bucketName,
//         objectName,
//         endpoint,
//       })
//       // client.bucket.putBucketPolicy({})

//       // https://gnfd-testnet-sp-2.bnbchain.org/view/test003/beb2235793276526899a38ee8a4bce4e-sticker.png
//       console.log(e)
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.newBucketGRN = newBucketGRN
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     window.GRNToString = GRNToString
//   }, [account.address])
// }
export function useG() {
  return 0
}
