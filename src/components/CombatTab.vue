<template>
  <div class="row text-bold q-px-sm q-pt-xs justify-center items-center">
    <div class="col text-h6 text-center">
      <div class="row items-center justify-center">
        <q-icon name="mdi-run" />
        {{ app.char.movement }}m
      </div>
    </div>
    <div class="col q-ml-sm text-h6 text-center">
      <div class="row items-center justify-center">
        <q-icon name="mdi-shield" />
        {{ armourRating }}
      </div>
    </div>
    <div class="col q-ml-sm text-h6 text-center">STR {{ DmgBonus(app.char.attributes.STR.score) }}</div>
    <div class="col q-ml-sm text-h6 text-center">AGL {{ DmgBonus(app.char.attributes.AGL.score) }}</div>
  </div>

  <div class="row q-ml-sm items-center">
    <div class="col text-h6 text-bold">Weapons</div>
    <div class="q-px-none">
      <q-toggle v-model="editWeapons" icon="mdi-pencil" />
    </div>
  </div>
  <weapon-block
    v-for="(w, i) in app.char.weapons"
    :key="`wpn-${i}`"
    v-model="app.char.weapons[i]"
    :edit-weapons="editWeapons"
    @delete="removeWeapon(i)"
  />
  <q-btn v-if="editWeapons" icon="add_circle" label="Add Weapon" flat dense rounded @click="addWeapon" />

  <div class="row q-ml-sm items-center">
    <div class="col text-h6 text-bold">Combat Skills</div>
    <div class="q-px-none">
      <q-toggle v-model="editSkills" icon="mdi-pencil" />
    </div>
  </div>
  <div class="row q-mt-sm">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <char-skill
        v-if="show('Evade')"
        v-model="app.char.priSkills['Evade']"
        :edit-skills="editSkills"
        label="Evade"
        :skill-type="ERollType.Primary"
      />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.wepSkills" :key="`skill-${k}`">
      <char-skill
        v-if="show(k as string)"
        v-model="app.char.wepSkills[k]"
        :edit-skills="editSkills"
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
    const editWeapons = ref(false);
    const editSkills = ref(false);
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
      editWeapons,
      editSkills,
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
