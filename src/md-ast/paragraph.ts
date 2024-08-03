import { ASTNode } from "./base";

export const PARAGRAPH_OPEN = "paragraph_open";
export const PARAGRAPH_CLOSE = "paragraph_close";

export class ParagraphNode extends ASTNode {
  checkOpen = [PARAGRAPH_OPEN];
  checkClose = [PARAGRAPH_CLOSE];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return "";
  }
}
