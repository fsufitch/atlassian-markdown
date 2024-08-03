import MarkdownIt from "markdown-it";
import { Options as MarkdownItOptions } from "markdown-it/lib/index.mjs";
import { extractAST } from "./extract";
import { ASTNode } from "./base";

export const parseAST = (
  src: string,
  options: MarkdownItOptions = {},
): ASTNode[] => {
  const MD = new MarkdownIt(options);
  const tokens = MD.parse(src, {});
  return extractAST(tokens);
};
