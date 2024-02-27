<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Dragonbane</q-toolbar-title>
        <q-btn-dropdown icon="mdi-bed">
          <q-list>
            <q-item clickable v-ripple @click="rest.round()">
              <q-item-section>
                <q-item-label>ROUND</q-item-label>
                <q-item-label caption class="text-center">D6 WP</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.stretch()">
              <q-item-section>
                <q-item-label>STRETCH</q-item-label>
                <q-item-label caption class="text-center">D6 HP, D6 WP. Clear one condition</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.shift()">
              <q-item-section>
                <q-item-label>SHIFT</q-item-label>
                <q-item-label caption class="text-center">All HP, WP. Clear all conditions</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
            <q-toggle label="Show Spells" v-model="app.conf.showSpells" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-toggle label="Show 'Trained'" v-model="app.conf.showTrainedSkills" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
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

import { EAttr, IDBStore } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewCharacter } from 'src/lib/defaults';
import { roll } from 'src/lib/util';

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

    const rest = {
      round: () => {
        app.char.wp.current += roll(6);
        if (app.char.wp.current > app.char.wp.max) app.char.wp.current = app.char.wp.max;
      },
      stretch: () => {
        rest.round();
        app.char.hp.current += roll(6);
        if (app.char.hp.current > app.char.hp.max) app.char.hp.current = app.char.hp.max;
      },
      shift: () => {
        app.char.wp.current = app.char.wp.max;
        app.char.hp.current = app.char.hp.max;
        Object.keys(app.char.attributes).forEach(
          (attr) => (app.char.attributes[attr as EAttr].condition.check = false)
        );
      },
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      app,
      rest,
      NewCharacter,
      removeChar,

      showDataLoad,
      fileToLoad,
      loadData,
    };
  },
});
</script>
