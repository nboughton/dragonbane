<script setup lang="ts">
import DiceIcon from './DiceIcon.vue';
import { Die } from './models';

defineProps<{
  dice: {
    name: Die;
    value: number;
  }[];
}>();
</script>

<template>
  <div class="row justify-center">
    <DiceIcon v-for="(d, i) in dice" :key="i" :name="d.name" :value="d.value" />
  </div>
</template>
