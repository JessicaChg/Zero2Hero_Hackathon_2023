<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { getNamePrice, genNameSignData } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { defaultChain, getWalletProvider } from '../utils/providers'
import nameAbi from '../abi/nameservice.json'
import { useSearch } from '@/hooks'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()

const referrerAddress = ref('')
const price = ref('')
const loaded = ref(false)
const curName = computed(() => route.params.name + '')
const getPrice = async (name: string) => {
  const res = await getNamePrice(name, userStore.address)
  if (+res.code !== 0) return ElMessage.info(res.desc)
  if (name !== route.params.name + '') return

  price.value = res.data.price
  loaded.value = true
}

onMounted(() => {})

watch(
  () => route.params.name,
  (n) => {
    getPrice(n + '')
  },
  {
    immediate: true
  }
)

const loading = ref(false)
const disabled = computed(() => !loaded.value || !curName.value)
const success = ref(false)
const register = async () => {
  loading.value = true
  const d: any = {
    name,
    walletAddress: userStore.address,
    price: price.value
  }
  if (referrerAddress.value) {
    d.referrerAddress = referrerAddress.value
  }
  const { code, data, desc } = await genNameSignData(d)
  console.log(
    '%c [ data ]-31',
    'font-size:13px; background:pink; color:#bf2c9f;',
    data
  )
  if (+code !== 0) {
    loading.value = true
    return ElMessage.info(desc)
  }

  try {
    const contractAddr = await commonStore.getContractAddress()
    const contract = await getContractInstance(
      defaultChain.chainId,
      contractAddr,
      nameAbi
    )

    // const walletProvider = await getWalletProvider(userStore.wallet)
    // const provider = new providers.Web3Provider(walletProvider)

    console.log(
      '%c [ data.value ]-60',
      'font-size:13px; background:pink; color:#bf2c9f;',
      data.price
    )
    const p = data.price // ethers.BigNumber.from(data.price + '')
    console.log(
      '%c [ p ]-60',
      'font-size:13px; background:pink; color:#bf2c9f;',
      p
    )

    const trans = await contract.register(
      name,
      data.deadline,
      data.maxMintCount,
      p,
      data.signature,
      { value: p }
    )
    const res = await trans.wait()
    console.log(
      '%c [ res ]-45',
      'font-size:13px; background:pink; color:#bf2c9f;',
      res
    )
    ElMessage.success('Success')

    success.value = true
  } catch (error) {
    handleMintErr(error)
  }

  loading.value = false
}
</script>
<template>
  <div class="Register-wrap" ref="">
    <div class="head flex-a">
      <div class="back" @click="$router.back">Back</div>
    </div>
    <SearchInput  />

    <h2 class="mt40">Price: {{ loaded ? price : '-' }}</h2>

    <div class="flex-a mt20">
      <div>推荐人：</div>
      <el-input v-model="referrerAddress" style="width: 300px" />
    </div>

    <div class="mt100 ta">
      <el-button
        type="primary"
        size="large"
        class=""
        @click="register"
        :disabled="disabled"
        :loading="loading"
      >
        Register
      </el-button>

      <el-button
        type="primary"
        size="large"
        class=""
        @click="$router.push('/mine')"
      >
        查看我拥有的
      </el-button>
    </div>

    <div class="ta"></div>
  </div>
</template>
<style lang="scss">
.Register-wrap {
  margin: 0 auto;

  .head {
    margin-bottom: 60px;
  }
  .back {
    padding: 10px 20px;
    background: #262931;
    border-radius: 4px;
  }
}
</style>
