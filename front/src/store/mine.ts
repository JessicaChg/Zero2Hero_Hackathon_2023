import { getProfile, getUserInfo, getNamePhase, getPreMintedNum } from '@/api'
import useCommonStore from './common'
import { os } from '@/utils/utils'

const useUserStore = defineStore('relation-nameservice-mine', {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  },
  state: (): {
    tokenList: any[]
  } => ({
    tokenList: []
  }),
  actions: {
    async getPreMintedNum() {
      const { code, data } = await getPreMintedNum()
      if (+code !== 0) return

      // this.premintedSum = data
    },

    reset() {
      this.$reset()
    }
  }
})

export default useUserStore
