<template>
  <div :class="`row items-center justify-between q-ma-none q-px-xs ${baned ? 'bg-negative' : ''}`">
    <q-checkbox
      v-if="editSkills"
      class="q-ml-xs"
      v-model="skill.trained"
      checked-icon="mdi-chevron-up-circle"
      unchecked-icon="mdi-chevron-up-circle-outline"
      :color="app.conf.darkMode === true ? 'white' : 'black'"
      size="xs"
      dense
    >
      <q-tooltip>Train Skill</q-tooltip>
    </q-checkbox>

    <q-input
      v-if="editSkills"
      class="col-1"
      input-class="text-center text-bold"
      type="number"
      v-model.number="val"
      dense
      borderless
    />

    <q-checkbox
      v-if="!editSkills"
      class="q-ml-xs"
      v-model="skill.checked"
      checked-icon="mdi-rhombus"
      unchecked-icon="mdi-rhombus-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="xs"
      dense
    >
      <q-tooltip>Advance Skill</q-tooltip>
    </q-checkbox>

    <div v-if="!editSkills" class="text-bold">{{ val }}</div>

    <div class="col-grow q-pl-sm">{{ label }}</div>

    <div class="col-shrink" v-if="baned">
      <q-icon v-for="(b, i) in banes" :key="i" name="mdi-skull" size="sm" />
    </div>
    <div class="col-1 text-center">{{ skill.attr }}</div>

    <div class="col-shrink">
      <q-btn icon="mdi-dice-d20" @click="showRoller = true" flat round dense />
    </div>

    <q-btn class="col-shrink" icon="delete" v-if="showDelete" @click="$emit('delete', label)" flat dense rounded />
  </div>
  <q-dialog v-model="showRoller" maximized>
    <dice-roller
      :name="label"
      :target="val"
      :banes="banes.length"
      :roll-type="skillType"
      @close="showRoller = false"
      @result="
        (r) =>
          send(
            `${app.char.name} rolled ${label}: ${r}`,
            r == ED20Result.Dragon || r == ED20Result.Success ? 'SUCCESS' : 'ERROR'
          )
      "
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';

import { ED20Result, EAttr, ERollType, ISkill } from './models';

import { useCharacterStore } from 'src/stores/character';

import { BaseChance } from 'src/lib/defaults';
import { send } from 'src/lib/notify';

import DiceRoller from './DiceRoller.vue';

export default defineComponent({
  name: 'CharSkill',
  components: { DiceRoller },
  props: {
    modelValue: {
      type: Object as PropType<ISkill>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    showDelete: {
      type: Boolean,
    },
    skillType: {
      type: String,
      required: true,
    },
    editSkills: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const skill = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (skill.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => skill.value,
      () => emit('update:modelValue', skill.value),
      { deep: true }
    );

    const app = useCharacterStore();
    const base = computed((): number => {
      const b = BaseChance(app.char.attributes[skill.value.attr as EAttr].score);
      return skill.value.trained ? b * 2 : props.skillType == ERollType.Secondary ? 0 : b;
    });

    const val = computed({
      get(): number {
        return skill.value.advances + base.value;
      },
      set(v: number) {
        if (v <= 18) return (skill.value.advances = v - base.value);
      },
    });

    const baned = computed((): boolean => {
      let b = false;
      if (app.char.attributes[skill.value.attr as EAttr].condition.check) b = true;

      Object.keys(app.char.armour.bane).forEach((k) => {
        if (app.char.armour.bane[k] && k == props.label) b = true;
      });

      Object.keys(app.char.helmet.bane).forEach((k) => {
        const checked = app.char.helmet.bane[k];
        if (
          (checked && k == props.label) ||
          (checked &&
            k == 'Ranged Attacks' &&
            (props.label == 'Bows' || props.label == 'Crossbows' || props.label == 'Slings'))
        )
          b = true;
      });

      return b;
    });

    const banes = computed((): number[] => {
      let b = [];
      if (app.char.attributes[skill.value.attr as EAttr].condition.check) b.push(0);

      Object.keys(app.char.armour.bane).forEach((k) => {
        if (app.char.armour.bane[k] && k == props.label) b.push(0);
      });

      Object.keys(app.char.helmet.bane).forEach((k) => {
        const checked = app.char.helmet.bane[k];
        if (
          (checked && k == props.label) ||
          (checked &&
            k == 'Ranged Attacks' &&
            (props.label == 'Bows' || props.label == 'Crossbows' || props.label == 'Slings'))
        )
          b.push(0);
      });

      return b;
    });

    const showRoller = ref(false);

    return {
      app,
      skill,
      val,
      baned,
      banes,
      showRoller,
      ERollType,
      ED20Result,
      send,
    };
  },
});
</script>
