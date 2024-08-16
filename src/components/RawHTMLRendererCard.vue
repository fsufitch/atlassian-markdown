<script setup lang="ts">
import { ref, watchEffect } from "vue";

const getMarkdownIt = () => import('markdown-it').then(it => it.default);

import hljs from "highlight.js/lib/core";
import { mdiCloseCircle } from "@mdi/js";
import CopyButton from "@app/components/CopyButton.vue";
const hljsXML = import("highlight.js/lib/languages/xml").then(
  (it) => it.default,
);


const props = defineProps<{ markdown: string }>();


const renderedHTML = ref<string>("");
const highlightedHTML = ref<string>("");
const loading = ref<boolean>(true);
const error = ref<unknown>(null);

watchEffect(async () => {
  const MarkdownIt = await getMarkdownIt();
  const MD = new MarkdownIt({
    breaks: false,
    highlight: null,
    html: false,
    linkify: false,
    typographer: false,
    xhtmlOut: true,
  });
  loading.value = true;

  try {
    renderedHTML.value = MD.render(props.markdown, {});
  } catch (err) {
    error.value = err;
  }

  hljs.registerLanguage("html", await hljsXML);
  highlightedHTML.value = hljs.highlight(renderedHTML.value, {
    language: "html",
  }).value;

  loading.value = false;
});
</script>

<template>
  <VCard style="min-height: 10em">
    <VSheet class="float-right ma-2">
      <CopyButton :copyText="renderedHTML" />
    </VSheet>

    <VCardText v-if="error">
      <code>
        <pre>{{ error }}</pre>
      </code>
    </VCardText>
    <VCardText v-if="loading">
      <VSkeletonLoader type="paragraph" />
    </VCardText>
    <VCardText>
      <VSkeletonLoader v-if="loading" type="text" />
      <VAlert v-if="error" :icon="mdiCloseCircle" color="error">
        <strong>ERROR:</strong> {{ error }}
      </VAlert>
      <code v-if="!error && !loading">
        <pre v-html="highlightedHTML || renderedHTML" />
      </code>
    </VCardText>
  </VCard>
</template>
