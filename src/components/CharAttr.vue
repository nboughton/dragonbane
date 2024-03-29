<template>
  <div
    :class="`column items-center justify-center q-ma-sm q-pa-sm ${
      attr.condition.check ? 'bg-negative' : 'bg-blue-grey-10'
    } rounded-borders`"
  >
    <q-btn icon="mdi-dice-d20" @click="showRoller = true" flat rounded dense size="md" />
    <q-btn :label="`${label} ${attr.score}`" class="col-shrink text-bold" size="lg" @click="editAttr" flat rounded />
    <q-checkbox
      :label="attr.condition.name"
      v-model="attr.condition.check"
      size="sm"
      left-label
      dense
      unchecked-icon="mdi-emoticon-happy"
      checked-icon="mdi-skull"
      color="white"
    />
  </div>
  <q-dialog v-model="showRoller" :maximized="$q.screen.lt.sm" position="right" full-height>
    <dice-roller
      :name="label"
      :banes="attr.condition.check ? 1 : 0"
      :target="attr.score"
      :roll-type="ERollType.Attr"
      @close="showRoller = false"
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { ERollType, IAttribute } from './models';

import { useQuasar } from 'quasar';

import DiceRoller from './DiceRoller.vue';

export default defineComponent({
  name: 'CharStat',
  components: { DiceRoller },
  props: {
    modelValue: {
      type: Object as PropType<IAttribute>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const attr = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (attr.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => attr.value,
      () => emit('update:modelValue', attr.value),
      { deep: true }
    );

    const $q = useQuasar();
    const editAttr = () =>
      $q
        .dialog({
          title: `Edit ${props.label}`,
          cancel: true,
          prompt: {
            type: 'number',
            model: `${attr.value.score}`,
            min: 3,
            max: 18,
          },
        })
        .onOk((n) => (attr.value.score = n));

    const showRoller = ref(false);

    return {
      attr,
      editAttr,
      showRoller,
      ERollType,
    };
  },
});
</script>
