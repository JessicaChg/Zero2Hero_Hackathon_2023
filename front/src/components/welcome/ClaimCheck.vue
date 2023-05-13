<script setup lang="ts">
import { getNameStatus } from '@/api'
import useUserStore from '@/store/user'
import useCommonStore from '@/store/common'
import { calcCountDown } from '@/utils/utils'

import { useClaim } from '@/hooks'
const user = useUserStore()
const common = useCommonStore()

const allWhitelistNum = 10000

const { canClaim, onClaim, minted, claiming, mintedCount } = useClaim()

const list = [
  { text: '', link: 'https://taskon.xyz/campaign/detail/3618' },
  { text: '', link: 'https://s.giveaway.com/10pt5he' },
  { text: '', link: 'https://soquest.xyz/space/Relation/campaign/LJYKPSzYHu' },
  { text: '', link: 'https://galxe.com/Relation/campaign/GCZV7U8wVw' },
  { text: '', link: 'https://app.questn.com/quest/764374467811123687' }
]

const claimText = computed(() => {
  if (!user.address) return 'You can get the pre-mint whitelist.'
  if (minted.value) return 'You are holding whitelist.'
  if (canClaim.value) return 'You can get the pre-mint whitelist.'
  return `You don't have eligibility yet.`
})
</script>
<template>
  <div class="claim-wrap">
    <div class="block">
      <div class="l">
        <div class="ctitle">Whitelist</div>

        <div class="desc">
          Users who holding the pre-mint whitelist have the opportunity to mint
          .soul NFT for free during the pre-mint stage. Pre-mint whitelist is an
          SBT and participation in various joint activities of Relation can earn
          eligibility to receive the pre-mint whitelist.
        </div>
      </div>
      <div class="r">
        <ReImage :src="$getImgUrl(`welcome/nft.png`)" class="img" />

        <div class="tag-wrap">
          <img :src="$getImgUrl('welcome/gift.png')" class="gift" />
          <span>
            {{ claimText }}
          </span>
        </div>

        <div class="foot flex-a-j">
          <el-button
            v-if="!user.address"
            type="primary"
            @click="onClaim"
            class="btn flex-a-j connect"
          >
            Connect Wallet
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="onClaim"
            :loading="claiming"
            :disabled="!canClaim || minted"
            class="btn flex-a-j"
          >
            <span class="pc">{{ minted ? 'Claimed' : 'Claim' }}</span>
            <div class="mobile">
              <img :src="$getImgUrl('welcome/gift.png')" class="w14 h14 mr4" />
              <span>
                {{ claimText }}
              </span>
            </div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.claim-wrap {
  position: relative;
  z-index: 11;
  max-width: 80vw;
  margin: 0 auto 32px;

  .title {
    margin-bottom: 18px;
  }

  .title-s {
    font-size: 30px;
    font-family: LexendDeca-Bold, LexendDeca;
    font-weight: bold;
  }

  .total-wrap {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .process {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      height: 21px;
      background: #000000;
      border-radius: 11px;
      border: 2px solid #db5c92;
      .inner {
        height: 15px;
        background: linear-gradient(90deg, #000000 0%, #db5c92 100%);
        border-radius: 8px;
        transition: all 0.3s ease-in-out;
      }

      .sum {
        position: absolute;
        bottom: calc(100% + 10px);
        right: 0;
        font-size: 16px;
        color: #ff3d8f;
      }
    }
  }

  .desc {
    font-size: 14px;
    margin-top: 40px;
    font-weight: 200;
    margin-bottom: 60px;
    color: rgba($color: #fff, $alpha: 0.7);
  }

  .plist {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;

    .item {
      width: 110px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #ffffff;
      margin-right: 10px;
      margin-bottom: 10px;
      font-weight: 200;

      &:last-child {
        margin-right: 0;
      }

      .icon {
        height: 18px;
        width: auto;
      }

      .text {
        color: #fff;
      }
    }
  }

  .block {
    display: flex;
    // background: linear-gradient(
    //   97deg,
    //   rgba(#323539, 0.5) 0%,
    //   rgba(#1a1b1e, 0.5) 100%
    // );
    border-radius: 15px;
    // padding: 50px;

    .ctitle {
      font-size: 40px;
      padding-top: 30px;
    }

    .l {
      flex: 1;
      margin-right: 60px;
      // margin-right: 200px;
    }
    .r {
      --w: 286px;
      position: relative;
      width: var(--w);
      height: fit-content;
      background: #ffffff;
      border-radius: 15px;
      overflow: hidden;

      .img {
        width: var(--w);
        height: var(--w);
        // border-radius: 15px 15px 0 0;
        vertical-align: bottom;
        border-radius: 0;
      }

      .tag-wrap {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 36px;
        padding: 4px 20px 4px 14px;
        background: #dd5c92;
        border-radius: 6px 0px 28px 0px;
        font-size: 12px;

        .gift {
          vertical-align: bottom;
          width: 18px;
          height: 18px;
          margin-right: 6px;
        }
      }

      .foot {
        height: 86px;
      }
      .btn {
        width: 80%;
        height: 46px;
        background: linear-gradient(136deg, #ab63a1 0%, #db5c92 100%);
        border: none;
        border-radius: 28px;
        font-size: 18px;
        color: #fff;

        &.is-disabled {
          background: #ccc;

          &.connect {
            cursor: pointer;
          }
        }

        .mobile {
          display: none;
        }
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .claim-wrap {
    position: relative;
    z-index: 11;
    max-width: 100%;
    margin: 0 auto 32px;

    .title {
      margin-bottom: 18px;
    }

    .title-s {
      font-size: 18px;
    }

    .total-wrap {
      display: block;
      .process {
        margin-top: 10px;
        height: 16px;
        border-radius: 11px;
        .inner {
          height: 10px;
          background: linear-gradient(90deg, #000000 0%, #db5c92 100%);
          border-radius: 8px;
        }

        .sum {
          bottom: calc(100% + 10px);
          font-size: 12px;
          color: #ff3d8f;
        }
      }
    }

    .desc {
      font-size: 12px;
      margin-top: 10px;
      margin-bottom: 30px;
      line-height: 18px;
    }

    .plist {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;

      .item {
        width: 30%;
        height: 30px;
        margin-right: 10px;
        margin-bottom: 10px;
        font-weight: 200;
        font-size: 12px;

        .icon {
          height: 14px;
          width: auto;
        }
      }
    }

    .block {
      flex-direction: column;
      // background: linear-gradient(
      //   97deg,
      //   rgba(#323539, 0.5) 0%,
      //   rgba(#1a1b1e, 0.5) 100%
      // );
      border-radius: 15px;
      padding: 10px 15px;

      .ctitle {
        font-size: 32px;
      }

      .l {
        margin-right: 0;
      }
      .r {
        --w: 240px;
        border-radius: 15px;
        overflow: hidden;
        margin: 20px auto;

        .tag-wrap {
          display: none;
          align-items: center;
          position: absolute;
          top: 0;
          left: 0;
          height: 36px;
          padding: 4px 12px 4px 4px;
          background: #dd5c92;
          border-radius: 6px 0px 28px 0px;
          font-size: 12px;

          .gift {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }
        .foot {
          height: 66px;
        }
        .btn {
          width: auto;
          min-width: 90%;
          height: 40px;
          font-size: 16px;
          padding: 0 10px;

          .pc {
            display: none;
          }
          .mobile {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;

            vertical-align: bottom;
          }
        }
      }
    }
  }
}
</style>
