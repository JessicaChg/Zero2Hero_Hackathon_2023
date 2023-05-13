<script setup lang="ts">
import { getNameStatus, getNamePhase, setNamePhase } from '@/api'
import useUserStore from '@/store/user'
import { useSearch } from '@/hooks'
import { nameRule } from '@/constants/rule'
import { calcCountDown } from '@/utils/utils'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

onMounted(() => {
  // user.getPreMintedNum()
  user.getMintedList()
})

// const { searchText, searching, errTip, searchResult, onSearch } = useSearch()
const searchText = ref('')
const onSearch = (r: any) => {
  if (!user.address) return user.login()
  if (!searchText.value) return

  router.push(
    `/search/${encodeURIComponent(searchText.value.toLocaleLowerCase())}`
  )
}

const { isScrolling, y } = useScroll(window)

const checkScroll = async () => {
  if (route.name !== 'home' || isScrolling.value) return

  const h = route.hash
  const id = h.replace('#', '')
  if (id) {
    await nextTick()
    document.querySelector(`.${id}`)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const checkLink = useDebounceFn((v) => {
  const y1 = document.querySelector('.home-head')?.clientHeight || 0
  if (v === 0) {
    location.hash = ''
  } else if (v < y1) {
    location.hash = '#soul'
  } else {
    location.hash = '#launchplan'
  }
}, 30)
watch(
  () => route.hash,
  () => {
    checkScroll()
  }
)

watch(y, (v) => {
  checkLink(v)
})
onMounted(() => {
  checkScroll()
})

const m = new Date().getMonth() + 1
const d = new Date().getDate() - 1
const activeDay = ref(m !== 5 ? 0 : Math.min(4, d))
const daySum = computed(() => {
  // remainingAmount limit
  if (!user.premintedSum)
    return {
      left: undefined,
      minted: undefined,
      percent: undefined
    }

  const data = user.premintedSum

  return {
    left: data.remainingAmount,
    minted: data.mint,
    percent: data.progress * 100
  }
})

// const total
let timer: any
const leftTime = ref<any>()
const calc = () => {
  if (user.premintStartLeft === undefined) return

  if (user.premintStartLeft <= 0) {
    clearInterval(timer)
    return
  }

  leftTime.value = calcCountDown(user.premintStartLeft)
  user.premintStartLeft--
}
calc()
timer = setInterval(calc, 1000)
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div class="home-wrap soul">
    <div class="home-head">
      <div class="head-wrap">
        <div class="head">
          <div class="flex-a spa">
            <div class="label">Public Mint Release</div>

            <div class="flex-a">
              <a
                href="https://etherscan.io/token/0x171f83d8e5b9c915b726784871f7f9f205f55365"
                target="_blank"
                class="mr10"
              >
                <svg-icon name="ethscan" class="fs26" />
              </a>
              <a
                href="https://opensea.io/collection/soul-profile"
                target="_blank"
              >
                <svg-icon name="opensea" class="fs26" />
              </a>
            </div>
          </div>

          <div class="desc">
            <p class="dtitle">What is .soul</p>
            <div class="desc-text">
              .Soul (Relation Profile Name) is your unique identifier used in
              all Relation Protocol. Having a Relation Profile Name not only
              means you obtain ownership control over content data (including
              generated S-SBTs) but also means that you benefit from worldwide
              encryption protection and data control while creating valuable
              digital assets with global users that enhance your influence and
              worth. Additionally, holding a .Soul also serves as a Relation
              airdrop entry ticket.
            </div>
          </div>
        </div>

        <re-image :src="$getImgUrl('token.png')" class="img" />
      </div>

      <div class="title pretitle">
        <div class="carousel-wrap" style="position: relative">
          <el-carousel
            height="32px"
            direction="vertical"
            :autoplay="true"
            :indicator-position="'none'"
            :interval="5000"
            :pause-on-hover="false"
            style="
              border-radius: 2px;
              background: rgba(255, 255, 255, 0.09);
              flex: 1;
            "
            v-if="user.mintedList?.length"
          >
            <el-carousel-item v-for="item in user.mintedList" :key="item">
              <div style="height: 100%" class="flex-a fs14 carousel-item">
                <span
                  class="c-main mr10"
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ item }}
                </span>
                <span style="flex-shrink: 0">has just been minted</span>
              </div>
            </el-carousel-item>
          </el-carousel>

          <SvgIcon name="laba" class="laba" />
        </div>
      </div>

      <div class="">
        <!-- <div class="flex-a countdown" v-if="user.premintStartLeft > 0">
          <span class="n">{{ leftTime?.days }}d</span>
          <span class="n">{{ leftTime?.hh }}h</span>
          <span class="n">{{ leftTime?.mm }}m</span>
          <span class="n">{{ leftTime?.ss }}s</span>
        </div> -->

        <div class="">
          <div class="home-search-wrap">
            <div class="flex-a-j form-wrap">
              <el-input
                v-model="searchText"
                placeholder="search"
                size="large"
                class="input"
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
              >
                Search
              </el-button>
            </div>
          </div>
          <div class="rule" v-html="nameRule"></div>
        </div>
      </div>
    </div>

    <!-- <ClaimCheck class="whitelist" /> -->

    <LaunchPlan />
  </div>
</template>
<style lang="scss" scoped>
.home-wrap {
  margin: 0 auto;
  padding-bottom: 100px;

  .home-head {
    padding-bottom: 40px;
  }
  .head-wrap {
    display: flex;
    justify-content: space-between;
    padding-top: 40px;
    margin-bottom: 60px;

    .head {
      padding-top: 20px;
      .label {
        display: inline-block;
        padding: 4px 32px;
        background: linear-gradient(90deg, #ab62a1 0%, #dd5c92 100%);
        border-radius: 4px;
        font-size: 32px;
        text-transform: uppercase;
      }

      .days {
        display: flex;
        margin: 32px 0 24px;

        .day {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          width: 120px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba($color: #fff, $alpha: 0.6);
          cursor: pointer;

          &:not(:last-child) {
            margin-right: 16px;
          }

          &.active {
            background: linear-gradient(90deg, #ab62a1 0%, #dd5c92 100%);
            border: none;
          }
        }
      }

      .day-process {
        position: relative;
        height: 24px;
        border-radius: 8px;
        background: rgba($color: #fff, $alpha: 0.2);
        margin-top: 20px;

        .inner {
          height: 100%;
          background: linear-gradient(90deg, #000000 0%, #db5c92 100%);
          border-radius: 8px;
        }

        .sum {
          position: absolute;
          top: 50%;
          left: calc(100% + 10px);
          transform: translateY(-50%);
          font-size: 14px;
          color: rgba($color: #fff, $alpha: 0.7);
          white-space: nowrap;
        }
      }

      .day-sum-left {
        margin-top: 6px;
        font-size: 16px;

        .left {
          color: rgba($color: #fff, $alpha: 0.7);
        }
      }

      .desc {
        width: 560px;
        font-size: 14px;
        margin-top: 32px;
        color: rgba($color: #fff, $alpha: 0.7);

        .dtitle {
          font-size: 24px;
          margin-bottom: 10px;
          color: rgba($color: #fff, $alpha: 1);
        }
      }
    }
    .img {
      width: 339px;
      height: 339px;
      border-radius: 4px;
    }
  }

  .title {
    font-size: 40px;
    margin-bottom: 20px;
  }
  .desc-text {
    font-size: 14px;
    color: rgba($color: #fff, $alpha: 0.7);

    p {
      position: relative;
      padding-left: 12px;
      margin-bottom: 4px;
      &::after {
        content: '';
        position: absolute;
        left: 0px;
        top: 7px;
        width: 6px;
        height: 6px;
        background-color: var(--el-color-primary);
        border-radius: 50%;
      }
    }
  }
  .countdown {
    .n {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 64px;
      border-radius: 4px;
      font-size: 24px;
      color: #dd5c92;
      margin-right: 24px;
      background: linear-gradient(
        90deg,
        rgba(#ab62a1, 0.4) 0%,
        rgba(#dd5c92, 0.4) 100%
      );
    }
  }

  .mint-desc {
    display: flex;
    align-items: center;
    margin: 40px 0;

    .soul-img {
      width: 400px;
      height: auto;
      margin-left: 80px;
    }
  }

  .pretitle {
    display: flex;
    align-items: center;

    .carousel-wrap {
      position: relative;
      margin-top: 10px;
      width: 500px;

      .carousel-item {
        padding: 0 36px;
      }

      .laba {
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .home-wrap {
    padding-bottom: 0px;

    .title {
      font-size: 32px;
    }

    .home-head {
      padding-bottom: 40px;
    }
    .head-wrap {
      display: block;
      position: relative;
      padding-top: 20px;
      margin: 0 15px 20px;

      .head {
        flex: 1;
        padding-top: 0px;
        .label {
          display: inline-block;
          padding: 4px 15px;
          background: linear-gradient(90deg, #ab62a1 0%, #dd5c92 100%);
          border-radius: 4px;
          font-size: 20px;
        }
        .title {
          font-size: 24px;
          margin: 10px 0 20px;
        }

        .days {
          display: flex;
          margin: 20px 0 16px;

          .day {
            font-size: 12px;
            width: 21%;
            height: 32px;

            &:not(:last-child) {
              margin-right: 4%;
            }

            &.active {
              background: linear-gradient(90deg, #ab62a1 0%, #dd5c92 100%);
              border: none;
            }
          }
        }

        .day-process {
          position: relative;
          height: 16px;
          border-radius: 8px;
          background: rgba($color: #fff, $alpha: 0.2);
          // margin-right: 60px;

          .inner {
            height: 100%;
            background: linear-gradient(90deg, #000000 0%, #db5c92 100%);
            border-radius: 8px;
          }

          .sum {
            position: absolute;
            top: 50%;
            left: calc(100% + 10px);
            transform: translateY(-50%);
            font-size: 14px;
            color: rgba($color: #fff, $alpha: 0.7);
            white-space: nowrap;
          }
        }

        .day-sum-left {
          margin-top: 6px;
          font-size: 14px;
          // margin-right: 63px;

          .left {
            color: rgba($color: #fff, $alpha: 0.7);
          }
        }

        .desc {
          width: auto;
          font-size: 12px;
        }
      }

      .img {
        width: 100%;
        margin-top: 20px;
      }
    }

    .pretitle {
      display: block;
      padding-left: 15px;
      .carousel-wrap {
        width: auto;
        margin-left: 0;
        margin-right: 15px;

        .carousel-item {
          padding-right: 10px;
        }
      }
    }

    .countdown {
      .n {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 64px;
        border-radius: 4px;
        font-size: 24px;
        color: #dd5c92;
        margin-right: 24px;
        background: linear-gradient(
          90deg,
          rgba(#ab62a1, 0.4) 0%,
          rgba(#dd5c92, 0.4) 100%
        );
      }
    }

    .mint-desc {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 40px 15px;

      .soul-img {
        width: 100%;
        height: auto;
        margin-left: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.home-search-wrap {
  .form-wrap {
    position: relative;
    .input {
      flex: 1;
      // width: 370px;

      .el-input__wrapper {
        background-color: #fff;
      }
      .el-input__inner {
        color: #000;
      }
    }
    .search-btn {
      width: 158px;
      margin-left: 20px;
    }

    .err-tip {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      font-size: 14px;
      color: #ff6666;

      .icon {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        border: 1px solid #ff6666;
        font-size: 12px;
        margin-right: 6px;
      }
    }
  }
}

.rule {
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 200;
  line-height: 18px;
}

@media screen and (max-width: 992px) {
  .home-search-wrap {
    width: 100%;
    padding: 0 15px;

    .form-wrap {
      width: 100%;
      position: relative;
      .input {
        width: auto;
        flex: 1;
      }
      .search-btn {
        width: 68px;
        margin-left: 10px;
      }

      .err-tip {
        top: calc(100% + 10px);
        font-size: 12px;
        .icon {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 1px solid #ff6666;
          font-size: 12px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
