<script setup lang="ts">
import { useSearch } from '@/hooks'

const emit = defineEmits(['resultChange'])
const { searchText, searching, errTip, searchResult, onSearch } = useSearch()
watch(
  searchResult,
  (s) => {
    emit('resultChange', s)
  },
  { deep: true }
)
</script>
<template>
  <div class="rns-search-wrap flex-a-j">
    <div class="flex-a-j form-wrap">
      <el-input
        v-model="searchText"
        :disabled="searching"
        placeholder="search"
        size="large"
        class="input"
        @keyup.enter="onSearch"
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

      <!-- <div class="err-tip flex-a" v-if="!searching && errTip">
        <div class="icon flex-a-j">i</div>
        <span>{{ errTip }}</span>
      </div> -->
    </div>
  </div>
</template>
<style lang="scss">
.rns-search-wrap {
  .form-wrap {
    position: relative;
    .input {
      width: 370px;

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

@media screen and (max-width: 992px) {
  .rns-search-wrap {
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
