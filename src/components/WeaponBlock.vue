<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <div class="row items-center justify-center bg-grey-10 rounded-borders">
    <q-btn v-if="weapon.skill" class="col-1 q-pr-xs" icon="mdi-dice-d20" @click="showRoller" dense flat rounded />
    <q-expansion-item
      class="col-10"
      :label="weapon.name"
      :caption="`DMG: ${weapon.damage}, Dur.: ${weapon.durability}, Features: ${weapon.features}`"
      header-class="text-bold rounded-borders"
      :default-opened="!weapon.name"
    >
      <div class="row items-center rounded-borders q-pa-xs q-mt-xs">
        <q-input class="col-xs-8 col-sm-6 q-pr-xs" label="Weapon/Shield" v-model="weapon.name" dense />
        <q-select class="col-xs-4 col-sm-2 q-pr-xs" label="Skill" v-model="weapon.skill" :options="skills" dense />
        <q-select
          class="col-xs-3 col-sm-1 q-pr-xs"
          label="Grip"
          v-model="weapon.grip"
          :options="Object.values(EGrip)"
          dense
        />
        <q-input class="col-xs-3 col-sm-1 q-pr-xs" label="Range" v-model="weapon.range" dense />
        <q-input class="col-xs-3 col-sm-1 q-pr-xs" label="Damage" v-model="weapon.damage" dense />
        <q-input
          class="col-xs-3 col-sm-1 q-pr-xs"
          type="number"
          label="Durability"
          v-model.number="weapon.durability"
          dense
        />
      </div>
      <div class="row q-pa-xs items-center">
        <q-input class="col-grow" label="Features" v-model="weapon.features" dense />
      </div>
    </q-expansion-item>
    <q-btn class="col-1" icon="delete" @click="$emit('delete')" flat dense rounded />
  </div>

  <q-dialog v-model="display.roller" :maximized="$q.screen.lt.sm" position="right" full-height>
    <dice-roller
      :name="weapon.name"
      :roll-type="ERollType.Attack"
      :target="app.skill('wepSkills', weapon.skill!)"
      :banes="app.banes('wepSkills', weapon.skill!)"
      :skill="weapon.skill"
      @close="display.roller = false"
      @result="(r) => setResultDisplay(r)"
    >
      <template v-slot:append>
        <q-card-section v-if="display.dragon || display.success" class="row text-center text-h5 border-top">
          Roll Some Damage
        </q-card-section>

        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />

        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center q-gutter-md">
          <q-btn label="Roll Damage" @click="dmgRes = rollDice(dmgDice)" color="white" text-color="black" />
          <div v-if="dmgRes.total != 0" class="text-h4 bg-grey-10 rounded-borders q-pa-sm">
            {{ dmgRes.total }}
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>

        <q-card-section v-if="display.dragon" class="column q-gutter-sm">
          <q-expansion-item label="Melee Special Effects" class="rounded-borders bg-grey-9">
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

          <q-expansion-item label="Ranged Special Effects" class="rounded-borders bg-grey-9">
            <div class="q-pa-sm">
              <p class="text-bold">Choose one:</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">
                  Your weapon's damage is doubled, excluding the damage bonus and other bonuses. Roll twice as many dice
                  as normal and add them up. For example, a criti- cal hit with a longbow inflicts 2D12 damage.
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
          <q-expansion-item label="Melee Mishap" class="rounded-borders bg-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn
                  class="col-shrink"
                  label="Roll your mishap"
                  @click="mishap.melee = rollTable(MeleeDemon) as string"
                  outline
                />
                <div class="col">{{ mishap.melee }}</div>
              </div>

              <table>
                <thead>
                  <th>D6</th>
                  <th>Effect</th>
                </thead>
                <tr v-for="(row, i) in MeleeDemon.rows" :key="`md-${i}`">
                  <td class="q-pa-xs">{{ row.floor }}</td>
                  <td class="q-pa-xs">{{ row.text }}</td>
                </tr>
              </table>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Ranged Mishap" class="rounded-borders bg-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn
                  class="col-shrink"
                  label="Roll your mishap"
                  @click="mishap.ranged = rollTable(RangedDemon) as string"
                  outline
                />
                <div class="col">{{ mishap.ranged }}</div>
              </div>

              <table>
                <thead>
                  <th>D6</th>
                  <th>Effect</th>
                </thead>
                <tr v-for="(row, i) in RangedDemon.rows" :key="`rd-${i}`">
                  <td class="q-pa-xs">{{ row.floor }}</td>
                  <td class="q-pa-xs">{{ row.text }}</td>
                </tr>
              </table>
            </div>
          </q-expansion-item>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import { IWeapon, EGrip, ERollType, IDiceRoll, ED20Result } from './models';

import { useCharacterStore } from 'src/stores/character';

import { parseDiceString, rollDice } from 'src/lib/util';
import { MeleeDemon, RangedDemon, rollTable } from 'src/lib/tables';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';

export default defineComponent({
  name: 'WeaponBlock',
  components: { DiceRoller, DiceSelect },
  props: {
    modelValue: {
      type: Object as PropType<IWeapon>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const weapon = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (weapon.value = props.modelValue)
    );
    watch(
      () => weapon.value,
      () => emit('update:modelValue', weapon.value)
    );

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

    const dmgBonus = computed(() =>
      weapon.value.skill ? app.dmgBonus(app.char.wepSkills[weapon.value.skill].attr) : '-'
    );
    if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
    watch(
      () => weapon.value.damage,
      () => {
        dmgDice.value = parseDiceString(weapon.value.damage);
        if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
      }
    );

    const dmgRes = ref(<IDiceRoll>{ total: 0, results: [] });
    const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(', ')}`);

    const setResultDisplay = (r: string) => {
      display.value = {
        roller: true,
        select: false,
        success: false,
        dragon: false,
        demon: false,
      };

      switch (r) {
        case ED20Result.Dragon:
          display.value.dragon = true;
          break;
        case ED20Result.Demon:
          display.value.demon = true;
          break;
        case ED20Result.Success:
          display.value.success = true;
        default:
          break;
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

    return {
      app,
      weapon,
      skills,
      EGrip,

      display,
      mishap,
      MeleeDemon,
      RangedDemon,
      setResultDisplay,
      ERollType,
      dmgDice,
      dmgRes,
      rollDice,
      rollTable,
      parseResult,
      showRoller,
    };
  },
});
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
