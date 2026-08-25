<template>
  <div class="row justify-center">
    <q-icon name="mdi-circle-slice-8" :color="iconColor" size="lg" class="col-shrink" />
    <q-input class="col-6" type="number" v-model.number="dollaBills" input-class="text-right text-h6" dense />
    <q-tooltip>{{ label }}</q-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const dollaBills = defineModel<number>({ required: true });
const props = defineProps<{ label: string }>();

// Property for determining the icon color based on the label
const iconColor = computed(() => {
  switch (props.label.toLowerCase()) {
    case "gold":
      return "amber-5";
    case "silver":
      return "blue-grey-5";
    case "copper":
      return "brown-5";
    default:
      return "black";
  }
});
</script>
