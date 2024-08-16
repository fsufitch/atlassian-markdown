import type MarkdownToken from "markdown-it/lib/token.mjs";

import { ASTNode } from "./base";

import * as Blocks from "./blocks";
import * as Inlines from "./inlines";

export const extractASTNode = (
  tokens: MarkdownToken[],
  startIndex: number,
): { node: ASTNode; nextIndex: number } => {
  for (let index = startIndex; index < tokens.length; index++) {
    const openToken = tokens[index];
    let children: ASTNode[] = [];
    let closeIndex: number = -1;

    switch (openToken.type) {
      // First, self-closers
      case Blocks.INLINE:
        children = extractAST(openToken.children ?? []);
        return {
          node: new Blocks.InlineContainerNode(openToken, children),
          nextIndex: index + 1,
        };
      case Blocks.HR:
        return {
          node: new Blocks.HorizontalRuleNode(openToken),
          nextIndex: index + 1,
        };
      case Blocks.CODE_BLOCK:
      case Blocks.FENCE:
        return {
          node: new Blocks.CodeBlockNode(openToken),
          nextIndex: index + 1,
        };

      // Then, containers
      case Blocks.PARAGRAPH_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Blocks.PARAGRAPH_CLOSE,
        ));
        return {
          node: new Blocks.ParagraphNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      case Blocks.BLOCKQUOTE_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Blocks.BLOCKQUOTE_CLOSE,
        ));
        return {
          node: new Blocks.BlockQuoteNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      case Blocks.BULLET_LIST_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Blocks.BULLET_LIST_CLOSE,
        ));
        return {
          node: new Blocks.BulletListNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      case Blocks.ORDERED_LIST_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Blocks.ORDERED_LIST_OPEN,
        ));
        return {
          node: new Blocks.OrderedListNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      case Blocks.LIST_ITEM_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Blocks.LIST_ITEM_CLOSE,
        ));
        return {
          node: new Blocks.ListItemNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      // Then, inline nodes
      case Inlines.TEXT:
        return {
          node: new Inlines.TextNode(openToken),
          nextIndex: index + 1,
        };

      case Inlines.CODE_INLINE:
        return {
          node: new Inlines.InlineCodeNode(openToken),
          nextIndex: index + 1,
        };

      case Inlines.EM_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Inlines.EM_CLOSE,
        ));
        return {
          node: new Inlines.EmphasisNode(
            openToken,
            tokens[closeIndex],
            children,
          ),
          nextIndex: closeIndex + 1,
        };

      case Inlines.STRONG_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Inlines.STRONG_CLOSE,
        ));
        return {
          node: new Inlines.StrongNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case Inlines.DEL_OPEN:
      case Inlines.STRIKE_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) =>
            (openToken.type === Inlines.DEL_OPEN &&
              tokens[i].type !== Inlines.DEL_CLOSE) ||
            (openToken.type === Inlines.STRIKE_OPEN &&
              tokens[i].type !== Inlines.STRIKE_CLOSE),
        ));
        return {
          node: new Inlines.DelNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case Inlines.LINK_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== Inlines.LINK_CLOSE,
        ));
        return {
          node: new Inlines.LinkNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      // Fail on unknown tokens
      default:
        throw `unknown or unsupported "open" token type: ${openToken.type} (html: ${openToken.tag})`;
    }
  }

  throw "extract failed";
};

export const extractAST = (tokens: MarkdownToken[]): ASTNode[] => {
  const { children } = extractASTChildren(tokens, 0, (i) => i < tokens.length);
  return children;
};

export const extractASTChildren = (
  tokens: MarkdownToken[],
  startIndex: number,
  keepGoing: (index: number) => boolean,
): { children: ASTNode[]; nextIndex: number } => {
  const children: ASTNode[] = [];
  let index = startIndex;
  while (keepGoing(index)) {
    if (index >= tokens.length) {
      throw "endless children";
    }
    const { node, nextIndex } = extractASTNode(tokens, index);
    if (nextIndex <= index) {
      console.error("bad node", node)
      throw "node extract did not move cursor forward";
    }
    children.push(node);
    index = nextIndex;
  }
  return { children, nextIndex: index };
};
