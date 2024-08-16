<script setup lang="ts">
import { mdiCloseCircle } from "@mdi/js";
import { computed } from "vue";

import CopyButton from "@app/components/CopyButton.vue";
import { useAST, useAtlassianRenderedAST } from "@app/ast-rendering";

const props = defineProps<{ markdown: string }>();
const markdownRef = computed(() => props.markdown);

const { ast, error: astError } = useAST(markdownRef);
const { text, error: atlError } = useAtlassianRenderedAST(ast);

const error = computed(() => astError || atlError || "");
</script>

<template>
  <VCard style="min-height: 10em">
    <VSheet class="float-right ma-2">
      <CopyButton :copyText="text" />
    </VSheet>
    <VCardText>
      <VAlert v-if="error.value" :icon="mdiCloseCircle" color="error">
        <strong>ERROR:</strong> {{ error.value }}
      </VAlert>
      <code v-if="!error.value">
        <pre>{{ text }}</pre>
      </code>
    </VCardText>
  </VCard>
</template>
