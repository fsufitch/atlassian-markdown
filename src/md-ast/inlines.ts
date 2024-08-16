import { ASTNode, SelfClosingNode } from "./base";


export const TEXT = "text";

export class TextNode extends SelfClosingNode {
  checkOpen = [TEXT];

  toHTML = () => this.openToken.content;
  toAtlassian = () => this.openToken.content;
}

export const CODE_INLINE = "code_inline";

export class InlineCodeNode extends SelfClosingNode {
  checkOpen = [CODE_INLINE];

  toHTML = () => `<code>${this.openToken.content}</code>`;
  toAtlassian = () => `{{${this.openToken.content}}}`;
}

export const EM_OPEN = "em_open";
export const EM_CLOSE = "em_close";

export class EmphasisNode extends ASTNode {
  checkOpen = [EM_OPEN];
  checkClose = [EM_CLOSE];

  toHTML = () => `<em>${this.contentsHTML()}</em>`;
  toAtlassian = () => `_${this.contentsAtlassian()}_`;
}

export const STRONG_OPEN = "strong_open";
export const STRONG_CLOSE = "strong_close";

export class StrongNode extends ASTNode {
  checkOpen = [STRONG_OPEN];
  checkClose = [STRONG_CLOSE];

  toHTML = () => `<strong>${this.contentsHTML()}</strong>`;
  toAtlassian = () => `*${this.contentsAtlassian()}*`;
}

export const LINK_OPEN = "link_open";
export const LINK_CLOSE = "link_close";

export class LinkNode extends ASTNode {
  checkOpen = [LINK_OPEN];
  checkClose = [LINK_CLOSE];

  href = () => this.openToken.attrGet("href") ?? "";
  escapedHref = () => new URL(this.href()).href;

  toHTML = () =>
    `<a href="${this.escapedHref()}">${this.contentsHTML()}</a>`;
  toAtlassian = () =>
    `[${this.contentsAtlassian()}|${this.escapedHref()}]`
}

export const STRIKE_OPEN = "s_open";
export const STRIKE_CLOSE = "s_close";
export const DEL_OPEN = "del_open";
export const DEL_CLOSE = "del_close";

export class DelNode extends ASTNode {
  checkOpen = [STRIKE_OPEN, DEL_OPEN];
  checkClose = [STRIKE_CLOSE, DEL_CLOSE];

  toHTML = () =>
    `<del>${this.contentsHTML()}</del>`;
  toAtlassian = () =>
    `-${this.contentsAtlassian()}-`
}
