<script setup lang="ts">
import EditorsSection from "@app/components/EditorsSection.vue";
import TopInfo from "@app/components/TopInfo.vue";
import StickyThemeProvider from "@app/StickyThemeProvider.vue";
import { VApp, VCol, VContainer } from "vuetify/components";
</script>

<template>
  <StickyThemeProvider>
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
  </StickyThemeProvider>
</template>

<style lang="scss">
@import url("highlight.js/styles/github.css");
</style>
