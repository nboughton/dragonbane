<template>
  <div class="row outlined items-center justify-between rounded-borders q-ma-xs">
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

<script lang="ts" setup></script>
