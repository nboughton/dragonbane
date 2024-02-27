<template>
  <div class="row items-center justify-center bg-grey-10 rounded-borders">
    <q-btn class="col-1" icon="mdi-account-arrow-right" flat dense rounded @click="activate" />
    <q-expansion-item
      class="col-10"
      :label="`${abl.name} [WP: ${abl.wp}]`"
      :caption="abl.text"
      :caption-lines="0.5"
      header-class="text-bold q-pl-xs rounded-borders"
      :default-opened="!abl.name"
    >
      <div class="column q-my-sm">
        <div class="row">
          <q-input class="col" label="Name" v-model="abl.name" dense />
          <q-input class="col-xs-2 col-sm-1" label="WP" v-model.number="abl.wp" type="number" dense />
        </div>

        <q-input class="row" label="Text" v-model="abl.text" dense autogrow />
      </div>
    </q-expansion-item>
    <q-btn class="col-1" icon="delete" flat dense rounded @click="$emit('delete')" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { IAbility } from './models';
import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'AbilityBlock',
  props: {
    modelValue: {
      type: Object as PropType<IAbility>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete'],
  setup(props, { emit }) {
    const abl = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (abl.value = props.modelValue)
    );
    watch(
      () => abl.value,
      () => emit('update:modelValue', abl.value)
    );

    const $q = useQuasar();
    const app = useCharacterStore();
    const activate = () =>
      $q
        .dialog({
          title: `Use ${abl.value.name}?`,
          ok: true,
          cancel: true,
        })
        .onOk(() => {
          if (app.char.wp.current >= abl.value.wp) app.char.wp.current -= abl.value.wp;
        });

    return {
      abl,
      activate,
    };
  },
});
</script>
