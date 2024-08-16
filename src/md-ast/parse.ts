import { Options as MarkdownItOptions } from "markdown-it/lib/index.mjs";
import { extractAST } from "./extract";
import { ASTNode } from "./base";

const getMarkdownIt = () => import('markdown-it').then(it => it.default);

export const parseAST = async (
  src: string,
  options: MarkdownItOptions = {},
): Promise<ASTNode[]> => {
  const MarkdownIt = await getMarkdownIt();
  const MD = new MarkdownIt(options);
  const tokens = MD.parse(src, {});
  return extractAST(tokens);
};
