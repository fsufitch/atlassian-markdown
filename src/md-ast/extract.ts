import type MarkdownToken from "markdown-it/lib/token.mjs";
import { INLINE, InlineNode } from "./inline";
import { HorizontalRuleNode, HR } from "./hr";
import { CODE_BLOCK, CodeBlockNode, FENCE } from "./code-block";
import { ASTNode } from "./base";
import { PARAGRAPH_CLOSE, PARAGRAPH_OPEN, ParagraphNode } from "./paragraph";
import {
  BLOCKQUOTE_CLOSE,
  BLOCKQUOTE_OPEN,
  BlockQuoteNode,
} from "./blockquote";
import {
  BULLET_LIST_CLOSE,
  BULLET_LIST_OPEN,
  BulletListNode,
  LIST_ITEM_CLOSE,
  LIST_ITEM_OPEN,
  ListItemNode,
  ORDERED_LIST_OPEN,
  OrderedListNode,
} from "./list";

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
      case INLINE:
        return { node: new InlineNode(openToken), nextIndex: index + 1 };
      case HR:
        return {
          node: new HorizontalRuleNode(openToken),
          nextIndex: index + 1,
        };
      case CODE_BLOCK:
      case FENCE:
        return { node: new CodeBlockNode(openToken), nextIndex: index + 1 };

      // Then, containers
      case PARAGRAPH_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== PARAGRAPH_CLOSE,
        ));
        return {
          node: new ParagraphNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case BLOCKQUOTE_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== BLOCKQUOTE_CLOSE,
        ));
        return {
          node: new BlockQuoteNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case BULLET_LIST_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== BULLET_LIST_CLOSE,
        ));
        return {
          node: new BulletListNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case ORDERED_LIST_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== ORDERED_LIST_OPEN,
        ));
        return {
          node: new OrderedListNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      case LIST_ITEM_OPEN:
        ({ children, nextIndex: closeIndex } = extractASTChildren(
          tokens,
          index + 1,
          (i) => tokens[i].type !== LIST_ITEM_CLOSE,
        ));
        return {
          node: new ListItemNode(openToken, tokens[closeIndex], children),
          nextIndex: closeIndex + 1,
        };

      // Fail on unknown tokens
      default:
        throw `unknown token type: ${openToken.type}`;
    }
  }

  throw "extract failed";
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
      throw "node extract did not move cursor forward";
    }
    children.push(node);
    index = nextIndex;
  }
  return { children, nextIndex: index };
};

export const extractAST = (tokens: MarkdownToken[]): ASTNode[] => {
  const { children } = extractASTChildren(tokens, 0, (i) => i < tokens.length);
  return children;
};
