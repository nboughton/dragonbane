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

    <q-card-section class="row justify-center items-center">
      <div class="col dice-tray">
        <dice-tray :dice="d20Result.map((d) => ({ name: 'd20', value: d }))" />
      </div>
    </q-card-section>

    <q-card-section class="column justify-evenly items-center">
      <div class="row full-width items-center justify-center q-mb-md">
        <q-btn class="col-shrink" :label="rollBtnLabel" @click="rollIt" color="white" text-color="black" />
      </div>
      <div v-if="rolled" class="text-center text-h5">
        {{ resultText }}
      </div>
    </q-card-section>

    <slot name="append"></slot>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import type { PriSkill, WepSkill } from "./models";
import { D20Results, RollTypes } from "./models";

import { useCharacterStore } from "../stores/character";

import { deepCopy, roll, sleep } from "../lib/util";

import IncDec from "./IncDec.vue";
import DiceTray from "./DiceTray.vue";

const props = defineProps({
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
    type: String, // RollTypes
    required: true,
  },
});

const emit = defineEmits(["close", "result"]);

const app = useCharacterStore();
const b = ref({ boons: props.boons, banes: props.banes });
const rolled = ref(false);

const mods = computed((): number => b.value.boons - b.value.banes);
const d20Result = ref<number[]>(Array(Math.abs(mods.value) + 1).fill(0));
watch(
  () => mods.value,
  () => {
    rolled.value = false;
    d20Result.value = Array(Math.abs(mods.value) + 1).fill(0);
  },
);

const rollBtnLabel = computed((): string =>
  mods.value == 0 ? "Roll" : `Roll with ${Math.abs(mods.value)} ${mods.value < 0 ? "Bane(s)" : "Boon(s)"}`
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
        case RollTypes.Primary:
          app.char.priSkills[props.name as PriSkill].checked = true;
          break;
        case RollTypes.Secondary:
          app.char.secSkills[props.name]!.checked = true;
          break;
        case RollTypes.Weapon:
          app.char.wepSkills[props.name as WepSkill].checked = true;
          break;
        case RollTypes.Attack:
          if (props.skill) app.char.wepSkills[props.skill as WepSkill].checked = true;
          break;
        case RollTypes.Attr:
          //if (selectResult() == 20) app.char.attributes[props.name as Attr].condition.check = true;
          break;
        case RollTypes.Spell:
          if (props.skill) app.char.secSkills[props.skill]!.checked = true;
          break;
        default:
          break;
      }
    }
    emit("result", `${resultText.value}: (${selectResult()} vs ${props.target})`);
  })();
};

const selectResult = (): number => {
  const cmp = deepCopy(d20Result.value);
  const sortFn = (a: number, b: number): number => {
    if (a < b) return -1;
    else if (b < a) return 1;
    else return 0;
  };

  if (mods.value < 0) {
    cmp.sort(sortFn).reverse();
  } else {
    cmp.sort(sortFn);
  }
  return cmp[0]!;
};

const resultText = computed((): string => {
  const r = selectResult();
  if (r === 1) return D20Results.Dragon;
  if (r === 20) return D20Results.Demon;
  if (r <= props.target) return D20Results.Success;
  if (r > props.target) return D20Results.Fail;

  return "Something has gone wrong :(";
});
</script>
