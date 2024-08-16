<script setup lang="tsx">
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiThemeLightDark,
  mdiCheck,
  mdiHome,
} from "@mdi/js";

import { ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const showDetails = ref<boolean>(true);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

console.log(mdiCheck);
</script>

<template>
  <VCard variant="flat">
    <VCardItem>
      <template #prepend>
        <VIcon color="success" :icon="mdiHome" />
      </template>
      <template #append>
        <VBtn variant="text" :icon="mdiThemeLightDark" @click="toggleTheme" />
        <VBtn
          variant="text"
          :icon="showDetails ? mdiChevronUp : mdiChevronDown"
          @click="showDetails = !showDetails"
        />
      </template>
      <VCardTitle> Markdown to Atlassian-Wiki Converter </VCardTitle>
    </VCardItem>

    <VCardText>
      <VExpandTransition>
        <div v-if="showDetails">
          <p>
            Used to formatting your text with a sane markup system like
            Markdown? Are Confluence, Jira, and other Atlassian tools driving
            you nuts?
          </p>
          <br />
          <p>
            You're in luck! Use this tool to convert Markdown into Atlassian
            markup. Just switch your Atlassian product to "Text" mode and paste
            the output from the right box.
          </p>
        </div>
      </VExpandTransition>
    </VCardText>
  </VCard>
</template>
