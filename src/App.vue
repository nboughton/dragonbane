<template>
  <router-view />
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, watch } from 'vue';
import { useCharacterStore } from './stores/character';

export default defineComponent({
  name: 'App',
  setup() {
    // Default to dark
    const c = useCharacterStore();
    if (c.conf.darkMode == undefined) c.conf.darkMode = true;
    if (c.conf.showSpells == undefined) c.conf.showSpells = true;
    if (c.conf.showTrainedSkills == undefined) c.conf.showTrainedSkills = true;

    const $q = useQuasar();
    $q.dark.set(c.conf.darkMode);

    watch(
      () => c.conf.darkMode,
      () => $q.dark.set(c.conf.darkMode as boolean)
    );
  },
});
</script>
