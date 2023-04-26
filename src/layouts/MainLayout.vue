<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Dragonbane</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-btn class="full-width" label="New Character" flat @click="app.chars.push(NewCharacter())" icon-right="add" />
      <q-list>
        <q-item
          class="items-center"
          v-for="(c, i) in app.chars"
          :key="`char-${i}`"
          :active="app.conf.char == i"
          clickable
          v-ripple
        >
          <q-item-section @click="app.conf.char = i">{{ c.name }}</q-item-section>
          <q-item-section v-if="app.chars.length > 1" side>
            <q-btn icon="delete" flat dense rounded @click="removeChar(i)" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="app.exportData">
          <q-item-section avatar>
            <q-icon name="download" />
          </q-item-section>
          <q-item-section>
            Export Character Data
            <q-tooltip>Download your character data as a .json file</q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="showDataLoad = true">
          <q-item-section avatar>
            <q-icon name="upload" />
          </q-item-section>
          <q-item-section>
            Load Character Data
            <q-tooltip>Load previously exported character data</q-tooltip>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <q-toggle label="Toggle Trained Skill Buttons" v-model="app.conf.showTrainedSkills" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showDataLoad" :maximized="$q.platform.is.mobile">
    <q-card>
      <q-card-section class="text-center text-bold bg-secondary">Load Character Data</q-card-section>

      <q-card-section class="text-subtitle">
        Please bear in mind that this data will overwrite any existing versions of the same character.
      </q-card-section>

      <q-card-section>
        <q-file v-model="fileToLoad" standout label="Select File" accept=".json" />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="load" color="primary" @click="loadData" flat />
        <q-btn label="close" color="warning" @click="showDataLoad = false" flat />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { IDBStore } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewCharacter } from 'src/lib/defaults';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    const app = useCharacterStore();
    const $q = useQuasar();

    const showDataLoad = ref(false);
    const fileToLoad = ref(null);
    const loadData = () => {
      const f: File = fileToLoad.value as unknown as File;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = JSON.parse(ev.target?.result as string) as IDBStore;
        app.loadData(data);
        showDataLoad.value = false;
      };
      reader.readAsText(f);
    };

    const removeChar = (index: number) =>
      $q
        .dialog({
          message: `Delete ${app.chars[index].name}?`,
          cancel: true,
        })
        .onOk(() => {
          app.conf.char = 0;
          app.chars.splice(index, 1);
        });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      app,
      NewCharacter,
      removeChar,

      showDataLoad,
      fileToLoad,
      loadData,
    };
  },
});
</script>
