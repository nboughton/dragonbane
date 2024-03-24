<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <q-page class="column" :padding="$q.screen.gt.sm">
    <q-expansion-item
      :default-opened="!app.char.kin"
      :label="`${app.char.name} ${app.char.kin ? 'the' : ''} ${app.char.kin} ${app.char.profession}`"
      header-class="text-h5"
    >
      <div class="row justify-between q-gutter-sm q-px-sm">
        <div class="col">
          <q-input class="row" label="Name" v-model="app.char.name" dense />

          <div class="row">
            <q-select class="col" label="Age" v-model="app.char.age" :options="Object.values(EAge)" dense />
            <q-input class="col" label="Movement" type="number" v-model.number="app.char.movement" dense />
          </div>
        </div>

        <div class="col">
          <div class="row">
            <q-input class="col" label="Kin" v-model="app.char.kin" dense />
            <q-input class="col" label="Profession" v-model="app.char.profession" dense />
          </div>
          <q-input class="row" label="Weakness" v-model="app.char.weakness" dense />
        </div>
      </div>

      <q-input class="row q-px-sm" label="Appearance" v-model="app.char.appearance" dense autogrow />
    </q-expansion-item>

    <div class="row justify-between q-px-sm">
      <div class="col-xs-6 col-sm-6 col-md-4 q-pr-xs">
        <points-block v-model="app.char.hp" label="HP" />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4 q-pl-xs">
        <points-block v-model="app.char.wp" label="WP" />
      </div>
    </div>

    <div class="row justify-evenly">
      <q-btn v-if="statsRolled" class="col-12 q-mb-sm" icon="mdi-dice-d20" flat @click="rollStats" label="Roll stats">
        <q-tooltip>Roll stats</q-tooltip>
      </q-btn>
      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.STR" v-model="app.char.attributes.STR" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.CON" v-model="app.char.attributes.CON" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.AGL" v-model="app.char.attributes.AGL" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.INT" v-model="app.char.attributes.INT" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.WIL" v-model="app.char.attributes.WIL" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="EAttr.CHA" v-model="app.char.attributes.CHA" />
      </div>
    </div>

    <q-tabs v-model="tab" align="justify" dense>
      <q-tab name="skills" label="Skills" />
      <q-tab name="combat" label="Combat" />
      <q-tab name="abilities" label="Abilities" />
      <q-tab name="gear" label="Gear" />
      <!-- <q-tab name="character" label="Character" />
      <q-tab name="log" label="Log" /> -->
    </q-tabs>

    <q-tab-panels v-model="tab" class="rounded-borders" swipeable>
      <!--SKILLS-->
      <q-tab-panel name="skills" class="q-pa-none">
        <skills-tab />
      </q-tab-panel>

      <!--COMBAT-->
      <q-tab-panel name="combat" class="q-pa-none">
        <combat-tab />
      </q-tab-panel>

      <!--ABILITIES & SPELLS-->
      <q-tab-panel name="abilities" class="q-pa-none">
        <abilities-tab />
      </q-tab-panel>

      <!--GEAR-->
      <q-tab-panel name="gear" class="q-pa-none">
        <gear-tab />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import { EAge, EAttr } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { BaseChance, DmgBonus } from 'src/lib/defaults';

import CharAttr from 'src/components/CharAttr.vue';
import PointsBlock from 'src/components/PointsBlock.vue';
import SkillsTab from 'src/components/SkillsTab.vue';
import CombatTab from 'src/components/CombatTab.vue';
import AbilitiesTab from 'src/components/AbilitiesTab.vue';
import GearTab from 'src/components/GearTab.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CharAttr,
    PointsBlock,
    SkillsTab,
    CombatTab,
    AbilitiesTab,
    GearTab,
  },
  setup() {
    const app = useCharacterStore();
    const tab = ref('skills');

    const $q = useQuasar();
    const rollStats = () =>
      $q
        .dialog({
          message: 'Roll and apply Character Stats?',
          maximized: true,
          cancel: true,
        })
        .onOk(() => {
          const r = (): number => {
            let sum = 0;

            let rolls: number[] = new Array(4).fill(0);
            rolls.forEach((n, i) => (rolls[i] = Math.floor(Math.random() * 6) + 1));
            rolls.sort();
            rolls.shift();
            rolls.forEach((roll) => (sum += roll));

            return sum;
          };

          Object.keys(EAttr).forEach((attr) => (app.char.attributes[attr as EAttr].score = r()));

          const hp = app.char.attributes[EAttr.CON].score;
          app.char.hp.max = hp;
          app.char.hp.current = hp;

          const wp = app.char.attributes[EAttr.WIL].score;
          app.char.wp.max = wp;
          app.char.wp.current = wp;
        });
    const statsRolled = computed((): boolean => {
      let total = 0;
      Object.keys(EAttr).forEach((attr) => (total += app.char.attributes[attr as EAttr].score));
      return total == 0;
    });

    return {
      app,
      tab,
      EAttr,
      EAge,
      DmgBonus,
      BaseChance,
      rollStats,
      statsRolled,
    };
  },
});
</script>
