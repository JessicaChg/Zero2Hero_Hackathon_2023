import {
  getNameStatus,
  getNamePhase,
  genNameSignData,
  getNamePrice,
  getWhitelistMintedNum
} from '@/api'
import {
  getWhitelistMintedCount,
  checkIsUserInWhiteList,
  checkIsUserMintedWhitelist,
  claimSbt,
  defaultChain,
  registerChain
} from './../utils/providers'
import nameAbi from '../abi/nameservice.json'
import useCommonStore from '@/store/common'
import useUserStore from '@/store/user'

export const useClaim = () => {
  const user = useUserStore()
  const common = useCommonStore()
  const canClaim = ref(false)
  const claiming = ref(false)
  const minted = ref(false)
  const mintedCount = ref()
  const loaded = ref(false)

  const getMintedNum = async () => {
    const { code, data } = await getWhitelistMintedNum()

    if (+code !== 0) return
    mintedCount.value = (data * 100).toFixed(2)
  }

  const check = async () => {
    getMintedNum()

    await checkIsUserMintedWhitelist().then((r) => {
      minted.value = r
    })

    await checkIsUserInWhiteList().then((r) => {
      canClaim.value = r
    })

    loaded.value = true
  }

  const onClaim = async () => {
    if (!user.address) return common.loginModalRef.show()

    if (!canClaim.value || minted.value) return

    claiming.value = true
    try {
      const r = await claimSbt()
      minted.value = true
      ElMessage.success('Success')

      getMintedNum()
    } catch (error) {
      handleMintErr(error)
    }
    claiming.value = false
  }

  check()

  watch(
    () => user.address,
    (v) => {
      check()
    }
  )

  return { canClaim, onClaim, minted, claiming, mintedCount, loaded }
}

export const useSearch = () => {
  const userStore = useUserStore()
  const common = useCommonStore()

  const searchText = ref('')
  const searching = ref(false)
  const errTip = ref('')
  const searchResult = ref<any>()
  const onSearch = async () => {
    if (!userStore.address) {
      return userStore.login()
    }

    const name = searchText.value
    if (!name) return
    console.log(
      '%c [ name ]-97',
      'font-size:13px; background:pink; color:#bf2c9f;',
      name
    )

    searchResult.value = null

    if (name.length < 5) {
      errTip.value =
        'Registration for 1-4 character names is not currently open'
      return
    }

    searching.value = true
    const res = await getNameStatus(name, userStore.address)
    console.log(
      '%c [ res ]-120',
      'font-size:13px; background:pink; color:#bf2c9f;',
      res
    )
    searching.value = false
    if (+res.code !== 0) {
      errTip.value = res.desc || res.message || ''
      return
    }

    const d = res.data

    if (d.status === 'ILLEGAL') {
      errTip.value =
        'The length does not comply / The character has not been recorded'
      return
    }

    if (d.status === 'PROTECTED') {
      errTip.value = 'Protected Profile Name'
      return
    }

    if (d.status === 'REGISTERED') {
      errTip.value = 'The Profile Name has already been registered'
    }

    searchResult.value = { ...d, name }

    // if (d.status !== 'AVAILABLE') {
    //   errTip.value = d.status
    //   return
    // }

    // if (d.status === 'AVAILABLE') {
    //   router.push(`/register/${encodeURIComponent(name)}`)
    // }
  }

  watch(searchText, (v) => {
    searchText.value = v.toLocaleLowerCase()
    errTip.value = ''
  })

  return {
    onSearch,
    searchText,
    searching,
    errTip,
    searchResult
  }
}

export const useRegister = (name?: string) => {
  const route = useRoute()
  const userStore = useUserStore()
  const commonStore = useCommonStore()
  const gettingPrice = ref(false)
  const gettingSign = ref(false)
  const gotSign = ref(false)
  const minting = ref(false)
  const success = ref(false)
  const preminted = ref(false)
  const price = ref('')
  const referrerAddress = ref('')

  const checkPreminted = async () => {
    const contractAddr = await commonStore.getContractAddress()

    const contract = await getRpcContract(
      registerChain.chainId,
      contractAddr,
      nameAbi
    )

    const count = await contract.balanceOf(userStore.address)

    preminted.value = +count > 0
  }
  checkPreminted()

  const getPrice = async (name?: string) => {
    if (!name) return

    gettingPrice.value = true
    const res = await getNamePrice(name, userStore.address)
    if (+res.code !== 0) return ElMessage.info(res.desc)
    if (name !== route.params.name + '') return

    price.value = res.data.price
    gettingPrice.value = false
  }
  getPrice(name)

  const register = async () => {
    gettingSign.value = true
    const d: any = {
      name,
      walletAddress: userStore.address,
      price: price.value
    }
    try {
      const contractAddr = await commonStore.getContractAddress()
      const contract = await getContractInstance(
        registerChain.chainId,
        contractAddr,
        nameAbi
      )
      let s = referrerAddress.value
      if (s) {
        try {
          if (!s.includes('.')) {
            s += '.soul'
          }
          const addr = await contract.ownerOfName(s)
          d.referrerAddress = addr
        } catch (error) {}

        if (!d.referrerAddress) {
          throw { code: -1, desc: 'Inviter does not exist' }
        }
      }
      const { code, data, desc } = await genNameSignData(d)
      gettingSign.value = false
      if (+code !== 0) {
        throw { code, desc }
      }

      gotSign.value = true
      minting.value = true

      const p = data.price

      let gasEstimated: any = 0
      try {
        gasEstimated = await contract.estimateGas.register(
          name,
          data.deadline,
          data.maxMintCount,
          p,
          data.signature,
          { value: p }
        )
      } catch (error) {}

      const trans = await contract.register(
        name,
        data.deadline,
        data.maxMintCount,
        p,
        data.signature,
        { value: p, gasLimit: Math.max(370000, +gasEstimated) }
      )

      await trans.wait()

      success.value = true
    } catch (error) {
      handleMintErr(error)

      gettingSign.value = false
      gettingPrice.value = false
      gotSign.value = false
    }

    minting.value = false
  }

  return {
    preminted,

    gettingPrice,
    price,
    referrerAddress,

    gettingSign,
    register,
    gotSign,
    minting,
    success
  }
}
