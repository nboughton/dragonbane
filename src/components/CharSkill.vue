<template>
  <div
    class="row items-center justify-between rounded-borders q-ma-xs q-pa-xs"
    :style="{ backgroundColor: baned.bgk, color: baned.fg }"
  >
    <q-checkbox
      class="col-shrink"
      v-model="skill.checked"
      checked-icon="mdi-alpha-a-box"
      unchecked-icon="mdi-alpha-a-box-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="lg"
      dense
    >
      <q-tooltip>Advance</q-tooltip>
    </q-checkbox>

    <q-input
      class="col-xs-2 col-sm-2"
      input-class="text-center text-bold"
      type="number"
      v-model.number="val"
      dense
      borderless
    />

    <q-checkbox
      v-if="app.conf.showTrainedSkills == true || app.conf.showTrainedSkills == undefined"
      class="col-shrink"
      v-model="skill.trained"
      checked-icon="mdi-alpha-t-box"
      unchecked-icon="mdi-alpha-t-box-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="lg"
      dense
    >
      <q-tooltip>Trained</q-tooltip>
    </q-checkbox>

    <div class="col">{{ label }} ({{ skill.attr }})</div>

    <div class="col-shrink q-mr-sm" v-if="baned">
      <q-icon v-for="(b, i) in banes" :key="i" name="mdi-skull" size="sm" />
    </div>

    <q-btn class="col-shrink" icon="delete" v-if="showDelete" @click="$emit('delete', label)" flat dense rounded />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';

import { EAttr, IColours, ISkill } from './models';

import { useCharacterStore } from 'src/stores/character';

import { BaseChance, colours } from 'src/lib/defaults';

export default defineComponent({
  name: 'CharSkill',
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
    secondary: {
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
      return skill.value.trained ? b * 2 : props.secondary ? 0 : b;
    });

    const val = computed({
      get(): number {
        return skill.value.advances + base.value;
      },
      set(v: number) {
        if (v <= 18) return (skill.value.advances = v - base.value);
      },
    });

    const baned = computed((): IColours => {
      let colour = colours(app.conf.darkMode as boolean);
      const bgk = (): string => (app.conf.darkMode == true ? '#783232' : '#ff7878');
      if (app.char.attributes[skill.value.attr as EAttr].condition.check) colour.bgk = bgk();

      Object.keys(app.char.armour.bane).forEach((k) => {
        if (app.char.armour.bane[k] && k == props.label) colour.bgk = bgk();
      });

      Object.keys(app.char.helmet.bane).forEach((k) => {
        const checked = app.char.helmet.bane[k];
        if (
          (checked && k == props.label) ||
          (checked &&
            k == 'Ranged Attacks' &&
            (props.label == 'Bows' || props.label == 'Crossbows' || props.label == 'Slings'))
        )
          colour.bgk = bgk();
      });

      return colour;
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

    return {
      app,
      skill,
      val,
      baned,
      banes,
    };
  },
});
</script>
