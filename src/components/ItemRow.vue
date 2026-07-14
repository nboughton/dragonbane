<template>
  <div class="row">
    <q-input class="col-grow" :label="t('ui.item')" v-model="item.text" dense />
    <q-input class="col-xs-2 col-sm-1" :label="t('ui.weightShort')" v-model.number="item.wt" type="number" dense />
    <q-btn class="col-shrink" icon="delete" dense flat rounded @click="$emit('delete')" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { InvItem } from './models';

const item = defineModel<InvItem>({ required: true });
defineEmits(['delete']);

const { t } = useI18n();
</script>
