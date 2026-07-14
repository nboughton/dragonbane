<template>
  <q-page class="column" :padding="$q.screen.gt.sm">
    <q-expansion-item :default-opened="!app.char.kin"
      :label="`${app.char.name}${app.char.kin ? ' ' + t('ui.the') + ' ' + t('kins.' + app.char.kin, app.char.kin) : ''}${app.char.profession ? ' ' + t('professions.' + app.char.profession, app.char.profession) : ''}`"
      header-class="text-h5">
      <div class="row justify-between q-gutter-sm q-px-sm">
        <div class="col">
          <q-input class="row" :label="t('ui.name')" v-model="app.char.name" dense />

          <div class="row">
            <q-select class="col" options-selected-class="text-purple-2" :label="t('ui.age')" v-model="app.char.age"
              :options="Object.values(Ages).map(age => ({ label: t('ages.' + age), value: age }))" dense emit-value map-options />
            <q-input class="col" :label="t('ui.movement')" type="number" v-model.number="app.char.movement" dense />
          </div>
        </div>

        <div class="col">
          <div class="row">
            <q-select class="col" options-selected-class="text-purple-2" :label="t('ui.kin')" v-model="app.char.kin"
              :options="Kins.map(k => ({ label: t('kins.' + k, k), value: k }))" dense emit-value map-options />
            <q-select class="col" options-selected-class="text-purple-2" :label="t('ui.profession')" v-model="app.char.profession"
              :options="Professions.map(p => ({ label: t('professions.' + p, p), value: p }))" dense emit-value map-options />
          </div>
          <q-input class="row" :label="t('ui.weakness')" v-model="app.char.weakness" dense />
        </div>
      </div>

      <q-input class="row q-px-sm" :label="t('ui.appearance')" v-model="app.char.appearance" dense autogrow borderless />
    </q-expansion-item>

    <q-separator />
    <div class="row justify-between q-px-sm q-mt-md q-mb-sm">
      <div class="col-xs-6 col-sm-6 col-md-4 q-pr-xs">
        <points-block v-model="app.char.hp" :label="t('ui.hp')" />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4 q-pl-xs">
        <points-block v-model="app.char.wp" :label="t('ui.wp')" label-right />
      </div>
    </div>


    <div class="row justify-evenly q-mb-md">
      <q-btn v-if="statsRolled" class="col-12 q-mb-sm" icon="mdi-dice-d20" flat @click="rollStats" :label="t('ui.rollStats')">
        <q-tooltip>{{ t('ui.rollStats') }}</q-tooltip>
      </q-btn>
      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.STR" v-model="app.char.attributes.STR" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.CON" v-model="app.char.attributes.CON" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.AGL" v-model="app.char.attributes.AGL" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.INT" v-model="app.char.attributes.INT" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.WIL" v-model="app.char.attributes.WIL" />
      </div>

      <div class="col-xs-4 col-sm-2 col-md-2">
        <char-attr :label="Attrs.CHA" v-model="app.char.attributes.CHA" />
      </div>
    </div>

    <q-separator />
    <q-tabs v-model="tab" align="justify" dense>
      <q-tab name="skills" :label="t('ui.skills')" />
      <q-tab name="combat" :label="t('ui.combat')" />
      <q-tab name="abilities" :label="t('ui.abilitiesSpells')" />
      <q-tab name="gear" :label="t('ui.gear')" />
      <q-tab name="log" :label="t('ui.log')" />
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

      <!--LOG-->
      <q-tab-panel name="log">
        <log-tab />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Attr } from 'src/components/models';
import { Ages, Attrs } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import CharAttr from 'src/components/CharAttr.vue';
import PointsBlock from 'src/components/PointsBlock.vue';
import SkillsTab from 'src/components/SkillsTab.vue';
import CombatTab from 'src/components/CombatTab.vue';
import AbilitiesTab from 'src/components/AbilitiesTab.vue';
import GearTab from 'src/components/GearTab.vue';
import LogTab from 'src/components/LogTab.vue';

const app = useCharacterStore();
const { t } = useI18n();
const tab = ref('skills');

const Kins = ['Human', 'Halfling', 'Dwarf', 'Elf', 'Mallard', 'Wolfkin'];
const Professions = [
  'Artisan',
  'Bard',
  'Fighter',
  'Hunter',
  'Knight',
  'Mage',
  'Merchant',
  'Scholar',
  'Thief',
  'Mariner',
];

const $q = useQuasar();
const rollStats = () =>
  $q
    .dialog({
      message: t('ui.rollStatsConfirm'),
      cancel: true,
    })
    .onOk(() => {
      const r = (): number => {
        let sum = 0;

        const rolls: number[] = new Array(4).fill(0);
        rolls.forEach((n, i) => (rolls[i] = Math.floor(Math.random() * 6) + 1));
        rolls.sort();
        rolls.shift();
        rolls.forEach((roll) => (sum += roll));

        return sum;
      };

      Object.keys(Attrs).forEach((attr) => (app.char.attributes[attr as Attr].score = r()));

      const hp = app.char.attributes[Attrs.CON].score;
      app.char.hp.max = hp;
      app.char.hp.current = hp;

      const wp = app.char.attributes[Attrs.WIL].score;
      app.char.wp.max = wp;
      app.char.wp.current = wp;
    });
const statsRolled = computed((): boolean => {
  let total = 0;
  Object.keys(Attrs).forEach((attr) => (total += app.char.attributes[attr as Attr].score));
  return total == 0;
});

watch(
  () => app.char?.attributes,
  (attrs) => {
    if (app.char && attrs) {
      const conScore = Number(attrs[Attrs.CON]?.score) || 0;
      const wilScore = Number(attrs[Attrs.WIL]?.score) || 0;

      if (app.char.hp.max !== conScore) {
        const diff = conScore - app.char.hp.max;
        app.char.hp.max = conScore;
        app.char.hp.current = Math.max(0, app.char.hp.current + diff);
      }

      if (app.char.wp.max !== wilScore) {
        const diff = wilScore - app.char.wp.max;
        app.char.wp.max = wilScore;
        app.char.wp.current = Math.max(0, app.char.wp.current + diff);
      }
    }
  },
  { deep: true, immediate: true }
);
</script>
