<template>
  <q-page padding class="column">
    <div class="row justify-between q-gutter-sm">
      <div class="col">
        <q-input class="row" label="Name" v-model="st.chars[st.conf.char].name" dense />

        <div class="row">
          <q-select class="col" label="Age" v-model="st.chars[st.conf.char].age" :options="Object.values(EAge)" dense />
          <q-input class="col" label="Movement" type="number" v-model.number="st.chars[st.conf.char].movement" dense />
        </div>
      </div>

      <div class="col">
        <div class="row">
          <q-input class="col" label="Kin" v-model="st.chars[st.conf.char].kin" dense />
          <q-input class="col" label="Profession" v-model="st.chars[st.conf.char].profession" dense />
        </div>
        <q-input class="row" label="Weakness" v-model="st.chars[st.conf.char].weakness" dense />
      </div>
    </div>

    <q-input class="row" label="Appearance" v-model="st.chars[st.conf.char].appearance" dense autogrow />

    <div class="row justify-evenly q-mt-lg">
      <q-btn v-if="statsRolled" class="col-12 q-mb-sm" icon="mdi-dice-d20" flat @click="rollStats" label="Roll stats">
        <q-tooltip>Roll stats</q-tooltip>
      </q-btn>
      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.STR" v-model="st.chars[st.conf.char].attributes.STR" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.CON" v-model="st.chars[st.conf.char].attributes.CON" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.AGL" v-model="st.chars[st.conf.char].attributes.AGL" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.INT" v-model="st.chars[st.conf.char].attributes.INT" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.WIL" v-model="st.chars[st.conf.char].attributes.WIL" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.CHA" v-model="st.chars[st.conf.char].attributes.CHA" />
      </div>
    </div>

    <div class="row justify-between q-mt-sm">
      <div class="col-xs-12 col-sm-5 col-md-4">
        <points-block v-model="st.chars[st.conf.char].hp" label="HP" show-max />
      </div>
      <div class="col-xs-12 col-sm-5 col-md-4">
        <points-block v-model="st.chars[st.conf.char].wp" label="WP" show-max />
      </div>
    </div>

    <q-tabs v-model="tab" align="justify" class="q-mt-md">
      <q-tab name="skills" label="Skills" />
      <q-tab name="combat" label="Combat" />
      <q-tab name="abilities" label="Abilities & Spells" />
      <q-tab name="gear" label="Gear" />
    </q-tabs>

    <q-tab-panels v-model="tab" class="rounded-borders">
      <!--SKILLS-->
      <q-tab-panel name="skills">
        <skills-tab v-model="st.chars[st.conf.char]" />
      </q-tab-panel>

      <!--COMBAT-->
      <q-tab-panel name="combat">
        <combat-tab v-model="st.chars[st.conf.char]" />
      </q-tab-panel>

      <!--ABILITIES & SPELLS-->
      <q-tab-panel name="abilities">
        <abilities-tab v-model="st.chars[st.conf.char]" />
      </q-tab-panel>

      <!--GEAR-->
      <q-tab-panel name="gear">
        <gear-tab v-model="st.chars[st.conf.char]" />
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
    const st = useCharacterStore();
    const tab = ref('skills');

    const $q = useQuasar();
    const rollStats = () =>
      $q
        .dialog({
          message: 'Roll and apply Character Stats?',
          cancel: true,
        })
        .onOk(() => {
          const r = (): number => {
            let sum = 0;
            let rolls: number[] = [];
            for (let i = 0; i < 4; i++) {
              rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            rolls = rolls.sort();
            console.log(rolls);
            rolls.shift();
            rolls.forEach((roll) => (sum += roll));
            return sum;
          };

          Object.keys(EAttr).forEach((attr) => (st.chars[st.conf.char].attributes[attr as EAttr].score = r()));
        });
    const statsRolled = computed((): boolean => {
      let total = 0;
      Object.keys(EAttr).forEach((attr) => (total += st.chars[st.conf.char].attributes[attr as EAttr].score));
      return total == 0;
    });

    return {
      st,
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
