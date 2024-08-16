<script setup lang="ts">
import { computed, ref } from "vue";

import { mdiCloseCircle } from "@mdi/js";

import { ASTRenderLanguage, useAST, useRenderedAST } from "@app/ast-rendering";
import { useHighlighted } from "@app/highlighting";
import CopyButton from "./CopyButton.vue";

const props = defineProps<{ markdown: string }>();

const language = ref<ASTRenderLanguage>("yaml");

const { ast, error: astError } = useAST(() => props.markdown);
const { text, error: renderError } = useRenderedAST(ast, language);
const highlightedText = useHighlighted(text, language);

const error = computed(() => astError || renderError || "");
</script>

<template>
  <VCard style="min-height: 10em" variant="elevated">
    <VSheet class="float-right ma-2">
      <VRow>
        <VCol class="text-overline d-flex align-center"> YAML </VCol>
        <VCol class="pl-0 pr-0">
          <VSwitch
            v-model="language"
            false-value="yaml"
            true-value="json"
            hide-details="auto"
          />
        </VCol>
        <VCol class="text-overline d-flex align-center"> JSON </VCol>
        <VDivider vertical if="!error.value" />
        <VCol v-if="!error.value">
          <CopyButton :copyText="text" />
        </VCol>
      </VRow>
    </VSheet>

    <VCardText>
      <VAlert v-if="error.value" :icon="mdiCloseCircle" color="error">
        <strong>ERROR:</strong> {{ error }}
      </VAlert>
      <code>
        <pre v-if="!error.value" v-html="highlightedText"></pre>
      </code>
    </VCardText>
  </VCard>
</template>
