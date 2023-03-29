<template>
  <div class="row items-center justify-between rounded-borders q-ma-xs q-pa-xs" :style="{ backgroundColor: baned }">
    <q-checkbox class="col-shrink" v-model="skill.checked" dense>
      <q-tooltip>Advance</q-tooltip>
    </q-checkbox>
    <q-input class="col-xs-2 col-sm-2" type="number" v-model.number="val" dense />
    <q-checkbox class="col-shrink" v-model="skill.trained" dense>
      <q-tooltip>Trained</q-tooltip>
    </q-checkbox>
    <div class="col">{{ label }} ({{ skill.attr }})</div>
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
      return skill.value.trained ? b * 2 : b;
    });

    const val = computed({
      get(): number {
        return skill.value.advances + base.value;
      },
      set(v: number) {
        if (v <= 18) skill.value.advances = v - base.value;
      },
    });

    const baned = computed((): string =>
      c.chars[c.conf.char].attributes[skill.value.attr as EAttr].condition.check ? '#ff7676' : 'lightgrey'
    );

    return {
      skill,
      val,
      baned,
    };
  },
});
</script>
