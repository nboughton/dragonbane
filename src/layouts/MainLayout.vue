<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Dragonbane</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item header clickable v-ripple class="text-bold" @click="st.chars.push(NewCharacter())">
          ADD CHARACTER +
        </q-item>

        <q-item v-for="(c, i) in st.chars" :key="`char-${i}`" clickable v-ripple>
          <q-item-section @click="st.conf.char = i">{{ c.name }}</q-item-section>
          <q-item-section v-if="st.chars.length > 1" side>
            <q-btn icon="delete" flat dense rounded @click="removeChar(i)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewCharacter } from 'src/lib/defaults';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    const st = useCharacterStore();
    const $q = useQuasar();

    const removeChar = (index: number) =>
      $q
        .dialog({
          message: `Delete ${st.chars[index].name}?`,
          cancel: true,
        })
        .onOk(() => {
          st.conf.char = 0;
          st.chars.splice(index, 1);
        });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      st,
      NewCharacter,
      removeChar,
    };
  },
});
</script>
