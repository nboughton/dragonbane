<template>
  <div class="column">
    <div class="row">
      <q-input class="col-grow" :label="label" v-model="amr.name" dense />
      <q-input class="col-xs-2 col-sm-1" label="Rating" v-model.number="amr.rating" type="number" dense />
    </div>

    <div class="row items-center justify-evenly">
      <div class="col-xs-6 col-sm-4 col-md-3">Bane on</div>
      <q-checkbox
        class="col-xs-6 col-sm-4 col-md-3"
        v-for="(a, i) in amr.bane"
        :key="`amr-${i}`"
        :label="`${i}`"
        v-model="amr.bane[i]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IArmour } from './models';
export default defineComponent({
  name: 'ArmourBlock',
  props: {
    modelValue: {
      type: Object as PropType<IArmour>,
      required: true,
    },
    label: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const amr = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (amr.value = props.modelValue)
    );
    watch(
      () => amr.value,
      () => emit('update:modelValue', amr.value)
    );

    return {
      amr,
    };
  },
});
</script>
