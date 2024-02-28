<template>
  <action-item-row>
    <template v-slot:prepend>
      <q-btn icon="mdi-account-arrow-right" flat dense @click="activate" />
    </template>

    <template v-slot:content>
      <q-expansion-item
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
    </template>

    <template v-slot:append>
      <q-btn icon="delete" flat dense @click="$emit('delete')" />
    </template>
  </action-item-row>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { IAbility } from './models';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

import ActionItemRow from './ActionItemRow.vue';

export default defineComponent({
  name: 'AbilityBlock',
  components: { ActionItemRow },
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
          message: abl.value.text,
          prompt: {
            label: 'Spend WP',
            model: `${abl.value.wp}`,
            type: 'number',
            hint: `current WP: ${app.char.wp.current}`,
            max: app.char.wp.current,
          },
          ok: true,
          cancel: true,
        })
        .onOk((wp) => {
          if (app.char.wp.current >= +wp) app.char.wp.current -= +wp;
        });

    return {
      abl,
      activate,
    };
  },
});
</script>
