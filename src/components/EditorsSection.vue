<script setup lang="ts">
import PreviewViewer from "@app/components/PreviewViewer.vue";
import { convertMarkdownToAtlassian, mdPreviewHTML, mdRawHTML } from "@app/markdown";
import { ref, watch, watchEffect } from "vue";
import RawHTMLViewer from "@app/components/RawHTMLViewer.vue";
import { useDisplay } from "vuetify";

const activeTab = ref<string>("preview");
const editorMarkdown = ref<string>("");
const renderedContent = ref<string>("");

watch([activeTab, editorMarkdown], ([tab, md]) => {
  switch (tab) {
    case "preview":
      renderedContent.value = mdPreviewHTML.render(md);
      break;
    case "raw-html":
      renderedContent.value = mdRawHTML.render(md);
      break;
    case "atlassian":
      renderedContent.value = convertMarkdownToAtlassian(md);
      break;
    default:
      console.error("unknown active tab", activeTab.value);
  }
});

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
        <VTab value="raw-html"> Raw HTML </VTab>
      </VTabs>

      <VCard class="flex-grow-1 overflow-auto">
        <VCardText>
          <VTabsWindow
            v-model="activeTab"
            direction="horizontal"
            class="flex-grow-1 d-flex flex-column"
          >
            <VTabsWindowItem class="flex-grow-1" value="raw-html">
              <RawHTMLViewer :html="renderedContent" />
            </VTabsWindowItem>
            <VTabsWindowItem class="flex-grow-1" value="preview">
              <PreviewViewer :html="renderedContent" />
            </VTabsWindowItem>
            <VTabsWindowItem class="flex-grow-1" value="atlassian">
              <RawHTMLViewer :html="renderedContent" />
            </VTabsWindowItem>
          </VTabsWindow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.standalone-vtextarea {
  grid-template-rows: auto min-content;
  // overflow-y: auto;

  textarea {
    height: 100%
  }
}
</style>
