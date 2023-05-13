<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { getWalletProvider } from '@/utils/providers'
import useCommonStore from '@/store/common'
import useUserStore from '@/store/user'
const user = useUserStore()
// import usemySbtStore from '@/store/mySbt'
// const mySbtStore = usemySbtStore()
const common = useCommonStore()
const route = useRoute()
const router = useRouter()


let changeLock = false
const listenAccountChange = async () => {
  // ret
  const wallet = user.wallet
  if (!wallet) return

  const walletProvider = await getWalletProvider(wallet)
  walletProvider.on('accountsChanged', () => {
    if (changeLock) return
    changeLock = true
    console.log(
      '%c [ accountsChanged ]-91',
      'font-size:13px; background:pink; color:#bf2c9f;'
    )
    user.logout()
    router.replace('/')
    changeLock = false
  })
}

onMounted(() => {
  listenAccountChange()

  user.getNamePhase()
  user.getMintedList()
})

watch(
  () => user.address,
  (v) => {
    if (v) {
      listenAccountChange()
    } else {
      router.replace('/')
    }
  }
)

// const transparent = computed(() => ['welcome'].includes(String(route.name)))
const transparent = true
</script>
<template>
  <Header :class="{ transparent }"></Header>
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          :is="Component"
          v-if="route?.meta?.keepAlive"
          :key="route.name"
        />
      </keep-alive>
      <component
        :is="Component"
        v-if="!route?.meta?.keepAlive"
        :key="route.name"
      />
    </router-view>
  </div>

  <Footer></Footer>

  <LoginModal
    :ref="
      (e: any) => {
        common.loginModalRef = e
      }
    "
  />
</template>
<style lang="scss">
// @font-face {
//   font-family: 'Apple-Chancery';
//   src: url(./assets/font/Apple-Chancery.ttf);
//   font-weight: 400;
// }
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Thin.ttf);
  font-weight: 100;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-ExtraLight.ttf);
  font-weight: 200;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Light.ttf);
  font-weight: 300;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Regular.ttf);
  font-weight: 400;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Medium.ttf);
  font-weight: 500;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-SemiBold.ttf);
  font-weight: 600;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Bold.ttf);
  font-weight: 700;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-ExtraBold.ttf);
  font-weight: 800;
}
@font-face {
  font-family: 'Lexend Deca';
  src: url(./assets/font/Lexend_Deca/LexendDeca-Black.ttf);
  font-weight: 900;
}
img {
  // max-width: 100%;
}

body {
  font-family: 'Lexend Deca', 'PingFang SC', 'Microsoft Yahei';
}

ul li {
  list-style: none;
}

#app {
  position: relative;
  min-height: 100vh;
  background-image: url(@img/bg.png);
  background-size: auto;
  background-repeat: no-repeat;
}

.app-main {
  color: #fff;
  font-size: 14px;
  max-width: var(--main-content-width);
  margin: 0 auto;
  padding-bottom: 250px;
}

.nav-head {
  .back {
    padding: 10px 20px;
    background: #262931;
    border-radius: 4px;
    cursor: pointer;
  }
}

@media screen and (max-width: 992px) {
  .app-main {
    padding-bottom: 0;
  }
  .footer-main {
    display: none;
  }
}
</style>
