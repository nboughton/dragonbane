<template>
  <div class="column q-mt-md rounded-borders q-pa-sm" style="background-color: #232323">
    <div class="row items-center">
      <q-checkbox
        v-if="spell.rank > 0"
        class="col-shrink q-pr-xs"
        checked-icon="mdi-alpha-p-box"
        unchecked-icon="mdi-alpha-p-box-outline"
        color="white"
        v-model="spell.prepared"
        size="lg"
        dense
      >
        <q-tooltip>Prepared</q-tooltip>
      </q-checkbox>
      <q-input class="col-grow" label="Name" v-model="spell.name" dense />
      <q-input class="col-xs-2 col-sm-1" label="Rank" v-model.number="spell.rank" type="number" dense />

      <q-btn class="col-shrink" icon="delete" flat dense rounded @click="$emit('delete')" />
    </div>

    <div v-if="spell.rank > 0" class="row">
      <q-input class="col" label="Casting Time" v-model="spell.time" dense />
      <q-select class="col" label="Duration" v-model="spell.duration" :options="Object.values(EDuration)" dense />
    </div>

    <div v-if="spell.rank > 0" class="row items-end">
      <q-select
        class="col"
        label="Requirements"
        v-model="spell.req"
        multiple
        :options="Object.values(ESpellReq)"
        dense
      />
      <q-input class="col" label="Range" v-model="spell.range" dense />
    </div>

    <q-input
      class="row"
      v-if="spell.req.includes(ESpellReq.Ingredient)"
      label="Ingredient"
      v-model="spell.ingredient"
      dense
    />

    <q-input class="row" label="Text" v-model="spell.text" dense autogrow />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { EDuration, ESpellReq, ISpell } from './models';

export default defineComponent({
  name: 'SpellBlock',
  props: {
    modelValue: {
      type: Object as PropType<ISpell>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const spell = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (spell.value = props.modelValue)
    );
    watch(
      () => spell.value,
      () => emit('update:modelValue', spell.value)
    );

    return {
      spell,
      ESpellReq,
      EDuration,
    };
  },
});
</script>
