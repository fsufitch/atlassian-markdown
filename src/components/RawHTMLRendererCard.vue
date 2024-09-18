<script setup lang="ts">
import { computed } from "vue";
import { mdiCloseCircle } from "@mdi/js";
import CopyButton from "@app/components/CopyButton.vue";

import { useAST } from "@app/ast-rendering";
import { useHighlighted } from "@app/highlighting";

const props = defineProps<{ markdown: string }>();
const markdownRef = computed(() => props.markdown);

const { ast, error: astError } = useAST(markdownRef);

const renderedHTML = computed(() =>
  ast.value.map((node) => node.toHTML()).join("\n"),
);
const highlightedHTML = useHighlighted(renderedHTML, "xml");

const error = computed(() => astError || "");
</script>

<template>
  <VCard style="min-height: 10em" variant="elevated">
    <VSheet class="float-right ma-2">
      <VRow>
        <VCol v-if="!error.value">
          <CopyButton :copyText="renderedHTML" />
        </VCol>
      </VRow>
    </VSheet>

    <VCardText>
      <VAlert v-if="error.value" :icon="mdiCloseCircle" color="error">
        <strong>ERROR:</strong> {{ error }}
      </VAlert>
      <code>
        <pre v-if="!error.value" v-html="highlightedHTML"></pre>
      </code>
    </VCardText>
  </VCard>
</template>
