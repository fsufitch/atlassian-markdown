<script setup lang="ts">
const props = defineProps<{ markdown: string }>();
import CopyButton from "@app/components/CopyButton.vue";
import { ASTNode } from "@app/md-ast/base";
import { parseAST } from "@app/md-ast/parse";
import { mdiCloseCircle } from "@mdi/js";
import { ref, watchEffect } from "vue";

const loading = ref<boolean>(false);
const ast = ref<ASTNode[]>([]);
const error = ref<unknown>(null);
const displayValue = ref<string>("");

watchEffect(async () => {
  loading.value = true;
  ast.value = [];
  error.value = null;

  try {
    ast.value = parseAST(props.markdown);
  } catch (err) {
    error.value = err;
  }

  displayValue.value = ast.value.map((it) => it.toAtlassian()).join("\n\n");
  loading.value = false;
});
</script>

<template>
  <VCard style="min-height: 10em">
    <VSheet class="float-right ma-2">
      <CopyButton :copyText="displayValue" />
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
        <pre>{{ displayValue }}</pre>
      </code>
    </VCardText>
  </VCard>
</template>
