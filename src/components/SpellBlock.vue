<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <action-item-row>
    <template v-slot:prepend>
      <q-btn
        v-if="spell.skill && spell.rank > 0 && spell.prepared"
        icon="mdi-dice-d20"
        @click="showRoller()"
        flat
        dense
      />
      <q-btn v-else-if="spell.rank == 0" icon="mdi-account-arrow-right" @click="useMagicTrick(spell.name)" flat dense />
      <q-btn v-else-if="spell.skill" icon="mdi-book-open-variant" @click="showRoller()" flat dense />
    </template>

    <template v-slot:content>
      <q-expansion-item
        :label="`${spell.name} [${spell.rank > 0 ? 'Rank ' + spell.rank : 'Magic Trick'}${
          spell.prepared ? ', Prepared' : ''
        }]`"
        :caption="spell.text"
        header-class="text-bold q-pl-xs rounded-borders"
        :default-opened="!spell.name"
      >
        <div class="column q-mt-sm rounded-borders">
          <div class="row items-center">
            <q-checkbox
              v-if="spell.rank > 0"
              class="col-shrink q-pr-xs"
              checked-icon="mdi-alpha-p-box"
              unchecked-icon="mdi-alpha-p-box-outline"
              color="white"
              v-model="spell.prepared"
              size="lg"
              dense
            >
              <q-tooltip>Prepared</q-tooltip>
            </q-checkbox>
            <q-input class="col-grow" label="Name" v-model="spell.name" dense />
            <q-input class="col-xs-2 col-sm-1" label="Rank" v-model.number="spell.rank" type="number" dense />
          </div>

          <q-select
            class="row"
            options-selected-class="text-purple-2"
            label="Skill"
            :options="skills"
            v-model="spell.skill"
            dense
          />

          <div v-if="spell.rank > 0" class="row">
            <q-input class="col" label="Casting Time" v-model="spell.time" dense />
            <q-select
              class="col"
              options-selected-class="text-purple-2"
              label="Duration"
              v-model="spell.duration"
              :options="Object.values(EDuration)"
              dense
            />
          </div>

          <div v-if="spell.rank > 0" class="row items-end">
            <q-select
              class="col"
              options-selected-class="text-purple-2"
              label="Requirements"
              v-model="spell.req"
              multiple
              :options="Object.values(ESpellReq)"
              dense
            />
            <q-input class="col" label="Range" v-model="spell.range" dense />
          </div>

          <q-input
            class="row"
            v-if="spell.req.includes(ESpellReq.Ingredient)"
            label="Ingredient"
            v-model="spell.ingredient"
            dense
          />

          <q-input class="row" label="Text" v-model="spell.text" dense autogrow />
        </div>
      </q-expansion-item>
    </template>

    <template v-slot:append>
      <q-btn icon="delete" flat dense @click="$emit('delete')" />
    </template>
  </action-item-row>

  <q-dialog v-model="display.roller" maximized>
    <dice-roller
      :name="spell.name"
      :roll-type="ERollType.Spell"
      :skill="spell.skill"
      :target="app.skill('secSkills', spell.skill!)"
      :banes="app.banes('secSkills', spell.skill!)"
      @close="display.roller = false"
      @result="
        (r: string) => {
          setResultDisplay(r);
          notifySend(
            `${app.char.name} rolled ${spell.skill}: ${r}`,
            r.includes(ED20Result.Dragon) || r.includes(ED20Result.Success) ? 'SUCCESS' : 'ERROR'
          );
        }
      "
    >
      <template v-slot:prepend>
        <q-card-section class="column justify-center items-center q-pb-none q-mb-none">
          <div class="row full-width items-center q-px-md">
            <q-select
              class="col-grow q-mr-sm"
              options-selected-class="text-purple-2"
              label="Power Level"
              :options="powerLevels"
              v-model="pl"
              dense
              :hint="`Current WP: ${app.char.wp.current}`"
            />
            <q-btn
              class="col-shrink"
              :label="`Spend ${pl * 2} WP`"
              color="white"
              text-color="black"
              @click="app.char.wp.current -= pl * 2"
            />
          </div>

          <p class="q-mt-sm q-pa-md rounded-borders text-bold">{{ spell.text }}</p>
        </q-card-section>
      </template>

      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column">
          <div class="q-pa-md rounded-borders text-bold">
            <p class="text-bold">Choose one:</p>
            <ul class="q-pl-md">
              <li class="q-pb-sm">The damage or range of the spell is doubled.</li>
              <li class="q-pb-sm">The spell does not cost any WP.</li>
              <li>You can immediately cast another spell, but get a bane on the roll.</li>
            </ul>
          </div>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column rounded-borders bg-negative q-ma-md">
          <div class="row items-center q-mb-md justify-between">
            <q-btn
              class="col-shrink q-mr-md"
              label="Roll your mishap"
              @click="mishap = rollTable(MagicalMishap) as string"
              outline
            />
            <div class="col">{{ mishap }}</div>
          </div>
          <q-expansion-item label="Magical Mishap Table" header-class="text-h6">
            <table>
              <thead>
                <th>D20</th>
                <th>Effect</th>
              </thead>
              <tr v-for="(row, i) in MagicalMishap.rows" :key="`mm-${i}`">
                <td class="q-pa-xs">{{ row.floor }}</td>
                <td class="q-pa-xs">{{ row.text }}</td>
              </tr>
            </table>
          </q-expansion-item>
        </q-card-section>

        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />

        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center">
          <q-btn label="Roll" @click="rollDmg()" color="white" text-color="black" />
          <div v-if="dmgRes.total != 0" class="text-h4 rounded-borders q-pa-sm">
            {{ dmgRes.total }}
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import { ED20Result, EDuration, ERollType, ESpellReq, IDiceRoll, ISpell } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { rollDice, parseDiceString } from 'src/lib/util';
import { MagicalMishap, rollTable } from 'src/lib/tables';
import { notifySend } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';
import ActionItemRow from './ActionItemRow.vue';

export default defineComponent({
  name: 'SpellBlock',
  components: { DiceRoller, DiceSelect, ActionItemRow },
  props: {
    modelValue: {
      type: Object as PropType<ISpell>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const spell = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (spell.value = props.modelValue)
    );
    watch(
      () => spell.value,
      () => emit('update:modelValue', spell.value)
    );

    const app = useCharacterStore();
    const skills = computed((): string[] => Object.keys(app.char.secSkills));
    const dmgDice = ref(parseDiceString(spell.value.text));
    // For spells we only include the first dice set mentioned
    dmgDice.value.splice(1);
    const dmgRes = ref(<IDiceRoll>{ total: 0, results: [] });
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

      r.includes(ED20Result.Dragon)
        ? (display.value.dragon = true)
        : r.includes(ED20Result.Demon)
        ? (display.value.demon = true)
        : r.includes(ED20Result.Success)
        ? (display.value.success = true)
        : null;
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
              title: `Spend 1 WP to use ${name}?`,
              ok: true,
              cancel: true,
              maximized: true,
            })
            .onOk(() => app.char.wp.current--)
        : undefined;

    const checkWP = (wpReq: number): boolean => {
      let out = false;
      app.char.wp.current < wpReq
        ? $q
            .dialog({
              title: 'Out of Juice!',
              message: `You have ${app.char.wp.current}WP`,
              ok: true,
              maximized: true,
            })
            .onOk(() => (out = false))
        : (out = true);
      return out;
    };

    const pl = ref(1);
    const powerLevels = computed((): number[] => {
      let out = <number[]>[];

      const lvls = [1, 2, 3];
      lvls.forEach((n) => (n * 2 <= app.char.wp.current ? out.push(n) : undefined));

      return out;
    });

    const rollDmg = () => {
      dmgRes.value = rollDice(dmgDice.value);
      notifySend(`${app.char.name} hit for ${dmgRes.value.total} damage!`, 'SUCCESS');
    };

    return {
      spell,
      ESpellReq,
      EDuration,

      app,
      notifySend,
      pl,
      display,
      showRoller,
      setResultDisplay,
      ERollType,
      ED20Result,
      skills,
      rollDice,
      dmgDice,
      dmgRes,
      rollDmg,
      parseResult,
      MagicalMishap,
      mishap,
      rollTable,
      useMagicTrick,
      powerLevels,
    };
  },
});
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
