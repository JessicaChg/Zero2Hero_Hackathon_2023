<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { getNamePrice, genNameSignData } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { defaultChain, getWalletProvider } from '../utils/providers'
import nameAbi from '../abi/nameservice.json'
import { cutString } from '@/utils/utils'
import { useRegister } from '@/hooks'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()

 

</script>
<template>
  <div class="register-page-wrap">
    <div class="nav-head flex-a">
      <div class="back" @click="$router.back">Back</div>
    </div>
    <SvgIcon name="arrow_back" class="arrow" @click="$router.back" />

    <RegisterPanel />
  </div>
</template>
<style lang="scss" scoped>
.register-page-wrap {
  width: 100%;
  // max-width: 500px;
  padding-bottom: 250px;

  .arrow {
    display: none;
  }
}

@media screen and (max-width: 992px) {
  .register-page-wrap {
    position: relative;
    padding: 20px 15px 50px;

    .fs24 {
      font-size: 20px;
    }

    .nav-head {
      display: none;
    }
    .arrow {
      display: block;
      font-size: 20px;
      position: absolute;
      left: 15px;
      top: 15px;
    }
  }
}
</style>
