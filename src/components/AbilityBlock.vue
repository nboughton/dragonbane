<template>
  <div class="q-ma-xs q-pa-xs rounded-borders outlined" flat>
    <div class="column" v-if="editAbilities">
      <div class="row q-gutter-sm items-center">
        <q-input class="col" :label="t('ui.name')" v-model="abl.name" dense />
        <q-input class="col-xs-2 col-sm-1" :label="t('ui.wp')" v-model.number="abl.wp" type="number" dense />
        <q-btn class="col-shrink bg-primary" icon="delete" flat dense @click="$emit('delete')" />
      </div>

      <q-input class="row" :label="t('ui.text')" v-model="abl.text" dense autogrow borderless />
    </div>

    <div v-else class="row q-pa-xs">
      <q-btn class="col-shrink" icon="mdi-account-arrow-right" flat dense @click="activate" />
      <div class="col-grow q-ml-xs">
        <div class="row">
          <span class="col-grow text-bold">{{ abl.name }}</span>
          <span class="col-shrink text-caption">WP {{ abl.wp }}</span>
        </div>
        <div class="row">{{ abl.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Ability } from './models';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

const abl = defineModel<Ability>({ required: true });
defineEmits(['delete']);
defineProps<{ editAbilities: boolean }>()

const $q = useQuasar();
const { t } = useI18n();
const app = useCharacterStore();
const activate = () =>
  $q
    .dialog({
      title: t('ui.useAbilityConfirm', { name: abl.value.name }),
      message: abl.value.text,
      prompt: {
        label: t('ui.spendWPLabel'),
        model: `${abl.value.wp}`,
        type: 'number',
        hint: t('ui.currentWPHint', { wp: app.char.wp.current }),
        max: app.char.wp.current,
      },
      ok: true,
      cancel: true,
    })
    .onOk((wp) => {
      if (app.char.wp.current >= +wp) app.char.wp.current -= +wp;
    });
</script>
