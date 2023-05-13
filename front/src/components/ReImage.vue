<template>
  <el-image
    @error="onerror"
    v-bind="$attrs"
    :fit="fit"
    :src="src"
    preview-teleported
    class="re-image"
    :preview-src-list="previewList"
  >
    <!-- 加载中 -->
    <template #placeholder>
      <el-skeleton style="width: 100%; height: 100%" :loading="true" animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
    </template>

    <!-- 加载失败 -->
    <template #error>
      <el-skeleton style="width: 100%; height: 100%" :loading="true" animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 100%; height: 100%" />
        </template>
      </el-skeleton>
    </template>
  </el-image>
</template>

<script setup lang="ts">
interface Props {
  fit?: string
  src?: string
  preview?: boolean
}
const emit = defineEmits(['error'])
const props = withDefaults(defineProps<Props>(), {
  fit: 'cover'
})

const previewList = computed(() => (!props.preview ? null : [props.src]))

const onerror = (err: any) => {
  emit('error', err)
}
</script>

<style lang="scss" scoped>
.re-image {
  vertical-align: bottom;
  width: 100%;
  height: 100%;
}
.skeleton__item {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  border-radius: 8px;

  &.animate {
    animation: skeleton-loading 1.4s ease infinite;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    fill: #dcdde0;
    width: 30%;
    height: 30%;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
</style>
