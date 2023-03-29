<template>
  <div class="row">
    <q-input class="col" label="Weapon/Shield" v-model="weapon.name" dense />
    <q-input class="col-xs-2 col-sm-1" label="Grip" v-model="weapon.grip" dense />
    <q-input class="col-xs-2 col-sm-1" label="Range" v-model="weapon.range" dense />
    <q-input class="col-xs-2 col-sm-1" label="Damage" v-model="weapon.damage" dense />
    <q-input class="col-xs-2 col-sm-1" type="number" label="Durability" v-model.number="weapon.durability" dense />
    <q-input class="col" label="Features" v-model="weapon.features" dense />
    <q-btn class="col-shrink" icon="delete" @click="$emit('delete')" flat dense rounded />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IWeapon } from './models';
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
    };
  },
});
</script>
