<template>
  <q-input
    class="col q-mx-sm"
    type="number"
    v-model.number="dollaBills"
    input-class="text-center text-h6"
    standout
    rounded
    dense
  >
    <template v-slot:prepend>
      <span class="text-h6">{{ label }}:</span>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MoneyField',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dollaBills = computed({
      get(): number {
        return props.modelValue;
      },
      set(n: number) {
        emit('update:modelValue', n);
      },
    });

    return {
      dollaBills,
    };
  },
});
</script>
