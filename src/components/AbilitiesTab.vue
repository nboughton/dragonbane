<template>
  <div class="row justify-between" v-if="app.conf.showSpells">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-xs">
      <div class="row q-mt-md text-h5 text-bold items-center">
        Heroic Abilities
        <q-btn icon="add_circle" flat dense rounded @click="addAbl" />
      </div>
      <ability-block
        v-for="(ab, i) in app.char.abilities"
        :key="`abl-${i}`"
        v-model="app.char.abilities[i]"
        @delete="removeAbl(i)"
      />
    </div>

    <div class="col-xs-12 col-sm-12 col-md-6 q-px-xs">
      <div class="row q-mt-md text-h5 text-bold items-center justify-between">
        <div class="col-shrink">
          Spells
          <q-btn icon="add_circle" flat dense rounded @click="addSpell" />
        </div>

        <q-btn class="col-shrink" icon="sort" flat dense rounded @click="sortSpells">
          <q-tooltip>Sort spells by rank</q-tooltip>
        </q-btn>
      </div>

      <div class="row items-center">
        <div class="col-shrink text-bold">Known (by rank):</div>
        <div class="col-shrink" v-for="(r, i) in spellsByRank" :key="`ranked-spells-${i}`">
          <span class="q-ml-sm q-pa-xs rounded-borders" v-if="r > 0">
            {{ i < 1 ? 'Magic Tricks' : 'Rank ' + i }}: {{ r }}
          </span>
        </div>
      </div>

      <div class="row items-center q-mt-xs">
        <div class="col-shrink text-bold">Prepared:</div>
        <div class="col-shrink q-ml-sm q-px-xs">
          {{ spellsPrepared }}/{{ BaseChance(app.char.attributes.INT.score) }}
        </div>
      </div>

      <spell-block
        v-for="(sp, i) in app.char.spells"
        :key="`spell-${i}`"
        v-model="app.char.spells[i]"
        @delete="removeSpell(i)"
      />
    </div>
  </div>
  <div v-else>
    <div class="row q-mt-md text-h5 text-bold items-center">
      Heroic Abilities
      <q-btn icon="add_circle" flat dense rounded @click="addAbl" />
    </div>
    <ability-block
      v-for="(ab, i) in app.char.abilities"
      :key="`abl-${i}`"
      v-model="app.char.abilities[i]"
      @delete="removeAbl(i)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useQuasar } from 'quasar';

import { NewAbility, NewSpell, BaseChance } from 'src/lib/defaults';

import AbilityBlock from './AbilityBlock.vue';
import SpellBlock from './SpellBlock.vue';
import { useCharacterStore } from 'src/stores/character';

export default defineComponent({
  name: 'AbilitiesTab',
  components: { AbilityBlock, SpellBlock },
  setup() {
    const app = useCharacterStore();

    const $q = useQuasar();
    const addSpell = () => app.char.spells.push(NewSpell());
    const removeSpell = (index: number) =>
      $q
        .dialog({
          message: 'Delete this spell?',
          cancel: true,
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
        spells[sp.rank]++;
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

    const addAbl = () => app.char.abilities.push(NewAbility());
    const removeAbl = (index: number) =>
      $q
        .dialog({
          message: 'Delete this ability?',
          cancel: true,
        })
        .onOk(() => app.char.abilities.splice(index, 1));

    return {
      app,
      BaseChance,

      addSpell,
      removeSpell,
      sortSpells,
      spellsByRank,
      spellsPrepared,

      addAbl,
      removeAbl,
    };
  },
});
</script>
