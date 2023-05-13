<script setup lang="ts">
import useCommonStore from '@/store/common'
import useUserStore from '@/store/user'
const common = useCommonStore()
const user = useUserStore()
</script>
<template>
  <div class="mysbts-wrap">
    <div class="title">My SBTs</div>

    <div class="sbt-list-wrap">
      <router-link to="/sbt" class="sbt-wrap" v-for="(item, index) in 20" :key="index">
        <ReImage src=" " class="img" />
        <div class="name">Relation Party Attendance</div>
        <div class="create">Create by : Relationlabs</div>
      </router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mysbts-wrap {
  max-width: 1340px;
  margin: 80px auto;
  .title {
    font-weight: 600;
    font-size: 56px;
    color: #ececec;
    padding-left: 30px;
    margin-bottom: 50px;
  }

  .sbt-list-wrap {
    display: flex;
    flex-wrap: wrap;

    .sbt-wrap {
      width: 274px;
      margin: 0 30px 140px;
      text-align: center;
      overflow: hidden;

      .img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
      }

      .name {
        font-weight: 600;
        font-size: 20px;
        line-height: 25px;
        color: #ffffff;
        margin-top: 50px;
        margin-bottom: 8px;
      }
      .create {
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
        color: #bcbcbc;
      }
    }
  }
}
</style>
