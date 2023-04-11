<template>
  <div class="column">
    <q-btn size="xl" :label="`${label} ${points.current}`" @click="showEditDialog = !showEditDialog" flat />
    <q-linear-progress :value="points.current / points.max" color="green" track-color="red" />
  </div>

  <q-dialog v-model="showEditDialog">
    <q-card>
      <q-card-section class="row text-h6 items-center justify-between">
        <div class="col">Adjust {{ label }}</div>
        <q-btn class="col-shrink" icon="close" flat dense rounded @click="showEditDialog = false" />
      </q-card-section>

      <q-card-section class="column">
        <q-input label="Current" type="number" v-model.number="points.current" :max="points.max" :min="0" />
        <q-input label="Max" type="number" v-model.number="points.max" :min="0" />
      </q-card-section>
    </q-card>
  </q-dialog>
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

    const showEditDialog = ref(false);

    return {
      points,

      showEditDialog,
    };
  },
});
</script>
