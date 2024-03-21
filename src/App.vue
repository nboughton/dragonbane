<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useCharacterStore } from './stores/character';
import OBR from '@owlbear-rodeo/sdk';
import { setupTheme } from './lib/theme';
import { colours } from './lib/theme';
import { useQuasar } from 'quasar';

OBR.onReady(setupTheme);

export default defineComponent({
  name: 'App',
  setup() {
    // Default to dark
    const c = useCharacterStore();
    if (c.conf.showSpells == undefined) c.conf.showSpells = true;
    if (c.conf.showTrainedSkills == undefined) c.conf.showTrainedSkills = true;

    const $q = useQuasar();
    $q.dark.set(colours.value.mode == 'DARK');
    watch(
      () => colours.value.mode,
      () => $q.dark.set(colours.value.mode == 'DARK')
    );
  },
});
</script>
