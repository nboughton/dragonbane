<template>
  <q-card-section class="top-and-bottom">
    <div class="row items-center justify-center">
      <div class="col-shrink">
        <div class="row items-center">
          <q-btn class="col-1" icon="mdi-minus-circle" @click="if (newDie.n - 1 > 0) newDie.n--;" flat />
          <div class="col-shrink text-h6">{{ newDie.n }}d</div>
          <q-select
            class="col-shrink text-h6 text-left q-ml-none"
            options-selected-class="text-purple-2"
            :options="[2, 4, 6, 8, 10, 12, 20, 100]"
            v-model.number="newDie.size"
            borderless
            dense
          />
          <q-btn class="col-1" icon="mdi-plus-circle" @click="newDie.n++" flat />
        </div>
      </div>

      <q-btn class="col-shrink" label="add dice" @click="addDie" color="white" text-color="black" />
    </div>

    <div class="row items-center justify-center q-mt-md">
      <div class="column items-center">
        <div class="row text-caption text-center">Dice to roll</div>
        <div class="row items-center justify-center">
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

<style lang="sass">
.top-and-bottom
  border-top: 1px solid grey
  border-bottom: 1px solid grey
</style>
