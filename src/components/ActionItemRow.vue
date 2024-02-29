<template>
  <div class="row items-center justify-between bg-blue-grey-10 rounded-borders q-mb-sm">
    <div class="col-1 items-center justify-center">
      <div class="row items-center justify-center">
        <slot name="prepend"></slot>
      </div>
    </div>

    <div class="col-10 items-center justify-center">
      <slot name="content"></slot>
    </div>

    <div class="col-1 items-center justify-center">
      <div class="row items-center justify-center">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ActionItemRow',
});
</script>
