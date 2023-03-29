<template>
  <div class="column items-center justify-center q-px-xs">
    <q-input
      type="number"
      v-model.number="attr.score"
      input-class="text-center text-bold text-h5"
      standout
      rounded
    >
      <template v-slot:prepend>
        <span class="text-h5 text-bold">{{ label }}</span>
      </template>
    </q-input>

    <q-checkbox
      :label="attr.condition.name"
      v-model="attr.condition.check"
      left-label
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IAttribute } from './models';
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

    return {
      attr,
    };
  },
});
</script>
