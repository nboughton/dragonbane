<template>
  <q-card>
    <q-card-section class="row text-center text-h5">
      <div class="col-grow">{{ name }} ({{ target }})</div>
      <q-btn class="col-shrink" icon="close" flat rounded @click="$emit('close')" dense />
    </q-card-section>

    <slot name="prepend"></slot>

    <q-card-section class="row justify-evenly items-center">
      <div class="column q-pa-sm rounded-borders">
        <div class="text-h6 text-center">Boons</div>
        <inc-dec v-model.number="b.boons" />
      </div>

      <div class="column q-pa-sm rounded-borders">
        <div class="text-h6 text-center">Banes</div>
        <inc-dec v-model.number="b.banes" />
      </div>
    </q-card-section>

    <q-card-section class="column justify-evenly items-center">
      <div class="row full-width items-center justify-center q-mb-md">
        <q-btn class="col-shrink" :label="rollBtnLabel" @click="rollIt" color="white" text-color="black" />
      </div>
      <div class="row full-width items-center justify-center q-mb-md">
        <div class="col text-center text-h5 rounded-borders q-pa-md">{{ d20Result.join(', ') }}</div>
      </div>
      <div v-if="rolled" class="text-center text-h5">
        {{ resultText }}
      </div>
    </q-card-section>

    <slot name="append"></slot>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { ERollType, ED20Result } from './models';

import { useCharacterStore } from 'src/stores/character';

import { roll, sleep, deepCopy } from 'src/lib/util';

import IncDec from './IncDec.vue';

export default defineComponent({
  name: 'DiceRoller',
  components: { IncDec },
  props: {
    name: {
      type: String,
      required: true,
    },
    skill: {
      type: String,
    },
    target: {
      type: Number,
      required: true,
    },
    boons: {
      type: Number,
      default: 0,
    },
    banes: {
      type: Number,
      default: 0,
    },
    rollType: {
      type: String, // ERollType
      required: true,
    },
  },
  emits: ['close', 'result'],
  setup(props, { emit }) {
    const app = useCharacterStore();
    const b = ref({ boons: props.boons, banes: props.banes });
    const rolled = ref(false);

    const mods = computed((): number => b.value.boons - b.value.banes);
    const d20Result = ref(Array(Math.abs(mods.value) + 1).fill(0));
    watch(
      () => mods.value,
      () => {
        rolled.value = false;
        d20Result.value = Array(Math.abs(mods.value) + 1).fill(0);
      }
    );

    const rollBtnLabel = computed((): string =>
      mods.value == 0 ? 'Roll' : `Roll with ${Math.abs(mods.value)} ${mods.value < 0 ? 'Bane(s)' : 'Boon(s)'}`
    );

    const rollIt = () => {
      rolled.value = false;
      void (async () => {
        for (let i = 0; i < 20; i++) {
          d20Result.value.forEach((v, i) => (d20Result.value[i] = roll(20)));
          await sleep(75 + i * 10);
        }
        rolled.value = true;

        // Apply special effects
        if (selectResult() == 1 || selectResult() == 20) {
          switch (props.rollType) {
            case ERollType.Primary:
              app.char.priSkills[props.name].checked = true;
              break;
            case ERollType.Secondary:
              app.char.secSkills[props.name].checked = true;
              break;
            case ERollType.Weapon:
              app.char.wepSkills[props.name].checked = true;
              break;
            case ERollType.Attack:
              if (props.skill) app.char.wepSkills[props.skill].checked = true;
              break;
            case ERollType.Attr:
              //if (selectResult() == 20) app.char.attributes[props.name as EAttr].condition.check = true;
              break;
            case ERollType.Spell:
              if (props.skill) app.char.secSkills[props.skill].checked = true;
              break;
            default:
              break;
          }
        }
        emit('result', resultText.value);
      })();
    };

    const selectResult = (): number => {
      let cmp = deepCopy(d20Result.value);
      const sortFn = (a: number, b: number): number => {
        if (a < b) return -1;
        else if (b < a) return 1;
        else return 0;
      };

      mods.value < 0 ? cmp.sort(sortFn).reverse() : cmp.sort(sortFn);
      return cmp[0];
    };

    const resultText = computed((): string => {
      const r = selectResult();
      if (r === 1) return ED20Result.Dragon;
      if (r === 20) return ED20Result.Demon;
      if (r <= props.target) return ED20Result.Success;
      if (r > props.target) return ED20Result.Fail;

      return 'Something has gone wrong :(';
    });

    return {
      b,
      d20Result,
      rollIt,
      mods,
      rolled,
      selectResult,
      resultText,
      rollBtnLabel,
    };
  },
});
</script>
