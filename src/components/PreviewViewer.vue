<script setup lang="ts">
const props = defineProps<{ html: string }>();
</script>

<template>
  <div v-html="props.html"></div>
</template>
