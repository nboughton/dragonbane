<template>
  <div class="row">
    <q-input class="col-grow" label="Item" v-model="item.text" dense />
    <q-input class="col-xs-2 col-sm-1" label="Wt" v-model.number="item.wt" type="number" dense />
    <q-btn class="col-shrink" icon="delete" dense flat rounded @click="$emit('delete')" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IItem } from './models';
export default defineComponent({
  name: 'ItemRow',
  props: {
    modelValue: {
      type: Object as PropType<IItem>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const item = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (item.value = props.modelValue)
    );
    watch(
      () => item.value,
      () => emit('update:modelValue', item.value)
    );

    return {
      item,
    };
  },
});
</script>
