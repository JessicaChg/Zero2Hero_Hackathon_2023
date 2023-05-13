<script setup lang="ts">
import useUserStore from '@/store/user'
import {
  metamaskAuth,
  okAuth,
  tokenPocketAuth,
  hashkeymeAuth,
  entireWalletConnectAuth
} from '@/utils/wallet'
interface Props {
  addOwner?: boolean
  supportWallets?: any
  authType?: string
}

const user = useUserStore()

const props = withDefaults(defineProps<Props>(), {
  addOwner: false,
  supportWallets: []
})

const emit = defineEmits(['close', 'walletToken', 'chooseWallet'])

interface WalletItem {
  type: string
  name: string
  chains: string
  auth?: any
}

const visible = ref(false)

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const allWallets = ref<WalletItem[]>([
  {
    type: 'metamask',
    name: 'MetaMask',
    chains: 'Ethereum',
    auth: metamaskAuth
  },
  {
    type: 'hashkeyme',
    name: 'HashKey Me',
    chains: 'Ethereum',
    auth: hashkeymeAuth
  },
  {
    type: 'tokenPocket',
    name: 'TokenPocket',
    chains: 'Ethereum',
    auth: tokenPocketAuth
  },
  { type: 'ok', name: 'OKX Wallet', chains: 'Ethereum', auth: okAuth },
  {
    type: 'walletConnect',
    name: 'WalletConnect',
    chains: 'Ethereum',
    auth: entireWalletConnectAuth
  }
])

const mobileLogin = () => {
  const wallet = allWallets.value.find((e) => e.name === 'MetaMask')
  if (!wallet) return
  login(wallet?.type, wallet?.auth)
}

const login = async (type: string, auth: string) => {
  if (props.authType === 'getWalletName') {
    return emit('chooseWallet', type)
  }

  const authFun = auth as any
  let loading: any
  let autoCloseLoadingTimer: any
  const showLoading = () => {
    if (autoCloseLoadingTimer) clearTimeout(autoCloseLoadingTimer)
    if (loading) loading.close()
    loading = ElLoading.service({
      lock: true,
      text: 'Sign in',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  showLoading()
  autoCloseLoadingTimer = setTimeout(() => {
    loading.close()
  }, 3000)
  if (authFun) {
    try {
      const { identity, address } = (await authFun({ showLoading })) as any
      const { token } = identity || {}

      user.wallet = type;
      user.address = address;
      user.token = token

      user.getProfile(token)

      hide()

      if (props.authType === 'walletToken') {
        return emit('walletToken', token, type)
      }
    } catch (e: any) {
      console.log('%c [ e ]-98', 'font-size:13px; background:pink; color:#bf2c9f;', e)
      if (e.code && e.code === 'ACTION_REJECTED') return
      ElMessage.error(e.message || e.reason)
    }
    if (loading) loading.close()
  }
}

defineExpose({
  show,
  hide,
  mobileLogin
})
</script>
<template class="login-modal-wrap">
  <el-dialog
    v-model="visible"
    center
    custom-class="login-modal"
    width="1360px"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <div class="login-modal-content">
      <div class="login-header">Connect wallet</div>
      <div class="login-btns">
        <div
          v-for="wallet in allWallets"
          :key="wallet.type"
          class="login-btn-wrap"
        >
          <div class="login-btns_item" @click="login(wallet.type, wallet.auth)">
            <div class="login-btns_item_left">
              <svg-icon class="login-logo-svg" :name="`login-${wallet.type}`" />
              <div class="login-btns_item_name">{{ wallet.name }}</div>
            </div>

            <div
              class="login-btns_item_chain"
              v-if="wallet.chains != 'Ethereum'"
            >
              {{ wallet.chains }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.login-modal {
  width: 400px;
  background: #fff;
  box-shadow: 0px 24px 80px rgb(0 0 0 / 15%);
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

    .login-modal-content {
      flex-direction: column;
      .login-header {
        margin-left: 24px;
        font-size: 24px;
        font-weight: 600;
        height: 76px;
        line-height: 76px;
        color: #000;
        // background: linear-gradient(90.53deg,#FF237F 0%,rgba(255,35,127,0.51) 100%);
      }
      .login-buttons {
        display: inline;
      }
      .login-btns {
        overflow-y: auto;
        height: 458px;
        padding: 0 22px 22px 22px;

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
          }
          .login-btns_item {
            display: flex;
            padding: 12px 16px;
            justify-content: space-between;
            align-items: center;

            .login-btns_item_left {
              display: flex;
              align-items: center;

              .login-btns_item_name {
                font-weight: 600;
                font-size: 16px;
                margin-left: 12px;
                line-height: 20px;
                color: #000000;
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
}
</style>
