<template>
  <div
    :class="`column items-center justify-center q-ma-xs q-pa-xs ${
      attr.condition.check ? 'bg-negative' : ''
    } rounded-borders`"
  >
    <div class="row items-center">
      <q-btn @click="showRoller = true" flat rounded dense size="md">
        {{ label }}
        <q-icon name="mdi-dice-d20" />
      </q-btn>
    </div>
    <q-btn :label="`${attr.score}`" class="col-shrink text-bold q-pa-none" size="xl" @click="editAttr" flat rounded />
    <q-checkbox
      :label="attr.condition.name"
      v-model="attr.condition.check"
      size="sm"
      left-label
      dense
      unchecked-icon="mdi-emoticon-happy"
      checked-icon="mdi-skull"
      color="white"
    />
  </div>
  <q-dialog v-model="showRoller" maximized>
    <dice-roller
      :name="label"
      :banes="attr.condition.check ? 1 : 0"
      :target="attr.score"
      :roll-type="RollTypes.Attr"
      @close="showRoller = false"
      @result="
        (r) =>
          notifySend(
            `${app.char.name} rolled ${label}: ${r}`,
            r.includes(D20Results.Dragon) || r.includes(D20Results.Success) ? 'SUCCESS' : 'ERROR',
          )
      "
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { Attribute } from './models';
import { D20Results, RollTypes } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { notifySend } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';

const attr = defineModel<Attribute>({ required: true });
const props = defineProps<{ label: string }>();

const $q = useQuasar();
const editAttr = () =>
  $q
    .dialog({
      title: `Edit ${props.label}`,
      cancel: true,
      prompt: {
        type: 'number',
        model: `${attr.value.score}`,
        min: 3,
        max: 18,
        inputClass: 'text-center text-h4',
        class: 'q-pa-lg',
        rounded: true,
        outlined: true,
      },
      maximized: true,
    })
    .onOk((n) => (attr.value.score = n));

const showRoller = ref(false);
const app = useCharacterStore();
</script>
