<template>
  <div class="row">
    <q-input class="col-grow" label="Item" v-model="item.text" dense />
    <q-input class="col-xs-2 col-sm-1" label="Wt" v-model.number="item.wt" type="number" dense />
    <q-btn class="col-shrink" icon="delete" dense flat rounded @click="$emit('delete')" />
  </div>
</template>

<script lang="ts" setup>
import type { InvItem } from './models';

const item = defineModel<InvItem>({ required: true });
defineEmits(['delete']);
</script>
