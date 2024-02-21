<template>
  <q-input
    class="col-xs-12 col-sm-3 q-ma-xs"
    type="number"
    v-model.number="dollaBills"
    input-class="text-right text-h6"
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
      // deepcode ignore VueGetterDoesntReturn: An emit doesn't require a return value
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
