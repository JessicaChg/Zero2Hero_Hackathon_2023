<script setup lang="ts">
interface Props {
  msg: string
  colorful?: boolean
  icon?: string
  url?: string
  casesensitive?: boolean,
  oneColorStyle?: boolean,
  oneFontStyle?: boolean,
}
const emit = defineEmits(['jumpTo']);
withDefaults(defineProps<Props>(), {
  icon: '',
  colorful: false,
  url: '',
  casesensitive: false,
  oneColorStyle: false,
  oneFontStyle: false,
});


</script>
<template>
  <a class="btn flex-a-j" :class="{ colorful, oneColorStyle }" v-if="!!url" :href="url" target="_blank">
    <img :src="icon" v-if="icon" />
    <span class="sub_title" :class="{ uppercase: !casesensitive }">{{ msg }}</span>
  </a>
  <a class="btn flex-a-j" :class="{ colorful, oneColorStyle }" @click="emit('jumpTo')" v-else>
    <img :src="icon" v-if="icon" />
    <span class="sub_title" :class="{ uppercase: !casesensitive, whiteFont: oneFontStyle }">{{ msg }}</span>
  </a>
</template>
<style lang="scss" scoped>
.btn {
  cursor: pointer;
  justify-content: left;
  border: 1px solid #fff;
  /* font-weight: 700; */
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  border-radius: 15px;
  height: 59px;
  padding: 0 30px;
  transition: transform 0.2s linear;
  &:hover {
    transform: scale(1.1);
  }
  &.colorful {
    background: linear-gradient(
      90deg,
      #b8cbb8 0%,
      #b8cbb8 0%,
      #b465da 0%,
      #cf6cc9 33%,
      #ee609c 66%,
      #ee609c 100%
    );
    box-shadow: 0px 2px 20px rgba(197, 160, 243, 0.5);
    border-radius: 15px;
    border: none;
    padding: 0 45px;
  }
  img {
    margin-right: 10px;
  }
  .sub_title {
    font-size: 12px;
    line-height: 100%;
    &.uppercase {
      text-transform: uppercase;
    }
    &.whiteFont {
      color: white;
    }
  }
}
.bazaar, .one, .club, .clubDetail, .dapps, .referer {
  .btn.colorful {
    box-shadow: none;
  }
}
</style>