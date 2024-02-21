<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <div class="row items-center rounded-borders q-pa-xs q-mt-xs">
    <q-input class="col-xs-4 col-sm-4 q-pr-xs" label="Weapon/Shield" v-model="weapon.name" dense />
    <q-select
      class="col-xs-2 col-sm-1 q-pr-xs"
      label="Grip"
      v-model="weapon.grip"
      :options="Object.values(EGrip)"
      dense
    />
    <q-input class="col-xs-2 col-sm-1 q-pr-xs" label="Range" v-model="weapon.range" dense />
    <q-input class="col-xs-2 col-sm-1 q-pr-xs" label="Damage" v-model="weapon.damage" dense />
    <q-input
      class="col-xs-2 col-sm-1 q-pr-xs"
      type="number"
      label="Durability"
      v-model.number="weapon.durability"
      dense
    />
    <q-input class="col-xs-10 col-sm-grow" label="Features" v-model="weapon.features" dense />
    <q-btn class="col-xs col-sm-shrink" icon="delete" @click="$emit('delete')" flat dense rounded />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IWeapon, EGrip } from './models';
export default defineComponent({
  name: 'WeaponBlock',
  props: {
    modelValue: {
      type: Object as PropType<IWeapon>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const weapon = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (weapon.value = props.modelValue)
    );
    watch(
      () => weapon.value,
      () => emit('update:modelValue', weapon.value)
    );

    return {
      weapon,
      EGrip,
    };
  },
});
</script>
