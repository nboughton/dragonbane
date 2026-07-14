<template>
  <div class="row q-px-sm q-pt-sm">
    <money-field class="col items-center" :label="t('ui.gold')" v-model="app.char.money.gold" />
    <money-field class="col items-center" :label="t('ui.silver')" v-model="app.char.money.silver" />
    <money-field class="col items-center" :label="t('ui.copper')" v-model="app.char.money.copper" />
  </div>

  <div class="row text-h6 text-bold q-mx-sm q-mt-sm items-center">
    <div class="col">
      <div class="row items-center">
        <div>{{ t('ui.inventory') }} ({{ encumberance }} / {{ encumberMax }})</div>
        <q-btn icon="add_circle" flat dense rounded @click="addInvItem">
          <q-tooltip>{{ t('ui.addItem') }}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-checkbox class="col-shrink self-end" v-model="app.char.backpack" :label="t('ui.backpack')" />
  </div>

  <item-row
    v-for="(it, i) in app.char.inventory"
    :key="`inv-${i}`"
    v-model="app.char.inventory[i]!"
    @delete="removeInvItem(i)"
    class="q-mx-sm"
  />

  <q-input class="row q-mt-sm q-mx-sm" :label="t('ui.tinyItems')" v-model="app.char.tinyItems" dense autogrow />
  <q-input class="row q-ma-sm" :label="t('ui.memento')" v-model="app.char.memento" dense autogrow />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

import MoneyField from './MoneyField.vue';
import ItemRow from './ItemRow.vue';

const app = useCharacterStore();
const { t } = useI18n();

const $q = useQuasar();

const addInvItem = () => app.char.inventory.push({ text: '', wt: 1 });
const removeInvItem = (index: number) =>
  $q
    .dialog({
      message: t('ui.deleteItemConfirm'),
      cancel: true,
    })
    .onOk(() => app.char.inventory.splice(index, 1));
const encumberance = computed((): number => {
  let total = 0;
  app.char.inventory.forEach((item) => {
    total += item.wt;
  });

  total += Math.floor((app.char.money.copper + app.char.money.silver + app.char.money.gold) / 100);
  return total;
});
const encumberMax = computed((): number => Math.ceil(app.char.attributes.STR.score / 2) + (app.char.backpack ? 2 : 0));
</script>
