<script setup lang="ts">
import { getNameStatus } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { calcCountDown } from '@/utils/utils'
const common = useCommonStore()

const welcomeRef = ref()
const { y } = useWindowScroll() // useScroll(welcomeRef)
watch(y, (v) => {
  common.scrollY = v
})

const leftTime = ref<any>()
const target = new Date('2023/5/1 8:00Z')
const calc = () => {
  const t = Math.floor((target.getTime() - new Date().getTime()) / 1000)
  leftTime.value = calcCountDown(t)
}
calc()
let timer = setInterval(calc, 1000)
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div class="welcome-wrap">
    <div class="bgs">
      <img :src="$getImgUrl('bg.png')" alt="" />
      <img :src="$getImgUrl('bg.png')" class="bg2" alt="" />
      <img :src="$getImgUrl('bg.png')" alt="" />
      <img :src="$getImgUrl('bg.png')" class="bg2" alt="" />
    </div>
    <div class="top-wrap welpage1">
      <div class="top">
        <div class="left">
          <div class="title text-linear">Mint your .soul Name</div>
          <div class="desc">
            .Soul (Relation Profile Name) is your unique identifier used in all
            Relation Protocol. Having a Relation Profile Name not only means you
            obtain ownership control over content data (including generated
            Semantic SBTs) but also means that you benefit from worldwide encryption
            protection and data control while creating valuable digital assets
            with global users that enhance your influence and worth.
            Additionally, holding a .Soul also serves as a Relation airdrop
            entry ticket.
          </div>

          <div class="countdown" v-show="leftTime">
            <div class="coming">Pre-mint:</div>
            <div class="flex-a">
              <span class="n">{{ leftTime?.days }}d</span>
              <span class="n">{{ leftTime?.hh }}h</span>
              <span class="n">{{ leftTime?.mm }}m</span>
              <span class="n">{{ leftTime?.ss }}s</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img :src="$getImgUrl('token.png')" class="token" alt="" />
        </div>
      </div>
    </div>

    <div class="plan-wrap">
      <div class="content-wrap">
        <ClaimCheck class="whitelist" />

        <div class="title text-linear launchplan">Launch plan</div>

        <div class="pblock-list">
          <div class="p-block">
            <div class="time">
              Apr 18th ~ Apr 30th(UTC)
              <SvgIcon name="rocket" class="rocket" />
            </div>
            <div class="stitle text-linear">Whitelist Distribution</div>
            <div class="tips">
              <div class="tip">
                Only 1 whitelist can be obtained per address
              </div>
              <div class="tip">
                Whitelist is an Semantic SBT, it cannot be transferred
              </div>
            </div>
          </div>

          <div class="p-block">
            <div class="time">May 1st 8AM(UTC)</div>
            <div class="stitle text-linear">Pre-mint</div>
            <div class="tips">
              <div class="tip">Price: free mint</div>
              <div class="tip">Upper limit: 8000</div>
              <div class="tip">
                Only addresses holding Pre-Mint SBT can participate，Pre-mint
                stage automatically closes after reaching the upper limit.
              </div>
            </div>
          </div>

          <div class="p-block">
            <div class="time">After Pre-Mint</div>
            <div class="stitle text-linear">Public Mint</div>
            <div class="tips">
              <div class="tip">Initial price: 0.025ETH</div>
              <div class="tip">
                During the public-mint stage, a reverse Dutch auction will be
                used, with an initial price of 0.025 ETH. The price will
                increase by 0.005 ETH for every 3000 .soul NFT minted.
              </div>
            </div>
          </div>

          <div class="p-block">
            <div class="time">May 8th 8AM(UTC)</div>
            <div class="stitle text-linear">SoulBound Release</div>
            <div class="tips">
              <div class="tip">
                The SoulBound feature of the .soul name can be used to initiate
                SBJ (SoulBoundJournal). After completing SoulBound, the .soul
                name will be locked and you will receive a Semantic SBT
                representing the ID.
              </div>
              <div class="tip">
                SoulBound can be released at any time and can be transferred,
                but when releasing SoulBound, SBJ will be cleared.
              </div>
            </div>
          </div>

          <div class="p-block">
            <div class="time">Coming Soon</div>
            <div class="stitle text-linear">Souldrop Alpha</div>
            <div class="tips">
              <div class="tip">
                During the alpha airdrop, SoulBound Journal is the only proof
                that people will receive the airdrop.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer class="wel-footer" />
  </div>
</template>
<style lang="scss">
.welcome-wrap {
  position: absolute;
  top: 0;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-image: url(@img/bg.png);
  background-size: 100vw auto;
  background-repeat: no-repeat;
  background-position: center top;
  padding-bottom: 0px;
  overflow: hidden;

  .bgs {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    min-width: 1920px;
    transform: translateX(-50%);

    img {
      width: 100%;
      height: auto;
      vertical-align: bottom;
      object-fit: cover;
    }
    .bg2 {
      transform: rotateZ(180deg) rotateY(180deg);
    }
  }

  .top-wrap {
    display: flex;
    align-items: center;
    padding-top: 40px;
    // height: 900px;
    // background-image: url(@img/token.png);
    // background-size: auto 40vw;
    // background-repeat: no-repeat;
    // background-position: 44vw center;

    .top {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      margin: 0 auto;

      .left {
        position: absolute;
        left: 10vw;
        top: 50%;
        transform: translateY(-50%);
        width: calc(75200vw / 1920);
        // margin-left: 10vw;

        .title {
          font-size: 3.6vw;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .desc {
          width: calc(69000vw / 1920);
          font-size: 14px;
          font-weight: 200;
        }
      }

      .right {
        transform: translateX(1vw);
        .token {
          height: 40vw;
          width: auto;
        }
      }
    }
  }

  .countdown {
    margin-top: 40px;
    font-size: 2.15vw;
    .coming {
      margin-bottom: 20px;
    }
    .n {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 64px;
      border-radius: 4px;
      font-size: 2.2vw;
      color: #dd5c92;
      margin-right: 20px;
      background: rgba(221, 92, 146, 0.3);
    }
    .days {
      font-size: 2vw;
    }
    .s {
      margin: 0 10px;
    }
  }

  .plan-wrap {
    position: relative;
    margin-top: -2.7vw;
    height: auto;
    padding-top: 10vw;
    width: 100%;
    overflow: hidden;
    padding-bottom: 400px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%) rotateZ(180deg) rotateY(180deg);
      width: 490vw;
      height: 490vw;
      border-radius: 50%;
      border: 1px solid #fff;
      overflow: hidden;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 631px;

      background-image: url(@img/star.png);
      background-size: auto;
      background-position: 4vw 8vw;
      background-repeat: no-repeat;
    }

    .content-wrap {
      position: relative;
      width: 80vw;
      margin: 0 auto;
      z-index: 1;
    }

    .pblock-list {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;

      .p-block {
        background: linear-gradient(
          97deg,
          rgba(#323539, 0.5) 0%,
          rgba(#1a1b1e, 0.5) 100%
        );
        // background: linear-gradient(97deg, #1a2b3d 0%, #0e1623 100%);
        border-radius: 15px;
        padding: 50px;
        margin-bottom: 60px;
        height: 298px;
        width: 48%;

        &:first-child {
          width: 100%;
          height: auto;
        }
      }
    }

    .title {
      font-size: 2.6vw;
      font-weight: bold;
    }
    .stitle {
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .time {
      position: relative;
      display: flex;
      align-items: center;
      width: fit-content;
      background: #dd5c92;
      border-radius: 22px;
      font-size: 18px;
      padding: 6px 10px 6px 30px;
      margin-bottom: 14px;

      &::after {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background-color: #000;
        border-radius: 50%;
      }

      .rocket {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: calc(100% + 10px);
        font-size: 30px;
      }
    }
    .tips {
      font-size: 14px;
      font-weight: 100;
      .tip {
        position: relative;
        padding-left: 12px;
        line-height: 22px;
        font-weight: 200;

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

  .wel-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}

@media screen and (max-width: 1400px) {
  .welcome-wrap {
    .plan-wrap {
      .pblock-list {
        .p-block {
          height: 340px;
        }
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .welcome-wrap {
    width: 100%;

    .wel-footer {
      display: none;
    }
  }

  .welcome-wrap {
    position: absolute;
    top: 0;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    background-image: url(@img/bg.png);
    background-size: 100vw auto;
    background-repeat: no-repeat;
    background-position: center top;
    padding-bottom: 0px;
    overflow: hidden;

    .bgs {
      position: absolute;
      top: 0;
      left: 50%;
      width: 100%;
      min-width: 1920px;
      transform: translateX(-50%);

      img {
        width: 100%;
        height: auto;
        vertical-align: bottom;
      }
      .bg2 {
        transform: rotateZ(180deg) rotateY(180deg);
      }
    }

    .top-wrap {
      display: flex;
      align-items: center;
      padding: 0 20px;
      padding-top: 90px;

      .top {
        position: relative;
        display: block;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        margin: 0 auto;

        .left {
          position: relative;
          left: 0;
          top: 0%;
          transform: translateY(0%);
          width: 100%;
          z-index: 1;
          // margin-left: 10vw;

          .title {
            width: 230px;
            font-size: 40px;
            margin-bottom: 16px;
          }

          .desc {
            width: auto;
            font-size: 14px;
            line-height: 20px;
          }
        }

        .right {
          position: relative;
          width: calc(100vw - 40px);
          height: 90vw;
          transform: translateX(0);
          .token {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -40px);
            height: auto;
            width: 150vw;
          }
        }
      }
    }

    .countdown {
      margin-top: 40px;
      font-size: 20px;
      .coming {
        margin-bottom: 20px;
      }
      .n {
        width: 50px;
        height: 32px;
        font-size: 21px;
        margin-right: 10px;
      }
      .days {
        font-size: 15px;
      }
    }

    .plan-wrap {
      position: relative;
      margin-top: -3vw;
      height: auto;
      padding-top: 10vw;
      width: 100%;
      overflow: hidden;
      padding-bottom: 100px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotateZ(180deg) rotateY(180deg);
        width: 490vw;
        height: 490vw;
        border-radius: 50%;
        border: 1px solid #fff;
        overflow: hidden;
        border-top-color: transparent;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 631px;

        background-image: url(@img/star.png);
        background-size: auto;
        background-position: 4vw 8vw;
        background-repeat: no-repeat;
      }

      .pblock-list {
        margin-top: 20px;

        .p-block {
          background: linear-gradient(
            97deg,
            rgba(#323539, 0.5) 0%,
            rgba(#1a1b1e, 0.5) 100%
          );
          border-radius: 15px;
          padding: 15px;
          margin-bottom: 24px;
          width: 100%;
          height: auto;
        }
      }

      .content-wrap {
        width: calc(100vw - 40px);
        margin: 0 auto;
      }

      .title {
        font-size: 25px;
      }
      .stitle {
        font-size: 20px;
        margin-top: 12px;
      }
      .time {
        font-size: 14px;
        margin-bottom: 10px;

        border-radius: 22px;
        padding: 3px 12px 3px 18px;
        margin-bottom: 10px;

        &::after {
          left: 6px;
          width: 6px;
          height: 6px;
        }

        .rocket {
          font-size: 20px;
        }
      }
      .tips {
        font-size: 13px;
        font-weight: 100;
        .tip {
          position: relative;
          padding-left: 12px;
          line-height: 22px;

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
  }
}
</style>
