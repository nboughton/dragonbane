<template>
  <div class="row items-center justify-between rounded-borders q-ma-xs q-pa-xs" :style="{ backgroundColor: baned }">
    <q-checkbox
      class="col-shrink"
      v-model="skill.checked"
      checked-icon="mdi-alpha-a-box"
      unchecked-icon="mdi-alpha-a-box-outline"
      color="white"
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
      class="col-shrink"
      v-model="skill.trained"
      checked-icon="mdi-alpha-t-box"
      unchecked-icon="mdi-alpha-t-box-outline"
      color="white"
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

import { EAttr, ISkill } from './models';

import { useCharacterStore } from 'src/stores/character';

import { BaseChance } from 'src/lib/defaults';

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

    const c = useCharacterStore();
    const base = computed((): number => {
      const b = BaseChance(c.chars[c.conf.char].attributes[skill.value.attr as EAttr].score);
      return skill.value.trained ? b * 2 : props.secondary ? 0 : b;
    });

    const val = computed({
      get(): number {
        return skill.value.advances + base.value;
      },
      set(v: number) {
        if (v <= 18) skill.value.advances = v - base.value;
      },
    });

    const baned = computed((): string => {
      let colour = '#232323';
      if (c.chars[c.conf.char].attributes[skill.value.attr as EAttr].condition.check) colour = '#783232';
      Object.keys(c.chars[c.conf.char].armour.bane).forEach((k) => {
        if (c.chars[c.conf.char].armour.bane[k] && k == props.label) colour = '#783232';
      });
      Object.keys(c.chars[c.conf.char].helmet.bane).forEach((k) => {
        if (c.chars[c.conf.char].helmet.bane[k] && k == props.label) colour = '#783232';
      });
      return colour;
    });
    const banes = computed((): number[] => {
      let b = [];
      if (c.chars[c.conf.char].attributes[skill.value.attr as EAttr].condition.check) b.push(0);
      Object.keys(c.chars[c.conf.char].armour.bane).forEach((k) => {
        if (c.chars[c.conf.char].armour.bane[k] && k == props.label) b.push(0);
      });
      Object.keys(c.chars[c.conf.char].helmet.bane).forEach((k) => {
        if (c.chars[c.conf.char].helmet.bane[k] && k == props.label) b.push(0);
      });
      return b;
    });

    return {
      skill,
      val,
      baned,
      banes,
    };
  },
});
</script>
