<script setup lang="ts">
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { defaultChain, registerChain } from '../utils/providers'
import nameAbi from '../abi/nameservice.json'

interface Props {
  modelValue: boolean
  tokenId: string
  name: string
}

const userStore = useUserStore()
const commonStore = useCommonStore()

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits(['close', 'update:modelValue', 'chooseWallet'])

interface WalletItem {
  icon: string
  name: string
  url: any
}

const visible = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  }
})

const allWallets = computed(() => [
  {
    icon: 'https://relationlabs.ai/icon/club/opensea.svg',
    name: 'Opensea',
    url: `https://opensea.io/assets/ethereum/0x171f83d8e5b9c915b726784871f7f9f205f55365/${props.tokenId}`
  },
  {
    icon: 'https://relationlabs.ai/icon/club/ethscan.svg',
    name: 'Etherscan',
    url: `https://etherscan.io/token/0x171f83d8e5b9c915b726784871f7f9f205f55365`
  }
])

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

    visible.value = false
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
    visible.value = false
  } catch (error) {
    handleMintErr(error)
  }
  loading.value = false
}
const onSoulbound = async () => {
  if (userStore.bindedDomain === props.name) {
    unbindDomain()
  } else {
    bindDomain()
  }
}
</script>
<template>
  <el-dialog
    v-model="visible"
    center
    custom-class="name-scan-modal"
    width="1360px"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <div class="name-scan-modal-content">
      <div class="login-header">Setting</div>
      <div class="login-btns">
        <div class="login-btn-wrap">
          <el-button
            :loading="loading"
            class="login-btns_item"
            type="text"
            @click="onSoulbound"
          >
            <div class="login-btns_item_left">
              <!-- <svg-icon class="login-logo-svg" :name="`${wallet.icon}`" /> -->
              <token-svg :name="''" class="login-logo-svg" />
              <div class="login-btns_item_name">
                {{ userStore.bindedDomain === name ? 'Unbound' : 'Soulbound' }}
              </div>
            </div>
          </el-button>
        </div>
      </div>

      <div class="tips">
        <div class="tip">
          After completing SoulBound, the .soul name will be locked and you will
          receive a Semantic SBT representing the ID.
        </div>
        <div class="tip">
          SoulBound can be released at any time and can be transferred.
        </div>
      </div>

      <div class="login-header">View on</div>
      <div class="login-btns">
        <div
          v-for="wallet in allWallets"
          :key="wallet.name"
          class="login-btn-wrap"
        >
          <a class="login-btns_item" :href="wallet.url" target="_blank">
            <div class="login-btns_item_left">
              <!-- <svg-icon class="login-logo-svg" :name="`${wallet.icon}`" /> -->
              <img class="login-logo-svg" :src="`${wallet.icon}`" />
              <div class="login-btns_item_name">{{ wallet.name }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.name-scan-modal {
  width: 100%;
  max-width: 390px;
  background: #000;
  box-shadow: 0px 0px 20px rgba($color: #fff, $alpha: 0.15);
  border-radius: 20px;
  overflow: hidden;
  color: #fff;

  .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn .el-dialog__close {
      color: #bac4cf;
    }
  }
  .el-dialog__body {
    padding: 0;
    word-break: break-word;

    .name-scan-modal-content {
      flex-direction: column;
      .login-header {
        margin-left: 24px;
        font-size: 24px;
        font-weight: 600;
        height: 76px;
        line-height: 76px;
        color: #fff;
        // background: linear-gradient(90.53deg,#FF237F 0%,rgba(255,35,127,0.51) 100%);
      }
      .login-buttons {
        display: inline;
      }
      .login-btns {
        overflow-y: auto;
        padding: 0 22px;

        .login-btn-wrap {
          margin-bottom: 12px;
          border: 1px solid #eaeff4;
          border-radius: 8px;
          &.disabled {
            border: 1px solid #ff237f;
            &:hover {
              border: 1px solid #ff237f;
            }
          }
          &:hover {
            border: 1px solid #ff237f;
          }
          .login-logo-svg {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
          .login-btns_item {
            display: flex;
            padding: 12px 16px;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            height: auto;
            width: 100%;

            .login-btns_item_left {
              display: flex;
              align-items: center;

              .login-btns_item_name {
                font-weight: 600;
                font-size: 16px;
                margin-left: 12px;
                line-height: 20px;
                color: #fff;
              }
            }

            .login-btns_item_chain {
              color: #8994a2;
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              background: #f4f7fa;
              border-radius: 8px;
              padding: 4px 8px;
            }
          }
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
      .login-footer {
        height: 88px;
        background: #f4f7fa;
        padding: 12px 32px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .login-tips {
          color: #000;
          font-size: 14px;
          font-weight: 600px;
          line-height: 20px;
          height: 20px;
          margin-bottom: 8px;
        }
        .login-chains {
          display: inline-flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .support-chains {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;

            overflow: hidden;
            border: 1px solid #eaeff4;
            width: 34px;
            height: 34px;
            margin: 0 8px;
            img {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  .tips {
    padding: 0 22px;
    font-size: 12px;

    .tip {
      position: relative;
      padding-left: 12px;
      line-height: 22px;
      font-weight: 200;
      color: rgba($color: #fff, $alpha: 0.7);

      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 8px;
        width: 6px;
        height: 6px;
        background-color: #ffffff;
        border-radius: 50%;
      }
    }
  }
}
</style>
