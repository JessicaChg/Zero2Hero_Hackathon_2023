<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.name}`)
    }
  }
})
</script>

<style scope lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
