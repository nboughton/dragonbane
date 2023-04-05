<template>
  <div class="row q-mt-md text-h5 text-bold items-center">
    Weapons
    <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
  </div>
  <div class="row text-bold q-mt-xs">
    Dmg Bonus: STR:
    {{ DmgBonus(char.attributes.STR.score) }}, AGL:
    {{ DmgBonus(char.attributes.AGL.score) }}
  </div>
  <weapon-block v-for="(w, i) in char.weapons" :key="`wpn-${i}`" v-model="char.weapons[i]" @delete="removeWeapon(i)" />

  <div class="row q-mt-md">
    <div class="col-12 text-h5 text-bold">Weapon Skills</div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in char.wepSkills" :key="`skill-${k}`">
      <char-skill v-model="char.wepSkills[k]" :label="`${k}`" />
    </div>
  </div>
  <div class="row justify-between items-center text-center q-mt-md">
    <div class="col-xs-12 col-sm-5">
      <armour-block label="Armour" v-model="char.armour" />
    </div>

    <div class="col-xs-12 col-sm-5">
      <armour-block label="Helmet" v-model="char.helmet" />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue';

import { ICharacter } from './models';

import { useQuasar } from 'quasar';

import { NewWeapon, DmgBonus } from 'src/lib/defaults';

import CharSkill from 'src/components/CharSkill.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import ArmourBlock from 'src/components/ArmourBlock.vue';

export default defineComponent({
  name: 'CombatTab',
  components: { CharSkill, WeaponBlock, ArmourBlock },
  props: {
    modelValue: {
      type: Object as PropType<ICharacter>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const char = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (char.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => char.value,
      () => emit('update:modelValue', char.value),
      { deep: true }
    );

    const $q = useQuasar();
    const addWeapon = () => char.value.weapons.push(NewWeapon());
    const removeWeapon = (index: number) =>
      $q
        .dialog({
          message: 'Remove this weapon?',
          cancel: true,
        })
        .onOk(() => char.value.weapons.splice(index, 1));

    return {
      char,

      addWeapon,
      removeWeapon,
      DmgBonus,
    };
  },
});
</script>
