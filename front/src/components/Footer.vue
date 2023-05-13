<script setup lang="ts">
import { ref } from 'vue'
import Button from './common/Button.vue'

const officialHomeUrl = import.meta.env.VITE_RELATION_OFFICIAL_DOMAIN
const email = ref('')
const subscribeOk = ref(false)
const errorMsg = ref('')
const onChange = () => {
  errorMsg.value = ''
}
const subscribe = () => {}
</script>
<template>
  <div class="footer-main">
    <ul class="footer-wrap flex spa">
      <li>
        <!-- <img src="../assets/logo_text@2x.png" class="logo" alt="Relation" /> -->
        <div class="logo"></div>
        <p class="introduce description">The Social Infrastructure for Web3.</p>
        <ul class="address flex">
          <li class="address-item">
            <a href="https://twitter.com/relationlabs" target="_blank">
              <svg-icon class="icon-address" :name="`twitter`" />
            </a>
          </li>
          <li class="address-item">
            <a href="https://t.me/therelationlabs" target="_blank">
              <svg-icon class="icon-address" :name="`telegram`" />
            </a>
          </li>
          <li class="address-item">
            <a href="https://discord.com/invite/whGB5zEsHY" target="_blank">
              <svg-icon class="icon-address" :name="`discord`" />
            </a>
          </li>
          <li class="address-item">
            <a href="https://github.com/relationlabs" target="_blank">
              <svg-icon class="icon-address" :name="`github`" />
            </a>
          </li>
        </ul>
        <p class="description">© 2023 RELATION LABS</p>
      </li>
      <li>
        <ul class="list">
          <li class="item sub_title">About</li>
          <li class="item description">
            <a target="_blank" :href="officialHomeUrl">Home</a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://blog.relationlabs.ai/">Blog</a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://docs.relationlabs.ai/">
              Documentation
            </a>
          </li>
          <!-- <li class="item description">FAQs</li> -->
          <li class="item description">
            <a target="_blank" href="/Brand Asset.zip">Brand Asset</a>
          </li>
          <li class="item description">
            <a href="mailto:contacts@relationlabs.ai" target="_blank">
              Contact
            </a>
          </li>
        </ul>
      </li>
      <li>
        <ul class="list">
          <li class="item sub_title">Community</li>
          <li class="item description">
            <a target="_blank" href="https://twitter.com/relationlabs">
              Twitter
            </a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://t.me/therelationlabs">Telegram</a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://medium.com/@RelationLabs">
              Medium
            </a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://discord.com/invite/whGB5zEsHY">
              Discord
            </a>
          </li>
          <li class="item description">
            <a target="_blank" href="https://github.com/relationlabs">Github</a>
          </li>
        </ul>
      </li>
      <li>
        <ul class="list right">
          <li class="item sub_title">Subscribe</li>
          <li class="description">
            Subscribe to the newsletter to hear about Relation Labs updates and
            events.
          </li>
          <a
            class="subscribe flex"
            href="https://relation.substack.com/"
            target="_blank"
          >
            <input
              class="email mr20"
              readonly
              type="email"
              @change="onChange"
              @keyup.enter="subscribe"
              placeholder="Enter Your Email Address"
            />
            <!-- <Button msg="Send" :colorful="true" @jump-to="subscribe"></Button> -->
            <Button
              msg="Send"
              :colorful="true"
              :oneColorStyle="true"
              :oneFontStyle="true"
              @jump-to="subscribe"
            ></Button>
          </a>
          <li class="errorMsg" v-if="!!errorMsg">
            {{ errorMsg }}
          </li>
          <li class="tradeSuccess" v-if="!!subscribeOk">
            <span class="text">Successful</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.footer-main {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  // background: #000;

  background: #111111;
}
.footer-wrap {
  max-width: var(--main-content-width);
  margin: 0 auto;
  padding: 45px 0px;
  text-align: left;
  font-size: 14px;
  line-height: 14px;
  align-items: flex-start;
  position: relative;
  z-index: 11;
  .icon-address {
    width: 23px;
    height: 23px;
    color: #fff;
  }
  .logo {
    width: 132px;
    height: 36px;
    background-image: url('../assets/logo.png');
    background-size: 132px 36px;
  }
  .address {
    width: 130px;
    margin-bottom: 35px;
  }
  .address-item {
    margin-right: 24px;
    &:last-child {
      margin-right: 0px;
    }
  }
}

.introduce {
  margin-top: 20px;
  margin-bottom: 16px;
}

.list {
  .item {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 100%;
    font-weight: 100;
    a {
      color: #fff;
    }

    &:first-child {
      font-weight: 400;
      margin-bottom: 20px;
    }

    &:last-child {
      margin-bottom: 0px;
    }
  }

  &.right {
    width: 360px;
  }
}

.subscribe {
  margin-top: 22px;

  .btn {
    padding: 0 35px;
    height: 45px;
  }
}

.description {
  font-size: 14px;
  font-weight: 100;
}

.email {
  width: 222px;
  height: 44px;
  border-radius: 15px 15px 15px 15px;
  border: 1px solid #ebebeb;
  padding: 15px 25px;
  font-size: 14px;
  line-height: 14px;
  background: transparent;
  cursor: pointer;
}

.errorMsg {
  color: #f00;
  margin-top: 10px;
}

.tradeSuccess {
  width: 240px;
  height: 40px;
  position: absolute;
  left: 50%;
  top: 5px;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #009a4d;
  border-radius: 8px;
}
</style>
