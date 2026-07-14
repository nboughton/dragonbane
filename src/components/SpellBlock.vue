<template>
  <div class="q-ma-xs q-pa-xs rounded-borders outlined" flat>
    <div class="column" v-if="editSpells">
      <div class="row q-gutter-sm items-center">
        <q-checkbox v-if="spell.rank > 0" class="col-shrink q-pr-xs" checked-icon="mdi-alpha-p-box"
          unchecked-icon="mdi-alpha-p-box-outline" color="white" v-model="spell.prepared" size="md" dense>
          <q-tooltip>{{ t('ui.prepared') }}</q-tooltip>
        </q-checkbox>
        <q-input class="col-grow" :label="t('ui.name')" v-model="spell.name" dense />
        <q-input class="col-xs-2 col-sm-1" :label="t('ui.spellRank')" v-model.number="spell.rank" type="number" dense />
        <q-btn class="col-shrink bg-primary" icon="delete" flat dense @click="$emit('delete')" />
      </div>

      <q-select class="row" options-selected-class="text-purple-2" :label="t('ui.skill')"
        :options="skills.map(sk => ({ label: t('skills.' + sk, sk), value: sk }))" v-model="spell.skill"
        dense emit-value map-options />

      <div v-if="spell.rank > 0" class="row q-gutter-sm">
        <q-input class="col" :label="t('ui.castingTime')" v-model="spell.time" dense />
        <q-select class="col" options-selected-class="text-purple-2" :label="t('ui.duration')" v-model="spell.duration"
          :options="Object.values(Durations).map(d => ({ label: t('durations.' + d, d), value: d }))"
          dense emit-value map-options />
      </div>

      <div v-if="spell.rank > 0" class="row q-gutter-sm items-end">
        <q-select class="col" options-selected-class="text-purple-2" :label="t('ui.requirements')" v-model="spell.req" multiple
          :options="Object.values(SpellReqs).map(req => ({ label: t('spellReqs.' + req, req), value: req }))"
          dense emit-value map-options />
        <q-input class="col" :label="t('ui.range')" v-model="spell.range" dense />
      </div>

      <q-input class="row" v-if="spell.req.includes(SpellReqs.Ingredient)" :label="t('ui.ingredient')" v-model="spell.ingredient"
        dense />

      <q-input class="row" :label="t('ui.text')" v-model="spell.text" dense autogrow borderless />
    </div>

    <div v-else class="row q-pa-xs">
      <q-btn class="col-1" v-if="spell.skill && spell.rank > 0 && spell.prepared" icon="mdi-dice-d20"
        @click="showRoller()" flat dense />
      <q-btn class="col-1" v-else icon="mdi-account-arrow-right" flat dense @click="useMagicTrick(spell.name)" />
      <div class="col-11 q-pl-xs">
        <div class="row items-center">
          <span class="col-grow text-bold">{{ spell.name }}</span>
          <span class="col-shrink text-caption" v-if="spell.rank > 0">{{ t('ui.rank', { rank: spell.rank }) }}</span>
          <span class="col-shrink text-caption" v-else>{{ t('ui.magicTrick') }}</span>
          <q-icon class="col-shrink" v-if="spell.rank > 0" :name="`mdi-alpha-p-box${spell.prepared ? '' : '-outline'}`"
            size="sm" />
        </div>
        <div class="row text-caption">{{ spell.text }}</div>
        <q-expansion-item dense header-class="q-pa-none q-ma-none text-bold rounded-borders" :content-inset-level="0"
          :label="t('ui.moreInfo')">
          <div class="row">
            <div class="col-4 text-bold">{{ t('ui.castingTime') }}</div>
            <div class="col">{{ spell.time }}</div>
          </div>
          <div class="row">
            <div class="col-4 text-bold">{{ t('ui.duration') }}</div>
            <div class="col">{{ t('durations.' + spell.duration, spell.duration) }}</div>
          </div>
          <div class="row">
            <div class="col-4 text-bold">{{ t('ui.requirements') }}</div>
            <div class="col">
              {{spell.req.map(s => s == "Ingredient" ? t('ui.ingredient') + ' (' + spell.ingredient + ')' : t('spellReqs.' + s, s)).join(', ')}}
            </div>
          </div>
          <div class="row">
            <div class="col-4 text-bold">{{ t('ui.range') }}</div>
            <div class="col">{{ spell.range }}</div>
          </div>
        </q-expansion-item>

      </div>
    </div>
  </div>

  <q-dialog v-model="display.roller" maximized>
    <dice-roller :name="spell.name" :roll-type="RollTypes.Spell" :skill="spell.skill!"
      :target="app.skillValue('secSkills', spell.skill!)" :banes="app.banes('secSkills', spell.skill!)"
      @close="display.roller = false" @result="
        (r: string) => {
          setResultDisplay(r);
          const translatedR = r
            .replace('Dragon!', t('d20Results.Dragon!'))
            .replace('Demon!', t('d20Results.Demon!'))
            .replace('Success!', t('d20Results.Success!'))
            .replace('Failure', t('d20Results.Failure'));
          notifySend(
            t('ui.notifyRoll', { name: app.char.name, label: spell.skill ? t('skills.' + spell.skill) : '', result: translatedR }),
            r.includes(D20Results.Dragon) || r.includes(D20Results.Success) ? 'SUCCESS' : 'ERROR',
          );
        }
      ">
      <template v-slot:prepend>
        <q-card-section class="column justify-center items-center q-pb-none q-mb-none">
          <div class="row full-width items-center q-px-md">
            <q-select class="col-grow q-mr-sm" options-selected-class="text-purple-2" :label="t('ui.powerLevel')"
              :options="powerLevels" v-model="pl" dense :hint="t('ui.currentWP', { wp: app.char.wp.current })" />
            <q-btn class="col-shrink" :label="t('ui.spendWP', { wp: pl * 2 })" color="white" text-color="black"
              @click="app.char.wp.current -= pl * 2" />
          </div>

          <p class="q-mt-sm q-pa-md rounded-borders text-bold">{{ spell.text }}</p>
        </q-card-section>
      </template>

      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column">
          <div class="q-pa-md rounded-borders text-bold">
            <p class="text-bold">{{ t('ui.chooseOne') }}</p>
            <ul class="q-pl-md">
              <li class="q-pb-sm">{{ t('ui.dragonSpellEffect1') }}</li>
              <li class="q-pb-sm">{{ t('ui.dragonSpellEffect2') }}</li>
              <li>{{ t('ui.dragonSpellEffect3') }}</li>
            </ul>
          </div>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column rounded-borders bg-negative q-ma-md">
          <div class="row items-center q-mb-md justify-between">
            <q-btn class="col-shrink q-mr-md" :label="t('ui.rollMishap')"
              @click="mishap = rollTable(MagicalMishap) as string" outline />
            <div class="col">{{ mishap }}</div>
          </div>
          <q-expansion-item :label="t('ui.magicalMishapTable')" header-class="text-h6">
            <table>
              <thead>
                <tr>
                  <th>{{ t('ui.d20') }}</th>
                  <th>{{ t('ui.effect') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in MagicalMishap.rows" :key="`mm-${i}`">
                  <td class="q-pa-xs">{{ row.floor }}</td>
                  <td class="q-pa-xs">{{ row.text }}</td>
                </tr>
              </tbody>
            </table>
          </q-expansion-item>
        </q-card-section>

        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />

        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center">
          <q-btn :label="t('ui.roll')" @click="rollDmg()" color="white" text-color="black" />
          <div v-if="dmgRes.total != 0" class="text-h4 rounded-borders q-pa-sm">
            {{ dmgRes.total }}
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DiceRoll, Spell } from './models';
import { D20Results, Durations, RollTypes, SpellReqs } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { rollDice, parseDiceString } from 'src/lib/util';
import { MagicalMishap, rollTable } from 'src/lib/tables';
import { notifySend } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';

const spell = defineModel<Spell>({ required: true });
defineEmits(['delete']);
defineProps<{ editSpells: boolean }>()

const app = useCharacterStore();
const { t } = useI18n();
const skills = computed((): string[] => Object.keys(app.char.secSkills));
const dmgDice = ref(parseDiceString(spell.value.text));
// For spells we only include the first dice set mentioned
dmgDice.value.splice(1);
const dmgRes = ref(<DiceRoll>{ total: 0, results: [] });
const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(', ')}`);
const display = ref({
  roller: false,
  select: false,
  success: false,
  dragon: false,
  demon: false,
});

const setResultDisplay = (r: string) => {
  display.value = {
    roller: true,
    select: false,
    success: false,
    dragon: false,
    demon: false,
  };

  if (r.includes(D20Results.Dragon)) {
    display.value.dragon = true;
  } else if (r.includes(D20Results.Demon)) {
    display.value.demon = true;
  } else if (r.includes(D20Results.Success)) {
    display.value.success = true;
  }
};

const showRoller = () => {
  if (checkWP(2)) {
    setResultDisplay('-');
    dmgRes.value = { total: 0, results: [] };
  }
};

const mishap = ref('');

const $q = useQuasar();
const useMagicTrick = (name: string) =>
  checkWP(1)
    ? $q
      .dialog({
        title: t('ui.spend1WPConfirm', { name: name }),
        ok: true,
        cancel: true,
      })
      .onOk(() => app.char.wp.current--)
    : undefined;

const checkWP = (wpReq: number): boolean => {
  let out = false;
  if (app.char.wp.current < wpReq) {
    $q.dialog({
      title: t('ui.outOfJuice'),
      message: t('ui.outOfJuiceMessage', { wp: app.char.wp.current }),
      ok: true,
    }).onOk(() => (out = false));
  } else {
    out = true;
  }
  return out;
};

const pl = ref(1);
const powerLevels = computed((): number[] => {
  const out = <number[]>[];

  const lvls = [1, 2, 3];
  lvls.forEach((n) => (n * 2 <= app.char.wp.current ? out.push(n) : undefined));

  return out;
});

const rollDmg = () => {
  dmgRes.value = rollDice(dmgDice.value);
  void notifySend(t('ui.notifyHit', { name: app.char.name, damage: dmgRes.value.total }), 'SUCCESS');
};
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
