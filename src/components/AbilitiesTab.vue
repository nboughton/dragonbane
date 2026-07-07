<template>
  <div class="column justify-between">
    <!---ABILITIES-->
    <div class="row q-ml-xs q-mt-md q-mb-sm items-center">
      <span class="col-grow text-h6 text-bold">Heroic Abilities</span>
      <q-btn v-if="editAbilities" icon="add_circle" flat dense rounded @click="addAbl" />
      <q-toggle class="col-shrink q-px-none" icon="mdi-pencil" v-model="editAbilities" />
    </div>
    <ability-block v-for="(ab, i) in app.char.abilities" :key="`abl-${i}`" v-model="app.char.abilities[i]!"
      @delete="removeAbl(i)" :edit-abilities="editAbilities" />

    <!---SPELLS-->
    <div class="row q-ml-xs q-mt-md q-mb-sm text-h6 text-bold items-center justify-between">
      <div class="col-shrink">
        Spells
        <q-btn v-if="editAbilities" icon="add_circle" flat dense rounded @click="addSpell" />
      </div>

      <q-input class="col-grow q-px-sm" label="Search" v-model="filter" clearable dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-checkbox class="col-shrink" v-model="showPreparedSpells" checked-icon="mdi-eye" unchecked-icon="mdi-eye-off"
        color="white">
        <q-tooltip>Toggle prepared spells</q-tooltip>
      </q-checkbox>

      <q-btn class="col-shrink" icon="sort" flat dense rounded @click="sortSpells">
        <q-tooltip>Sort spells by rank</q-tooltip>
      </q-btn>
    </div>

    <div class="row q-ml-xs items-center">
      <div class="col-shrink text-bold">Known (by rank):</div>
      <div class="col-shrink" v-for="(r, i) in spellsByRank" :key="`ranked-spells-${i}`">
        <span class="q-ml-sm q-pa-xs rounded-borders" v-if="r > 0">
          {{ i < 1 ? 'Magic Tricks' : 'Rank ' + i }}: {{ r }} </span>
      </div>
    </div>

    <div class="row items-center q-ml-xs q-mt-xs">
      <div class="col-shrink text-bold">Prepared:</div>
      <div class="col-shrink q-ml-sm q-px-xs">
        {{ spellsPrepared }}/{{ BaseChance(app.char.attributes.INT.score) }}
      </div>
    </div>

    <div v-for="(sp, i) in app.char.spells" :key="`spell-${i}`">
      <spell-block v-if="show(sp)" v-model="app.char.spells[i]!" @delete="removeSpell(i)"
        :edit-spells="editAbilities" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import type { Spell } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewAbility, NewSpell, BaseChance } from 'src/lib/defaults';

import AbilityBlock from './AbilityBlock.vue';
import SpellBlock from './SpellBlock.vue';

const app = useCharacterStore();
const editAbilities = ref(false)

const $q = useQuasar();

const addAbl = () => app.char.abilities.push(NewAbility());
const removeAbl = (index: number) =>
  $q
    .dialog({
      message: 'Delete this ability?',
      cancel: true,
      maximized: true,
    })
    .onOk(() => app.char.abilities.splice(index, 1));

const addSpell = () => app.char.spells.push(NewSpell());
const removeSpell = (index: number) =>
  $q
    .dialog({
      message: 'Delete this spell?',
      cancel: true,
      maximized: true,
    })
    .onOk(() => app.char.spells.splice(index, 1));
const sortSpells = () =>
  app.char.spells.sort((a, b) => {
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    else return 0;
  });
const spellsByRank = computed((): number[] => {
  const spells = [0, 0, 0, 0, 0, 0];
  app.char.spells.forEach((sp) => {
    spells[sp.rank]!++;
  });
  return spells;
});
const spellsPrepared = computed((): number => {
  let t = 0;
  app.char.spells.forEach((sp) => {
    if (sp.rank > 0 && sp.prepared) t++;
  });
  return t;
});



const filter = ref('');
const show = (s: Spell): boolean => {
  if (!s.prepared && showPreparedSpells.value) return false;
  if (filter.value == null || filter.value == '') return true;

  if (RegExp(filter.value, 'i').test(s.name) || RegExp(filter.value).test(s.text)) return true;

  return false;
};

const showPreparedSpells = ref(false);
</script>
