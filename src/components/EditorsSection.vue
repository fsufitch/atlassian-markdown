<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import PreviewRendererCard from "@app/components/PreviewRendererCard.vue";
import { useLocalStorage } from "@vueuse/core";
import ASTRendererCard from "@app/components/ASTRendererCard.vue";
import RawHTMLRendererCard from "@app/components/RawHTMLRendererCard.vue";
import AtlassianRendererCard from "@app/components/AtlassianRendererCard.vue";

const EDITOR_TAB = "editor-tab";
const activeTab = useLocalStorage<"preview" | "atlassian" | "html" | "ast">(
  EDITOR_TAB,
  "preview",
);

const EDITOR_CONTENT = "editor-content";
const editorMarkdown = useLocalStorage(EDITOR_CONTENT, "");

const mdAutoGrow = ref<boolean>(false);
const mdMaxRows = ref<number | undefined>(undefined);

const display = useDisplay();

watchEffect(() => {
  if (display.lg.value) {
    mdAutoGrow.value = false;
    mdMaxRows.value = undefined;
  } else {
    mdAutoGrow.value = true;
    mdMaxRows.value = 15;
  }
});
</script>
<template>
  <VRow align="stretch" class="fill-height">
    <VCol cols="12" lg="6" class="d-flex align-stretch">
      <VCard class="flex-grow-1">
        <VCardText class="fill-height">
          <code>
            <VTextarea
              variant="plain"
              v-model="editorMarkdown"
              autofocus
              :auto-grow="mdAutoGrow"
              :max-rows="mdMaxRows"
              no-resize
              class="fill-height standalone-vtextarea"
              hide-details="auto"
              placeholder="Input your Markdown here"
            />
          </code>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" lg="6" class="d-flex flex-column">
      <VTabs v-model="activeTab" direction="horizontal">
        <VTab value="preview"> Preview </VTab>
        <VTab value="atlassian"> Atlassian </VTab>
        <VTab value="html"> Raw HTML </VTab>
        <VTab value="ast"> AST </VTab>
      </VTabs>

      <VDivider />

      <VTabsWindow
        v-model="activeTab"
        direction="horizontal"
        class="flex-grow-1 d-flex flex-column"
      >
        <VTabsWindowItem class="flex-grow-1" value="preview">
          <PreviewRendererCard :markdown="editorMarkdown"/>
        </VTabsWindowItem>
        <VTabsWindowItem class="flex-grow-1" value="atlassian">
          <AtlassianRendererCard :markdown="editorMarkdown" />
        </VTabsWindowItem>
        <VTabsWindowItem class="flex-grow-1" value="html">
          <RawHTMLRendererCard :markdown="editorMarkdown" />
        </VTabsWindowItem>
        <VTabsWindowItem class="flex-grow-1" value="ast">
          <ASTRendererCard :markdown="editorMarkdown" />
        </VTabsWindowItem>
      </VTabsWindow>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.standalone-vtextarea {
  grid-template-rows: auto min-content;
  // overflow-y: auto;

  textarea {
    height: 100%;
  }
}
</style>
