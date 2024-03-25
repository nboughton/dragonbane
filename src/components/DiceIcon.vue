<script setup lang="ts">
import { computed } from 'vue';
import { Die } from './models';

const props = defineProps<{
  name: Die;
  value: number;
}>();

const tenPlus = computed((): boolean => props.value > 9);
</script>

<template>
  <div class="die-icon">
    <q-icon :name="`img:icons/dice/${name}.svg`" size="100px" />
    <div :class="`die-value text-bold text-black ${name} ${tenPlus ? name + '-ten-plus' : ''}`">{{ value }}</div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.die-icon {
  display: inline-block;
  width: 100px;
  height: 100px;
}

.die-value {
  opacity: 70%;
  left: 42px;
}

.d10 {
  position: relative;
  bottom: 80px;
  font-size: 25px;
}

.d10-ten-plus {
  left: 36px !important;
}

.d20 {
  position: relative;
  bottom: 58px;
  left: 44px;
  font-size: 20px;
}

.d20-ten-plus {
  left: 38px !important;
}
</style>
