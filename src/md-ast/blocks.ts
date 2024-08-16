import { ASTNode, SelfClosingNode } from "./base";
import type MarkdownToken from "markdown-it/lib/token.mjs";

export const BLOCKQUOTE_OPEN = "blockquote_open";
export const BLOCKQUOTE_CLOSE = "blockquote_close";

export class BlockQuoteNode extends ASTNode {
  checkOpen = [BLOCKQUOTE_OPEN];
  checkClose = [BLOCKQUOTE_CLOSE];

  toAtlassian = () => `{quote}\n${this.contentsAtlassian()}\n{quote}`;
  toHTML = () => `<blockquote>${this.contentsHTML()}</blockquote>`;
}

export const FENCE = "fence";
export const CODE_BLOCK = "code_block";
export const ATLASSIAN_SUPPORTED_HIGHLIGHTS = [
  "actionscript",
  "ada",
  "applescript",
  "bash",
  "c",
  "csharp",
  "cpp",
  "css",
  "erlang",
  "go",
  "groovy",
  "haskell",
  "html",
  "javascript",
  "js",
  "html",
  "json",
  "lua",
  "nyan",
  "objc",
  "perl",
  "php",
  "python",
  "r",
  "ruby",
  "scala",
  "sql",
  "swift",
  "visualbasic",
  "xml",
  "yaml",
];

//C, C#, C++, CSS, Erlang, Go, Groovy, Haskell, HTML, JavaScript, JSON,
// Lua, Nyan, Objc, Perl, PHP, Python, R, Ruby, Scala, SQL, Swift, VisualBasic, XML and YAML.

export class CodeBlockNode extends SelfClosingNode {
  checkOpen = [FENCE, CODE_BLOCK];

  language = () => this.openToken.info || "";

  private atlassianCodeOpenTag = () =>
    ATLASSIAN_SUPPORTED_HIGHLIGHTS.includes(this.language())
      ? `{code:${this.language()}}`
      : "{code}";

  toAtlassian = () =>
    `${this.atlassianCodeOpenTag()}\n${this.openToken.content.trimEnd()}\n{code}`;
  toHTML(): string {
    return `<code><pre>${this.openToken.content}</pre></code>`;
  }
}

export const HR = "hr";

export class HorizontalRuleNode extends SelfClosingNode {
  checkOpen = [HR];
  toAtlassian(): string {
    return "----\n\n";
  }
  toHTML(): string {
    return "<hr />";
  }
}

export const PARAGRAPH_OPEN = "paragraph_open";
export const PARAGRAPH_CLOSE = "paragraph_close";

export class ParagraphNode extends ASTNode {
  checkOpen = [PARAGRAPH_OPEN];
  checkClose = [PARAGRAPH_CLOSE];
  toAtlassian = () => `\n${this.contentsAtlassian()}\n`;
  toHTML = () => `<p>${this.contentsHTML()}</p>`;
}

export const BULLET_LIST_OPEN = "bullet_list_open";
export const BULLET_LIST_CLOSE = "bullet_list_close";
export const ORDERED_LIST_OPEN = "ordered_list_open";
export const ORDERED_LIST_CLOSE = "ordered_list_close";
export const LIST_ITEM_OPEN = "list_item_open";
export const LIST_ITEM_CLOSE = "list_item_close";

export class BulletListNode extends ASTNode {
  checkOpen = [BULLET_LIST_OPEN];
  checkClose = [BULLET_LIST_CLOSE];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return `<ul>${this.contentsHTML()}</ul>`;
  }
}
export class OrderedListNode extends ASTNode {
  checkOpen = [ORDERED_LIST_OPEN];
  checkClose = [ORDERED_LIST_CLOSE];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return `<ol>${this.contentsHTML()}</ol>`;
  }
}

export class ListItemNode extends ASTNode {
  checkOpen = [LIST_ITEM_OPEN];
  checkClose = [LIST_ITEM_CLOSE];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return `<li>${this.contentsHTML()}</li>`;
  }
}

export const INLINE = "inline";

export class InlineContainerNode extends SelfClosingNode {
  checkOpen = [INLINE];

  constructor(token: MarkdownToken, children: ASTNode[] = []) {
    super(token);
    this.children = children;
  }

  toAtlassian = () => this.contentsAtlassian();
  toHTML = () => this.contentsHTML();
}
