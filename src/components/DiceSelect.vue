<template>
  <q-card-section class="q-pt-none">
    <div class="row items-center justify-between">
      <q-btn class="col-shrink" label="add dice" @click="addDie" color="white" text-color="black" />
      <q-btn class="col-shrink" icon="mdi-minus-circle" @click="if (newDie.n - 1 > 0) newDie.n--;" flat rounded />
      <div class="col-shrink text-h5">{{ newDie.n }}d</div>
      <q-select
        class="col-shrink text-h5 text-left q-ml-none"
        :options="[2, 4, 6, 8, 10, 12, 20, 100]"
        v-model.number="newDie.size"
        borderless
        dense
      />
      <q-btn class="col-shrink" icon="mdi-plus-circle" @click="newDie.n++" flat rounded />
    </div>

    <div class="row q-mt-sm items-center justify-center bg-grey-10 rounded-borders q-pa-md">
      <div class="col-12 text-caption text-center">Dice to roll</div>
      <div
        class="col-shrink rounded-borders bg-white text-black q-ma-xs"
        v-for="(die, i) in dice"
        :key="`dselect-${i}`"
      >
        <div class="row justify-between items-center q-px-sm">
          <div class="col q-pr-sm">{{ die.n }}d{{ die.size }}</div>
          <q-btn class="col-shrink" icon="mdi-close-circle" @click="rmDie(i)" flat dense round />
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue';

import { IDie } from './models';

import { deepCopy } from 'src/lib/util';

export default defineComponent({
  name: 'DiceSelect',
  props: {
    modelValue: {
      type: Array as PropType<IDie[]>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dice = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (dice.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => dice.value,
      () => emit('update:modelValue', dice.value),
      { deep: true }
    );
    const newDie = ref(<IDie>{ n: 1, size: 10 });
    const addDie = () => dice.value.unshift(deepCopy(newDie.value));
    const rmDie = (index: number) => dice.value.splice(index, 1);
    return {
      dice,
      newDie,
      addDie,
      rmDie,
    };
  },
});
</script>
