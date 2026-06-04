<template>
  <div class="column">
    <div class="row q-pa-sm q-ma-xs bg-dark rounded-borders" v-for="(msg, i) in app.char.log" :key="`msg-${i}`">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCharacterStore } from 'src/stores/character';

const app = useCharacterStore();
</script>
