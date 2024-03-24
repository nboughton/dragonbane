<template>
  <div class="row q-px-sm q-pt-sm">
    <money-field class="col items-center" label="GOLD" v-model="app.char.money.gold" />
    <money-field class="col items-center" label="SILVER" v-model="app.char.money.silver" />
    <money-field class="col items-center" label="COPPER" v-model="app.char.money.copper" />
  </div>

  <div class="row text-h6 text-bold q-mx-sm q-mt-sm items-center">
    <div class="col">
      <div class="row items-center">
        <div>Inventory ({{ encumberance }} / {{ encumberMax }})</div>
        <q-btn icon="add_circle" flat dense rounded @click="addInvItem">
          <q-tooltip>Add item</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-checkbox class="col-shrink self-end" v-model="app.char.backpack" label="Backpack" />
  </div>

  <item-row
    v-for="(it, i) in app.char.inventory"
    :key="`inv-${i}`"
    v-model="app.char.inventory[i]"
    @delete="removeInvItem(i)"
    class="q-mx-sm"
  />

  <q-input class="row q-mt-sm q-mx-sm" label="Tiny Items" v-model="app.char.tinyItems" dense autogrow />
  <q-input class="row q-ma-sm" label="Memento" v-model="app.char.memento" dense autogrow />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useCharacterStore } from 'src/stores/character';
import { useQuasar } from 'quasar';

import MoneyField from './MoneyField.vue';
import ItemRow from './ItemRow.vue';

export default defineComponent({
  name: 'GearTab',
  components: { MoneyField, ItemRow },
  setup() {
    const app = useCharacterStore();

    const $q = useQuasar();

    const addInvItem = () => app.char.inventory.push({ text: '', wt: 1 });
    const removeInvItem = (index: number) =>
      $q
        .dialog({
          message: 'Delete this item?',
          cancel: true,
          maximized: true,
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
    const encumberMax = computed(
      (): number => Math.ceil(app.char.attributes.STR.score / 2) + (app.char.backpack ? 2 : 0)
    );

    return {
      app,

      addInvItem,
      removeInvItem,
      encumberance,
      encumberMax,
    };
  },
});
</script>
