<script setup lang="ts">
const modelData = defineModel<string>("");
</script>

<template>
  <VTextarea variant="solo-filled" v-model="modelData" no-resize />
</template>
