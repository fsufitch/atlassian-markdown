import { SelfClosingNode } from "./base";

export const INLINE = 'inline';

export class InlineNode extends SelfClosingNode {
  checkOpen = ["inline"];
  toAtlassian(): string {
    return "";
  }
  toHTML(): string {
    return "";
  }
}
