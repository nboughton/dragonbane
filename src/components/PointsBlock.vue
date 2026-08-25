<template>
  <div class="row">
    <q-btn v-if="!labelRight" class="col-shrink" @click="showEditDialog = !showEditDialog" flat :label="`${label}`" />

    <div class="col-grow flex flex-center">
      <q-linear-progress @click="showEditDialog = !showEditDialog" :value="points.current / points.max" color="positive"
        track-color="grey-1" size="2em" rounded>
        <div class="absolute-full flex flex-center text-grey-9 text-subtitle2">
          {{ points.current }}/{{ points.max }}
        </div>
      </q-linear-progress>
    </div>

    <q-btn v-if="labelRight" class="col-shrink" @click="showEditDialog = !showEditDialog" flat :label="`${label}`" />
  </div>

  <q-dialog v-model="showEditDialog" maximized>
    <q-card>
      <q-card-section class="row text-h6 items-center justify-between">
        <div class="col">Adjust {{ label }}</div>
        <q-btn class="col-shrink" icon="close" flat dense rounded @click="showEditDialog = false" />
      </q-card-section>

      <q-card-section class="row items-center justify-center">
        <q-input class="col-5 input-left" input-class="text-center text-h4" label="Current" type="number"
          v-model.number="points.current" :max="points.max" :min="0" borderless />

        <q-input class="col-5 input-right" input-class="text-center text-h4" label="Max" type="number"
          v-model.number="points.max" :min="0" borderless />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type { StatPoints } from "./models";

const points = defineModel<StatPoints>({ required: true });
defineProps<{
  label: string;
  showMax?: boolean;
  labelRight?: boolean;
}>();

const showEditDialog = ref(false);
</script>

<style scoped>
.input-left {
  border: 2px solid grey;
  border-right: 0px;
  padding-left: 0.5em;
  padding-right: 0.5em;
  border-radius: 20px 0px 0px 20px;
}

.input-right {
  border: 2px solid grey;
  padding-left: 0.5em;
  padding-right: 0.5em;
  border-radius: 0px 20px 20px 0px;
}
</style>
