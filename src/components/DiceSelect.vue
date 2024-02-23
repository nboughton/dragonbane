<template>
  <q-card-section class="row items-center justify-center q-gutter-md">
    <q-input
      class="col"
      type="number"
      label="Number"
      v-model.number="newDie.n"
      :min="1"
      filled
      input-class="text-center text-h5"
    />
    <div class="col-shrink text-h5">d</div>
    <q-input
      class="col"
      type="number"
      label="Sides"
      v-model.number="newDie.size"
      :min="2"
      filled
      input-class="text-center text-h5"
    />
    <q-btn class="col-shrink" icon="mdi-plus-circle" @click="addDie" flat rounded />
  </q-card-section>

  <q-card-section class="row q-gutter-lg justify-start items-center">
    <div class="col-shrink rounded-borders bg-white text-black" v-for="(die, i) in dice" :key="`dselect-${i}`">
      <div class="row justify-between items-center q-px-sm">
        <div class="col q-pr-sm">{{ die.n }}d{{ die.size }}</div>
        <q-btn class="col-shrink" icon="mdi-close-circle" @click="rmDie(i)" flat dense round />
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
