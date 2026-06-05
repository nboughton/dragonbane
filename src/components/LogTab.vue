<template>
  <div class="column">
    <div class="row items-center justify-between q-pa-sm q-ma-xs outlined rounded-borders"
      v-for="(msg, i) in app.char.log" :key="`msg-${i}`">
      <q-icon class="col-1" name="mdi-account-alert" size="sm" /> <span class="col-11 q-pl-md">{{ msg }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCharacterStore } from 'src/stores/character';

const app = useCharacterStore();
</script>
