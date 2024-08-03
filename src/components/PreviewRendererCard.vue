<script setup lang="ts">
import { ref, watchEffect } from "vue";

const MD = import("markdown-it")
  .then((it) => it.default)
  .then(
    (MarkdownIt) =>
      new MarkdownIt({
        breaks: false,
        highlight: null,
        html: false,
        linkify: true,
        xhtmlOut: true,
      }),
  );

const props = defineProps<{ markdown: string }>();

const renderedHTML = ref<string>("");
const loading = ref<boolean>(true);
const error = ref<unknown>(null);

watchEffect(() => {
  loading.value = true;
  const inputMarkdown = props.markdown;
  MD.then((MD) => {;
    renderedHTML.value = MD.render(inputMarkdown, {});
  })
    .catch((err) => (error.value = err))
    .then(() => (loading.value = false));
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
    <VCardText v-if="!error && !loading"><div v-html="renderedHTML" /></VCardText>
  </VCard>
</template>
