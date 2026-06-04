<template>
  <div class="row justify-center">
    <DiceIcon v-for="(d, i) in dice" :key="i" :name="d.name" :value="d.value" />
  </div>
</template>

<script lang="ts" setup>
import type { DieType } from './models';

import DiceIcon from './DiceIcon.vue';

defineProps<{
  dice: {
    name: DieType;
    value: number;
  }[];
}>();
</script>
