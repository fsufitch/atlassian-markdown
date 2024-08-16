import type MarkdownToken from "markdown-it/lib/token.mjs";

export interface ASTJSON {
  type: string;
  children?: ASTJSON[];
  content?: string;
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

  contentsHTML = () => (this.children ?? []).map((it) => it.toHTML()).join("");
  contentsAtlassian = (state?: unknown) =>
    (this.children ?? []).map((it) => it.toAtlassian(state)).join("");

  abstract toHTML(): string;
  abstract toAtlassian(state?: unknown): string;

  toJSON(): ASTJSON {
    return {
      type: this.openToken.type,
      children: this.children?.map((ch) => ch.toJSON()),
      content: this.openToken.content || undefined,
    };
  }
}

export abstract class SelfClosingNode extends ASTNode {
  constructor(token: MarkdownToken) {
    super(token);
  }

  get token(): MarkdownToken {
    return this.openToken;
  }
}
