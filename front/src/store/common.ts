import { getNameContractAddr } from './../api/index';
type Common = {
  loginModalRef: any
  nameContractAddress: string
  scrollY: number
}

const dev = import.meta.env.MODE === 'development'
const useCommonStore = defineStore('common', {
  state: (): Common => ({
    loginModalRef: null,
    nameContractAddress: dev ? '0xeb8247A3bE8B195630a9aC79f25C8C48F6D72311' : '',
    scrollY: 0,
  }),
  actions: {
    async getContractAddress() {
      if(this.nameContractAddress) return this.nameContractAddress

      const {code, data, desc} = await getNameContractAddr()
      if(+code !== 0) return 

      this.nameContractAddress = data
      return data
    }
  }
})


export default useCommonStore
