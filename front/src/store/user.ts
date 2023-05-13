import {
  getProfile,
  getUserInfo,
  getNamePhase,
  getPreMintedNum,
  getMintedList,
  getReferralRewards
} from '@/api'
import useCommonStore from './common'
import useMineStore from './mine'
import { os } from '@/utils/utils'

const useUserStore = defineStore('relation-nameservice-user', {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  },
  state: (): UserInfo => ({
    wallet: '',
    address: '',
    token: '',
    chainId: '',

    relationAuthorization: '',
    name: '',
    avatar: '',
    relationId: '',

    bindedDomain: '',

    phase: undefined,
    preminted: false,
    premintStartLeft: undefined,

    premintedSum: undefined,

    mintedList: [], // all user minted list

    referralRewards: undefined
  }),
  actions: {
    async getReferralRewards() {
      if(!this.address) return

      const { code, data } = await getReferralRewards(this.address)
      if (+code !== 0) return
      this.referralRewards = data
    },
    async getNamePhase() {
      getNamePhase().then((res) => {
        if (+res.code !== 0) return
        this.phase = res.data[0]
        this.premintStartLeft = Math.floor(res.data[1] / 1000)
      })
    },
    async getPreMintedNum() {
      const { code, data } = await getPreMintedNum()
      if (+code !== 0) return
      this.premintedSum = data
    },
    async getMintedList() {
      const { code, data } = await getMintedList()
      if (+code !== 0) return
      this.mintedList = data
    },
    async login() {
      const commonStore = useCommonStore()
      if (!commonStore.loginModalRef) return
      // PC登录 & 移动端登录
      if (os.isPc) {
        commonStore.loginModalRef.show()
      } else {
        commonStore.loginModalRef.mobileLogin()
      }
    },
    async getProfile(token: string) {
      const httpConfig = { headers: { 'I-Authorization': `Bearer ${token}` } }
      const { code, data } = (await getProfile(httpConfig)) || {}
      // user/getUserInfo
      console.log(
        '%c [ data ]-19',
        'font-size:13px; background:pink; color:#bf2c9f;',
        data
      )
      const codeNum = Number(code)
      const { relationAuthorization } = data || {}
      if (!relationAuthorization) return
      this.relationAuthorization = relationAuthorization

      getUserInfo().then(({ code, data }) => {
        this.name = data.name
        this.avatar = data.avatar
        this.relationId = data.relationId
      })
    },

    logout() {
      // this.$reset()
      this.address = ''
      this.name = ''
      this.avatar = ''
      this.relationAuthorization = ''
      this.relationId = ''

      this.bindedDomain = ''
      this.preminted = false

      useMineStore().reset()
    }
  }
})

export default useUserStore
