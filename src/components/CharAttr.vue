<template>
  <div class="column items-center justify-center">
    <q-btn :label="`${label} ${attr.score}`" class="text-bold" size="lg" @click="editAttr" flat rounded />
    <q-checkbox :label="attr.condition.name" v-model="attr.condition.check" size="sm" left-label dense />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { IAttribute } from './models';

import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'CharStat',
  props: {
    modelValue: {
      type: Object as PropType<IAttribute>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const attr = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (attr.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => attr.value,
      () => emit('update:modelValue', attr.value),
      { deep: true }
    );

    const $q = useQuasar();
    const editAttr = () =>
      $q
        .dialog({
          title: `Edit ${props.label}`,
          cancel: true,
          prompt: {
            type: 'number',
            model: `${attr.value.score}`,
            min: 3,
            max: 18,
          },
        })
        .onOk((n) => (attr.value.score = n));

    return {
      attr,
      editAttr,
    };
  },
});
</script>
