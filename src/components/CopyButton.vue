<script setup lang="ts">
import { mdiCheck, mdiContentCopy } from "@mdi/js";
import { useClipboard } from "@vueuse/core";
import { computed } from "vue";

const props = defineProps<{ copyText: string }>();
const clipboard = useClipboard();

const buttonIcon = computed(() =>
  clipboard.copied.value ? mdiCheck : mdiContentCopy,
);
const buttonColor = computed(() =>
  clipboard.copied.value ? "success" : "default",
);
</script>

<template>
  <VBtn
    :icon="buttonIcon"
    :color="buttonColor"
    @click="clipboard.copy(props.copyText).then(() => console.log('copied'))"
  />
</template>
