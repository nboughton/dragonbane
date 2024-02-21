<template>
  <q-card>
    <q-card-section>
      {{ name }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DiceRoller',
  props: {
    name: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    boons: {
      type: Number,
    },
    banes: {
      type: Number,
    },
  },
});
</script>
