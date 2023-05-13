<script setup lang="ts">
import { GAEvent } from '@/constants/analytics_google'
import useCommonStore from '@/store/common'
import useUserStore from '@/store/user'
const common = useCommonStore()
const user = useUserStore()

const format = cutString

const officialHomeUrl = import.meta.env.VITE_RELATION_OFFICIAL_DOMAIN

const login = () => {
  user.login()
}
const logout = () => {
  user.logout()
}

const showNavBg = ref(false)
const activeLink = ref('')
const { y } = useWindowScroll()

watch(y, (v) => {
  showNavBg.value = v > 50
})
</script>

<template>
  <div class="nav-bar-wrap" :class="{ showbg: showNavBg }">
    <div class="fixed-placeholder">&nbsp;</div>
    <div class="nav-bar">
      <div class="inner-wrap">
        <a class="logo-wrap" :href="officialHomeUrl" target="_blank">
          <SvgIcon name="logo" class="logo" />
        </a>

        <div class="flex-a-j">
          <div class="flex-a-j jumps">
            <div class="flex-a-j jumps">
              <div class="tab">
                $REL
                <SvgIcon name="coming" class="comingsoon" />
              </div>
              <router-link
                to="/"
                class="tab"
                :class="{
                  active:
                    (!$route.hash && $route.name === 'home') ||
                    $route.hash === '#soul'
                }"
              >
                .SOUL
              </router-link>
              <!-- <router-link
                to="/search"
                class="tab"
                :class="{ active: ['register', 'search'].includes(String($route.name)) }"
              >
                Register
              </router-link> -->
              <router-link
                to="/#launchplan"
                class="tab"
                :class="{ active: $route.hash === '#launchplan' }"
              >
                Launch Plan
              </router-link>

              <router-link
                to="/mine"
                class="tab"
                :class="{ active: $route.name === 'mine' }"
              >
                My .soul
              </router-link>
            </div>
          </div>

          <div class="ml40">
            <el-dropdown
              v-if="user.address"
              trigger="hover"
              popper-class="relation-header-avatar-dropdown"
              placement="bottom"
            >
              <div to="/mine" class="user">
                <re-image :src="user.avatar" class="avatar" />
                <span class="addr">{{ format(user.address) }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <div class="" v-else>
              <div class="btn-login" @click="login">Connect Wallet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$activeColor: #ee609c;
.nav-bar-wrap {
  position: relative;
  z-index: 11;
  .fixed-placeholder {
    height: var(--navbar-height);
  }

  &.transparent {
    .nav-bar {
      background-color: transparent;
      transition: background-color 0.5s;

      .inner-wrap {
        .links {
          display: none;
        }
      }
    }

    &.showbg {
      .nav-bar {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .btn-login {
    padding: 4px 20px;
    // background: #ff237f;
    // border-radius: 32px;
    // font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    color: #fff;
    cursor: pointer;

    border-radius: 4px;
    border: 1px solid #ffffff;
  }

  .nav-bar {
    position: fixed;
    // position: absolute;
    top: 0;
    left: 0;
    height: var(--navbar-height);
    width: 100%;
    background-color: #000;
    z-index: 1;
    color: #fff;
    .inner-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      max-width: var(--main-content-width);
      margin: 0 auto;

      .logo-wrap {
        .logo {
          width: 132px;
          height: 36px;
        }
      }

      .links {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        .link {
          font-family: 'Lexend Deca';
          font-style: normal;
          font-weight: 600;
          font-size: 20px;
          line-height: 32px;
          color: #ececec;
          text-decoration: none;

          &.router-link-active {
            color: $activeColor;
          }

          &:first-child {
            margin-right: 40px;
          }
        }
      }

      .jumps {
        .tab {
          position: relative;
          cursor: pointer;
          height: 30px;
          line-height: 30px;
          color: #fff;

          &:not(:last-child) {
            margin-right: 55px;
          }

          &.active {
            color: #ee609c;
            border-bottom: 1px solid #ee609c;
          }

          .comingsoon {
            display: none;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 30px;
          }
          &:hover {
            .comingsoon {
              display: block;
            }
          }
        }

        .about {
          height: 26px;
          padding: 0 10px;
          background: linear-gradient(230deg, #de5c92 0%, #a763a2 100%);
          border-radius: 20px;
          font-size: 14px;
          white-space: nowrap;
        }
      }

      .user {
        display: flex;
        align-items: center;
        height: 44px;
        border: 1px solid #ffffff;
        border-radius: 32px;
        padding: 4px 12px 4px 4px;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #ffffff;
          margin-right: 8px;
        }
        .name {
          font-size: 14px;
        }
        .addr {
          color: #fff;
        }
      }
    }
  }
}

.relation-header-avatar-dropdown {
  transform: translateY(-5px);

  &.el-popper {
    width: 176px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 16px;
    overflow: hidden;
  }
  .el-dropdown-menu {
    padding: 12px 8px;
    .el-dropdown-menu__item {
      color: #fff;
      font-weight: 500;
      font-size: 14px;
    }
    .el-dropdown-menu__item:not(.is-disabled):focus {
      background-color: transparent;
      color: #fff;
    }
  }

  &.el-popper[data-popper-placement^='bottom'] > .el-popper__arrow {
    display: none;
  }
}

@media screen and (max-width: 992px) {
  .nav-bar-wrap {
    --navbar-height: 70px;
    font-size: 12px;

    &.transparent {
      .nav-bar {
        .inner-wrap {
          padding: 0 20px;

          .jumps {
            display: none;
            // div:first-child {
            //   margin-right: 20px;
            // }
          }

          .user {
            height: 34px;
            padding: 0 12px 0 4px;

            .avatar {
              width: 28px;
              height: 28px;
              margin-right: 8px;
            }
            .name {
              font-size: 14px;
            }
          }
        }
      }
    }

    .btn-login {
      padding: 2px 8px;
      font-size: 12px;
      line-height: 30px;
      border-radius: 4px;
    }
  }
}
</style>
