<template>
  <div class="column">
    <div class="row">
      <q-input class="col-grow" :label="label" v-model="amr.name" dense />
      <q-input class="col-xs-2 col-sm-1" label="Rating" v-model.number="amr.rating" type="number" dense />
    </div>

    <div class="row items-center justify-center q-mt-sm">Bane on</div>

    <div class="row items-center justify-center">
      <q-checkbox
        class="col-shrink"
        v-for="(a, i) in amr.bane"
        :key="`amr-${i}`"
        :label="`${i}`"
        v-model="amr.bane[i]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IArmour } from './models';

const amr = defineModel<IArmour>({ required: true });
defineProps<{ label: string }>();
</script>
