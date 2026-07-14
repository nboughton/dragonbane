<template>
  <div class="column">
    <div class="row">
      <q-input class="col-grow" :label="label" v-model="amr.name" dense />
      <q-input class="col-xs-2 col-sm-1" :label="t('ui.rating')" v-model.number="amr.rating" type="number" dense />
    </div>

    <div class="row items-center justify-center q-mt-sm">{{ t('ui.baneOn') }}</div>

    <div class="row items-center justify-center">
      <q-checkbox
        class="col-shrink"
        v-for="(a, i) in amr.bane"
        :key="`amr-${i}`"
        :label="t('skills.' + i, i)"
        v-model="amr.bane[i]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { Armour } from './models';

const amr = defineModel<Armour>({ required: true });
defineProps<{ label: string }>();

const { t } = useI18n();
</script>
