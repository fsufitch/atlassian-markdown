import { SelfClosingNode } from "./base";

export const FENCE = "fence";
export const CODE_BLOCK = "code_block";

export class CodeBlockNode extends SelfClosingNode {
  checkOpen = [FENCE, CODE_BLOCK];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return "";
  }
}
