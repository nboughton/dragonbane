<template>
  <div class="row">
    <q-input
      class="col text-h6 text-bold"
      input-class="text-center text-bold"
      label="CURRENT"
      type="number"
      v-model.number="points.current"
      :min="0"
      :max="points.max"
      dense
    >
      <template v-slot:prepend>{{ label }}</template>
      <template v-slot:append v-if="showMax">/&nbsp;</template>
    </q-input>
    <q-input
      v-if="showMax"
      class="col text-h6 text-bold"
      input-class="text-center text-bold"
      label="MAX"
      type="number"
      v-model.number="points.max"
      :min="0"
      dense
    />
  </div>
  <q-linear-progress :value="points.current / points.max" color="green" track-color="red" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IPoints } from './models';
export default defineComponent({
  name: 'PointsBlock',
  props: {
    modelValue: {
      type: Object as PropType<IPoints>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    showMax: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const points = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (points.value = props.modelValue)
    );
    watch(
      () => points.value,
      () => emit('update:modelValue', points.value)
    );

    return {
      points,
    };
  },
});
</script>
