<template>
  <div :class="`row items-center justify-between q-ma-none q-px-xs ${baned ? 'bg-negative' : ''}`">
    <q-checkbox
      v-if="editSkills"
      class="q-ml-xs q-mb-xs"
      v-model="skill.trained"
      checked-icon="mdi-chevron-up-circle"
      unchecked-icon="mdi-chevron-up-circle-outline"
      :color="app.conf.darkMode === true ? 'white' : 'black'"
      size="xs"
      dense
    >
      <q-tooltip>{{ t('ui.trained') }}</q-tooltip>
    </q-checkbox>

    <q-input
      v-if="editSkills"
      class="col-2"
      input-class="text-center text-bold"
      type="number"
      v-model.number="localVal"
      @update:model-value="onInputVal"
      dense
      borderless
    />

    <q-checkbox
      v-if="!editSkills"
      class="q-ml-xs q-mb-xs"
      v-model="skill.checked"
      checked-icon="mdi-rhombus"
      unchecked-icon="mdi-rhombus-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="xs"
      dense
    >
      <q-tooltip>{{ t('ui.advance') }}</q-tooltip>
    </q-checkbox>

    <div v-if="!editSkills" class="text-bold">{{ val }}</div>

    <div class="col-grow q-pl-sm">{{ t('skills.' + label, label) }}</div>

    <div class="col-shrink" v-if="baned">
      <q-icon v-for="(b, i) in banes" :key="i" name="mdi-skull" size="sm" />
    </div>
    <div class="col-1 text-center">{{ t('attributes.' + skill.attr) }}</div>

    <div class="col-shrink">
      <q-btn icon="mdi-dice-d20" @click="showRoller = true" flat round dense />
    </div>

    <q-btn class="col-shrink" icon="delete" v-if="showDelete" @click="$emit('delete', label)" flat dense rounded />
  </div>
  <q-dialog v-model="showRoller" maximized>
    <dice-roller
      :name="t('skills.' + label, label)"
      :target="val"
      :banes="banes.length"
      :roll-type="skillType"
      @close="showRoller = false"
      @result="
        (r: string) =>
          notifySend(
            t('ui.notifyRoll', { name: app.char.name, label: t('skills.' + label, label), result: r }),
            r.includes(D20Results.Dragon) || r.includes(D20Results.Success) ? 'SUCCESS' : 'ERROR',
          )
      "
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Skill } from './models';
import { D20Results, RollTypes, WepSkills } from './models';

import { useCharacterStore } from 'src/stores/character';

import { BaseChance } from 'src/lib/defaults';
import { notifySend } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';

const skill = defineModel<Skill>({ required: true });
const props = defineProps<{
  label: string;
  showDelete?: boolean;
  skillType: string;
  editSkills: boolean;
}>();
defineEmits(['delete']);

const app = useCharacterStore();
const { t } = useI18n();
const base = computed((): number => {
  const b = BaseChance(app.char.attributes[skill.value.attr].score);
  return skill.value.trained ? b * 2 : props.skillType == RollTypes.Secondary ? 0 : b;
});

const val = computed({
  get(): number {
    return skill.value.advances + base.value;
  },
  set(v: number) {
    if (v === null || isNaN(v)) {
      skill.value.advances = 0;
      return;
    }
    if (v <= 18) skill.value.advances = v - base.value;
  },
});

const localVal = ref(val.value);
watch(() => val.value, (newVal) => {
  localVal.value = newVal;
});
const onInputVal = (newVal: number | string | null) => {
  const v = Number(newVal);
  if (isNaN(v) || newVal === null || newVal === '') {
    skill.value.advances = 0;
    return;
  }
  if (v <= 18) {
    skill.value.advances = v - base.value;
  }
};

const baned = computed((): boolean => {
  let b = false;
  if (app.char.attributes[skill.value.attr].condition.check) b = true;

  Object.keys(app.char.armour.bane).forEach((k) => {
    if (app.char.armour.bane[k] && k == props.label) b = true;
  });

  Object.keys(app.char.helmet.bane).forEach((k) => {
    const checked = app.char.helmet.bane[k];
    if (
      (checked && k == props.label) ||
      (checked &&
        k == 'Ranged Attacks' &&
        (props.label == WepSkills.Bows || props.label == WepSkills.Crossbows || props.label == WepSkills.Slings))
    )
      b = true;
  });

  return b;
});

const banes = computed((): number[] => {
  const b = [];
  if (app.char.attributes[skill.value.attr].condition.check) b.push(0);

  Object.keys(app.char.armour.bane).forEach((k) => {
    if (app.char.armour.bane[k] && k == props.label) b.push(0);
  });

  Object.keys(app.char.helmet.bane).forEach((k) => {
    const checked = app.char.helmet.bane[k];
    if (
      (checked && k == props.label) ||
      (checked &&
        k == 'Ranged Attacks' &&
        (props.label == WepSkills.Bows || props.label == WepSkills.Crossbows || props.label == WepSkills.Slings))
    )
      b.push(0);
  });

  return b;
});

const showRoller = ref(false);
</script>
