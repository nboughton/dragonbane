<template>
  <div class="row items-center justify-between">
    <q-btn class="col q-pa-md" icon="mdi-minus-circle" @click="if (n - 1 >= 0) n--;" flat round />
    <div class="col q-pa-sm text-h5">{{ n }}</div>
    <q-btn class="col q-pa-md" icon="mdi-plus-circle" @click="n++" flat round />
  </div>
</template>

<script lang="ts" setup>
const n = defineModel<number>({ required: true });
</script>
