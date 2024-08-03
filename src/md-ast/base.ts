import type MarkdownToken from "markdown-it/lib/token.mjs";

export interface ASTJSON {
  open: MarkdownToken;
  close?: MarkdownToken;
  children?: ASTJSON[];
}

export abstract class ASTNode {
  protected checkOpen?: string[];
  protected checkClose?: string[];
  constructor(
    public openToken: MarkdownToken,
    public closeToken?: MarkdownToken,
    public children?: ASTNode[],
  ) {
    if (this.checkOpen && !this.checkOpen.includes(openToken.type)) {
      throw `invalid open token (got: ${openToken.type}, expected: ${this.checkOpen})`;
    }
    if (
      this.checkClose &&
      !this.checkClose.includes(closeToken?.type ?? "UNDEFINED")
    ) {
      throw `invalid close token (got: ${closeToken?.type}, expected: ${this.checkClose})`;
    }
  }

  abstract toHTML(): string;
  abstract toAtlassian(): string;
  toJSON = (): ASTJSON => ({
    open: this.openToken,
    close: this.closeToken,
    children: this.children?.map((ch) => ch.toJSON()),
  });
}

export abstract class SelfClosingNode extends ASTNode {
  constructor(token: MarkdownToken) {
    super(token);
  }

  get token(): MarkdownToken {
    return this.openToken;
  }
}
