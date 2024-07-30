<script setup lang="ts">
import TopInfo from "@app/components/TopInfo.vue";
import StickyThemeProvider from "@app/StickyThemeProvider.vue";
import { VApp, VCol, VContainer, VTextarea } from "vuetify/components";
</script>

<template>
  <StickyThemeProvider>
    <VApp>
      <VMain>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <TopInfo />
            </VCol>
            <VCol cols="6">
              <VTextarea variant="solo-filled">asdf</VTextarea>
            </VCol>
            <VCol cols="6">
              <VTextarea variant="solo-filled">asdf</VTextarea>
            </VCol>
          </VRow>
        </VContainer>
      </VMain>
    </VApp>
  </StickyThemeProvider>
</template>
