<template>
  <div class="q-ma-xs q-pa-xs q-pl-sm rounded-borders outlined" flat>
    <div v-if="editWeapons">
      <div class="row q-gutter-sm items-center">
        <q-input class="col-grow" label="Weapon/Shield" v-model="weapon.name" dense />
        <q-select class="col-shrink" options-selected-class="text-purple-2" label="Skill" v-model="weapon.skill"
          :options="skills" dense />
        <q-btn class="col-shrink bg-primary" icon="delete" @click="$emit('delete')" flat dense />
      </div>
      <div class="row q-gutter-sm">
        <q-select class="col" label="Grip" v-model="weapon.grip" :options="Object.values(Grips)" dense />
        <q-input class="col" label="Range" v-model="weapon.range" dense />
        <q-input class="col" label="Damage" v-model="weapon.damage" dense />
        <q-input class="col" label="Durability" type="number" v-model.number="weapon.durability" dense />
      </div>
      <div class="row q-gutter-sm">
        <q-input class="col-grow" label="Features" v-model="weapon.features" dense borderless />
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
          notifySend(
            `${app.char.name} rolled ${weapon.skill}: ${r}`,
            r.includes(D20Results.Dragon) || r.includes(D20Results.Success) ? 'SUCCESS' : 'ERROR',
          );
        }
      ">
      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column q-gutter-sm">
          <q-expansion-item label="Melee Special Effects" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <p class="text-bold">Choose one:</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">
                  Roll double the amount of dice for the weapon's damage, before adding any damage bonus and other
                  bonuses. For example, if you get a critical hit with a broadsword (damage 2D6) and have damage bonus
                  D4, the damage is 4D6+D4.
                </li>
                <li class="q-pb-sm">
                  You can immediately perform a second attack against another enemy. This additional attack is a free
                  action.
                </li>
                <li>
                  Armor has no effect against the attack, as it finds a gap or weak spot. This effect can only be chosen
                  if the attack deals piercing damage
                </li>
              </ul>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Ranged Special Effects" class="rounded-borders bg-blue-grey-9"
            header-class="text-h6">
            <div class="q-pa-sm">
              <p class="text-bold">Choose one:</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">
                  Your weapon's damage is doubled, excluding the damage bonus and other bonuses. Roll twice as many dice
                  as normal and add them up. For example, a critical hit with a longbow inflicts 2D12 damage.
                </li>
                <li>
                  Armor and natural armor have no effect against the attack, as it hits a gap or weak spot. This effect
                  can only be chosen if the attack deals piercing damage.
                </li>
              </ul>
            </div>
          </q-expansion-item>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column q-gutter-sm">
          <q-expansion-item label="Melee Mishap" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn class="col-shrink" label="Roll your mishap"
                  @click="mishap.melee = rollTable(MeleeDemon) as string" outline />
                <div class="col">{{ mishap.melee }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>Effect</th>
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

          <q-expansion-item label="Ranged Mishap" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn class="col-shrink" label="Roll your mishap"
                  @click="mishap.ranged = rollTable(RangedDemon) as string" outline />
                <div class="col">{{ mishap.ranged }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>Effect</th>
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
            <q-btn label="Roll Damage" @click="rollDmg()" color="white" text-color="black" />
          </div>
          <div class="row full-width items-center justify-center q-mb-md">
            <div v-if="dmgRes.total != 0" class="col-2 text-center text-h5 rounded-borders q-pa-sm">
              {{ dmgRes.total }}
            </div>
          </div>
          <div class="text-caption">{{ parseResult().join(", ") }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import type { DiceRoll, Weapon } from "./models";
import { D20Results, Grips, RollTypes } from "./models";

import { useCharacterStore } from "../stores/character";

import { parseDiceString, rollDice } from "../lib/util";
import { MeleeDemon, RangedDemon, rollTable } from "../lib/tables";
import { notifySend } from "../lib/notify";

import DiceRoller from "./DiceRoller.vue";
import DiceSelect from "./DiceSelect.vue";

const weapon = defineModel<Weapon>({ required: true });
defineEmits(["delete"]);
defineProps<{ editWeapons: boolean }>();

const app = useCharacterStore();
const skills = computed((): string[] => Object.keys(app.char.wepSkills));
const display = ref({
  roller: false,
  select: false,
  success: false,
  dragon: false,
  demon: false,
});

const dmgDice = ref(parseDiceString(weapon.value.damage));

const dmgBonus = computed(() => (weapon.value.skill ? app.dmgBonus(app.char.wepSkills[weapon.value.skill].attr) : "-"));
if (dmgBonus.value != "-") dmgDice.value.push(...parseDiceString(dmgBonus.value));
watch(
  () => weapon.value.damage,
  () => {
    dmgDice.value = parseDiceString(weapon.value.damage);
    if (dmgBonus.value != "-") dmgDice.value.push(...parseDiceString(dmgBonus.value));
  },
);

const dmgRes = ref(<DiceRoll>{ total: 0, results: [] });
const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(", ")}`);

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
  melee: "",
  ranged: "",
});

const showRoller = () => {
  setResultDisplay("-");
  dmgRes.value = { total: 0, results: [] };
};

const rollDmg = () => {
  dmgRes.value = rollDice(dmgDice.value);
  void notifySend(`${app.char.name} hit for ${dmgRes.value.total} damage!`, "SUCCESS");
};
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
