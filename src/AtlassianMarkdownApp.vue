<script setup lang="ts">
import EditorsSection from "@app/components/EditorsSection.vue";
import TopInfo from "@app/components/TopInfo.vue";
import { useLocalStorage, useStyleTag } from "@vueuse/core";
import { watchEffect } from "vue";
import { useTheme } from "vuetify";
import { VApp, VCol, VContainer } from "vuetify/components";


const getLightThemeCSS = () => import("highlight.js/styles/github.css?inline").then(it => it.default);
const getDarkThemeCSS = () => import("highlight.js/styles/github-dark.css?inline").then(it => it.default);

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

watchEffect(async () => {
  switch (vuetifyTheme.global.name.value) {
    case "light":
      currentThemeName.value = "light";
      themeStyleTag.css.value = await getLightThemeCSS();
      break;
    case "dark":
      currentThemeName.value = "dark";
      themeStyleTag.css.value = await getDarkThemeCSS();
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
