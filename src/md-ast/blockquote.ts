import { ASTNode } from "./base";

export const BLOCKQUOTE_OPEN = 'blockquote_open';
export const BLOCKQUOTE_CLOSE = 'blockquote_close'

export class BlockQuoteNode extends ASTNode {
  checkOpen = [BLOCKQUOTE_OPEN];
  checkClose = [BLOCKQUOTE_CLOSE];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return "";
  }
}
