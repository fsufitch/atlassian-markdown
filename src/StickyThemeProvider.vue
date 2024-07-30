<script setup lang="ts">
import { watch, watchEffect } from "vue";
import { useTheme } from "vuetify";

const STORAGE_THEME = "theme";
type ThemeName = "light" | "dark";

const getCurrentlyStoredTheme = (): ThemeName => {
  const storedTheme = localStorage.getItem(STORAGE_THEME);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  } else if (storedTheme) {
    console.warn("found invalid theme in storage", storedTheme);
  }
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const vuetifyTheme = useTheme();
watchEffect(() => {
  vuetifyTheme.global.name.value = getCurrentlyStoredTheme();
});

watch(vuetifyTheme.global.name, (updatedVuetifyThemeName) => {
  if (updatedVuetifyThemeName == "light" || updatedVuetifyThemeName == "dark") {
    localStorage.setItem(STORAGE_THEME, updatedVuetifyThemeName);
  } else {
    console.error("invalid theme name", updatedVuetifyThemeName);
    vuetifyTheme.global.name.value = getCurrentlyStoredTheme();
  }
});
</script>

<template><slot></slot></template>
