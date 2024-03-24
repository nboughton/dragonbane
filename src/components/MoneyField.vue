<template>
  <div class="row justify-center">
    <q-icon name="mdi-circle-slice-8" :color="iconColor" size="lg" class="col-shrink" />
    <q-input class="col-4" type="number" v-model.number="dollaBills" input-class="text-right text-h6" dense />
  </div>
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

    // Property for determining the icon color based on the label
    const iconColor = computed(() => {
      switch (props.label.toLowerCase()) {
        case 'gold':
          return 'amber-5';
        case 'silver':
          return 'blue-grey-5';
        case 'copper':
          return 'brown-5';
        default:
          return 'black';
      }
    });

    return {
      dollaBills,
      iconColor,
    };
  },
});
</script>
