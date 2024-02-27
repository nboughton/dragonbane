<template>
  <div class="row items-center justify-between">
    <q-btn class="col q-pa-md" icon="mdi-minus-circle" @click="if (n - 1 >= 0) n--;" flat round />
    <div class="col q-pa-sm text-h5">{{ n }}</div>
    <q-btn class="col q-pa-md" icon="mdi-plus-circle" @click="n++" flat round />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'IncDec',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const n = computed({
      get: (): number => props.modelValue,
      set: (v: number) => emit('update:modelValue', v),
    });

    return { n };
  },
});
</script>
