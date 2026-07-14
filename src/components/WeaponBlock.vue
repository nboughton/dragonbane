<template>
  <div class="q-ma-xs q-pa-xs q-pl-sm rounded-borders outlined" flat>
    <div v-if="editWeapons">
      <div class="row q-gutter-sm items-center">
        <q-input class="col-grow" :label="t('ui.weaponShield')" v-model="weapon.name" dense />
        <q-select class="col-shrink" options-selected-class="text-purple-2" :label="t('ui.skill')" v-model="weapon.skill"
          :options="skills.map(sk => ({ label: t('skills.' + sk, sk), value: sk }))" dense emit-value map-options />
        <q-btn class="col-shrink bg-primary" icon="delete" @click="$emit('delete')" flat dense />
      </div>
      <div class="row q-gutter-sm">
        <q-select class="col" :label="t('ui.grip')" v-model="weapon.grip"
          :options="Object.values(Grips).map(g => ({ label: t('grips.' + g, g), value: g }))" dense emit-value map-options />
        <q-input class="col" :label="t('ui.range')" v-model="weapon.range" dense />
        <q-input class="col" :label="t('ui.damage')" v-model="weapon.damage" dense />
        <q-input class="col" :label="t('ui.durability')" type="number" v-model.number="weapon.durability" dense />
      </div>
      <div class="row q-gutter-sm">
        <q-input class="col-grow" :label="t('ui.features')" v-model="weapon.features" dense borderless />
      </div>
    </div>
    <div v-else>
      <div class="row justify-between items-center">
        <div class="col text-bold">{{ weapon.name }}</div>
        <div class="col text-right">
          <q-icon name="mdi-skull" size="sm" v-if="weapon.skill && app.banes('wepSkills', weapon.skill!)" />
        </div>
        <q-btn v-if="weapon.skill" icon="mdi-dice-d20" @click="showRoller" flat dense />
      </div>
      <div class="row">
        <div class="col-shrink">
          <q-icon name="mdi-sword" />
          {{ weapon.damage }}
          {{
            weapon.skill && app.dmgBonus(app.char.wepSkills[weapon.skill]!.attr) != '-'
              ? app.dmgBonus(app.char.wepSkills[weapon.skill]!.attr)
              : ''
          }}
        </div>
        <div class="col-shrink q-ml-sm">
          <q-icon name="mdi-anvil" />
          {{ weapon.durability }}
        </div>
        <div v-if="+weapon.range > 2" class="col-shrink q-ml-sm">
          <q-icon name="mdi-ray-start-arrow" />
          {{ weapon.range }}m
        </div>
        <div class="col-grow text-right q-mr-sm">
          {{ weapon.features }}
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="display.roller" maximized>
    <dice-roller :name="weapon.name" :roll-type="RollTypes.Attack" :target="app.skillValue('wepSkills', weapon.skill!)"
      :banes="app.banes('wepSkills', weapon.skill!)" :skill="weapon.skill!" @close="display.roller = false" @result="
        (r: string) => {
          setResultDisplay(r);
          const translatedR = r
            .replace('Dragon!', t('d20Results.Dragon!'))
            .replace('Demon!', t('d20Results.Demon!'))
            .replace('Success!', t('d20Results.Success!'))
            .replace('Failure', t('d20Results.Failure'));
          notifySend(
            t('ui.notifyRoll', { name: app.char.name, label: t('skills.' + weapon.skill, weapon.skill), result: translatedR }),
            r.includes(D20Results.Dragon) || r.includes(D20Results.Success) ? 'SUCCESS' : 'ERROR',
          );
        }
      ">
      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column q-gutter-sm">
          <q-expansion-item :label="t('ui.meleeSpecialEffects')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <p class="text-bold">{{ t('ui.chooseOne') }}</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">{{ t('ui.meleeCritEffect1') }}</li>
                <li class="q-pb-sm">{{ t('ui.meleeCritEffect2') }}</li>
                <li>{{ t('ui.meleeCritEffect3') }}</li>
              </ul>
            </div>
          </q-expansion-item>

          <q-expansion-item :label="t('ui.rangedSpecialEffects')" class="rounded-borders bg-blue-grey-9"
            header-class="text-h6">
            <div class="q-pa-sm">
              <p class="text-bold">{{ t('ui.chooseOne') }}</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">{{ t('ui.rangedCritEffect1') }}</li>
                <li>{{ t('ui.rangedCritEffect2') }}</li>
              </ul>
            </div>
          </q-expansion-item>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column q-gutter-sm">
          <q-expansion-item :label="t('ui.meleeMishap')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn class="col-shrink" :label="t('ui.rollMishap')"
                  @click="mishap.melee = rollTable(MeleeDemon) as string" outline />
                <div class="col">{{ mishap.melee }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>{{ t('ui.effect') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in MeleeDemon.rows" :key="`md-${i}`">
                    <td class="q-pa-xs">{{ row.floor }}</td>
                    <td class="q-pa-xs">{{ row.text }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-expansion-item>

          <q-expansion-item :label="t('ui.rangedMishap')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn class="col-shrink" :label="t('ui.rollMishap')"
                  @click="mishap.ranged = rollTable(RangedDemon) as string" outline />
                <div class="col">{{ mishap.ranged }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>{{ t('ui.effect') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in RangedDemon.rows" :key="`rd-${i}`">
                    <td class="q-pa-xs">{{ row.floor }}</td>
                    <td class="q-pa-xs">{{ row.text }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-expansion-item>
        </q-card-section>

        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />

        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center">
          <div class="row full-width items-center justify-center q-mb-md">
            <q-btn :label="t('ui.rollDamage')" @click="rollDmg()" color="white" text-color="black" />
          </div>
          <div class="row full-width items-center justify-center q-mb-md">
            <div v-if="dmgRes.total != 0" class="col-2 text-center text-h5 rounded-borders q-pa-sm">
              {{ dmgRes.total }}
            </div>
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Weapon, DiceRoll } from './models';
import { Grips, RollTypes, D20Results } from './models';

import { useCharacterStore } from 'src/stores/character';

import { parseDiceString, rollDice } from 'src/lib/util';
import { MeleeDemon, RangedDemon, rollTable } from 'src/lib/tables';
import { notifySend } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';

const weapon = defineModel<Weapon>({ required: true });
defineEmits(['delete']);
defineProps<{ editWeapons: boolean }>();

const app = useCharacterStore();
const { t } = useI18n();
const skills = computed((): string[] => Object.keys(app.char.wepSkills));
const display = ref({
  roller: false,
  select: false,
  success: false,
  dragon: false,
  demon: false,
});

const dmgDice = ref(parseDiceString(weapon.value.damage));

const dmgBonus = computed(() => (weapon.value.skill ? app.dmgBonus(app.char.wepSkills[weapon.value.skill].attr) : '-'));
if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
watch(
  () => weapon.value.damage,
  () => {
    dmgDice.value = parseDiceString(weapon.value.damage);
    if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
  },
);

const dmgRes = ref(<DiceRoll>{ total: 0, results: [] });
const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(', ')}`);

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

const mishap = ref({
  melee: '',
  ranged: '',
});

const showRoller = () => {
  setResultDisplay('-');
  dmgRes.value = { total: 0, results: [] };
};

const rollDmg = () => {
  dmgRes.value = rollDice(dmgDice.value);
  void notifySend(t('ui.notifyHit', { name: app.char.name, damage: dmgRes.value.total }), 'SUCCESS');
};
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
