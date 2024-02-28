<template>
  <div class="row justify-between" v-if="app.conf.showSpells">
    <div class="col-xs-12 col-sm-12 col-lg-6 q-px-xs">
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

    <div class="col-xs-12 col-sm-12 col-lg-6 q-px-xs">
      <div class="row q-mt-md q-mb-sm text-h5 text-bold items-center justify-between">
        <div class="col-shrink">
          Spells
          <q-btn icon="add_circle" flat dense rounded @click="addSpell" />
        </div>

        <q-input class="col-grow q-px-sm" label="Search" v-model="filter" clearable dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-checkbox
          class="col-shrink"
          v-model="showPreparedSpells"
          checked-icon="mdi-eye"
          unchecked-icon="mdi-eye-off"
          color="white"
        >
          <q-tooltip>Toggle prepared spells</q-tooltip>
        </q-checkbox>

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

      <div v-for="(sp, i) in app.char.spells" :key="`spell-${i}`">
        <spell-block v-if="show(sp)" v-model="app.char.spells[i]" @delete="removeSpell(i)" />
      </div>
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
import { defineComponent, computed, ref } from 'vue';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewAbility, NewSpell, BaseChance } from 'src/lib/defaults';

import AbilityBlock from './AbilityBlock.vue';
import SpellBlock from './SpellBlock.vue';
import { ISpell } from './models';

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

    const filter = ref('');
    const show = (s: ISpell): boolean => {
      if (!s.prepared && showPreparedSpells.value) return false;
      if (filter.value == null || filter.value == '') return true;

      if (RegExp(filter.value, 'i').test(s.name) || RegExp(filter.value).test(s.text)) return true;

      return false;
    };

    const showPreparedSpells = ref(false);

    return {
      app,
      BaseChance,
      filter,
      show,

      addSpell,
      removeSpell,
      sortSpells,
      spellsByRank,
      spellsPrepared,
      showPreparedSpells,

      addAbl,
      removeAbl,
    };
  },
});
</script>
