<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { getNamePrice, genNameSignData } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
// import { defaultChain, getWalletProvider } from '../utils/providers'
// import nameAbi from '../abi/nameservice.json'
import { cutString } from '@/utils/utils'
import { useRegister } from '@/hooks'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()

const name = route.params.name + ''
const {
  gettingPrice,
  price,
  referrerAddress,
  gettingSign,
  register,
  gotSign,
  minting,
  success
} = useRegister(name)

const showProcess = computed(() => minting.value || gettingSign.value)

const disabled = computed(() => !name || gettingPrice.value)
</script>
<template>
  <RegisterSuccess v-if="success" />

  <div class="register-panel" v-else>
    <div class="flex-a-j">
      <TokenSvg :name="name" class="token-img" />
    </div>
    <div class="ta name">
      <span>{{ name }}</span>
      <span style="color: #d95d94">.soul</span>
    </div>

    <div class="card-ing" v-if="showProcess">
      <div class="fs24 ta">In registration/Registration completed.</div>
      <div class="fs14 ta mt4">It will take approximately 2 minutes.</div>

      <div class="inner">
        <div class="process">
          <div
            class="flex step"
            :class="{ active: gettingSign || gettingPrice }"
          >
            <div class="w18 h18 mr6">
              <SvgIcon name="check" class="check fs18" v-if="gotSign" />
              <SvgIcon name="loading" class="fs18 icon-loading" v-else />
            </div>

            <div class="row">
              <div class="flex1">
                1. Confirm profile name status and payment
              </div>
              <div class="addr">{{ cutString(userStore.address) }}</div>
            </div>
          </div>

          <div class="addr-m">{{ cutString(userStore.address) }}</div>

          <div class="flex-a step" :class="{ active: minting }">
            <div class="w18 h18 mr6">
              <SvgIcon name="check" class="check fs18" v-if="success" />
              <SvgIcon name="loading" class="fs18 icon-loading" v-else />
            </div>
            <span class="flex1">2. Mint Profile NFT</span>
          </div>
        </div>

        <div class="foot">
          <el-button
            type="primary"
            size="large"
            class=""
            @click="$router.push('/mine')"
          >
            View what I own
          </el-button>
        </div>
      </div>
    </div>
    <div class="card" v-else>
      <div class="inner">
        <div class="row">
          <div class="flex-a spa">
            <span class="fs16">Mint fee</span>
            <div class="">
              <span class="real-price fs20">
                {{ gettingPrice ? '-' : price }}
              </span>
              <span
                class="show-price ml10"
                v-if="userStore.phase === 'pre-mint'"
              >
                0.05
              </span>
              <SvgIcon name="eth" class="icon-eth" />
            </div>
          </div>
        </div>

        <div class="row" v-if="userStore.phase === 'public-mint'">
          <div class="flex-a spa">
            <div class="fs16">
              <p>Inviter</p>
              <p class="fs12" style="color: #b4b4b4">Inviter can receive 10% of your minting fee.</p>
            </div>
            <el-input
              v-model="referrerAddress"
              size="large"
              class="refer-input"
            >
              <template #suffix>
                <span class="fs20 cfff">.soul</span>
              </template>
            </el-input>
          </div>
        </div>

        <div class="foot">
          <el-button
            type="primary"
            size="large"
            class=""
            :disabled="disabled"
            :loading="gettingSign || minting"
            @click="register"
          >
            Register
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.register-panel {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  .token-img {
    width: 92px;
    height: 92px;
    background: #d8d8d8;
    border: 1px solid #000000;
    border-radius: 8px;
  }
  .name {
    margin: 20px 0;
    font-size: 30px;
    font-weight: bold;
  }
  .card {
    padding: 0px 12px 20px;
    background: #121212;
    border-radius: 4px;
    border: 1px solid #3d3d3d;

    .row {
      border-bottom: 1px solid #2c2c2c;
      padding: 15px 0;

      .show-price {
        text-decoration: line-through;
      }
      .icon-eth {
        font-size: 18px;
        transform: translateY(2px);
      }

      .refer-input {
        width: 60%;
        color: #fff;

        :deep(.el-input__wrapper) {
          border: none;
          box-shadow: none;
          background: #262931;
          border-radius: 4px;

          .el-input__inner {
            color: #fff;
          }
        }
      }
    }
    .foot {
      text-align: right;
      margin-top: 20px;
    }
  }

  .card-ing {
    padding: 26px 12px;
    background: #121212;
    border-radius: 4px;
    border: 1px solid #3d3d3d;

    .process {
      height: 153px;
      background: #262626;
      border-radius: 4px;
      margin-top: 20px;
      padding: 20px 15px;

      .step {
        margin-bottom: 10px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }

      .addr-m {
        display: none;
      }

      .check {
        color: #fff;
      }

      .icon-loading {
        animation: rotating 2s linear infinite;
        color: #d75c93;
        opacity: 0;
      }

      .addr {
        color: #fff;
      }

      .active {
        color: #d75c93;

        .icon-loading {
          opacity: 1;
        }
      }
    }

    .foot {
      text-align: right;
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 992px) {
  .register-panel {
    .token-img {
      width: 92px;
      height: 92px;
    }
    .name {
      margin: 10px 0;
      font-size: 18px;
    }
    .card {
      margin-top: 20px;
      .foot {
        text-align: right;
        margin-top: 20px;
      }
    }
    .card-ing {
      padding: 0;
      background: transparent;
      border: none;
      margin-top: 20px;
      .fs24 {
        font-size: 20px;
      }

      .inner {
        background: #121212;
        padding: 15px 12px;
        margin-top: 20px;
      }

      .process {
        height: auto;
        background: transparent;
        margin-top: 0;
        padding: 0 0 20px;
        border-bottom: 1px solid #2c2c2c;

        .step {
          margin-bottom: 4px;
        }

        .row {
          display: block;
          line-height: 20px;

          .addr {
            display: none;
          }
        }

        .addr-m {
          display: block;
          padding-left: 24px;
          margin-bottom: 20px;
        }

        .check {
          color: #fff;
        }

        .icon-loading {
          animation: rotating 2s linear infinite;
          color: #d75c93;
          opacity: 0;
        }

        .addr {
          color: #fff;
          font-weight: 200;
          padding-left: 15px;
        }

        .active {
          color: #d75c93;

          .icon-loading {
            opacity: 1;
          }
        }
      }

      .foot {
        text-align: right;
        margin-top: 20px;
      }
    }
  }
}
</style>
