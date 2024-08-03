<script setup lang="ts">
import EditorsSection from "@app/components/EditorsSection.vue";
import TopInfo from "@app/components/TopInfo.vue";
import { useLocalStorage, useStyleTag } from "@vueuse/core";
import { watch, watchEffect } from "vue";
import { useTheme } from "vuetify";
import { VApp, VCol, VContainer } from "vuetify/components";
const lightThemeCSS = import("highlight.js/styles/github.css?inline");
const darkThemeCSS = import("highlight.js/styles/github-dark.css?inline");

const STORAGE_THEME = "theme";
type ThemeName = "light" | "dark";
const themeStyleTag = useStyleTag("");

const defaultTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const currentThemeName = useLocalStorage<ThemeName>(
  STORAGE_THEME,
  defaultTheme,
);

const vuetifyTheme = useTheme();
watchEffect(() => {
  vuetifyTheme.global.name.value = currentThemeName.value;
});

watch(vuetifyTheme.global.name, (updatedVuetifyThemeName) => {
  switch (updatedVuetifyThemeName) {
    case "light":
      currentThemeName.value = "light";
      lightThemeCSS
        .then((it) => it.default)
        .then((css) => (themeStyleTag.css.value = css));
      break;
    case "dark":
      currentThemeName.value = "dark";
      darkThemeCSS
        .then((it) => it.default)
        .then((css) => (themeStyleTag.css.value = css));
      break;
  }
});
</script>

<template>
  <VApp>
    <VMain>
      <VContainer fluid class="fill-height flex-column align-stretch">
        <VRow class="flex-grow-0">
          <VCol cols="12">
            <TopInfo />
          </VCol>
        </VRow>
        <VRow class="flex-grow-1">
          <VCol cols="12">
            <EditorsSection />
          </VCol>
        </VRow>
      </VContainer>
      <VSpacer />
    </VMain>
  </VApp>
</template>

<style lang="scss"></style>
