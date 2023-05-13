<script setup lang="ts">
import { ethers } from 'ethers'
import { getNameList } from '@/api'
import useUserStore from '@/store/user'
import useMineStore from '@/store/mine'
import useCommonStore from '@/store/common'
import { registerChain } from '../utils/providers'
// import { CONTRACT } from '../constants'
import nameAbi from '../abi/nameservice.json'

const route = useRoute()
const userStore = useUserStore()
const mineStore = useMineStore()
const commonStore = useCommonStore()

const visible = ref(false)

const loaded = ref(false)
const list = ref<any[]>(mineStore.tokenList)

const searchText = ref('')
const searching = ref(false)
const errTip = ref('')
const searchResult = ref<any>()
const onSearch = async () => {
  const name = searchText.value
  // searching.value = true
  // searchResult.value = null
  // const res = await getNameStatus(name, userStore.address)
  // searching.value = false
  // if (+res.code !== 0) {
  //   errTip.value = res.desc || ''
  //   return
  // }
  list.value = mineStore.tokenList.filter((e) =>
    e.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
  )
}

const getListFromServer = async () => {
  let { code, data, desc } = await getNameList(userStore.address)
  console.log(
    '%c [ data ]-18',
    'font-size:13px; background:pink; color:#bf2c9f;',
    data
  )
  if (+code !== 0) return

  data = data || []
  for (let index = 0; index < data.length; index++) {
    const e = data[index]
    mineStore.tokenList[index] = e
  }

  list.value = mineStore.tokenList
}

const getMyName = async () => {
  const contractAddr = await commonStore.getContractAddress()

  const contract = await getRpcContract(
    registerChain.chainId,
    contractAddr,
    nameAbi
  )

  const count = await contract.balanceOf(userStore.address)
  if (!+count) {
    loaded.value = true
    return
  }

  const arr = []
  for (let index = 0; index < count; index++) {
    const tokenId = await contract.tokenOfOwnerByIndex(userStore.address, index)
    console.log(
      '%c [ tokenId ]-32',
      'font-size:13px; background:pink; color:#bf2c9f;',
      tokenId
    )
    const name = await contract.subject(tokenId)
    console.log(
      '%c [ name ]-34',
      'font-size:13px; background:pink; color:#bf2c9f;',
      name
    )
    mineStore.tokenList[index] = mineStore.tokenList[index] || {}
    mineStore.tokenList[index].name = name.subjectValue
    mineStore.tokenList[index].tokenId = +tokenId
  }

  list.value = mineStore.tokenList
  loaded.value = true
}

const getResolved = async () => {
  const contractAddr = await commonStore.getContractAddress()
  try {
    const nameServiceContract = await getRpcContract(
      registerChain.chainId,
      contractAddr,
      nameAbi
    )

    const name = await nameServiceContract.nameOf(userStore.address)
    console.log(
      '%c [ name ]-83',
      'font-size:13px; background:pink; color:#bf2c9f;',
      name
    )

    userStore.bindedDomain = name
  } catch (error) {
    handleMintErr(error)
  }
}
onMounted(async () => {
  userStore.getReferralRewards()

  window.scrollTo({ top: 0 })

  getResolved()

  await getListFromServer()

  getMyName()
})

const { width } = useWindowSize()

const tokenId = ref('')
const name = ref('')
const onClickName = (item?: any) => {
  if (!item.tokenId) return
  console.log(
    '%c [ item.tokenId ]-121',
    'font-size:13px; background:pink; color:#bf2c9f;',
    item.tokenId
  )

  tokenId.value = item.tokenId
  name.value = item.name
  visible.value = true
}
</script>
<template>
  <div class="mine-wrap" v-if="width > 992">
    <div class="nav-head flex-a">
      <div class="back" @click="$router.back">Back</div>
    </div>
    <div class="title-wrap flex-a spa">
      <h1>
        <span>My</span>
        <span class="c-main">.soul</span>
      </h1>

      <div class="flex-a-j form-wrap">
        <el-input
          v-model="searchText"
          :disabled="searching || !loaded"
          placeholder="search"
          size="large"
          class="input"
        />

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
    </div>
    <div class="card">
      <div class="avatar-wrap">
        <re-image :src="userStore.avatar" class="avatar" />
        <p class="name">{{ userStore.name }}</p>

        <div class="referral-reward mt20">
          <div class="fs12 ta">Referral Reward</div>
          <div class="flex-a-j mt4">
            <span class="fs14">{{ userStore.referralRewards ?? '-' }}</span>
            <SvgIcon name="eth" class="icon-eth fs16" />
          </div>
        </div>
      </div>
      <div class="record-list-wrap">
        <div class="record-list">
          <NameItem
            v-for="(item, index) in list"
            :key="item.name"
            :name="item.name"
            :tokenId="item.tokenId"
            @click="onClickName(item)"
          />
        </div>
        <div class="ta nomore mt60">no more</div>
      </div>
    </div>
  </div>
  <div class="mine-mobile-wrap" v-else>
    <div class="title-wrap flex-a spa">
      <SvgIcon name="arrow_back" class="fs20 mr10" @click="$router.back" />
      <div class="flex-a-j flex1 form-wrap">
        <el-input
          v-model="searchText"
          :disabled="searching"
          placeholder="search"
          size="large"
          class="flex1 mr10"
        />

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
    </div>

    <div class="flex-a mt20">
      <re-image :src="userStore.avatar" class="avatar" />

      <div class="ml20">
        <h1>
          <span>relation</span>
          <span class="c-main">.soul</span>
        </h1>
        <p class="name">{{ userStore.name }}</p>
      </div>
    </div>

    <div class="referral-reward mt10">
      <div class="fs12 ta">Referral Reward</div>
      <div class="flex-a-j ml10">
        <span class="fs14">{{ userStore.referralRewards ?? '-' }}</span>
        <SvgIcon name="eth" class="icon-eth fs16" />
      </div>
    </div>
    <div class="card">
      <div class="record-list-wrap">
        <div class="record-list">
          <NameItem
            :name="item.name"
            v-for="(item, index) in list"
            :key="item.name"
            :tokenId="item.tokenId"
            @click="onClickName(item)"
          />
        </div>
        <div class="ta nomore">no {{ list.length ? 'more' : 'data' }}</div>
      </div>
    </div>
  </div>
  <NameScanModal v-model="visible" :tokenId="tokenId" :name="name" />
</template>
<style lang="scss">
.mine-wrap {
  height: 100vh;
  overflow-y: auto;
  margin: 0 auto;

  .title-wrap {
    margin: 20px 0;

    .form-wrap {
      .input {
        width: 200px;
        margin-right: 10px;
      }
    }
  }

  .card {
    display: flex;
    background: #121212;
    border-radius: 4px;
    border: 1px solid #1d1d1d;
    padding: 30px 0;

    .avatar-wrap {
      width: 120px;
      text-align: center;

      .avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        margin-bottom: 10px;
      }
      .name {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 auto;
      }

      .referral-reward {
        width: max-content;
        margin: 20px auto 0;
        background: #292929;
        border-radius: 8px;
        border: 1px solid #ffffff;
        padding: 6px 4px;
      }
    }

    .record-list-wrap {
      position: relative;
      height: 360px;
      overflow-y: auto;
      flex: 1;
      padding-left: 7px;
      .record-list {
        padding: 0 15px;
        border-left: 1px solid #2c2c2c;
      }
      .nomore {
        color: #b7b7b7;
        margin-top: 60px;
      }
    }
  }
}
</style>
<style lang="scss">
.mine-mobile-wrap {
  padding: 10px 15px;

  .avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .referral-reward {
    display: flex;
    align-items: center;
    width: max-content;
    background: #292929;
    border-radius: 8px;
    border: 1px solid #ffffff;
    padding: 6px 10px;
  }
  .card {
    display: flex;
    background: #121212;
    border-radius: 4px;
    border: 1px solid #1d1d1d;
    padding: 20px 0;
    margin-top: 20px;

    .record-list-wrap {
      position: relative;
      height: 360px;
      overflow-y: auto;
      flex: 1;
      padding-left: 15px;
      .record-list {
        padding: 0 15px;
        border-left: 1px solid #2c2c2c;
      }
      .nomore {
        color: #b7b7b7;
        margin-top: 20px;
      }
    }
  }
}
</style>
