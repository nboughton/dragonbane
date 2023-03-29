<template>
  <div class="column">
    <div class="row">
      <q-input class="col" label="Name" v-model="abl.name" dense />
      <q-input class="col-xs-2 col-sm-1" label="WP" v-model.number="abl.wp" type="number" dense />
      <q-btn class="col-shrink" icon="delete" flat dense rounded @click="$emit('delete')" />
    </div>

    <q-input class="row" label="Text" v-model="abl.text" dense autogrow />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { IAbility } from './models';

export default defineComponent({
  name: 'AbilityBlock',
  props: {
    modelValue: {
      type: Object as PropType<IAbility>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const abl = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (abl.value = props.modelValue)
    );
    watch(
      () => abl.value,
      () => emit('update:modelValue', abl.value)
    );

    return {
      abl,
    };
  },
});
</script>
