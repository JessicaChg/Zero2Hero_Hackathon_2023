<template>
  <div class="flex-a name-item">
    <token-svg :name="name" class="img" />
    <div class="flex1 flex">
      <div class="soul-name">
        <span class="">{{ name }}</span>
        <span class="label flex-a-j" v-if="userStore.bindedDomain === name">
          soulbund
        </span>
      </div>
    </div>

    <div class="arrow" v-if="tokenId"></div>
  </div>
</template>

<script setup lang="ts">
import { defaultChain, registerChain } from '../utils/providers'
import nameAbi from '../abi/nameservice.json'
import useCommonStore from '@/store/common'
import useUserStore from '@/store/user'

interface Props {
  name?: string
  tokenId?: string
}
const props = withDefaults(defineProps<Props>(), {
  name: ''
})
const userStore = useUserStore()
const commonStore = useCommonStore()

const loading = ref(false)
const bindDomain = async () => {
  try {
    loading.value = true
    const contractAddr = await commonStore.getContractAddress()
    const nameServiceContract = await getContractInstance(
      registerChain.chainId,
      contractAddr,
      nameAbi
    )
    const addr = await window.ethereum.enable()
    const s = props.name + ''
    // if (!s.includes('.')) {
    //   s += '.rel'
    // }
    await (await nameServiceContract.setNameForAddr(addr[0], s)).wait()
    ElMessage.success('Soulbound successful!')

    userStore.bindedDomain = s
  } catch (error) {
    handleMintErr(error)
  }
  loading.value = false
}

const unbindDomain = async () => {
  try {
    loading.value = true
    const contractAddr = await commonStore.getContractAddress()
    const nameServiceContract = await getContractInstance(
      registerChain.chainId,
      contractAddr,
      nameAbi
    )
    const s = props.name
    await (
      await nameServiceContract.setNameForAddr(
        '0x0000000000000000000000000000000000000000',
        s
      )
    ).wait()
    ElMessage.success('Unbound  successful!')
    userStore.bindedDomain = ''
  } catch (error) {
    handleMintErr(error)
  }
  loading.value = false
}
</script>

<style lang="scss" scoped>
.name-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 54px;
  padding: 0 26px 0 12px;
  background: #262626;
  border-radius: 4px;
  margin-bottom: 20px;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -15px;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #dc5c93;
    z-index: 1;
  }

  .img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    margin-right: 12px;
  }

  .soul-name {
    position: relative;
    font-size: 20px;
    font-weight: 500;
  }

  .label {
    position: absolute;
    top: 50%;
    left: calc(100% + 10px);
    transform: translateY(-50%);
    padding: 2px 8px;
    font-size: 14px;
    background: linear-gradient(90deg, #a963a1 0%, #dc5c93 100%);
    border-radius: 4px;
  }

  .arrow {
    position: relative;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 50%;

    &::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translate(0%, -50%) rotate(45deg);
      width: 8px;
      height: 8px;
      border-top: 2px solid #979797;
      border-right: 2px solid #979797;
    }
  }
}

@media screen and (max-width: 992px) {
  .name-item {
    padding-right: 10px;
    padding-left: 6px;
  }
}
</style>
