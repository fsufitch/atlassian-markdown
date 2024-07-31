<script setup lang="ts">
import { mdiContentCopy } from "@mdi/js";
import hljs from "highlight.js/lib/common";
import hljsXML from "highlight.js/lib/languages/xml";
import { computed } from "vue";

hljs.registerLanguage("html", hljsXML);

const props = defineProps<{ html: string }>();

const htmlHighlighted = computed(
  () => hljs.highlight(props.html, { language: "html" }).value,
);
</script>

<template>
  <VBtn class="position-absolute top-0 right-0 ma-3" :icon="mdiContentCopy" />
  <VCardText>
    <pre v-html="htmlHighlighted"></pre>
  </VCardText>
</template>
