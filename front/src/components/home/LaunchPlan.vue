<script setup lang="ts"></script>
<template>
  <div class="plan-wrap launchplan">
    <div class="title">Launch plan</div>
    <div class="content-wrap">
      <div class="pblock-list">
        <div class="p-block">
          <div class="time">
            Apr 18th ~ Apr 30th(SGT) 
            <!-- <SvgIcon name="rocket" class="rocket" /> -->
          </div>
          <div class="stitle">Whitelist Distribution</div>
          <div class="tips">
            <div class="tip">Only 1 whitelist can be obtained per address</div>
            <div class="tip">
              Whitelist is an Semantic SBT, it cannot be transferred
            </div>
          </div>
        </div>

        <div class="p-block">
          <div class="time">May 1st ~ May 8th 16PM(SGT)</div>
          <div class="stitle">Pre-mint</div>
          <div class="tips">
            <div class="tip">Price: free mint</div>
            <div class="tip">
              Only addresses holding Pre-Mint SBT can participate，Pre-mint
              stage automatically closes after reaching the upper limit.
            </div>
          </div>
        </div>

        <div class="p-block">
          <div class="time">Released</div>
          <div class="stitle">Public Mint</div>
          <div class="tips">
            <div class="tip">Initial price: 0.025ETH</div>
            <div class="tip">
              During the public-mint stage, a reverse Dutch auction will be
              used, with an initial price of 0.025 ETH. The price will increase
              by 0.005 ETH for every 3000 .soul NFT minted.
            </div>
          </div>
        </div>

        <div class="p-block">
          <div class="time">Released</div>
          <div class="stitle">SoulBound Release</div>
          <div class="tips">
            <div class="tip">
              The SoulBound feature of the .soul name can be used to initiate
              SBJ (SoulBoundJournal). After completing SoulBound, the .soul name
              will be locked and you will receive a Semantic SBT representing
              the ID.
            </div>
            <div class="tip">
              SoulBound can be released at any time and can be transferred, but
              when releasing SoulBound, SBJ will be cleared.
            </div>
          </div>
        </div>

        <div class="p-block">
          <div class="time">Coming Soon</div>
          <div class="stitle">Souldrop Alpha</div>
          <div class="tips">
            <div class="tip">
              During the alpha airdrop, SoulBound Journal is the only proof that
              people will receive the airdrop.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.plan-wrap {
  position: relative;
  height: auto;
  padding-top: 80px;
  width: 100%;
  overflow: hidden;
  .content-wrap {
    position: relative;
    margin: 0 auto;
    z-index: 1;
  }

  .pblock-list {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 30px;

    .p-block {
      padding: 30px;
      margin-bottom: 20px;
      height: 298px;
      width: 49%;

      background: linear-gradient(85deg, #191919 0%, #000000 100%);
      border-radius: 15px;
      border: 1px solid #ffffff;

      &:last-child {
        width: 100%;
        height: auto;
      }

      &:nth-child(1),
      &:nth-child(2) {
        height: 240px;
      }
    }
  }

  .title {
    font-size: 40px;
    font-weight: bold;
    text-align: center;
  }
  .stitle {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .time {
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    font-size: 22px;
    padding: 6px 20px 6px 30px;
    margin-bottom: 14px;

    min-height: 43px;
    min-width: 280px;
    background: #292929;
    border-radius: 22px;
    border: 1px solid #ffffff;

    &::after {
      content: '';
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      background-color: #fff;
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

@media screen and (max-width: 1400px) {
  .plan-wrap {
    .pblock-list {
      .p-block {
        height: 340px;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .plan-wrap {
    position: relative;
    height: auto;
    width: 100%;
    overflow: hidden;
    padding: 20px 15px;

    .pblock-list {
      margin-top: 20px;

      .p-block {
        background: linear-gradient(85deg, #191919 0%, #000000 100%);
        border: 1px solid #ffffff;

        border-radius: 15px;
        padding: 15px;
        margin-bottom: 24px;
        width: 100%;
        height: auto !important;
      }
    }

    .content-wrap {
      margin: 0 auto;
    }

    .title {
      font-size: 18px;
      text-align: left;
    }
    .stitle {
      font-size: 14px;
      margin-top: 12px;
    }
    .time {
      height: auto;
      font-size: 16px;
      margin-bottom: 10px;
      min-width: auto;

      border-radius: 22px;
      padding: 3px 20px 3px 20px;
      margin-bottom: 10px;

      &::after {
        left: 8px;
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
</style>
