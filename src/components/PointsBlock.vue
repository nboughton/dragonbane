<template>
  <div class="row">
    <div class="col-shrink">
      <q-btn @click="showEditDialog = !showEditDialog" flat :label="`${label}`" />
    </div>
    <div class="col-grow flex flex-center">
      <q-linear-progress
        @click="showEditDialog = !showEditDialog"
        :value="points.current / points.max"
        color="positive"
        track-color="negative"
        size="2em"
      >
        <div class="absolute-full flex flex-center text-white text-subtitle2">
          {{ points.current }}/{{ points.max }}
        </div>
      </q-linear-progress>
    </div>
  </div>

  <q-dialog v-model="showEditDialog" maximized>
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
