<script setup lang="ts">
import { ASTNode } from "@app/md-ast/base";
import { parseAST } from "@app/md-ast/parse";
import { ref, watchEffect } from "vue";

import YAML from "yaml";

import hljs from "highlight.js/lib/common";
import CopyButton from "./CopyButton.vue";
import { mdiAlarm } from "@mdi/js";
const hljsYAML = import("highlight.js/lib/languages/yaml").then(
  (it) => it.default,
);
const hljsJSON = import("highlight.js/lib/languages/json").then(
  (it) => it.default,
);

const props = defineProps<{ markdown: string }>();

const loading = ref<boolean>(false);
const ast = ref<ASTNode[]>([]);
const error = ref<unknown>(null);
const displayLang = ref<"yaml" | "json">("yaml");
const displayUnhighlighted = ref<string>("");
const displayHighlighted = ref<string>("");

watchEffect(async () => {
  loading.value = true;
  ast.value = [];
  error.value = null;

  try {
    ast.value = parseAST(props.markdown);
  } catch (err) {
    error.value = err;
  }

  const displayValue = ast.value.map((it) => it.toJSON());
  switch (displayLang.value) {
    case "yaml":
      hljs.registerLanguage("yaml", await hljsYAML);
      displayUnhighlighted.value = YAML.stringify(displayValue);
      break;
    case "json":
      hljs.registerLanguage("yaml", await hljsJSON);
      displayUnhighlighted.value = JSON.stringify(displayValue, undefined, 2);
      break;
    default:
      throw `unknown display lang: ${displayLang.value}`;
  }

  displayHighlighted.value = hljs.highlight(displayUnhighlighted.value, {
    language: displayLang.value,
  }).value;

  loading.value = false;
});
</script>

<template>
  <VCard style="min-height: 10em" variant="elevated">
    <VSheet class="float-right ma-2">
      <VRow>
        <VCol class="text-overline d-flex align-center"> YAML </VCol>
        <VCol class="pl-0 pr-0">
          <VSwitch
            v-model="displayLang"
            false-value="yaml"
            true-value="json"
            hide-details="auto"
          />
        </VCol>
        <VCol class="text-overline d-flex align-center"> JSON </VCol>
        <VDivider vertical v-if="!error" />
        <VCol v-if="!error">
          <CopyButton :copyText="displayUnhighlighted" />
        </VCol>
      </VRow>
    </VSheet>

    <VCardText>
      <VSkeletonLoader v-if="loading" type="text" />
      <VAlert v-if="error" :icon="mdiAlarm" color="error">
        <strong>ERROR:</strong> {{ error }}
      </VAlert>
      <code>
        <pre
          v-if="!error"
          v-html="displayHighlighted || displayUnhighlighted"
        ></pre>
      </code>
    </VCardText>
  </VCard>
</template>
