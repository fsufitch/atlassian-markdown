import { ref, Ref, toValue, watch } from "vue";
import { MaybeRefOrGetter } from "@vueuse/core";

import { ASTNode } from "./md-ast/base";
import { parseAST } from "./md-ast/parse";

const YAML = import("yaml").then((it) => it.default);

export const useAST = (markdownRef: MaybeRefOrGetter<string>) => {
  const resultAST = ref<ASTNode[]>([]);
  const resultError = ref<string>("");

  const recomputeAST = async (markdown: string) => {
    try {
      resultAST.value = await parseAST(markdown);
      resultError.value = "";
    } catch (err) {
      resultAST.value = [];
      resultError.value = `Failed computing AST: ${err}`;
    }
  };

  watch(
    () => toValue(markdownRef),
    (md) => recomputeAST(md),
    { immediate: true },
  );

  return {
    ast: resultAST,
    error: resultError,
  };
};

export type ASTRenderLanguage = "yaml" | "json";

export const useRenderedAST = (
  astRef: ASTNode[] | Ref<ASTNode[]>,
  languageRef: ASTRenderLanguage | Ref<ASTRenderLanguage>,
) => {
  const resultText = ref<string>("");
  const resultError = ref<string>("");

  const recomputeText = async (ast: ASTNode[], lang: ASTRenderLanguage) => {
    const obj = ast.map((it) => it.toJSON());
    let renderFunc: () => Promise<string>;

    switch (lang) {
      case "yaml":
        renderFunc = async () => (await YAML).stringify(obj);
        break;
      case "json":
        renderFunc = async () => JSON.stringify(obj, undefined, 2);
        break;
    }

    try {
      resultText.value = await renderFunc();
      resultError.value = "";
    } catch (err) {
      resultText.value = "";
      resultError.value = `Rendering '${lang}' failed: ${err}`;
    }
  };

  watch(
    () => ({ ast: toValue(astRef), lang: toValue(languageRef) }),
    ({ ast, lang }) => recomputeText(ast, lang),
    { immediate: true },
  );

  return {
    text: resultText,
    error: resultError,
  };
};

export const useAtlassianRenderedAST = (astRef: ASTNode[] | Ref<ASTNode[]>) => {
  const resultText = ref<string>("");
  const resultError = ref<string>("");

  const recomputeText = async (ast: ASTNode[]) => {
    try {
      resultText.value = ast.map((it) => it.toAtlassian()).join("\n");
      resultError.value = "";
    } catch (err) {
      resultText.value = "";
      resultError.value = `Failed rendering to Atlassian: ${err}`;
    }
  };

  watch(
    () => toValue(astRef),
    (ast) => recomputeText(ast),
    { immediate: true },
  );

  return { text: resultText, error: resultError };
};
