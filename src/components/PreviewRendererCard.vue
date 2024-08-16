<script setup lang="ts">
import { ref, watchEffect } from "vue";

const getMarkdownIt = () => import("markdown-it").then((it) => it.default);

const props = defineProps<{ markdown: string }>();

const renderedHTML = ref<string>("");
const loading = ref<boolean>(true);
const error = ref<unknown>(null);

watchEffect(async () => {
  const MarkdownIt = await getMarkdownIt();
  const MD = new MarkdownIt({
    breaks: false,
    highlight: null,
    html: false,
    linkify: true,
    xhtmlOut: true,
  });
  loading.value = true;
  const inputMarkdown = props.markdown;
  try {
    renderedHTML.value = MD.render(inputMarkdown, {});
  } catch (err) {
    error.value = err;
  }
  loading.value = false;
});
</script>

<template>
  <VCard style="min-height: 10em">
    <VCardText v-if="error">
      <code>
        <pre>{{ error }}</pre>
      </code>
    </VCardText>
    <VCardText v-if="loading">
      <VSkeletonLoader type="paragraph" />
    </VCardText>
    <VCardText v-if="!error && !loading"
      ><div v-html="renderedHTML"
    /></VCardText>
  </VCard>
</template>
