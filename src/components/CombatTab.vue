<template>
  <div class="row text-bold q-mt-xs">
    Evade: {{ evade }};
    <span v-if="armourRating > 0">&nbsp;Armour: {{ armourRating }};&nbsp;</span>
    Dmg Bonus: STR: {{ DmgBonus(app.char.attributes.STR.score) }}, AGL:
    {{ DmgBonus(app.char.attributes.AGL.score) }}
  </div>

  <div class="row q-mt-md text-h5 text-bold items-center">
    Weapons
    <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
  </div>

  <weapon-block
    v-for="(w, i) in app.char.weapons"
    :key="`wpn-${i}`"
    v-model="app.char.weapons[i]"
    @delete="removeWeapon(i)"
  />

  <div class="row q-mt-md">
    <div class="col-12 text-h5 text-bold">Weapon Skills</div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.wepSkills" :key="`skill-${k}`">
      <char-skill v-model="app.char.wepSkills[k]" :label="`${k}`" />
    </div>
  </div>
  <div class="row justify-between items-center text-center q-mt-md">
    <div class="col-xs-12 col-sm-5">
      <armour-block label="Armour" v-model="app.char.armour" />
    </div>

    <div class="col-xs-12 col-sm-5">
      <armour-block label="Helmet" v-model="app.char.helmet" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

import { NewWeapon, DmgBonus, BaseChance } from 'src/lib/defaults';

import CharSkill from 'src/components/CharSkill.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import ArmourBlock from 'src/components/ArmourBlock.vue';

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
        })
        .onOk(() => app.char.weapons.splice(index, 1));

    const armourRating = computed((): number => app.char.armour.rating + app.char.helmet.rating);
    const evade = computed((): number => {
      const b = BaseChance(app.char.attributes.AGL.score);
      return (app.char.priSkills.Evade.trained ? b * 2 : b) + app.char.priSkills.Evade.advances;
    });

    return {
      app,

      addWeapon,
      removeWeapon,
      DmgBonus,
      evade,
      armourRating,
    };
  },
});
</script>
