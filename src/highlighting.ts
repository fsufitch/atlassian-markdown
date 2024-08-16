import type { HLJSApi } from "highlight.js";
import { MaybeRefOrGetter, ref, toValue, watch } from "vue";

const loadHighlightCore = () =>
  import("highlight.js/lib/core").then((it) => it.default);
const loadHighlightCommon = () =>
  import("highlight.js/lib/common").then((it) => it.default);
const loadHighlightFull = () => import("highlight.js").then((it) => it.default);

const loadedAPIs: { [k: string]: Promise<HLJSApi> | undefined } = {};

const loadMinimalHighlightAPI = async (
  language: string,
): Promise<HLJSApi | undefined> => {
  loadedAPIs.core = loadedAPIs.core ?? loadHighlightCore();
  const core = await loadedAPIs.core;
  if (core.getLanguage(language)) {
    return core;
  }
  loadedAPIs.common = loadedAPIs.common ?? loadHighlightCommon();
  const common = await loadedAPIs.common;
  if (common.getLanguage(language)) {
    return common;
  }
  loadedAPIs.full = loadedAPIs.full ?? loadHighlightFull();
  const full = await loadedAPIs.full;
  if (full.getLanguage(language)) {
    return full;
  }
  return undefined;
};

export const useHighlighted = (
  textRef: MaybeRefOrGetter<string>,
  languageRef: MaybeRefOrGetter<string>,
) => {
  const result = ref<string>("");

  const recomputeHighlight = async (text: string, language: string) => {
    const hljs = await loadMinimalHighlightAPI(language);
    if (!hljs) {
      console.warn("could not find language for highlighting", language);
      result.value = text;
      return;
    }
    const hljsOutput = hljs.highlight(text, { language });
    if (hljsOutput.errorRaised) {
      console.warn(
        `error while rendering '${language} highlights`,
        hljsOutput.errorRaised,
      );
    }
    result.value = hljsOutput.value;
  };

  watch(
    () => ({ text: toValue(textRef), lang: toValue(languageRef) }),
    ({ text, lang }) => recomputeHighlight(text, lang),
    { immediate: true },
  );
  return result;
};
