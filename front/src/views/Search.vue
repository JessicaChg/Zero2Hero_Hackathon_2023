<script setup lang="ts">
// import { ethers, providers } from 'ethers'
// import { getNamePrice, genNameSignData } from '@/api'
import useUserStore from '@/store/user'
// import useCommonStore from '@/store/common'
// import { defaultChain, getWalletProvider } from '../utils/providers'
// import nameAbi from '../abi/nameservice.json'
import { useRegister, useSearch } from '@/hooks'
import { nameRule } from '@/constants/rule'

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const { preminted } = useRegister()
const { searchText, searching, errTip, searchResult, onSearch } = useSearch()
const curName = computed(
  () => searchResult.value?.name || route.params?.name + ''
)

const showRegister = ref(false)

const loading = ref(false)
const disabled = computed(
  () =>
    (preminted.value && userStore.phase === 'pre-mint') ||
    !curName.value ||
    (searchResult.value && searchResult.value.status !== 'AVAILABLE')
)
const register = async () => {
  // showRegister.value = true
  router.push(`/register/${searchResult.value?.name}`)
}

onMounted(() => {
  searchText.value = route.params?.name + ''
  onSearch()
})
</script>
<template>
  <div class="search-wrap">
    <div class="nav-head flex-a">
      <div class="back" @click="$router.back">Back</div>
    </div>
    <SvgIcon name="arrow_back" class="arrow" @click="$router.back" />

    <div class="">
      <div class="flex-a-j">
        <!-- <re-image :src="relTokenSvg" class="token-img" /> -->
        <TokenSvg class="token-img" :name="searchResult?.name"></TokenSvg>
      </div>
      <!-- <div class="ta mt8 rel">
        <span>relation</span>
        <span style="color: #d95d94">.soul</span>
      </div> -->

      <div class="flex-a-j form-wrap">
        <el-input
          v-model="searchText"
          :disabled="searching"
          placeholder="search"
          size="large"
          class="flex1"
          @keyup.enter="onSearch"
        >
          <template #suffix>
            <span class="fs20" style="color: #000">.soul</span>
          </template>
        </el-input>

        <el-button
          type="primary"
          class="search-btn"
          size="large"
          @click="onSearch"
          :loading="searching"
        >
          Search
        </el-button>
      </div>
      <div class="err-tip" v-if="errTip">
        {{ errTip }}
      </div>
      <div
        class="err-tip"
        v-else-if="preminted && searchResult && userStore.phase === 'pre-mint'"
      >
        {{ 'The pre-mint phase can only mint one token!' }}
      </div>

      <div class="card" v-show="!searching && searchResult">
        <div class="name-wrap ta" v-if="searchResult">
          <div class="flex-a-j">
            <div
              class="fs20 rstatus"
              :class="[searchResult.status.toLocaleLowerCase()]"
            >
              {{ searchResult.status }}
            </div>
          </div>
          <div class="name">
            <span>{{ searchResult.name }}</span>
            <span class="c-main">.soul</span>
          </div>
        </div>

        <!-- <div class="body">
          <div class="flex-a">
            <div class="mint-tip flex-a" v-show="loaded && !minted">
              <div class="icon flex-a-j">i</div>
              <span>Only address holding Whitelist can Register</span>
            </div>
          </div>
        </div> -->

        <div class="flex-a-j mt40">
          <el-button
            type="primary"
            size="large"
            class="register-btn"
            @click="register"
            :disabled="disabled"
            :loading="loading"
          >
            Register
          </el-button>
        </div>
      </div>

      <div class="rule" v-html="nameRule"></div>
    </div>

    <!-- <Register v-if="showRegister"/> -->
  </div>
</template>
<style lang="scss" scoped>
.search-wrap {
  margin: 0 auto;
  padding-bottom: 250px;

  .arrow {
    display: none;
  }
  .token-img {
    width: 186px;
    height: 186px;
    border-radius: 8px;

    :deep(svg) {
      width: 186px;
      height: 186px;
    }
  }
  .rel {
    font-size: 30px;
  }

  .rule {
    max-width: 500px;
    margin: 20px auto 0;
    padding: 15px 12px;
    background: #121212;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 200;
    line-height: 18px;
  }

  .form-wrap {
    position: relative;
    width: 500px;
    margin: 60px auto 0;

    .search-btn {
      margin-left: 10px;
    }
  }

  .err-tip {
    width: 100%;
    max-width: 500px;
    font-size: 14px;
    color: var(--el-color-primary);
    margin: 10px auto 0;
  }

  .card {
    position: relative;
    width: 500px;
    padding: 0 15px 20px;
    background: #121212;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.19);
    margin: 20px auto 0;

    .name-wrap {
      padding: 15px 0;
      // border-bottom: 1px solid rgba(235, 235, 235, 0.12);
      .rstatus {
        margin: 10px 0;
        padding: 4px 10px;
        border-radius: 4px;
        color: #ff4d4f;
        background-color: rgb($color: #ff4d4f, $alpha: 0.4);

        &.available {
          color: #52c41a;
          background-color: rgb($color: #52c41a, $alpha: 0.4);
        }

        &.registered {
        }
      }
      .name {
        position: relative;
        font-size: 30px;
        font-weight: bold;
        word-break: break-word;
        .status {
          position: absolute;
          top: 50%;
          left: calc(100% + 10px);
          transform: translateY(-50%);
          font-weight: 200;
          padding: 4px 8px;
          font-size: 12px;
          background: linear-gradient(103deg, #ab63a1 0%, #dd5c92 100%);
          border-radius: 11px;
        }
      }
    }

    .body {
      position: relative;
      padding: 20px 0;
      .mint-tip {
        padding: 2px 6px;
        background: rgba(246, 194, 194, 0.29);
        border-radius: 10px;
        font-size: 12px;
        color: #ff6666;
        margin-bottom: 20px;

        .icon {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid #ff6666;
          font-size: 12px;
          margin-right: 6px;
        }
      }
    }

    .register-btn {
      // position: absolute;
      // bottom: 20px;
      // left: 50%;
      // transform: translateX(-50%);
    }
  }
}
@media screen and (max-width: 992px) {
  .search-wrap {
    padding-bottom: 50px;
    margin: 0 15px;

    .nav-head {
      display: none;
    }

    .arrow {
      display: block;
      font-size: 20px;
      margin-right: 10px;
    }

    .form-wrap {
      width: auto;
      margin: 10px auto 0;

      .search-btn {
        margin-left: 10px;
      }
    }

    .card {
      position: relative;
      width: auto;
      height: 215px;
      padding: 0 15px;

      .name-wrap {
        border-bottom: 1px solid rgba(235, 235, 235, 0.12);
        .name {
          position: relative;
          font-size: 24px;
          font-weight: bold;

          .status {
            transform: translateY(-50%) scale(0.9);
            transform-origin: left center;
          }
        }
      }

      .body {
        position: relative;
        padding: 20px 0;
        .mint-tip {
          padding: 2px 6px;
          background: rgba(246, 194, 194, 0.29);
          border-radius: 10px;
          font-size: 12px;
          color: #ff6666;
          margin-bottom: 20px;

          .icon {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 1px solid #ff6666;
            font-size: 12px;
            margin-right: 6px;
          }
        }
      }

      .register-btn {
      }
    }
  }
}
</style>
