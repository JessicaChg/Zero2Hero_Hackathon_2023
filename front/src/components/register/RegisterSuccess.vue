<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { getNamePrice, genNameSignData } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { cutString } from '@/utils/utils'
import { useRegister } from '@/hooks'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commonStore = useCommonStore()
</script>
<template>
  <div class="register-success">
    <p class="fs20">Congratulations! Your Profile Name has been minted.</p>
    <div class="fs30 b mt10">
      <span>{{ route.params.name }}</span>
      <span style="color: #d95d94">.soul</span>
    </div>

    <div class="flex-a-j mt40">
      <el-button
        type="primary"
        size="large"
        class="fs18"
        @click="$router.replace('/mine')"
      >
        My .soul
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.register-success {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  padding: 15px 20px;
  background: #121212;
  border-radius: 8px;
  text-align: center;
}

@media screen and (max-width: 992px) {
  .register-success {
  }
}
</style>
