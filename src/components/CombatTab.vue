<template>
  <div class="row text-bold q-ma-sm">
    <span v-if="armourRating > 0">&nbsp;Armour: {{ armourRating }};&nbsp;</span>
    Dmg Bonus: STR: {{ DmgBonus(app.char.attributes.STR.score) }}, AGL:
    {{ DmgBonus(app.char.attributes.AGL.score) }}
  </div>

  <div class="row q-ma-sm text-h6 text-bold items-center">
    Weapons
    <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
  </div>

  <weapon-block
    v-for="(w, i) in app.char.weapons"
    :key="`wpn-${i}`"
    v-model="app.char.weapons[i]"
    @delete="removeWeapon(i)"
  />

  <div class="row items-center q-ma-sm">
    <div class="col-shrink text-h6 text-bold">Combat Skills</div>
    <!-- Removed Search as it makes the layout go boing and feels not necessary for 10 skills  -->
    <!-- <q-input class="col-grow q-ml-sm" label="Search" v-model="filter" clearable dense>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input> -->
  </div>
  <div class="row q-mt-sm">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <char-skill
        v-if="show('Evade')"
        v-model="app.char.priSkills['Evade']"
        label="Evade"
        :skill-type="ERollType.Primary"
      />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.wepSkills" :key="`skill-${k}`">
      <char-skill
        v-if="show(k as string)"
        v-model="app.char.wepSkills[k]"
        :label="`${k}`"
        :skill-type="ERollType.Weapon"
      />
    </div>
  </div>
  <div class="row justify-between items-center text-center q-ma-sm">
    <div class="col-xs-12 col-sm-5">
      <armour-block label="Armour" v-model="app.char.armour" />
    </div>

    <div class="col-xs-12 col-sm-5">
      <armour-block label="Helmet" v-model="app.char.helmet" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

import { NewWeapon, DmgBonus } from 'src/lib/defaults';

import CharSkill from 'src/components/CharSkill.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import ArmourBlock from 'src/components/ArmourBlock.vue';
import { ERollType } from './models';

export default defineComponent({
  name: 'CombatTab',
  components: { CharSkill, WeaponBlock, ArmourBlock },
  setup() {
    const app = useCharacterStore();

    const $q = useQuasar();
    const addWeapon = () => app.char.weapons.push(NewWeapon());
    const removeWeapon = (index: number) =>
      $q
        .dialog({
          message: 'Remove this weapon?',
          cancel: true,
          maximized: true,
        })
        .onOk(() => app.char.weapons.splice(index, 1));

    const armourRating = computed((): number => app.char.armour.rating + app.char.helmet.rating);

    const filter = ref('');
    const show = (name: string): boolean => {
      if (filter.value == '' || filter.value == null) return true;
      if (RegExp(filter.value, 'i').test(name)) return true;
      return false;
    };

    return {
      app,

      addWeapon,
      removeWeapon,
      DmgBonus,
      armourRating,
      ERollType,
      filter,
      show,
    };
  },
});
</script>
