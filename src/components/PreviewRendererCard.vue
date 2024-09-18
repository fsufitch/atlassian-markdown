<script setup lang="ts">
import { computed } from "vue";
import { mdiCloseCircle } from "@mdi/js";

import { useAST } from "@app/ast-rendering";

const props = defineProps<{ markdown: string }>();
const markdownRef = computed(() => props.markdown);

const { ast, error: astError } = useAST(markdownRef);

const renderedHTML = computed(() =>
  ast.value.map((node) => node.toHTML()).join("\n"),
);

const error = computed(() => astError || "");
</script>

<template>
  <VCard style="min-height: 10em" variant="elevated">
    <VCardText>
      <VAlert v-if="error.value" :icon="mdiCloseCircle" color="error">
        <strong>ERROR:</strong> {{ error }}
      </VAlert>
      <div v-if="!error.value" v-html="renderedHTML"></div>
    </VCardText>
  </VCard>
</template>
