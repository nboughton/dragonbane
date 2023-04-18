<template>
  <div class="row justify-between">
    <money-field label="GOLD" v-model="char.money.gold" />
    <money-field label="SILVER" v-model="char.money.silver" />
    <money-field label="COPPER" v-model="char.money.copper" />
  </div>

  <div class="row text-h6 text-bold q-mt-md items-center">
    <div class="col-shrink">Inventory ({{ encumberance }} / {{ encumberMax }})</div>
    <q-checkbox class="col-shrink" v-model="char.backpack" label="Backpack" />
    <q-btn class="col-shrink" icon="add_circle" flat dense rounded @click="addInvItem">
      <q-tooltip>Add item</q-tooltip>
    </q-btn>
  </div>
  <item-row
    v-for="(it, i) in char.inventory"
    :key="`inv-${i}`"
    v-model="char.inventory[i]"
    @delete="removeInvItem(i)"
  />

  <q-input class="row q-mt-sm" label="Tiny Items" v-model="char.tinyItems" dense autogrow />
  <q-input class="row q-mt-sm" label="Memento" v-model="char.memento" dense autogrow />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';

import { ICharacter } from './models';

import { useQuasar } from 'quasar';

import MoneyField from './MoneyField.vue';
import ItemRow from './ItemRow.vue';

export default defineComponent({
  name: 'GearTab',
  components: { MoneyField, ItemRow },
  props: {
    modelValue: {
      type: Object as PropType<ICharacter>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const char = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (char.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => char.value,
      () => emit('update:modelValue', char.value),
      { deep: true }
    );

    const $q = useQuasar();

    const addInvItem = () => char.value.inventory.push({ text: '', wt: 1 });
    const removeInvItem = (index: number) =>
      $q
        .dialog({
          message: 'Delete this item?',
          cancel: true,
        })
        .onOk(() => char.value.inventory.splice(index, 1));
    const encumberance = computed((): number => {
      let total = 0;
      char.value.inventory.forEach((item) => {
        total += item.wt;
      });
      return total;
    });
    const encumberMax = computed(
      (): number => Math.ceil(char.value.attributes.STR.score / 2) + (char.value.backpack ? 2 : 0)
    );

    return {
      char,

      addInvItem,
      removeInvItem,
      encumberance,
      encumberMax,
    };
  },
});
</script>
